// Import types
import {
    ChatInputCommandInteraction,
    InteractionType,
    MessageContextMenuCommandInteraction,
    UserContextMenuCommandInteraction,
} from "discord.js";
import { SavedInteractionType } from "../../../declarations/types";

// Define interaction type
export const interactionType: SavedInteractionType = {
    // Set interaction type
    type: InteractionType.ApplicationCommand,

    // Handle application command interaction
    async execute(
        interaction:
            | ChatInputCommandInteraction
            | MessageContextMenuCommandInteraction
            | UserContextMenuCommandInteraction,
    ) {
        // Search for application command type
        const applicationCommandType = applicationCommandTypes.get(
            interaction.commandType,
        );

        // Check if application command type was found
        if (applicationCommandType) {
            // Try to execute application command type specific function
            await applicationCommandType
                .execute(interaction)
                .catch((error: Error) => {
                    // Send notifications
                    sendNotification("error", error);
                });
        } else {
            // Send notification
            sendNotification(
                "error",
                `Unable to find application command type matching '${interaction.commandType}' in global variable`,
            );
        }
    },
};
