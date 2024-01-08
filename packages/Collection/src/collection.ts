/**
 * A collection of key-value pairs.
 * @extends {Map}
 */
export class Collection extends Map {
  /**
   * The maximum number of entries allowed in this collection
   * @default null
   */
  private limit: number | null;
  constructor(limit?: number) {
    super();
    this.limit = limit ?? null;
  }
  /**
   * Returns the first value in the collection
   */
  first() {
    return this.values().next().value;
  }
  /**
   * Returns the last value in the collection
   */
  last() {
    return [...this.values()].pop();
  }
  /**
   * Returns a random value from the collection
   */
  random() {
    return [...this.values()][Math.floor(Math.random() * this.size)];
  }
  /**
   * Returns an array of values from the collection
   */
  array() {
    return [...this.values()];
  }
  /**
   * Returns an array of keys from the collection
   */
  keyArray() {
    return [...this.keys()];
  }

  /**
   * Adds a key-value pair to the collection.
   * If the key already exists, it will be replaced if the `replace` parameter is truthy.
   * If the key already exists and `replace` is falsy, the method will return without making any changes.
   * @param key - The key to add.
   * @param value - The value to associate with the key.
   * @param replace - A flag indicating whether to replace the existing value if the key already exists.
   */
  add(key: string, value: unknown, replace: number) {
    if (this.has(key)) {
      if (replace) {
        this.delete(key);
      } else {
        return;
      }
    }
    this.set(key, value);
  }

  /**
   * Removes a key-value pair from the collection.
   * @param key - The key to remove.
   */
  remove(key: string) {
    if (!this.has(key)) return;
    this.delete(key);
  }
  
}
