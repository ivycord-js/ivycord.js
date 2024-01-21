interface CacheOptions {
  ttl?: number;
  max?: number;
  reset?: boolean;
  sweep?: number;
}

/**
 * Represents a cache with configurable options.
 */
class Cache<T> {
  public ttl: number;
  public max: number;
  public reset: boolean;
  public sweep: number;

  /**
   * Creates a new instance of the Cache class.
   * @param options - The options for configuring the cache.
   */
  constructor(options: CacheOptions) {
    this.ttl = options.ttl ?? 0;
    this.max = options.max ?? Infinity;
    this.reset = options.reset ?? false;
    this.sweep = options.sweep ?? 0;
  }

  add(key: string, value: any) {
    // dodaj key i value u cache
  }
}

export { Cache, CacheOptions };
