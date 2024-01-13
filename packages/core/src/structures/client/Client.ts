import { Gateway, GatewayEvents, ShardEvents } from '@ivycord-js/gateway';
import { Rest } from '@ivycord-js/rest';
import { IvyEventEmitter } from '@ivycord-js/utils';

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
interface ClientEvents extends Omit<GatewayEvents, keyof ShardEvents> {}

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
   * Creates a new instance of the client.
   * @param options Options for the client.
   */
  constructor(options: ClientOptions) {
    super();
    this.rest = options.rest;
    this.gateway = options.gateway ?? null;
  }
}

export { Client, ClientEvents };
