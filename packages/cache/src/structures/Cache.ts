interface CacheOptions {
  ttl?: number;
  max?: number;
  reset?: boolean;
  sweep?: number;
}

/**
 * Represents a cache that stores key-value pairs.
 * @template T - The type of values stored in the cache.
 */
abstract class Cache<T> {
  /**
   * The time-to-live (TTL) for cached values in seconds.
   */
  public ttl: number;

  /**
   * The maximum number of entries that the cache can hold.
   */
  public max: number;

  /**
   * The interval in seconds at which the cache should be automatically swept for expired entries.
   */
  public sweep: number;

  /**
   * Creates a new instance of the Cache class.
   * @param options - The options for configuring the cache.
   */
  constructor(options: CacheOptions) {
    this.ttl = options.ttl ?? 0;
    this.max = options.max ?? Infinity;
    this.sweep = options.sweep ?? 0;
  }

  /**
   * Retrieves the value associated with the specified key from the cache.
   * @returns The value associated with the key, or undefined if the key does not exist in the cache.
   */
  abstract get(key: string): T | undefined;

  /**
   * Sets the value associated with the specified key in the cache.
   * @returns The previous value associated with the key, or undefined if the key did not exist in the cache.
   */
  abstract set(key: string, value: T): T;

  /**
   * Deletes the value associated with the specified key from the cache.
   * @returns The value associated with the key, or undefined if the key did not exist in the cache.
   */
  abstract delete(key: string): T | undefined;

  /**
   * Clears all key-value pairs from the cache.
   */
  abstract clear(): void;

  /**
   * Checks if the cache contains a value associated with the specified key.
   * @returns True if the cache contains the key, false otherwise.
   */
  abstract has(key: string): boolean;
}

export { Cache, CacheOptions };
