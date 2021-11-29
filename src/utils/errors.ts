import { CommandInteraction, ButtonInteraction } from 'discord.js';
import SprintError from '../sprints/SprintError';
import { logger } from './logger';

function getInteractionErrorResponse(error: unknown) {
  const defaultResponse = 'sorry, an error occurred when I tried to do that';
  if (error instanceof SprintError && error.userMessage) {
    return error.userMessage;
  }
  return defaultResponse;
}

export function handleInteractionError(
  error: unknown,
  interaction: CommandInteraction | ButtonInteraction,
  attempted: string,
): void {
  const interactionType = interaction instanceof CommandInteraction ? 'command' : 'button';
  const errorResponse = getInteractionErrorResponse(error);
  interaction.reply({ content: errorResponse }).catch(() => null);
  logger.exception(
    error,
    `Error executing ${attempted} ${interactionType} in ${interaction.guild?.name ?? 'no server'}`,
  );
}
