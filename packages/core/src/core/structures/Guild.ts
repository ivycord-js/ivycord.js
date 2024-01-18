import { APIGuild, GuildFeature } from 'discord-api-types/v10';

import { Client } from '../client/Client';
import { BaseStructure } from './BaseStructure';

class Guild extends BaseStructure {
  public name: string;
  public icon?: string;
  public iconHash?: string;
  public splash?: string;
  public discoverySplash?: string;
  public owner?: boolean;
  public ownerId: string;
  public permissions?: string;
  public region?: string;
  public afkChannelId?: string;
  public afkTimeout: number;
  public widgetEnabled?: boolean;
  public widgetChannelId?: string;
  public verificationLevel: number;
  public defaultMessageNotifications: number;
  public explicitContentFilter: number;
  public roles: any[]; // TODO: Role - object
  public emojis: any[]; // TODO: Emoji - object
  public features: GuildFeature[];
  public mfaLevel: number;
  public applicationId?: string;
  public systemChannelId?: string;
  public systemChannelFlags: number;
  public rulesChannelId?: string;
  public maxPresences?: number;
  public maxMembers?: number;
  public vanityUrlCode?: string;
  public description?: string;
  public banner?: string;
  public premiumTier: number;
  public premiumSubscriptionCount?: number;
  public preferredLocale: string;
  public publicUpdatesChannelId?: string;
  public maxVideoChannelUsers?: number;
  public maxStageVideoChannelUsers?: number;
  public approximateMemberCount?: number;
  public approximatePresenceCount?: number;
  public welcomeScreen?: any; // TODO: WelcomeScreen - object
  public nsfwLevel: number;
  public stickers?: any[]; // TODO: Sticker - object
  public premiumProgressBarEnabled: boolean;
  public safetyAlertsChannelId?: string;
  public channels: any[]; // TODO: Channel - object
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
    // this.region = data.region ?? undefined; - deprecated
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
    this.channels = [];
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
