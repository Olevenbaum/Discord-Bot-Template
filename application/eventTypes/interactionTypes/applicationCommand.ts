// Type imports
import {
    ChatInputCommandInteraction,
    InteractionType,
    MessageContextMenuCommandInteraction,
    UserContextMenuCommandInteraction,
} from "discord.js";
import {
    PredefinedInteractionErrorResponse,
    SavedInteractionType,
} from "../../../declarations/types";

/**
 * Application command interaction handler
 */
export const applicationCommandInteraction: SavedInteractionType = {
    type: InteractionType.ApplicationCommand,

    async execute(
        interaction:
            | ChatInputCommandInteraction
            | MessageContextMenuCommandInteraction
            | UserContextMenuCommandInteraction,
    ) {
        /**
         * Application command type of the application command that was interacted with
         */
        const applicationCommandType = applicationCommandTypes.get(
            interaction.commandType,
        );

        // Check if application command type was found
        if (applicationCommandType) {
            // Try to forward application command interaction response prompt
            await applicationCommandType
                .execute(interaction)
                .catch((error: Error) => {
                    // Send notifications
                    sendNotification(
                        {
                            consoleOutput: `Error handling interaction with application command type '${interaction.commandType}'`,
                            content: `The application command type \`\`${interaction.commandType}\`\` could not be handled!`,
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
        } else {
            // Send notifications
            sendNotification(
                {
                    consoleOutput: `No file found for application command type '${interaction.commandType}'`,
                    content: `The file handling the application command type \`\`${interaction.commandType}\`\` does not exist!`,
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
        }
    },
};
