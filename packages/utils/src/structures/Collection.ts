/**
 * Represents a collection of key-value pairs.
 * @extends {Map}
 */
class Collection<KeyType, ValueType> extends Map<KeyType, ValueType> {
  /**
   * The maximum number of entries allowed in this collection.
   */
  private limit: number | null;

  /**
   * Creates a new instance of the collection.
   * @param [limit] The maximum number of entries allowed in this collection.
   */
  constructor(limit?: number) {
    super();
    this.limit = limit ?? null;
  }

  /**
   * Adds a key-value pair to the collection.
   * @param key The key to add.
   * @param value The value associated with the key.
   * @param [replace=true] Whether to replace the value if the key already exists.
   * @returns The value added to the collection.
   */
  add(key: KeyType, value: ValueType, replace = true) {
    if (this.limit && this.size >= this.limit) return this;
    if (!replace && this.has(key)) return this;
    this.set(key, value);
    return value;
  }

  /**
   * Returns the first value in the collection.
   * @returns The first value in the collection.
   */
  first() {
    return [...this.values()][0];
  }

  /**
   * Returns the last value in the collection.
   * @returns The last value in the collection.
   */
  last() {
    return [...this.values()][this.size - 1];
  }

  /**
   * Returns a random value from the collection.
   * @returns A random value from the collection.
   */
  random() {
    return [...this.values()][Math.floor(Math.random() * this.size)];
  }

  /**
   * Checks if any element in the collection satisfies the provided testing function.
   * @param fn The testing function.
   * @returns True if any element satisfies the provided testing function, otherwise false.
   */
  some(fn: (key: KeyType, value: ValueType) => boolean) {
    for (const [key, value] of this) {
      if (fn(key, value)) return true;
    }
    return false;
  }

  /**
   * Checks if every element in the collection satisfies the provided testing function.
   * @param fn The testing function.
   * @returns True if every element satisfies the provided testing function, otherwise false.
   */
  every(fn: (value: ValueType) => boolean) {
    for (const value of this.values()) {
      if (!fn(value)) return false;
    }
    return true;
  }

  /**
   * Returns an array containing all the values in the collection.
   *
   * @returns An array containing all the values in the collection.
   */
  toArray() {
    return [...this.values()];
  }

  /**
   * Returns an array containing all the keys in the collection.
   * @returns An array containing all the keys in the collection.
   */
  keysArray() {
    return [...this.keys()];
  }
}

export { Collection };
