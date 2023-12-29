// Type imports
import { ApplicationCommandType } from "discord.js";
import { SavedApplicationCommandType } from "../../../../../declarations/types";

/**
 * Template for application command type handler
 */
export const applicationCommandType: SavedApplicationCommandType = {
    type:
        ApplicationCommandType.ChatInput ||
        ApplicationCommandType.Message ||
        ApplicationCommandType.User,

    async execute(interaction) {
        /**
         * Application command that was interacted with
         */
        const applicationCommand = applicationCommands
            .filter(
                (applicationCommand) => applicationCommand.type === this.type,
            )
            .get(interaction.commandName);

        // Try to forward application command interaction response prompt
        await applicationCommand
            .execute(interaction)
            .catch(async (error: Error) => {
                // TODO: Better notification system
                // Send notifications
                sendNotification(
                    "error",
                    error,
                    `There was an error executing the application command \`\`${interaction.commandName}\`\`!`,
                    interaction,
                    true,
                );
            });
    },
};
