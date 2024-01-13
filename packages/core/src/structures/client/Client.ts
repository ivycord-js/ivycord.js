import { Gateway, GatewayEvents, ShardEvents } from '@ivycord-js/gateway';
import { Rest } from '@ivycord-js/rest';
import { Collection, IvyError, IvyEventEmitter } from '@ivycord-js/utils';

import { glob } from 'fast-glob';

/**
 * Options for the client.
 */
interface ClientOptions {
  rest: Rest;
  gateway?: Gateway;
}

/**
 * All events emitted by the client.
 */
interface ClientEvents extends Omit<GatewayEvents, keyof ShardEvents> {
  ready: (data: unknown) => void;
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
    string,
    (client: this, data: unknown, shardID?: number) => Promise<void>
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
          this.gateway?.on('rawEvent', async (data): Promise<void> => {
            if (this.events.has(data.t)) {
              await this.events.get(data.t)?.(this, data.d, data.shardID);
            }
          });
        })
        .catch(() => {
          throw new IvyError('EVENTS_LOAD_FAILED');
        });
    }
  }
  private async loadEvents() {
    const eventFiles = await glob(
      `${__dirname.replaceAll('\\', '/')}/../../events/*.js`
    );
    for (const file of eventFiles) {
      const event = await import(file);
      const eventName = file.split('\\').pop()?.split('/').pop()?.split('.')[0];
      if (!eventName) {
        throw new IvyError('EVENT_NOT_IMPLEMENTED', file);
      }
      this.events.set(eventName as string, event.run);
    }
  }
}

export { Client, ClientEvents };
