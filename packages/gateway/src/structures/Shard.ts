import {
  IvyError,
  IvyEventEmitter,
  calculateBitfield,
  hasBit
} from '@ivycord-js/utils';

import {
  GatewayCloseCodes,
  GatewayOpcodes,
  GatewayVersion
} from 'discord-api-types/v10';
import { RawData, WebSocket } from 'ws';
import { Inflate, Z_SYNC_FLUSH } from 'zlib-sync';

import { GatewayIntents } from './Gateway';
import { ShardingManager } from './ShardingManager';

/**
 * Shard connection status type.
 */
type ConnectionStatus =
  | 'DISCONNECTED'
  | 'HANDSHAKING'
  | 'RECONNECTING'
  | 'RESUMING'
  | 'READY';

/**
 * Represents raw event data.
 */
interface RawShardEventData {
  /**
   * The name of the event.
   */
  t: string;

  /**
   * The ID of the shard.
   */
  shardID?: number;

  /**
   * The data received from the gateway.
   */
  d: unknown;
}

/**
 * All events emitted by the shard.
 */
interface ShardEvents {
  /**
   * Emitted when the shard receives a raw event.
   * @param data The data received from the gateway.
   */
  rawEvent: (data: RawShardEventData) => void;
}

/**
 * Represents a gateway shard. Note: Unavailable guilds are not handled by the gateway. See https://discord.com/developers/docs/topics/gateway-events#ready for more information.
 * @extends {IvyEventEmitter}
 */
class Shard extends IvyEventEmitter<keyof ShardEvents, ShardEvents> {
  /**
   * The WebSocket connection of the shard.
   */
  public ws: WebSocket | null = null;

  /**
   * The WebSocket latency of the shard.
   */
  public latency = 0;

  /**
   * The ID of the shard.
   */
  public id: number;

  /**
   * The current gateway connection status of the shard.
   */
  public status: ConnectionStatus = 'DISCONNECTED';

  /**
   * All guilds that are currently unavailable for this specific shard.
   */
  public unavailableGuilds: string[] = [];

  /**
   * The inflate stream for decompressing gateway data.
   */
  private inflate: Inflate | null = null;

  /**
   * The last event sequence number received from the gateway.
   */
  private sequence: number | null = null;

  /**
   * Timestamp of the last heartbeat sent.
   */
  private lastHeartbeat = 0;

  /**
   * Timestamp of the last heartbeat acknowledged.
   */
  private lastHeartbeatAck = 0;

  /**
   * Interval for sending heartbeats.
   */
  private heartbeatInterval: NodeJS.Timeout | null = null;

  /**
   * Interval for reconnecting to the gateway.
   */
  private reconnectInterval: NodeJS.Timeout | null = null;

  /**
   * Timeout for waiting for guilds to become available.
   */
  private readyTimeout: NodeJS.Timeout | null = null;

  /**
   * The URL for resuming the gateway connection.
   */
  private resumeGatewayURL: string | null = null;

  /**
   * The session ID of the shard.
   */
  private sessionID: number | null = null;

  /**
   * The sharding manager that manages all gateway shards.
   */
  private manager: ShardingManager;

  /**
   * Creates a new instance of the shard.
   * @param id The ID of the shard.
   * @param manager The sharding manager that manages all gateway shards.
   */
  constructor(id: number, manager: ShardingManager) {
    super();
    this.id = id;
    this.manager = manager;

    this._onOpen = this._onOpen.bind(this);
    this._onMessage = this._onMessage.bind(this);
    this._onClose = this._onClose.bind(this);
    this._onError = this._onError.bind(this);
  }

  /**
   * Initializes the WebSocket connection.
   */
  initWS() {
    if (this.status !== 'DISCONNECTED')
      throw new IvyError('WS_ALREADY_CONNECTED');
    if (this.manager.gateway.compress) {
      this.inflate = new Inflate({
        chunkSize: 65535,
        to: 'string'
      });
    }
    if (!this.sessionID) {
      this.ws = new WebSocket(
        `${this.manager.gateway._gatewayData
          ?.url}/?v=${GatewayVersion}&encoding=json${
          this.manager.gateway.compress ? '&compress=zlib-stream' : ''
        }`
      );
    } else {
      if (!this.resumeGatewayURL)
        this.emit('rawEvent', {
          t: 'SHARD_WARN',
          shardID: this.id,
          d: 'Resume URL not found. Using gateway URL.'
        });
      this.ws = new WebSocket(
        `${
          this.resumeGatewayURL ?? this.manager.gateway._gatewayData?.url
        }/?v=${GatewayVersion}&encoding=json${
          this.manager.gateway.compress ? '&compress=zlib-stream' : ''
        }`
      );
    }
    this.ws.on('open', this._onOpen);
    this.ws.on('message', this._onMessage);
    this.ws.on('close', this._onClose);
    this.ws.on('error', this._onError);
  }

  /**
   * Handles the 'open' event received from the gateway.
   */
  private _onOpen() {
    this.status = 'HANDSHAKING';
    if (this.reconnectInterval) clearInterval(this.reconnectInterval);
  }

  /**
   * Handles the 'message' event received from the gateway.
   * @param data The data received from the gateway.
   */
  private _onMessage(data: RawData) {
    if (this.manager.gateway.compress) {
      let buffer = Buffer.alloc(0);
      buffer = Buffer.concat([buffer, data as Buffer]);
      const zlibSuffix = Buffer.from([0x00, 0x00, 0xff, 0xff]);
      if (
        buffer.length >= 4 &&
        Buffer.compare(zlibSuffix, buffer.subarray(buffer.length - 4)) === 0
      )
        this.inflate?.push(buffer, Z_SYNC_FLUSH);
      else this.inflate?.push(buffer, false);
      data = Buffer.from(this.inflate?.result as string);
    }
    data = JSON.parse(data.toString());
    this.handleOPCodes(data);
  }

