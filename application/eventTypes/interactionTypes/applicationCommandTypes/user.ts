// Type imports
import {
    ApplicationCommandType,
    UserContextMenuCommandInteraction,
} from "discord.js";
import {
    PredefinedInteractionErrorResponse,
    SavedApplicationCommandType,
    SavedUserCommand,
} from "../../../../declarations/types";

/**
 * User command handler
 */
export const userCommandInteraction: SavedApplicationCommandType = {
    type: ApplicationCommandType.User,

    async execute(interaction: UserContextMenuCommandInteraction) {
        /**
         * User command that was interacted with
         */
        const userCommand = applicationCommands.get(
            interaction.commandName + `(${this.type})`,
        ) as SavedUserCommand;

        // Try to forward user command interaction response prompt
        await userCommand.execute(interaction).catch(async (error) => {
            // Send notifications
            sendNotification(
                {
                    consoleOutput: `Error handling interaction with user command '${interaction.commandName}'`,
                    content: `There was an error handling the interaction with the user command \`\`${interaction.commandName}\`\`!`,
                    error,
                    interaction,
                    owner: interaction.client.application.owner,
                    type: "error",
                },
                {
                    content:
                        PredefinedInteractionErrorResponse.errorHandlingInteraction,
                    interaction,
                },
            );
        });
    },
};
