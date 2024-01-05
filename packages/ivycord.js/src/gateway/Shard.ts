import WebSocket from 'ws';
import pako from 'pako';
import { BaseClient } from '../core/BaseClient';
import { IvyError } from '../utils/IvyError';

class Shard {
  public client: BaseClient | null = null;
  public ws: WebSocket | null = null;

  private connected: boolean;
  private sequence: number | null;
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
        this.client?.compress ? '&compress=zlib-stream' : ''
      }`
    );
    this.processSocket();
  }

  private processSocket() {
    this.ws?.on('open', () => {
      this.connected = true;
    });
    this.ws?.on('message', (data) => {
      const parsedData = JSON.parse(data.toString());
      console.log(parsedData);
      this.handleMessages(parsedData);
    });
    this.ws?.on('error', () => {
      // TODO: dodaj reconnect attemptove
    });
    this.ws?.on('message', (data) => {
      data = JSON.parse(data.toString());
      console.log(data);
      this.handleMessages(data);
    });
    this.ws?.on('close', () => {
      this.connected = false;
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
        this.heartbeatInterval = setInterval(() => {
          console.log('a');
          this.heartbeat();
        }, data.d.heartbeat_interval);
        break;
      case 11:
        this.client?.emit('heartbeat');
        break;
    }
  }

  private identify() {
    this.ws?.send(
      JSON.stringify({
        op: 2,
        d: {
          token: this.client?.token,
          compress: this.client?.compress,
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
    this.ws?.send(
      JSON.stringify({
        op: 1,
        d: this.sequence
      })
    );
  }
}

export { Shard };
