import { Gateway } from '@ivycord-js/gateway';
import { RawShardEventData } from '@ivycord-js/gateway';
import { Rest } from '@ivycord-js/rest';
import { Collection, IvyError, IvyEventEmitter } from '@ivycord-js/utils';

import { glob } from 'fast-glob';

import { BaseEvent } from '../events/base/BaseEvent';
import { User } from '../structures/User';

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
   * The options for the cache used for storing Discord data.
   */
  cacheOptions?: ClientCacheOptions;
}

/**
 * Options for configuring the cache.
 */
interface ClientCacheOptions {
  /**
   * The location where the cache is stored.
   */
  location: 'memory' | 'redis' | 'mongodb';

  /**
   * The connection string for connecting to the cache storage.
   * This property is optional and only required for certain cache locations (e.g. Redis).
   */
  connectionString?: string;

  /**
   * After how many seconds the cached value should expire.
   */
  ttl?: number;

  /**
   * The maximum number of entries that the cache can hold.
   */
  max?: number;

  /**
   * The interval in seconds at which the cache should be automatically swept for expired entries.
   */
  sweepInterval?: number;
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
  public events: Collection<keyof ClientEvents, (...args: any[]) => void> =
    new Collection();

  /**
   * The user associated with the client.
   */
  public user?: User;

  /**
   * Options for the cache.
   */
  public cacheOptions?: ClientCacheOptions;

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
            const eventFn = this.events.get(data.t as keyof ClientEvents);
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

export { Client, ClientEvents };
