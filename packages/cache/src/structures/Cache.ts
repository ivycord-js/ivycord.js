/**
 * Options for the cache.
 */
interface CacheOptions {
  /**
   * After how many seconds the cached value should expire.
   */
  ttl?: number;

  /**
   * The maximum number of entries that the cache can hold.
   */
  maxEntries?: number;

  /**
   * The interval in seconds at which the cache should be automatically swept for expired entries.
   */
  sweepInterval?: number;
}

/**
 * Represents a cache that stores key-value pairs.
 */
abstract class Cache<T> {
  /**
   * After how many seconds the cached value should expire.
   */
  public ttl: number;

  /**
   * The maximum number of entries that the cache can hold.
   */
  public maxEntries: number;

  /**
   * The interval in seconds at which the cache should be automatically swept for expired entries.
   */
  public sweepInterval: number;

  /**
   * Creates a new instance of the cache.
   * @param options Options for the cache.
   */
  constructor(options: CacheOptions) {
    this.ttl = options.ttl ?? 86400;
    this.maxEntries = options.maxEntries ?? Infinity;
    this.sweepInterval = options.sweepInterval ?? 600;
  }

  /**
   * Retrieves the value associated with the specified key from the cache.
   * @param key The key to retrieve the value for.
   * @returns The value associated with the key, or null if the key does not exist in the cache.
   */
  abstract get(key: string): T | null;

  /**
   * Sets the value associated with the specified key in the cache.
   * @param key The key to set the value for.
   * @param value The value to set.
   * @returns The value that was set.
   */
  abstract set(key: string, value: T): T;

  /**
   * Deletes the value associated with the specified key from the cache.
   * @param key The key to delete the value for.
   * @returns The value that was deleted, or null if the key does not exist in the cache.
   */
  abstract delete(key: string): T | null;

  /**
   * Wipes all key-value pairs from the cache.
   * @returns The cache instance.
   */
  abstract wipe(): this;

  /**
   * Checks if the cache contains a value associated with the specified key.
   * @param key The key to check for.
   * @returns True if the cache contains the key, false otherwise.
   */
  abstract has(key: string): boolean;
}

export { Cache, CacheOptions };
