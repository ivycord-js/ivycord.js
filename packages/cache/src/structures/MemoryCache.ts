import { Collection } from '@ivycord-js/utils';

import { Cache, CacheOptions } from './Cache';

/**
 * Represents a memory cache that stores key-value pairs with expiration time.
 * @template T The type of values stored in the cache.
 */
class MemoryCache<T> extends Cache<T> {
  /**
   * The internal data structure that holds the cached values.
   */
  private readonly data: Collection<string, { value: T; expiresAt: number }>;

  /**
   * The interval ID for the cache sweeping process.
   */
  private _sweepInterval: NodeJS.Timeout | null;

  /**
   * Creates a new instance of the MemoryCache class.
   * @param options The options for configuring the cache.
   */
  constructor(options: CacheOptions) {
    super(options);
    this.data = new Collection();
    this._sweepInterval = null;

    this.startSweeping();
  }

  /**
   * Retrieves the value associated with the specified key from the cache.
   * @param key The key of the value to retrieve.
   * @returns The value associated with the key, or undefined if the key is not found or has expired.
   */
  public get(key: string) {
    const entry = this.data.get(key);
    if (entry && entry.expiresAt > Date.now()) {
      return entry.value;
    }
    return undefined;
  }

  /**
   * Sets the value associated with the specified key in the cache.
   * @param key The key of the value to set.
   * @param value The value to set.
   * @returns The value that was set.
   */
  public set(key: string, value: T) {
    const expiresAt = Date.now() + this.ttl * 1000;
    if (this.data.size >= this.max) {
      const oldestKey = this.data.firstKey();
      this.data.delete(oldestKey);
    }
    this.data.set(key, { value, expiresAt });
    return value;
  }

  /**
   * Deletes the value associated with the specified key from the cache.
   * @param key The key of the value to delete.
   * @returns The value that was deleted, or undefined if the key is not found.
   */
  public delete(key: string) {
    const entry = this.data.get(key);
    if (entry) {
      this.data.delete(key);
      return entry.value;
    }
    return undefined;
  }

  /**
   * Clears all the values from the cache.
   * @returns The MemoryCache instance.
   */
  public clear() {
    this.data.clear();
    return this;
  }

  /**
   * Checks if the cache contains a value associated with the specified key.
   * @param key The key to check.
   * @returns A boolean indicating whether the cache contains the key.
   */
  public has(key: string) {
    const entry = this.data.get(key);
    return !!entry && entry.expiresAt > Date.now();
  }

  /**
   * Starts the cache sweeping process.
   * This process periodically removes expired entries from the cache.
   */
  private startSweeping() {
    if (this.sweepInterval <= 0) return;
    if (this._sweepInterval) {
      clearInterval(this._sweepInterval);
    }
    this._sweepInterval = setInterval(() => {
      this.sweepCache();
    }, this.sweepInterval * 1000);
  }

  /**
   * Removes expired entries from the cache.
   */
  private sweepCache() {
    const now = Date.now();
    this.data.forEach((entry, key) => {
      if (entry.expiresAt <= now) {
        this.data.delete(key);
      }
    });
  }
}

export { MemoryCache };
