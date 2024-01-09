/**
 * Represents a collection of key-value pairs
 * @extends {Map}
 */
export class Collection<KeyType, ValueType> extends Map<KeyType, ValueType> {
  /**
   * The maximum number of entries allowed in this collection
   */
  private limit: number | null;

  /**
   * Creates a new instance of the collection
   * @param limit The maximum number of entries allowed in this collection
   */
  constructor(limit?: number) {
    super();
    this.limit = limit ?? null;
  }

  /**
   * Adds a key-value pair to the collection
   * @param key Key to add
   * @param value Value associated with the key
   * @param replace Whether to replace the value if the key already exists
   */
  add(key: KeyType, value: ValueType, replace = true) {
    if (this.limit && this.size >= this.limit) return this;
    if (!replace && this.has(key)) return this;
    this.set(key, value);
    return this;
  }

  /**
   * Returns the first value in the collection
   */
  first() {
    return [...this.values()][0];
  }

  /**
   * Returns the last value in the collection
   */
  last() {
    return [...this.values()][this.size - 1];
  }

  /**
   * Returns a random value from the collection
   */
  random() {
    return [...this.values()][Math.floor(Math.random() * this.size)];
  }

  /**
   * Removes a key-value pair from the collection
   * @param key Key to remove
   */
  remove(key: KeyType) {
    this.delete(key);
    return this;
  }
}
