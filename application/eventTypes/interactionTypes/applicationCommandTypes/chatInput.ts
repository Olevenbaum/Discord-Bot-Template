// Type imports
import {
    ApplicationCommandType,
    ChatInputCommandInteraction,
} from "discord.js";
import {
    SavedApplicationCommandType,
    SavedChatInputCommand,
} from "../../../../declarations/types";

/**
 * Chat input command handler
 */
export const applicationCommandType: SavedApplicationCommandType = {
    type: ApplicationCommandType.ChatInput,

    async execute(interaction: ChatInputCommandInteraction) {
        /**
         * Chat input command that was interacted with
         */
        const chatInputCommand = applicationCommands
            .filter(
                (applicationCommand) => applicationCommand.type === this.type,
            )
            .get(interaction.commandName) as SavedChatInputCommand; // TODO: Fix type

        // Try to forward chat input command interaction response prompt
        await chatInputCommand
            .execute(interaction)
            .catch(async (error: Error) => {
                // TODO: Better notification system
                // Send notifications
                sendNotification(
                    "error",
                    error,
                    `There was an error executing the chat input command \`\`${interaction.commandName}\`\`!`,
                    interaction,
                    true,
                );
            });
    },
};
