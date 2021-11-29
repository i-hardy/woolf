import { Message, MessageEmbed } from 'discord.js';
import { logger } from './logger';
import { commandList } from '../responses.json';

export async function respondToMention(message: Message): Promise<void> {
  try {
    const commandsEmbed = new MessageEmbed()
      .setTitle('Woolf Info')
      .setColor('#818d8d')
      .setThumbnail(commandList.thumbnail)
      .setDescription(commandList.intro)
      .addFields(
        { name: 'Commands', value: commandList.commands.join('\n') },
        { name: 'Where did the old commands go?', value: commandList.deprecation },
        { name: 'Useful links', value: `${commandList.invite}\n${commandList.support}` },
      );
    await message.channel.send({ embeds: [commandsEmbed] });
    logger.info(`Command list sent in ${message.guild?.name ?? 'no server'}`);
  } catch (error) {
    message.reply({ content: 'sorry, an error occurred when I tried to do that' }).catch(() => null);
    logger.exception(error, `Error responding to mention in ${message.guild?.name ?? 'no server'}`);
  }
}
