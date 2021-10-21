import { SlashCommandBuilder } from '@discordjs/builders';

export const commands = [
  new SlashCommandBuilder()
    .setName('sprint')
    .setDescription('Start a writing sprint')
    .addIntegerOption(
      (option) => option.setName('startin').setDescription('Time in minutes until the sprint starts').setRequired(true),
    )
    .addIntegerOption(
      (option) => option.setName('duration').setDescription('Time in minutes for the sprint to last').setRequired(true),
    ),
  new SlashCommandBuilder()
    .setName('synonym')
    .setDescription('Gets you a synonym')
    .addStringOption(
      (option) => option.setName('word').setDescription('The word to find a synonym for').setRequired(true),
    ),
  new SlashCommandBuilder()
    .setName('antonym')
    .setDescription('Gets you an antonym')
    .addStringOption(
      (option) => option.setName('word').setDescription('The word to find an antonym for').setRequired(true),
    ),
  new SlashCommandBuilder()
    .setName('rhyme')
    .setDescription('Gets you a rhyme')
    .addStringOption(
      (option) => option.setName('word').setDescription('The word to find a rhyme for').setRequired(true),
    ),
  new SlashCommandBuilder()
    .setName('related')
    .setDescription('Gets you words associated with a word')
    .addStringOption(
      (option) => option.setName('word').setDescription('The word to find associations for').setRequired(true),
    ),
  new SlashCommandBuilder()
    .setName('describe')
    .setDescription('Gets you adjectives to describe a noun')
    .addStringOption(
      (option) => option.setName('word').setDescription('The word to find descriptions for').setRequired(true),
    ),
  new SlashCommandBuilder()
    .setName('inspire')
    .setDescription('Gets you an inspiring photo'),
];
