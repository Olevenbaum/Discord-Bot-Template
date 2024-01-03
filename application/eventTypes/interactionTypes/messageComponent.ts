// Type imports
import { InteractionType, MessageComponentInteraction } from "discord.js";
import {
    PredefinedInteractionErrorResponse,
    SavedInteractionType,
} from "../../../declarations/types";

/**
 * Message component type handler
 */
export const messageComponentInteraction: SavedInteractionType = {
    type: InteractionType.MessageComponent,

    async execute(interaction: MessageComponentInteraction) {
        // Searching for message component type
        const messageComponentType = messageComponentTypes.get(
            interaction.componentType,
        );

        // Check if message component type was found
        if (messageComponentType) {
            // Try to forward message component interaction response prompt
            await messageComponentType
                .execute(interaction)
                .catch((error: Error) => {
                    // Send notifications
                    sendNotification(
                        {
                            consoleOutput: `Error handling interaction with message component type '${interaction.componentType}'`,
                            content: `The application command type \`\`${interaction.componentType}\`\` could not be handled!`,
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
                    consoleOutput: `No file found for message component type '${interaction.componentType}'`,
                    content: `The file handling the message component type \`\`${interaction.componentType}\`\` does not exist!`,
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
