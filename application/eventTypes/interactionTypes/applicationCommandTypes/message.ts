// Type imports
import {
    ApplicationCommandType,
    MessageContextMenuCommandInteraction,
} from "discord.js";
import {
    SavedApplicationCommandType,
    SavedMessageCommand,
} from "../../../../declarations/types";

/**
 * Message command handler
 */
export const applicationCommandType: SavedApplicationCommandType = {
    type: ApplicationCommandType.Message,

    async execute(interaction: MessageContextMenuCommandInteraction) {
        /**
         * Message command that was interacted with
         */
        const messageCommand = applicationCommands
            .filter(
                (applicationCommand) => applicationCommand.type === this.type,
            )
            .get(interaction.commandName) as SavedMessageCommand; // TODO: Fix type

        // Try to forward message command interaction response prompt
        await messageCommand.execute(interaction).catch(async (error) => {
            // TODO: Better notification system
            // Send notifications
            sendNotification(
                "error",
                error,
                `There was an error executing the message command \`\`${interaction.commandName}\`\`!`,
                interaction,
                true,
            );
        });
    },
};
