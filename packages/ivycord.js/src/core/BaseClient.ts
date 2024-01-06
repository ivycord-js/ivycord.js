import { EventEmitter } from 'ws';

import { Shard } from '../gateway/Shard';
import { IvyError } from '../utils/IvyError';

interface ClientOptions {
  token: string;
  compress?: boolean;
  largeThreshold?: number;
}

class BaseClient extends EventEmitter {
  public token: string | null = null;
  public compress: boolean = false;
  public largeThreshold: number = 50;
  public shard: Shard | null = null;

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
    this.shard?.connect();
  }
}

export { BaseClient, ClientOptions };
