import { IvyError } from '@ivycord-js/utils';

import {
  GatewayCloseCodes,
  GatewayOpcodes,
  GatewayVersion
} from 'discord-api-types/gateway/v10';
import { APIGatewayBotInfo } from 'discord-api-types/v10';
import { EventEmitter, RawData, WebSocket } from 'ws';
import { Inflate, Z_SYNC_FLUSH } from 'zlib-sync';

/**
 * Gateway connection status type
 */
type ConnectionStatus =
  | 'DISCONNECTED'
  | 'HANDSHAKING'
  | 'CONNECTED'
  | 'RECONNECTING'
  | 'RESUMING';

interface ShardOptions {
  /**
   * The token of the bot
   */
  token: string;

  /**
   * The number of reconnect attempts before giving up
   */
  reconnectAttempts?: number;

  /**
   * Whether to compress the gateway data or not
   */
  compress?: boolean;

  /**
   * The gateway data
   */
  _gatewayData?: APIGatewayBotInfo;
}

/**
 * Represents a Discord shard
 * @extends {EventEmitter}
 */
class Shard extends EventEmitter {
  /**
   * The WebSocket connection of the shard
   */
  public ws: WebSocket;

  /**
   * The WebSocket latency of the shard
   */
  public latency: number;

  /**
   * The ID of the shard
   */
  public id: number;

  /**
   * The token of the bot
   */
  public token: string;

  /**
   * The number of reconnect attempts before giving up
   */
  public reconnectAttempts: number | null;

  /**
   * The gateway data
   */
  public _gatewayData: APIGatewayBotInfo | null;

  /**
   * Whether to compress the gateway data or not
   */
  public compress: boolean;

  /**
   * The current gateway connection status of the shard
   */
  private status: ConnectionStatus = 'DISCONNECTED';

  /**
   * The inflate stream for decompressing gateway data
   */
  private inflate: Inflate;

  /**
   * The last event sequence number received from the gateway
   */
  private sequence: number | null = null;

  /**
   * Timestamp of the last heartbeat sent
   */
  private lastHeartbeat: number;

  /**
   * Timestamp of the last heartbeat acknowledged
   */
  private lastHeartbeatAck: number;

  /**
   * Interval for sending heartbeats
   */
  private heartbeatInterval: ReturnType<typeof setInterval>;

  /**
   * Interval for reconnecting to the gateway
   */
  private reconnectInterval: ReturnType<typeof setInterval>;

  /**
   * The URL for resuming the gateway connection
   */
  private resumeGatewayURL: string;

  /**
   * The session ID of the shard
   */
  private sessionID: number | null;

  /**
   * Creates a new instance of the shard
   * @param client The client that manages this shard
   * @param id The ID of the shard
   * @param options Options for the shard
   */
  constructor(id: number, options: ShardOptions) {
    super();
    this.id = id;

    this.token = options.token;
    this.reconnectAttempts = options.reconnectAttempts ?? 5; // It can be null if the user want infinite reconnect attempts
    this.compress = options.compress ?? false;
    this._gatewayData = options._gatewayData ?? null;

    this._onOpen = this._onOpen.bind(this);
    this._onError = this._onError.bind(this);
    this._onMessage = this._onMessage.bind(this);
    this._onClose = this._onClose.bind(this);
  }

  /**
   * Initializes the WebSocket connection
   */
  initWS() {
    if (this.status !== 'DISCONNECTED')
      throw new IvyError('WS_ALREADY_CONNECTED');
    if (this.compress) {
      this.inflate = new Inflate({
        chunkSize: 65535,
        to: 'string'
      });
    }
    if (!this.sessionID) {
      this.ws = new WebSocket(
        `${this._gatewayData?.url}/?v=${GatewayVersion}&encoding=json${
          this.compress ? '&compress=zlib-stream' : ''
        }`
      );
    } else {
      // Second url is provided if there isn't a resumeGatewayURL
      // TODO: dodati warn ako nema resumeGatewayURL, zato sto ce se cesto disconnectovat nakon resuma zbog toga
      this.ws = new WebSocket(
        `${
          this.resumeGatewayURL || this._gatewayData?.url
        }/?v=${GatewayVersion}&encoding=json${
          this.compress ? '&compress=zlib-stream' : ''
        }`
      );
    }
    this.ws.on('open', this._onOpen);
    this.ws.on('error', this._onError);
    this.ws.on('message', this._onMessage);
    this.ws.on('close', this._onClose);
  }

