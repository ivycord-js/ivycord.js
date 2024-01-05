import { EventEmitter } from 'ws';
import { Shard } from '../gateway/Shard';

export interface ClientOptions {
  token: string;
  compress?: boolean;
  largeThreshold?: number;
}

export class BaseClient extends EventEmitter {
  public token: string | undefined;
  public compress: boolean;
  public largeThreshold: number;
  public shard: Shard;
  constructor(options: ClientOptions) {
    super();
    this.token = options.token || undefined;
    this.compress = options.compress || false;
    // TODO: limitovat threshold od 50 do 250
    this.largeThreshold = options.largeThreshold || 50;
    this.shard = new Shard(this);
  }
  connect() {
    this.shard.connect();
  }
}
