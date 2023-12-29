// Type imports
import {
    ChatInputCommandInteraction,
    InteractionType,
    MessageContextMenuCommandInteraction,
    UserContextMenuCommandInteraction,
} from "discord.js";
import { SavedInteractionType } from "../../../declarations/types";

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
                    // TODO: Better notification system
                    // Send notifications
                    sendNotification("error", error);
                });
        } else {
            // TODO: Better notification system
            // Send notifications
            sendNotification(
                "error",
                `Unable to find application command type matching '${interaction.commandType}' in global variable`,
            );
        }
    },
};
