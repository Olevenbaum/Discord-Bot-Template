// Type imports
import { ComponentType } from "discord.js";
import {
    PredefinedInteractionErrorResponse,
    SavedMessageComponent,
    SavedMessageComponentType,
} from "../../../../../declarations/types";

/**
 * Template for message component interaction handler
 */
export const messageComponentInteraction: SavedMessageComponentType = {
    type:
        ComponentType.Button ||
        ComponentType.ChannelSelect ||
        ComponentType.MentionableSelect ||
        ComponentType.RoleSelect ||
        ComponentType.StringSelect ||
        ComponentType.UserSelect,

    async execute(interaction) {
        /**
         * Message component that was interacted with
         */
        const messageComponent = components.get(
            interaction.customId.replace(/[0-9]/g, "") + `(${this.type})`,
        ) as SavedMessageComponent;

        // Try to forward message component interaction response prompt
        await messageComponent.execute(interaction).catch((error: Error) => {
            // Send notifications
            sendNotification(
                {
                    consoleOutput: `Error handling interaction with message component '${interaction.customId}'`,
                    content: `There was an error handling the interaction with the message component \`\`${interaction.customId}\`\`!`,
                    error: error,
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
