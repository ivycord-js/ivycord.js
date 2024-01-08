import { BaseClient } from '../core/BaseClient';

class ShardingManager {
  public client: BaseClient;
  constructor(client: BaseClient) {
    this.client = client;
  }
  // TODO: uradit ovo sutra mrsko mi sad :D
}

export { ShardingManager };
