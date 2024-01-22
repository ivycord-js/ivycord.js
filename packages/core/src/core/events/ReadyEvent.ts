import { Client } from '../client/Client';
import { BaseEvent } from './base/BaseEvent';

/**
 * Represents the ready event emitted by the client.
 * @extends {BaseEvent}
 */
class ReadyEvent extends BaseEvent {
  /**
   * Creates a new instance of the ready event.
   * @param client The client that emits the event.
   */
  constructor(client: Client) {
    super('ready', client);
  }

  /**
   * Runs the event.
   */
  override run() {
    this.client.emit('ready', this.client);
  }
}

export { ReadyEvent };
