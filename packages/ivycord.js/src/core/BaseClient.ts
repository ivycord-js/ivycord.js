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
    this.token = options.token;
    this.compress = options.compress ?? false;
    this.shard = new Shard(this);
  }

  connect() {
    this.shard?.connect();
  }
}

export { BaseClient, ClientOptions };
