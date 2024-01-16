import { Client } from '../client/Client';
import BaseStructure from './BaseStructure';

interface UserData {
  id: string;
  username: string;
  discriminator: string;
  global_name?: string;
  avatar: string;
  bot?: boolean;
  system?: boolean;
  mfa_enabled?: boolean;
  banner?: string;
  accent_color?: number;
  locale?: string;
  verified?: boolean;
  email?: string;
  flags?: number;
  premium_type?: number;
  public_flags?: number;
  avatar_decoration?: string;
}

class User extends BaseStructure {
  public username: string;
  public discriminator: string;
  public global_name?: string;
  public avatar: string;
  public bot?: boolean;
  public system?: boolean;
  public mfa_enabled?: boolean;
  public banner?: string;
  public accent_color?: number;
  public locale?: string;
  public verified?: boolean;
  public email?: string;
  public flags?: number;
  public premium_type?: number;
  public public_flags?: number;
  public avatar_decoration?: string;
  constructor(client: Client, data: UserData) {
    super(client, data.id);
    this.id = data.id;
    this.username = data.username;
    this.discriminator = data.discriminator;
    this.global_name = data.global_name;
    this.avatar = data.avatar;
    this.bot = data.bot ?? false;
    this.system = data.system ?? false;
    this.mfa_enabled = data.mfa_enabled ?? false;
    this.banner = data.banner ?? undefined;
    this.accent_color = data.accent_color ?? undefined;
    this.locale = data.locale ?? '';
    this.verified = data.verified ?? false;
    this.email = data.email ?? '';
    this.flags = data.flags ?? 0;
    this.premium_type = data.premium_type ?? 0;
    this.public_flags = data.public_flags ?? 0;
    this.avatar_decoration = data.avatar_decoration ?? undefined;
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
      : `https://cdn.discordapp.com/embed/avatars/${
          Number(this.discriminator) % 5
        }.png`;
  }

  public bannerURL({
    format = 'webp',
    size = 128
  }: { format?: 'webp' | 'png' | 'jpg'; size?: number } = {}) {
    return this.banner
      ? `https://cdn.discordapp.com/banners/${this.id}/${this.banner}.${format}?size=${size}`
      : null;
  }

  public avatarDecorationURL({ size = 128 }: { size?: number } = {}) {
    return this.accent_color
      ? `https://cdn.discordapp.com/avatar-decorations/${this.id}/${this.avatar_decoration}.png?size=${size}`
      : null;
  }
}