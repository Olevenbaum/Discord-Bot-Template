// Type imports
import { ComponentType } from "discord.js";
import {
    SavedMessageComponent,
    SavedMessageComponentType,
} from "../../../../../declarations/types";

/**
 * Template for message component interaction handler
 */
export const messageComponentInteraction: SavedMessageComponentType = {
    type: ComponentType.Button,

    async execute(interaction) {
        /**
         * Message component that was interacted with
         */
        const messageComponent = components
            .filter((messageComponent) => messageComponent.type === this.type)
            .get(
                interaction.customId.replace(/[0-9]/g, ""),
            ) as SavedMessageComponent;

        // Check if message component was found
        if (messageComponent) {
            // Try to forward message component interaction response prompt
            await messageComponent
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
                `The button component ${interaction.customId.replace(
                    /[0-9]/g,
                    "",
                )} could not be found!`,
            );
        }
    },
};
