import { Client } from '../client/Client';
import BaseEvent from './base/BaseEvent';

/**
 * Represents the ready event emitted by the client.
 * @extends {BaseEvent}
 */
class ReadyEvent extends BaseEvent {
  /**
   * Creates a new instance of the ready event.
   * @param name The name of the event.
   */
  constructor(client: Client) {
    super('READY', client);
  }

  /**
   * Runs the event.
   */
  override run(): void {
    this.client.emit('ready');
  }
}

export default ReadyEvent;
