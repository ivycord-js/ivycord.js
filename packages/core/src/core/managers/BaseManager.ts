import { Client } from '../client/Client';

/**
 * Represents a base manager used for many other managers.
 */
class BaseManager {
  /**
   * The client that manages the manager.
   */
  public client: Client;

  /**
   * Creates a new instance of the base manager.
   * @param client The client that manages the manager.
   */
  constructor(client: Client) {
    this.client = client;
  }
}
export { BaseManager };
