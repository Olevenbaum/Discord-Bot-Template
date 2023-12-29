// Type imports
import {
    ApplicationCommandType,
    UserContextMenuCommandInteraction,
} from "discord.js";
import {
    SavedApplicationCommandType,
    SavedUserCommand,
} from "../../../../declarations/types";

/**
 * User command handler
 */
export const applicationCommandType: SavedApplicationCommandType = {
    type: ApplicationCommandType.User,

    async execute(interaction: UserContextMenuCommandInteraction) {
        /**
         * User command that was interacted with
         */
        const userCommand = applicationCommands
            .filter(
                (applicationCommand) => applicationCommand.type === this.type,
            )
            .get(interaction.commandName) as SavedUserCommand; // TODO: Fix type

        // Try to forward user command interaction response prompt
        await userCommand.execute(interaction).catch(async (error) => {
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
