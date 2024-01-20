import { merge } from 'lodash';

import { Client } from '../client/Client';

/**
 * Represents a base structure used for many other structures.
 */
class BaseStructure {
  /**
   * The client that uses this structure.
   */
  public client: Client;

  /**
   * The ID of the structure.
   */
  public id: string;

  /**
   * Creates a new instance of the base structure.
   * @param client The client that uses this structure.
   * @param id The ID of the structure.
   */
  constructor(client: Client, id: string) {
    this.client = client;
    this.id = id;
  }

  /**
   * The timestamp of when the structure was created.
   */
  get createdAtTimestamp() {
    return Math.floor(Number(BigInt(this.id) / 4194304n)) + 1420070400000;
  }

  /**
   * The unix timestamp of when the structure was created.
   */
  get createdAtUnix() {
    return Math.floor(this.createdAtTimestamp / 1000);
  }

  /**
   * The date of when the structure was created.
   */
  get createdAt() {
    return new Date(this.createdAtTimestamp);
  }

  /**
   * Returns the JSON representation of the structure.
   * @param additionalProps Additional properties to add to the JSON object.
   * @returns The JSON representation of the structure.
   */
  toJSON(additionalProps?: string[]) {
    const baseProps = {
      id: this.id,
      client: this.client,
      createdAtTimestamp: this.createdAtTimestamp,
      createdAtUnix: this.createdAtUnix,
      createdAt: this.createdAt
    };
    if (additionalProps) return merge(baseProps, additionalProps);
    else return baseProps;
  }
}

export { BaseStructure };
