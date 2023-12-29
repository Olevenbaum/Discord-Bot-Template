// Type imports
import { InteractionType, MessageComponentInteraction } from "discord.js";
import { SavedInteractionType } from "../../../declarations/types";

/**
 * Message component type handler
 */
export const messageComponentInteraction: SavedInteractionType = {
    type: InteractionType.MessageComponent,

    async execute(interaction: MessageComponentInteraction) {
        // Searching for application command type
        const messageComponentType = messageComponentTypes.get(
            interaction.componentType,
        );

        // Check if message component type was found
        if (messageComponentType) {
            // Try to forward message component interaction response prompt
            await messageComponentType
                .execute(interaction)
                .catch((error: Error) => {
                    // TODO: Better notification system
                    // Send notifications
                    sendNotification("error", error);
                });
        } else {
            // TODO: Better notification system
            // Send notifications
            sendNotification(
                "error",
                `Unable to find message component type matching ${interaction.componentType} in global variable`,
            );
        }
    },
};
