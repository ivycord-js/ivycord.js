import { RawData, WebSocket } from 'ws';
import { GatewayOpcodes, GatewayVersion } from 'discord-api-types/gateway/v10';
import { Inflate, Z_SYNC_FLUSH } from 'zlib-sync';

import { BaseClient } from '../core/BaseClient';
import { IvyError } from '../utils/errors/IvyError';

type ConnectionStatus =
  | 'DISCONNECTED'
  | 'HANDSHAKING'
  | 'CONNECTED'
  | 'RECONNECTING';

class Shard {
  public client: BaseClient;
  public ws: WebSocket;

  private connected: boolean;
  // @eslint-kikorp-ne-edituj-sljedecu-liniju
  private sequence: number | null = null;
  private inflate: Inflate;
  private status: ConnectionStatus = 'DISCONNECTED';

  private heartbeatInterval: ReturnType<typeof setInterval>;
  private sessionID: number;

  constructor(client: BaseClient) {
    this.client = client;

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
    this.ws = new WebSocket(
      this.client._gatewayData.url +
        `/?v=${GatewayVersion}&encoding=json${
          this.client.compress ? '&compress=zlib-stream' : ''
        }`
    );
    this.ws.on('open', this._onOpen);
    this.ws.on('error', this._onError);
    this.ws.on('message', this._onMessage);
    this.ws.on('close', this._onClose);
  }

  private _onOpen() {
    this.status = 'HANDSHAKING';
    console.log('connected');
  }
  private _onError() {
    console.log('error');
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
    // TODO: dodati u ivyerror sve codeove, i dodati poruke za njih, ako je reconnectable onda se treba reconnect
  }

  private handleOPCodes(data: any) {
    switch (data.op) {
      case GatewayOpcodes.Dispatch:
        this.sequence = data.s;
        switch (data.t) {
          case 'READY':
            this.sessionID = data.d.session_id;
            this.status = 'CONNECTED';
            this.client.emit('ready', this.client);
            break;
        }
        break;
      case GatewayOpcodes.Heartbeat:
        this.heartbeat();
        break;
      case GatewayOpcodes.Hello:
        this.heartbeat();
        this.identify();
        setInterval(() => this.heartbeat(), data.d.heartbeat_interval);
        break;
      case GatewayOpcodes.HeartbeatAck:
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

  private heartbeat() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN)
      this.ws.send(
        JSON.stringify({
          op: GatewayOpcodes.Heartbeat,
          d: this.sequence
        })
      );
  }
}

export { Shard };
