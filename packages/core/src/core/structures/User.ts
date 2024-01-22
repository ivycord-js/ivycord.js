import { APIUser } from 'discord-api-types/v10';

import { Client } from '../client/Client';
import { BaseStructure } from './BaseStructure';

class User extends BaseStructure {
  public username: string;
  public discriminator: string;
  public globalName?: string;
  public avatar: string;
  public bot?: boolean;
  public system?: boolean;
  public mfaEnabled?: boolean;
  public banner?: string;
  public accentColor?: number;
  public locale?: string;
  public verified?: boolean;
  public email?: string;
  public flags?: number;
  public premiumType?: number;
  public publicFlags?: number;
  public avatarDecoration?: string;
  constructor(client: Client, data: APIUser) {
    super(client, data.id);
    this.username = data.username;
    this.discriminator = data.discriminator;
    this.globalName = data.global_name ?? undefined;
    this.avatar = data.avatar ?? '';
    this.bot = data.bot ?? false;
    this.system = data.system ?? false;
    this.mfaEnabled = data.mfa_enabled ?? false;
    this.banner = data.banner ?? undefined;
    this.accentColor = data.accent_color ?? undefined;
    this.locale = data.locale ?? '';
    this.verified = data.verified ?? false;
    this.email = data.email ?? '';
    this.flags = data.flags ?? 0;
    this.premiumType = data.premium_type ?? 0;
    this.publicFlags = data.public_flags ?? 0;
    this.avatarDecoration = data.avatar_decoration ?? undefined;
  }
  get tag() {
    return `${this.username}#${this.discriminator}`;
  }

  get mention() {
    return `<@${this.id}>`;
  }

  public avatarURL({
    format = 'webp',
    size = 128
  }: { format?: 'webp' | 'png' | 'jpg'; size?: number } = {}) {
    return this.avatar
      ? `https://cdn.discordapp.com/avatars/${this.id}/${this.avatar}.${format}?size=${size}`
      : `https://cdn.discordapp.com/embed/avatars/${BigInt(this.id) % 6n}.png`;
  }

  public bannerURL({
    format = 'webp',
    size = 128
  }: { format?: 'webp' | 'png' | 'jpg'; size?: number } = {}) {
    return this.banner
      ? `https://cdn.discordapp.com/banners/${this.id}/${this.banner}.${format}?size=${size}`
      : null;
  }

  override toJSON() {
    return super.toJSON([
      'username',
      'discriminator',
      'globalName',
      'avatar',
      'bot',
      'system',
      'mfaEnabled',
      'banner',
      'accentColor',
      'locale',
      'verified',
      'email',
      'flags',
      'premiumType',
      'publicFlags',
      'avatarDecoration'
    ]);
  }
}

export { User };
