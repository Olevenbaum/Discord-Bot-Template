// Type imports
import { ButtonInteraction, ComponentType } from "discord.js";
import {
    PredefinedInteractionErrorResponse,
    SavedButtonComponent,
    SavedMessageComponentType,
} from "../../../../declarations/types";

/**
 * Button component interaction handler
 */
export const buttonComponentInteraction: SavedMessageComponentType = {
    type: ComponentType.Button,

    async execute(interaction: ButtonInteraction) {
        /**
         * Button component that was interacted with
         */
        const buttonComponent = components.get(
            interaction.customId.replace(/[0-9]/g, "") + `(${this.type})`,
        ) as SavedButtonComponent;

        // Try to forward button component interaction response prompt
        await buttonComponent.execute(interaction).catch((error: Error) => {
            // Send notifications
            sendNotification(
                {
                    consoleOutput: `Error handling interaction with button component '${interaction.customId}'`,
                    content: `There was an error handling the interaction with the button component \`\`${interaction.customId}\`\`!`,
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
