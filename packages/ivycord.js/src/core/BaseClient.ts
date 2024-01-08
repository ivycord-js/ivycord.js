import { EventEmitter } from 'ws';
import { APIGatewayBotInfo } from 'discord-api-types/v10';

import { IvyError } from '../utils/errors/IvyError';
import { Shard } from '../gateway/Shard';
import { RequestHandler } from '../handlers/RequestHandler';

interface ClientOptions {
  token: string;
  reconnectAttempts?: number;
  compress?: boolean;
  largeThreshold?: number;
}

class BaseClient extends EventEmitter {
  public token: string;
  public compress: boolean;
  public largeThreshold: number;
  public reconnectAttempts: number | null;

  public shard: Shard;
  public requestHandler: RequestHandler;

  public _userAgent: string; // TODO: dodaj ovo
  public _gatewayData: APIGatewayBotInfo;

  constructor(options: ClientOptions) {
    super();
    this.token = options.token;
    this.compress = options.compress ?? false;
    this.largeThreshold = options.largeThreshold ?? 50;
    this.reconnectAttempts = options.reconnectAttempts ?? 5; // It can be null if the user want infinite reconnect attempts
    this.shard = new Shard(this);

    this.requestHandler = new RequestHandler(this);

    if (this.largeThreshold < 50 || this.largeThreshold > 250) {
      throw new IvyError('LARGE_THRESHOLD_INVALID');
    }
  }

  protected async getGateway() {
    const gatewayData = await this.requestHandler.request<APIGatewayBotInfo>(
      'GET',
      '/gateway/bot'
    );
    this._gatewayData = gatewayData;
    return;
  }

  async connect() {
    await this.getGateway();
    this.shard.initWS();
  }
}

export { BaseClient, ClientOptions };
