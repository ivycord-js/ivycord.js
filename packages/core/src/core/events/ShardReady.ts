import { GatewayReadyDispatchData } from 'discord-api-types/v10';

import { Client } from '../client/Client';
import { User, UserData } from '../structures/User';
import { BaseEvent } from './base/BaseEvent';

/**
 * Represents the shard ready event emitted by the client.
 * @extends {BaseEvent}
 */
class ShardReadyEvent extends BaseEvent {
  /**
   * Creates a new instance of the ready event.
   * @param name The name of the event.
   */
  constructor(client: Client) {
    super('SHARD_READY', client);
  }

  /**
   * Runs the event.
   */
  override run(data: GatewayReadyDispatchData, shardID: number): void {
    if (!this.client.user && data.user) {
      this.client.user = new User(this.client, data.user as UserData);
      this.client.emit('shardReady', shardID);
    } else {
      this.client.emit('shardReady', shardID);
    }
  }
}

export { ShardReadyEvent };