  /**
   * Handles the 'close' event received from the gateway.
   * @param code The close code.
   * @param reason The reason for closing.
   */
  private _onClose(code: number, reason: RawData) {
    this.status = 'DISCONNECTED';
    this.emit('rawEvent', {
      t: 'SHARD_CLOSE',
      shardID: this.id,
      d: { code, reason }
    });
    switch (code) {
      case GatewayCloseCodes.AuthenticationFailed:
      case GatewayCloseCodes.InvalidShard:
      case GatewayCloseCodes.ShardingRequired:
      case GatewayCloseCodes.InvalidAPIVersion:
      case GatewayCloseCodes.InvalidIntents:
      case GatewayCloseCodes.DisallowedIntents:
        break;
      default:
        this.reconnect();
        break;
    }
  }

  /**
   * Handles the 'error' event received from the gateway.
   * @param error The error received from the gateway.
   */
  private _onError(error: ErrorEvent) {
    this.emit('rawEvent', {
      t: 'SHARD_ERROR',
      shardID: this.id,
      d: error
    });
  }

  /**
   * Disconnects from the gateway.
   */
  disconnect() {
    if (this.ws?.readyState !== WebSocket.OPEN) return;
    this.ws.close();
    this.status = 'DISCONNECTED';
    this.emit('rawEvent', {
      t: 'SHARD_DISCONNECT',
      shardID: this.id,
      d: null
    });
  }

  /**
   * Reconnects to the gateway.
   */
  private reconnect() {
    if (this.status !== 'DISCONNECTED') return;
    this.status = 'RECONNECTING';
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
    this.disconnect();

    let attempts = this.manager.gateway.reconnectAttempts ?? Infinity;
    this.reconnectInterval = setInterval(() => {
      if (!attempts) {
        if (this.reconnectInterval) clearInterval(this.reconnectInterval);
        this.status = 'DISCONNECTED';
        return;
      }
      this.initWS();
      attempts--;
    }, 5000);
  }

  /**
   * Sends an identify payload to the gateway.
   */
  private identify() {
    if (this.ws?.readyState !== WebSocket.OPEN) return;
    const intents = this.manager.gateway.intents;
    this.send(GatewayOpcodes.Identify, {
      token: this.manager.gateway.token,
      compress: this.manager.gateway.compress,
      largeThreshold: this.manager.gateway.largeThreshold,
      properties: {
        os: process.platform,
        browser: 'ivycord.js',
        device: 'ivycord.js'
      },
      shard: [this.id, this.manager.shardCount],
      intents:
        typeof intents === 'number' ? intents : calculateBitfield(intents)
    });
  }

  /**
   * Sends a resume payload to the gateway.
   */
  private resume() {
    if (this.ws?.readyState !== WebSocket.OPEN) return;
    this.status = 'RESUMING';
    this.send(GatewayOpcodes.Resume, {
      token: this.manager.gateway.token,
      session_id: this.sessionID,
      seq: this.sequence
    });
  }

  /**
   * Sends a heartbeat payload to the gateway.
   */
  private heartbeat() {
    if (this.ws?.readyState === WebSocket.OPEN)
      this.send(GatewayOpcodes.Heartbeat, this.sequence);
    this.lastHeartbeat = Date.now();
  }

  /**
   * Handles gateway OP codes.
   * @param data Data received from the gateway.
   */
  private handleOPCodes(data: any) {
    switch (data.op) {
      case GatewayOpcodes.Dispatch:
        this.sequence = data.s;
        switch (data.t) {
          case 'RESUMED':
          case 'READY':
            this.status = 'READY';
            this.resumeGatewayURL = data.d.resume_gateway_url;
            this.sessionID = data.d.session_id;
            this.unavailableGuilds = data.d.guilds.map(
              (guild: { id: string; unavailable: boolean }) => guild.id
            );
            this.emit('rawEvent', {
              t: 'SHARD_READY',
              shardID: this.id,
              d: data.d
            });
            break;
          default:
            this.emit('rawEvent', {
              t: data.t,
              shardID: this.id,
              d: data.d
            });
            break;
        }
        break;
      case GatewayOpcodes.Heartbeat:
        this.heartbeat();
        break;
      case GatewayOpcodes.Reconnect:
        this.reconnect();
        break;
      case GatewayOpcodes.InvalidSession:
        if (data.d) this.resume();
        else {
          this.sequence = null;
          this.sessionID = null;
          this.reconnect();
        }
        break;
      case GatewayOpcodes.Hello:
        if (this.sessionID) this.resume();
        else {
          this.heartbeat();
          this.identify();
          this.heartbeatInterval = setInterval(
            () => this.heartbeat(),
            data.d.heartbeat_interval
          );
        }
        break;
      case GatewayOpcodes.HeartbeatAck:
        this.lastHeartbeatAck = Date.now();
        this.latency = this.lastHeartbeatAck - this.lastHeartbeat;
        break;
    }
  }

  /**
   * Sends a payload to the gateway.
   * @param opCode The OP code to send to the gateway.
   * @param data The data to send to the gateway.
   */
  send(opCode: GatewayOpcodes, data: any) {
    if (this.ws?.readyState !== WebSocket.OPEN) return;
    this.ws.send(
      JSON.stringify({
        op: opCode,
        d: data
      })
    );
  }
}

export { Shard, ShardEvents, RawShardEventData };
