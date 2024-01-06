import WebSocket from 'ws';
import { Inflate, Z_SYNC_FLUSH } from 'zlib-sync';

import { BaseClient } from '../core/BaseClient';
import { IvyError } from '../utils/IvyError';

class Shard {
  public client: BaseClient;
  public ws: WebSocket;

  private connected: boolean;
  private sequence: number;
  private inflate: Inflate;

  private heartbeatInterval: ReturnType<typeof setInterval>;
  private sessionID: number;

  constructor(client: BaseClient) {
    this.client = client;
  }

  connect() {
    if (this.connected) {
      throw new IvyError('WS_ALREADY_CONNECTED');
    }
    this.ws = new WebSocket(
      `wss://gateway.discord.gg/?v=10&encoding=json${
        this.client.compress ? '&compress=zlib-stream' : ''
      }`
    );
    this.inflate = new Inflate({
      chunkSize: 65535,
      to: 'string'
    });
    this.processSocket();
  }

  private processSocket() {
    this.ws.on('open', () => {
      this.connected = true;
    });
    this.ws.on('error', () => {
      // TODO: dodaj reconnect attemptove
      console.log('error');
    });
    this.ws.on('message', (data) => {
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
      this.handleMessages(data);
    });
    this.ws.on('close', () => {
      this.connected = false;
      console.log('closed');
      // TODO: i ovdje dodaj reconnect
    });
  }

  private handleMessages(data: any) {
    switch (data.op) {
      case 0:
        this.sequence = data.s;
        break;
      case 1:
        this.heartbeat();
        break;
      case 10:
        this.heartbeat();
        this.identify();
        setInterval(() => this.heartbeat(), data.d.heartbeat_interval);
        break;
      case 11:
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
    this.ws.send(
      JSON.stringify({
        op: 1,
        d: this.sequence
      })
    );
  }
}

export { Shard };
