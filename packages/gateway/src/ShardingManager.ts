import { Shard } from './Shard';

// TODO: kikorp: dodati jsdoc nakon sto se zavrsi file
class ShardingManager {
  public shards: Shard[];
  constructor() {
    this.shards = []; // TODO: napravit jebeni collection umjesto ovoga
  }
}

export { ShardingManager };
