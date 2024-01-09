import { BaseClient } from '../core/BaseClient';
import { Shard } from './Shard';

// TODO: kikorp: dodati jsdoc nakon sto se zavrsi file
class ShardingManager {
  public client: BaseClient;
  public shards: Shard[];
  constructor(client: BaseClient) {
    this.client = client;
    this.shards = []; // TODO: napravit jebeni collection umjesto ovoga
  }
}

export { ShardingManager };
