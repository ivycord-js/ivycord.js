import { GatewayGuildCreateDispatchData } from 'discord-api-types/v10';

import { Client } from '../client/Client';
import { BaseEvent } from './base/BaseEvent';

class GuildCreateEvent extends BaseEvent {
  constructor(client: Client) {
    super('GUILD_CREATE', client);
  }
  override run(data: GatewayGuildCreateDispatchData) {
    // dodaj cache pa radi ovo
  }
}
