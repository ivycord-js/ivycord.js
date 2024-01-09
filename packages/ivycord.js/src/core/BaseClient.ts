import { APIGatewayBotInfo } from 'discord-api-types/v10';
import { EventEmitter } from 'ws';

import { Shard } from '../gateway/Shard';
import { RequestHandler } from '../handlers/RequestHandler';
import { IvyError } from '../utils/errors/IvyError';

/**
 * Options for the client
 */
interface ClientOptions {
  /**
   * The token of the bot
   */
  token: string;

  /**
   * The number of reconnect attempts before giving up
   */
  reconnectAttempts?: number;

  /**
   * Whether to compress the gateway data or not
   */
  compress?: boolean;

  /**
   * Total number of members where the gateway will stop sending offline members in the guild member list
   */
  largeThreshold?: number;
}

/**
 * Represents a base Discord client
 * @extends {EventEmitter}
 */
class BaseClient extends EventEmitter {
  /**
   * The token of the bot
   */
  public token: string;

  /**
   * The number of reconnect attempts before giving up
   */
  public reconnectAttempts: number | null;

  /**
   * Whether to compress the gateway data or not
   */
  public compress: boolean;

  /**
   * Total number of members where the gateway will stop sending offline members in the guild member list
   */
  public largeThreshold: number;

  /**
   * The shard that is managed by this client
   */
  public shard: Shard;

  /**
   * The request handler for the client
   */
  public requestHandler: RequestHandler;

  /**
   * The user agent of the client
   */
  public _userAgent: string; // TODO: dodaj ovo

  /**
   * The gateway data
   */
  public _gatewayData: APIGatewayBotInfo;

  /**
   * Creates a new instance of the base client
   * @param options Options for the client
   */
  constructor(options: ClientOptions) {
    super();
    this.token = options.token;
    this.reconnectAttempts = options.reconnectAttempts ?? 5; // It can be null if the user want infinite reconnect attempts
    this.compress = options.compress ?? false;
    this.largeThreshold = options.largeThreshold ?? 50;

    this.shard = new Shard(this, 1);
    this.requestHandler = new RequestHandler(this);

    if (this.largeThreshold < 50 || this.largeThreshold > 250) {
      throw new IvyError('LARGE_THRESHOLD_INVALID');
    }
  }

  /**
   * Connects to the gateway
   */
  async connect() {
    await this.getGateway();
    this.shard.initWS();
  }

  /**
   * Gets the gateway data
   */
  protected async getGateway() {
    const gatewayData = await this.requestHandler.request<APIGatewayBotInfo>(
      'GET',
      '/gateway/bot'
    );
    this._gatewayData = gatewayData;
    return;
  }
}

export { BaseClient, ClientOptions };
