import { GatewayGuildCreateDispatchData } from 'discord-api-types/v10';

import { Client } from '../client/Client';
import { Guild } from '../structures/Guild';
import { BaseEvent } from './base/BaseEvent';

/**
 * Represents the guild create event emitted by the client.
 * @extends {BaseEvent}
 */
class GuildCreateEvent extends BaseEvent {
  /**
   * Creates a new instance of the ready event.
   * @param client The client that emits the event.
   */
  constructor(client: Client) {
    super('GUILD_CREATE', client);
  }

  /**
   * Runs the event.
   */
  override run(data: GatewayGuildCreateDispatchData) {
    if (data.unavailable) {
      this.client.guilds?.cache.set(data.id, new Guild(this.client, data));
      this.client.emit(
        'guildCreate',
        this.client.guilds?.cache.get(data.id) as Guild
      );
    } else {
      this.client.unavailableGuilds.push(data.id);
      this.client.emit('guildUnavailable', data.id);
    }
  }
}

export { GuildCreateEvent };
