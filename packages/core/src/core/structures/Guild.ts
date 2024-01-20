import { APIGuild, GuildFeature } from 'discord-api-types/v10';

import { Client } from '../client/Client';
import { BaseStructure } from './BaseStructure';

/**
 * Represents a Discord guild.
 * @extends {BaseStructure}
 */
class Guild extends BaseStructure {
  /**
   * The name of the guild.
   */
  public name: string;

  /**
   * The icon of the guild.
   */
  public icon?: string;

  /**
   * The icon hash of the guild.
   */
  public iconHash?: string;

  /**
   * The hash of the splash image.
   */
  public splash?: string;

  /**
   * The hash of the discovery splash image.
   */
  public discoverySplash?: string;

  /**
   * Whether the client is the owner of the guild.
   */
  public owner?: boolean;

  /**
   * The ID of the owner of the guild.
   */
  public ownerId: string;

  /**
   * The permission bitfield for the client in the guild, excluding channel overwrites and implicit permissions.
   */
  public permissions?: string;

  /**
   * The voice region of the guild.
   * @deprecated channel.rtc_region should be used instead.
   */
  public region?: string;

  /**
   * The ID of the AFK channel of the guild.
   */
  public afkChannelId?: string;

  /**
   * After how much time should the user be moved to the AFK channel, if they're AFK.
   */
  public afkTimeout: number;

  /**
   * Whether the server widget is enabled.
   */
  public widgetEnabled?: boolean;

  /**
   * The channel ID that the widget will generate an invite to, null if set to no invite.
   */
  public widgetChannelId?: string | null;

  /**
   * The verification level of the guild.
   */
  public verificationLevel: number;

  /**
   * The default message notification level of the guild.
   */
  public defaultMessageNotifications: number;

  /**
   * The explicit content filter level of the guild.
   */
  public explicitContentFilter: number;

  /**
   * The roles of the guild.
   */
  public roles: any[]; // TODO: Role - object

  /**
   * The emojis of the guild.
   */
  public emojis: any[]; // TODO: Emoji - object

  /**
   * The enabled features of the guild.
   */
  public features: GuildFeature[];

  /**
   * The required MFA level for the guild.
   */
  public mfaLevel: number;

  /**
   * The application ID of the guild creator if it is bot-created.
   */
  public applicationId?: string;

  /**
   * The ID of the channel where guild notices such as welcome messages and boost events are posted.
   */
  public systemChannelId?: string;

  /**
   * The system channel flags.
   */
  public systemChannelFlags: number;

  /**
   * The ID of the channel where Community guilds can display rules and/or guidelines.
   */
  public rulesChannelId?: string;

  /**
   * The maximum amount of presences for the guild.
   */
  public maxPresences?: number;

  /**
   * The maximum amount of members for this guild.
   */
  public maxMembers?: number;

  /**
   * The vanity URL code of the guild.
   */
  public vanityUrlCode?: string;

  /**
   * The description of the guild.
   */
  public description?: string;

  /**
   * The banner hash of the guild.
   */
  public banner?: string;

  /**
   * The premium tier (boost level) of the guild.
   */
  public premiumTier: number;

  /**
   * The amount of boosts this guild currently has.
   */
  public premiumSubscriptionCount?: number;

  /**
   * The preferred locale of the guild.
   */
  public preferredLocale: string;

  /**
   * The ID of the channel where admins and moderators of community guilds receive notices from Discord.
   */
  public publicUpdatesChannelId?: string;

  /**
   * The maximum amount of users in a video channel.
   */
  public maxVideoChannelUsers?: number;

  /**
   * The maximum amount of users in a stage channel.
   */
  public maxStageVideoChannelUsers?: number;

  /**
   * The approximate member count of the guild.
   */
  public approximateMemberCount?: number;

  /**
   * The 	approximate number of non-offline members in this guild.
   */
  public approximatePresenceCount?: number;

  /**
   * The welcome screen of the guild.
   */
  public welcomeScreen?: any; // TODO: WelcomeScreen - object

  /**
   * The NSFW level of the guild.
   */
  public nsfwLevel: number;

