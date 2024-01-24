import { Cache, MemoryCache } from '@ivycord-js/cache';

import { Client } from '../client/Client';
import { Guild } from '../structures/Guild';

/**
 * Manages guilds for the client.
 */
class GuildManager {
  /**
   * The client that manages the manager.
   */
  public client: Client;

  /**
   * The cache for storing guild objects.
   */
  public cache: Cache<Guild>;

  /**
   * Creates a new instance of the guild manager.
   * @param client The client that manages the manager.
   * @param _cache The type of cache to use ('memory', 'redis', or 'mongodb').
   */
  constructor(client: Client, _cache: 'memory' | 'redis' | 'mongodb') {
    // TODO: kada ostali cachovi budu gotovi popraviti ovo dole ispod
    this.client = client;
    this.cache = new MemoryCache({
      maxEntries: this.client.cacheOptions?.maxEntries,
      sweepInterval: this.client.cacheOptions?.sweepInterval,
      ttl: this.client.cacheOptions?.ttl
    });
  }

  /**
   * Adds a guild to the cache.
   * @param guild The guild to add.
   * @returns The guild manager instance.
   */
  add(guild: Guild): this {
    this.cache.set(guild.id, guild);
    return this;
  }

  /**
   * Retrieves a guild from the cache.
   * @param id The ID of the guild to retrieve.
   * @returns The guild object if found, or null if not found.
   */
  get(id: string): Guild | null {
    return this.cache.get(id);
  }

  /**
   * Removes a guild from the cache.
   * @param id The ID of the guild to remove.
   * @returns The guild manager instance.
   */
  remove(id: string): this {
    this.cache.delete(id);
    return this;
  }
}
export { GuildManager };
