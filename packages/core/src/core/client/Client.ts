import { Gateway } from '@ivycord-js/gateway';
import { RawShardEventData } from '@ivycord-js/gateway';
import { Rest } from '@ivycord-js/rest';
import { Collection, IvyError, IvyEventEmitter } from '@ivycord-js/utils';

import { GatewayDispatchEvents } from 'discord-api-types/v10';
import { glob } from 'fast-glob';

import { BaseEvent } from '../events/base/BaseEvent';
import { User } from '../structures/User';

enum GatewayEvents {
  shardReady = 'SHARD_READY',
  shardDisconnect = 'SHARD_DISCONNECT',
  shardError = 'SHARD_ERROR',
  shardClose = 'SHARD_CLOSE',
  shardWarn = 'SHARD_WARN'
}

type GatewayEventsType = GatewayDispatchEvents | GatewayEvents;

/**
 * Options for the client.
 */
interface ClientOptions {
  /**
   * The REST client used for sending requests to Discord API.
   */
  rest: Rest;

  /**
   * The gateway used for communicating with the Discord gateway.
   */
  gateway?: Gateway;

  /**
   * The cache used for caching Discord data.
   * @default 'memory'
   */
  cacheOptions?: CacheOptions;
}

/**
 * Options for configuring the cache.
 */
interface CacheOptions {
  /**
   * The location where the cache is stored.
   * Possible values are 'memory', 'redis', or 'mongodb'.
   */
  location: 'memory' | 'redis' | 'mongodb';

  /**
   * The connection string for connecting to the cache storage.
   * This property is optional and only required for certain cache locations.
   */
  connectionString?: string;

  /**
   * The time to live for cached values in seconds.
   * Default value is 0, which means no expiration.
   */
  ttl?: number;

  /**
   * The maximum number of entries the cache can hold.
   * Default value is Infinity, which means unlimited entries.
   */
  max?: number;

  /**
   * The interval in milliseconds for sweeping the cache.
   * Default value is 0, which means no sweeping.
   */
  sweep?: number;
}

/**
 * All events emitted by the client.
 */
interface ClientEvents {
  /**
   * Emitted when the client is ready.
   */
  ready: (client: Client) => void;

  /**
   * Emitted when a shard is ready.
   */
  shardReady: (shardID: number) => void;
}

/**
 * Represents a Discord client.
 * @extends {IvyEventEmitter}
 */
class Client extends IvyEventEmitter<keyof ClientEvents, ClientEvents> {
  /**
   * The REST client used for sending requests to Discord API.
   */
  public rest: Rest;

  /**
   * The gateway used for communicating with the Discord gateway.
   */
  public gateway: Gateway | null;

  /**
   * The events emitted by the client.
   */
  public events: Collection<`${GatewayEventsType}`, (...args: any[]) => void> =
    new Collection();

  /**
   * The user associated with the client.
   */
  public user: User | undefined;

  /**
   * Options for the cache.
   */
  public cacheOptions?: CacheOptions;

  /**
   * Creates a new instance of the client.
   * @param options Options for the client.
   */
  constructor(options: ClientOptions) {
    super();
    this.rest = options.rest;
    this.gateway = options.gateway ?? null;
    this.cacheOptions = options.cacheOptions;

    if (this.gateway) {
      this.loadEvents()
        .then(() => {
          this.gateway?.on('rawEvent', (data: RawShardEventData) => {
            const eventFn = this.events.get(data.t as `${GatewayEventsType}`);
            if (eventFn) eventFn(data.d, data.shardID);
          });
        })
        .catch(() => {
          throw new IvyError('EVENTS_LOAD_FAILED');
        });
    }
  }

  /**
   * Loads all client events.
   */
  private async loadEvents() {
    const eventFiles = await glob(
      `${__dirname.replaceAll('\\', '/')}/../events/*.js`
    );
    for (const file of eventFiles) {
      const Event: any = Object.values(await import(file))[0];
      const instance: BaseEvent = new Event(this);
      this.events.set(instance.name, instance.run);
    }
  }
}

export { Client, ClientEvents, GatewayEventsType };
