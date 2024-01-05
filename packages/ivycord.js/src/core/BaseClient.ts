import { EventEmitter } from 'ws';

import { Shard } from '../gateway/Shard';

interface ClientOptions {
  token: string;
  compress?: boolean;
  largeThreshold?: number;
}

class BaseClient extends EventEmitter {
  public token: string | null = null;
  public compress: boolean = false;

  public shard: Shard | null = null;

  constructor(options: ClientOptions) {
    super();
<<<<<<< HEAD
    this.token = options.token || undefined;
    this.compress = options.compress || false;
    this.largeThreshold = options.largeThreshold || 50;
=======
    this.token = options.token;
    this.compress = options.compress ?? false;
>>>>>>> 97fcf6981569ec9052b49cb71cc5afea88f86273
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