  /**
   * The stickers of the guild.
   */
  public stickers?: any[]; // TODO: Sticker - object

  /**
   * Whether the boost progress bar is enabled.
   */
  public premiumProgressBarEnabled: boolean;

  /**
   * The ID of the channel where admins and moderators of community guilds receive safety notices from Discord.
   */
  public safetyAlertsChannelId?: string;

  constructor(client: Client, data: APIGuild) {
    super(client, data.id);
    this.name = data.name;
    this.icon = data.icon ?? undefined;
    this.iconHash = data.icon_hash ?? undefined;
    this.splash = data.splash ?? undefined;
    this.discoverySplash = data.discovery_splash ?? undefined;
    this.owner = data.owner ?? undefined;
    this.ownerId = data.owner_id;
    this.permissions = data.permissions ?? undefined;
    this.region = data.region ?? undefined;
    this.afkChannelId = data.afk_channel_id ?? undefined;
    this.afkTimeout = data.afk_timeout;
    this.widgetEnabled = data.widget_enabled ?? undefined;
    this.widgetChannelId = data.widget_channel_id ?? undefined;
    this.verificationLevel = data.verification_level;
    this.defaultMessageNotifications = data.default_message_notifications;
    this.explicitContentFilter = data.explicit_content_filter;
    this.roles = data.roles;
    this.emojis = data.emojis;
    this.features = data.features;
    this.mfaLevel = data.mfa_level;
    this.applicationId = data.application_id ?? undefined;
    this.systemChannelId = data.system_channel_id ?? undefined;
    this.systemChannelFlags = data.system_channel_flags;
    this.rulesChannelId = data.rules_channel_id ?? undefined;
    this.maxPresences = data.max_presences ?? undefined;
    this.maxMembers = data.max_members ?? undefined;
    this.vanityUrlCode = data.vanity_url_code ?? undefined;
    this.description = data.description ?? undefined;
    this.banner = data.banner ?? undefined;
    this.premiumTier = data.premium_tier;
    this.premiumSubscriptionCount =
      data.premium_subscription_count ?? undefined;
    this.preferredLocale = data.preferred_locale;
    this.publicUpdatesChannelId = data.public_updates_channel_id ?? undefined;
    this.maxVideoChannelUsers = data.max_video_channel_users ?? undefined;
    this.maxStageVideoChannelUsers =
      data.max_stage_video_channel_users ?? undefined;
    this.approximateMemberCount = data.approximate_member_count ?? undefined;
    this.approximatePresenceCount =
      data.approximate_presence_count ?? undefined;
    this.welcomeScreen = data.welcome_screen ?? undefined;
    this.nsfwLevel = data.nsfw_level;
    this.stickers = data.stickers ?? undefined;
    this.premiumProgressBarEnabled = data.premium_progress_bar_enabled;
    this.safetyAlertsChannelId = data.safety_alerts_channel_id ?? undefined;
  }

  get shardID() {
    return Number(
      (BigInt(this.id) >> 22n) %
        BigInt(this.client.gateway?.shardCount as number)
    );
  }

  override toJSON() {
    return super.toJSON([
      'name',
      'icon',
      'icon_hash',
      'splash',
      'discovery_splash',
      'owner',
      'owner_id',
      'permissions',
      'region',
      'afk_channel_id',
      'afk_timeout',
      'widget_enabled',
      'widget_channel_id',
      'verification_level',
      'default_message_notifications',
      'explicit_content_filter',
      'roles',
      'emojis',
      'features',
      'mfa_level',
      'application_id',
      'system_channel_id',
      'system_channel_flags',
      'rules_channel_id',
      'max_presences',
      'max_members',
      'vanity_url_code',
      'description',
      'banner',
      'premium_tier',
      'premium_subscription_count',
      'preferred_locale',
      'public_updates_channel_id',
      'max_video_channel_users',
      'max_stage_video_channel_users',
      'approximate_member_count',
      'approximate_presence_count',
      'welcome_screen',
      'nsfw_level',
      'stickers',
      'premium_progress_bar_enabled',
      'safety_alerts_channel_id'
    ]);
  }
}

export { Guild };