  /**
   * Handles the 'open' event received from the gateway
   */
  private _onOpen() {
    this.status = 'HANDSHAKING';
    if (this.reconnectInterval) clearInterval(this.reconnectInterval);
  }

  /**
   * Handles the 'error' event received from the gateway
   */
  private _onError(error: ErrorEvent) {
    this.emit('error', error.error, this.id);
  }

  /**
   * Handles the 'message' event received from the gateway
   * @param data Data received from the gateway
   */
  private _onMessage(data: RawData) {
    if (this.compress) {
      let buffer = Buffer.alloc(0);
      buffer = Buffer.concat([buffer, data as Buffer]);
      const zlibSuffix = Buffer.from([0x00, 0x00, 0xff, 0xff]);
      if (
        buffer.length >= 4 &&
        Buffer.compare(zlibSuffix, buffer.subarray(buffer.length - 4)) === 0
      )
        this.inflate.push(buffer, Z_SYNC_FLUSH);
      else this.inflate.push(buffer, false);
      data = Buffer.from(this.inflate.result as string);
    }
    data = JSON.parse(data.toString());
    this.handleOPCodes(data);
  }

  /**
   * Handles the 'close' event received from the gateway
   * @param code The close code
   * @param reason Reason for closing
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _onClose(code: number, reason: RawData) {
    this.status = 'DISCONNECTED';
    this.emit('disconnect', code, reason, this.id);
    // This is all codes that allows reconnecting to the gateway
    switch (code) {
      case GatewayCloseCodes.UnknownError:
      case GatewayCloseCodes.UnknownOpcode:
      case GatewayCloseCodes.DecodeError:
      case GatewayCloseCodes.NotAuthenticated:
      case GatewayCloseCodes.InvalidSeq:
      case GatewayCloseCodes.RateLimited:
      case GatewayCloseCodes.SessionTimedOut:
        this.reconnect();
        break;
      default:
        this.reconnect();
        break;
    }
  }

  /**
   * Handles gateway OP codes
   * @param data Data received from the gateway
   */
  private handleOPCodes(data: any) {
    switch (data.op) {
      case GatewayOpcodes.Dispatch:
        this.sequence = data.s;
        switch (data.t) {
          case 'READY':
            this.sessionID = data.d.session_id;
            this.resumeGatewayURL = data.d.resume_gateway_url;
            this.status = 'CONNECTED';
            this.emit('shardReady', this.id);
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
        if (data.d) {
          this.resume();
        } else {
          this.sessionID = null;
          this.sequence = null;
          this.reconnect();
        }
        break;
      case GatewayOpcodes.Hello:
        if (this.sessionID) {
          this.resume();
        } else {
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
   * Reconnects to the gateway
   */
  private reconnect() {
    if (this.status !== 'DISCONNECTED') return;
    this.status = 'RECONNECTING';
    let attempts = this.reconnectAttempts ?? Infinity;
    const reconnectInterval = setInterval(() => {
      if (attempts === 0) {
        clearInterval(reconnectInterval);
        this.status = 'DISCONNECTED';
        return;
      }
      clearInterval(this.heartbeatInterval);
      this.initWS();
      attempts--;
    }, 5000);
  }

  /**
   * Sends an identify payload to the gateway
   */
  private identify() {
    this.ws.send(
      JSON.stringify({
        op: 2,
        d: {
          token: this.token,
          compress: this.compress,
          properties: {
            os: process.platform,
            browser: 'ivycord.js',
            device: 'ivycord.js'
          },
          intents: 131071 // TODO: napraviti intent calculator
        }
      })
    );
  }

  /**
   * Sends a resume payload to the gateway
   */
  private resume() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.status = 'RESUMING';
      this.ws.send(
        JSON.stringify({
          op: 6,
          d: {
            token: this.token,
            session_id: this.sessionID,
            seq: this.sequence
          }
        })
      );
    }
  }

  /**
   * Sends a heartbeat payload to the gateway
   */
  private heartbeat() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN)
      this.ws.send(
        JSON.stringify({
          op: GatewayOpcodes.Heartbeat,
          d: this.sequence
        })
      );
    this.lastHeartbeat = Date.now();
  }
}

export { Shard };
