import { Collection } from '@ivycord-js/utils';

import { Cache, CacheOptions } from './Cache';

/**
 * Represents a cache that stores key-value pairs in memory.
 * @extends {Cache}
 */
class MemoryCache<T> extends Cache<T> {
  /**
   * The internal data structure that holds the cached values.
   */
  private readonly data: Collection<string, { value: T; expiresAt: number }> =
    new Collection();

  /**
   * The interval for the cache sweeping process.
   */
  private _sweepInterval: NodeJS.Timeout | null = null;

  /**
   * Creates a new instance of the memory cache.
   * @param options Options for the cache.
   */
  constructor(options: CacheOptions) {
    super(options);
    this.startSweeping();
  }

  /**
   * Retrieves the value associated with the specified key from the cache.
   * @param key The key to retrieve the value for.
   * @returns The value associated with the key, or null if the key does not exist in the cache.
   */
  public get(key: string) {
    const entry = this.data.get(key);
    if (entry && entry.expiresAt > Date.now()) return entry.value;
    else return null;
  }

  /**
   * Sets the value associated with the specified key in the cache.
   * @param key The key to set the value for.
   * @param value The value to set.
   * @returns The value that was set.
   */
  public set(key: string, value: T) {
    const expiresAt = Date.now() + this.ttl * 1000;
    if (this.data.size >= this.maxEntries) {
      const oldestKey = this.data.firstKey();
      this.data.delete(oldestKey);
    }
    this.data.add(key, { value, expiresAt });
    return value;
  }

  /**
   * Deletes the value associated with the specified key from the cache.
   * @param key The key to delete the value for.
   * @returns The value that was deleted, or null if the key does not exist in the cache.
   */
  public delete(key: string) {
    const entry = this.data.get(key);
    if (entry) {
      this.data.delete(key);
      return entry.value;
    }
    return null;
  }

  /**
   * Wipes all key-value pairs from the cache.
   * @returns The memory cache instance.
   */
  public wipe() {
    this.data.clear();
    return this;
  }

  /**
   * Checks if the cache contains a value associated with the specified key.
   * @param key The key to check for.
   * @returns True if the cache contains the key, false otherwise.
   */
  public has(key: string) {
    const entry = this.data.get(key);
    return !!entry && entry.expiresAt > Date.now();
  }

  /**
   * Starts the cache sweeping process. This process periodically removes expired entries from the cache.
   */
  private startSweeping() {
    if (this.sweepInterval <= 0) return;
    if (this._sweepInterval) clearInterval(this._sweepInterval);
    this._sweepInterval = setInterval(
      () => this.sweepCache(),
      this.sweepInterval * 1000
    ).unref();
  }

  /**
   * Removes expired entries from the cache.
   */
  private sweepCache() {
    for (const [key, entry] of this.data) {
      if (entry.expiresAt <= Date.now()) this.data.delete(key);
    }
  }
}

export { MemoryCache };
