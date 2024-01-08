import { RawData, WebSocket } from 'ws';
import { Z_SYNC_FLUSH, Inflate } from 'zlib-sync';
import {
  GatewayCloseCodes,
  GatewayOpcodes,
  GatewayVersion
} from 'discord-api-types/gateway/v10';

import { BaseClient } from '../core/BaseClient';
import { IvyError } from '../utils/errors/IvyError';
import { EventEmitter } from 'stream';

type ConnectionStatus =
  | 'DISCONNECTED'
  | 'HANDSHAKING'
  | 'CONNECTED'
  | 'RECONNECTING'
  | 'RESUMING';

class Shard extends EventEmitter {
  public client: BaseClient;
  public ws: WebSocket;
  public latency: number;
  public id: number;

  private connected: boolean;
  // @eslint-kikorp-ne-edituj-sljedecu-liniju
  private sequence: number | null = null;
  private inflate: Inflate;
  private status: ConnectionStatus = 'DISCONNECTED';

  private lastHeartbeat: number;
  private lastHeartbeatAck: number;
  private heartbeatInterval: ReturnType<typeof setInterval>;
  private reconnectInterval: ReturnType<typeof setInterval>;
  private resumeGatewayURL: string;
  private sessionID: number | null;

  constructor(client: BaseClient, id: number) {
    super();
    this.client = client;
    this.id = id;

    this._onOpen = this._onOpen.bind(this);
    this._onError = this._onError.bind(this);
    this._onMessage = this._onMessage.bind(this);
    this._onClose = this._onClose.bind(this);
  }

  initWS() {
    if (this.connected) {
      throw new IvyError('WS_ALREADY_CONNECTED');
    }
    if (this.client.compress) {
      this.inflate = new Inflate({
        chunkSize: 65535,
        to: 'string'
      });
    }
    if (!this.sessionID) {
      this.ws = new WebSocket(
        `${this.client._gatewayData.url}/?v=${GatewayVersion}&encoding=json${
          this.client.compress ? '&compress=zlib-stream' : ''
        }`
      );
    } else {
      // Second url is provided if there isn't a resumeGatewayURL
      // TODO: dodati warn ako nema resumeGatewayURL, zato sto ce se cesto disconnectovat nakon resuma zbog toga
      this.ws = new WebSocket(
        `${
          this.resumeGatewayURL || this.client._gatewayData.url
        }/?v=${GatewayVersion}&encoding=json${
          this.client.compress ? '&compress=zlib-stream' : ''
        }`
      );
    }
    this.ws.on('open', this._onOpen);
    this.ws.on('error', this._onError);
    this.ws.on('message', this._onMessage);
    this.ws.on('close', this._onClose);
  }

  private _onOpen() {
    this.status = 'HANDSHAKING';
    if (this.reconnectInterval) clearInterval(this.reconnectInterval);
  }
  private _onError(error: ErrorEvent) {
    this.emit('error', error.error, this.id);
  }
  private _onMessage(data: RawData) {
    if (this.client.compress) {
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

  private handleOPCodes(data: any) {
    switch (data.op) {
      case GatewayOpcodes.Dispatch:
        this.sequence = data.s;
        switch (data.t) {
          case 'READY':
            this.sessionID = data.d.session_id;
            this.resumeGatewayURL = data.d.resume_gateway_url;
            this.status = 'CONNECTED';
            this.emit('shardReady', this.id, this.client);
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
        this.client.emit('heartbeat');
        break;
    }
  }

  private identify() {
    this.ws.send(
      JSON.stringify({
        op: 2,
        d: {
          token: this.client.token,
          compress: this.client.compress,
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
  private resume() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.status = 'RESUMING';
      this.ws.send(
        JSON.stringify({
          op: 6,
          d: {
            token: this.client.token,
            session_id: this.sessionID,
            seq: this.sequence
          }
        })
      );
    }
  }
  private reconnect() {
    if (this.status !== 'DISCONNECTED') return;
    this.status = 'RECONNECTING';
    let attempts = this.client.reconnectAttempts ?? Infinity;
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
