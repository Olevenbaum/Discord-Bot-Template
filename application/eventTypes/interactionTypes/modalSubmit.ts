// Type imports
import { InteractionType, ModalSubmitInteraction } from "discord.js";
import {
    PredefinedInteractionErrorResponse,
    SavedInteractionType,
} from "../../../declarations/types";

/**
 * Modal submit interaction handler
 */
export const modalSubmitInteraction: SavedInteractionType = {
    type: InteractionType.ModalSubmit,

    async execute(interaction: ModalSubmitInteraction) {
        /**
         * Modal that was submitted
         */
        const modal = modals.get(interaction.customId);

        // Try to forward modal submit interaction response prompt
        await modal.execute(interaction).catch((error: Error) => {
            // Send notifications
            sendNotification(
                {
                    consoleOutput: `Error handling submission of modal '${interaction.customId}'`,
                    content: `The submission of the modal \`\`${interaction.customId}\`\` could not be handled!`,
                    error,
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
