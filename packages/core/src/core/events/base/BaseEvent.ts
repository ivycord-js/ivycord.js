import { Client, GatewayEventsType } from '../../client/Client';

/**
 * Represents a base event emitted by the client.
 */
abstract class BaseEvent {
  /**
   * The client that emits the event.
   */
  public client: Client;

  /**
   * The name of the event.
   */
  public name: `${GatewayEventsType}`;

  /**
   * Creates a new instance of the base event.
   * @param client The client that emits the event.
   * @param name The name of the event.
   */
  constructor(name: `${GatewayEventsType}`, client: Client) {
    this.client = client;
    this.name = name;

    this.run = this.run.bind(this);
  }

  /**
   * Runs the event.
   * @param args The arguments passed to the event.
   */
  abstract run(...args: any[]): void;
}

export { BaseEvent };
