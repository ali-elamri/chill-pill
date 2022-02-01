import { Guild, GuildMember } from 'discord.js';
import Client from '../../entities/client';

const autoJoin = async (client: Client, guild: Guild, member: GuildMember) => {
  if (member.voice.channel && !guild.me?.voice.channel) {
    await client.distube.voices.join(member.voice.channel);
  }
};

export default autoJoin;
