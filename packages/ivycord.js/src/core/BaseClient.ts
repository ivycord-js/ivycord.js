import { EventEmitter } from 'ws';

import { IvyError } from '../errors/IvyError';
import { Shard } from '../gateway/Shard';
import { RequestHandler } from '../handlers/RequestHandler';

interface ClientOptions {
  token: string;
  compress?: boolean;
  largeThreshold?: number;
}

class BaseClient extends EventEmitter {
  public token: string;
  public compress: boolean;
  public largeThreshold: number;
  public shard: Shard;

  public requestHandler: RequestHandler;

  constructor(options: ClientOptions) {
    super();
    this.token = options.token;
    this.compress = options.compress ?? false;
    this.largeThreshold = options.largeThreshold ?? 50;
    this.shard = new Shard(this);

    this.requestHandler = new RequestHandler(this);

    if (this.largeThreshold < 50 || this.largeThreshold > 250) {
      throw new IvyError('LARGE_THRESHOLD_INVALID');
    }
  }

  connect() {
    this.shard.connect();
  }
}

export { BaseClient, ClientOptions };
