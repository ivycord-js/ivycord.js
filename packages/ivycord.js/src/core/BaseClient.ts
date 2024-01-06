import { EventEmitter } from 'ws';

import { Shard } from '../gateway/Shard';
import { IvyError } from '../errors/IvyError';

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

  constructor(options: ClientOptions) {
    super();
    this.token = options.token;
    this.compress = options.compress ?? false;
    this.largeThreshold = options.largeThreshold ?? 50;
    this.shard = new Shard(this);

    if (this.largeThreshold < 50 || this.largeThreshold > 250) {
      throw new IvyError('LARGE_THRESHOLD_INVALID');
    }
  }

  connect() {
    this.shard.connect();
  }
}

export { BaseClient, ClientOptions };
