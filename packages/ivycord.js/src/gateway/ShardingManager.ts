import { BaseClient } from '../core/BaseClient';

// TODO: kikorp: dodati jsdoc nakon sto se zavrsi file
class ShardingManager {
  public client: BaseClient;
  constructor(client: BaseClient) {
    this.client = client;
  }
  // TODO: uradit ovo sutra mrsko mi sad :D
}

export { ShardingManager };
