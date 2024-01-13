import { Rest } from '@ivycord-js/rest';
import { IvyError, IvyEventEmitter } from '@ivycord-js/utils';

import {
  APIGatewayBotInfo,
  GatewayUpdatePresence
} from 'discord-api-types/v10';

import { ShardEvents } from './Shard';
import { ShardingManager } from './ShardingManager';

/**
 * All Discord gateway intents.
 */
enum GatewayIntents {
  GUILDS = 1 << 0,
  GUILD_MEMBERS = 1 << 1,
  GUILD_MODERATION = 1 << 2,
  GUILD_EMOJIS_AND_STICKERS = 1 << 3,
  GUILD_INTEGRATIONS = 1 << 4,
  GUILD_WEBHOOKS = 1 << 5,
  GUILD_INVITES = 1 << 6,
  GUILD_VOICE_STATES = 1 << 7,
  GUILD_PRESENCES = 1 << 8,
  GUILD_MESSAGES = 1 << 9,
  GUILD_MESSAGE_REACTIONS = 1 << 10,
  GUILD_MESSAGE_TYPING = 1 << 11,
  DIRECT_MESSAGES = 1 << 12,
  DIRECT_MESSAGE_REACTIONS = 1 << 13,
  DIRECT_MESSAGE_TYPING = 1 << 14,
  MESSAGE_CONTENT = 1 << 15,
  GUILD_SCHEDULED_EVENTS = 1 << 16,
  AUTO_MODERATION_CONFIGURATION = 1 << 20,
  AUTO_MODERATION_EXECUTION = 1 << 21
}

/**
 * The data received from the gateway.
 */
interface GatewayData extends APIGatewayBotInfo {
  expiresAt: number;
}

/**
 * All events emitted by the gateway.
 */
interface GatewayEvents extends ShardEvents {}

/**
 * Options for the gateway.
 */
interface GatewayOptions {
  /**
   * The authorization token of the client.
   */
  token: string;

  /**
   * The REST client used for sending requests to Discord API.
   */
  rest: Rest;

  /**
   * The number of reconnect attempts before giving up.
   */
  reconnectAttempts?: number;

  /**
   * Whether to compress the data sent over the gateway.
   */
  compress?: boolean;

  /**
   * The threshold at which the gateway considers a guild to be "large".
   */
  largeThreshold?: number;

  /**
   * The total number of shards the bot is using.
   */
  shardCount?: number | 'auto';

  /**
   * The number from which the shard IDs should start.
   */
  shardsStartFrom?: number;

  /**
   * The presence data to send to the gateway.
   */
  presence?: GatewayUpdatePresence;

  /**
   * The intents to enable for the client.
   */
  intents?: number;
}

/**
 * Represents a structure used for communicating with the Discord gateway.
 * @extends {IvyEventEmitter}
 */
class Gateway extends IvyEventEmitter<keyof GatewayEvents, GatewayEvents> {
  /**
   * The authorization token of the client.
   */
  public token: string;

  /**
   * The REST client used for sending requests to Discord API.
   */
  public rest: Rest;

  /**
   * The number of reconnect attempts before giving up.
   */
  public reconnectAttempts: number | null;

  /**
   * Whether to compress the data sent over the gateway.
   */
  public compress: boolean;

  /**
   * The threshold at which the gateway considers a guild to be "large".
   */
  public largeThreshold: number;

  /**
   * The total number of shards the bot is using.
   */
  public shardCount: number | 'auto';

  /**
   * The number from which the shard IDs should start.
   */
  public shardsStartFrom: number;

  /**
   * The presence data to send to the gateway.
   */
  public presence: GatewayUpdatePresence | null;

  /**
   * The intents to enable for the client.
   */
  public intents: GatewayIntents[] | number;

  /**
   * Whether the gateway is ready.
   */
  public ready = false;

  /**
   * The sharding manager that manages all gateway shards.
   */
  public shardingManager = new ShardingManager(this);

  /**
   * The data received from the gateway.
   */
  public _gatewayData: GatewayData | null = null;

  /**
   * Creates a new instance of the gateway.
   * @param token The authorization token of the client.
   * @param options Options for the gateway.
   */
  constructor(options: GatewayOptions) {
    super();
    this.token = options.token;
    this.rest = options.rest;
    this.reconnectAttempts = options?.reconnectAttempts ?? null;
    this.compress = options?.compress ?? false;
    this.largeThreshold = options?.largeThreshold ?? 50;
    this.shardCount = options?.shardCount ?? 'auto';
    this.presence = options?.presence ?? null;
    this.intents = options?.intents ?? 0;
    this.shardsStartFrom = options?.shardsStartFrom ?? 0;

    if (this.shardCount === 'auto' && this.shardsStartFrom !== 0)
      throw new IvyError('SHARD_COUNT_SHARDS_START_FROM_MISMATCH');
  }

  /**
   * Fetches data from the gateway.
   * @returns The fetched gateway data.
   */
  async fetchGatewayData() {
    if (this._gatewayData && this._gatewayData.expiresAt > Date.now())
      return this._gatewayData;
    const fetchedData = await this.rest!.getGatewayBotInfo();
    this._gatewayData = {
      ...fetchedData,
      expiresAt:
        Date.now() + (fetchedData.session_start_limit.reset_after ?? 10000)
    };
    return this._gatewayData;
  }

  /**
   * Connects to the gateway.
   */
  async connect() {
    await this.shardingManager.spawnShards();
  }
}

export { Gateway, GatewayEvents, GatewayIntents };
