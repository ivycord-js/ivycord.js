import { GatewayDispatchEvents } from 'discord-api-types/v10';

import { Client } from '../../client/Client';
import { Guild } from '../../structures/Guild';

/**
 * All raw events emitted by the client.
 */
enum GatewayRawEvents {
  shardReady = 'SHARD_READY',
  shardClose = 'SHARD_CLOSE',
  shardDisconnect = 'SHARD_DISCONNECT'
}

/**
 * Represents the event handlers for various client events.
 */
interface ClientEvents {
  /**
   * Emitted when the client is ready.
   * @param client - The client instance.
   */
  ready: (client: Client) => void;

  /**
   * Emitted when a shard is ready.
   * @param shardID - The ID of the shard that is ready.
   */
  shardReady: (shardID: number) => void;

  /**
   * Emitted when a guild is created.
   * @param guild - The guild that was created.
   */
  guildCreate: (guild: Guild) => void;

  /**
   * Emitted when a guild becomes unavailable.
   * @param guildID - The ID of the guild that became unavailable.
   */
  guildUnavailable: (guildID: string) => void;
}

/**
 * Represents a base event emitted by the client.
 */
abstract class BaseEvent {
  /**
   * The client that emits the event.
   */
  public client: Client;

  /**
   * The name of the event.
   */
  public name: `${GatewayDispatchEvents | GatewayRawEvents}`;

  /**
   * Creates a new instance of the base event.
   * @param client The client that emits the event.
   * @param name The name of the event.
   */
  constructor(
    name: `${GatewayDispatchEvents | GatewayRawEvents}`,
    client: Client
  ) {
    this.client = client;
    this.name = name;

    this.run = this.run.bind(this);
  }

  /**
   * Runs the event.
   * @param args The arguments passed to the event.
   */
  abstract run(...args: any[]): void;
}

export { BaseEvent, ClientEvents, GatewayRawEvents };
