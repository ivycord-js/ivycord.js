import { Gateway } from '@ivycord-js/gateway';
import { Rest } from '@ivycord-js/rest';
import { Collection, IvyError, IvyEventEmitter } from '@ivycord-js/utils';

import { GatewayDispatchEvents } from 'discord-api-types/v10';
import { glob } from 'fast-glob';

import { BaseEvent } from '../events/base/BaseEvent';

/**
 * Options for the client.
 */
interface ClientOptions {
  /**
   * The REST client used for sending requests to Discord API.
   */
  rest: Rest;

  /**
   * The gateway used for communicating with the Discord gateway.
   */
  gateway?: Gateway;
}

/**
 * All events emitted by the client.
 */
interface ClientEvents {
  /**
   * Emitted when the client is ready.
   */
  ready: () => void;
}

/**
 * Represents a Discord client.
 * @extends {IvyEventEmitter}
 */
class Client extends IvyEventEmitter<keyof ClientEvents, ClientEvents> {
  /**
   * The REST client used for sending requests to Discord API.
   */
  public rest: Rest;

  /**
   * The gateway used for communicating with the Discord gateway.
   */
  public gateway: Gateway | null;

  /**
   * The events emitted by the client.
   */
  public events: Collection<
    `${GatewayDispatchEvents}`,
    (...args: any[]) => void
  > = new Collection();

  /**
   * Creates a new instance of the client.
   * @param options Options for the client.
   */
  constructor(options: ClientOptions) {
    super();
    this.rest = options.rest;
    this.gateway = options.gateway ?? null;

    if (this.gateway) {
      this.loadEvents()
        .then(() => {
          this.gateway?.on('rawEvent', (data) => {
            const eventFn = this.events.get(
              data.t as `${GatewayDispatchEvents}`
            );
            if (eventFn) eventFn();
          });
        })
        .catch(() => {
          throw new IvyError('EVENTS_LOAD_FAILED');
        });
    }
  }

  private async loadEvents() {
    const eventFiles = await glob(
      `${__dirname.replaceAll('\\', '/')}/../events/*.js`
    );
    for (const file of eventFiles) {
      const Event: any = Object.values(await import(file))[0];
      const instance: BaseEvent = new Event(this);
      this.events.set(instance.name, instance.run);
    }
  }
}

export { Client, ClientEvents };
