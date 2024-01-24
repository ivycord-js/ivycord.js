import { GatewayReadyDispatchData } from 'discord-api-types/v10';

import { Client } from '../client/Client';
import { User } from '../structures/User';
import { BaseEvent } from './base/BaseEvent';

/**
 * Represents the shard ready event emitted by the client.
 * @extends {BaseEvent}
 */
class ShardReadyEvent extends BaseEvent {
  /**
   * Creates a new instance of the shard ready event.
   * @param client The client that emits the event.
   */
  constructor(client: Client) {
    super('SHARD_READY', client);
  }

  /**
   * Runs the event.
   */
  override run(data: GatewayReadyDispatchData, shardID: number) {
    if (!this.client.user && data.user) {
      this.client.user = new User(this.client, data.user);
      this.client.emit('shardReady', shardID);
    } else this.client.emit('shardReady', shardID);
  }
}

export { ShardReadyEvent };
