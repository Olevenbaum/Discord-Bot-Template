// Type imports
import { Events, Interaction, InteractionType } from "discord.js";
import { SavedEventType } from "../../declarations/types";

// Configuration data import
import configuration from "configuration.json";

/**
 * Interaction event handler
 */
export const eventType: SavedEventType = {
    once: false,
    type: Events.InteractionCreate,

    async execute(interaction: Interaction) {
        // Check if user is allowed to interact with bot
        if (
            interaction.type !==
                InteractionType.ApplicationCommandAutocomplete &&
            ((configuration.enableBlockedUsers &&
                blockedUsers.includes(interaction.user.id)) ||
                (!configuration.enableBotInteraction && interaction.user.bot))
        ) {
            // TODO: Better notification system
            // Send notifications
            sendNotification(
                "warning",
                `The ${
                    (interaction.user.bot
                        ? "bot"
                        : "user, who is currently blocked from using your bot,") +
                    interaction.user.username
                } tried to interact with your bot`,
            );
        } else {
            /**
             * Interaction type handler matching the interaction type
             */
            const interactionType = interactionTypes.get(interaction.type);

            // Check if interaction type was found
            if (interactionType) {
                // Try to forward interaction response prompt
                await interactionType
                    .execute(interaction)
                    .catch((error: Error) => {
                        // TODO: Better notification system
                        // Send notification
                        sendNotification(
                            "error",
                            error,
                            `There was an error handling the interaction '${interaction.type}'!`,
                            interaction,
                            true,
                        );
                    });
            } else {
                // TODO: Better notification system
                // Send notification
                sendNotification(
                    "error",
                    `Unable to find interaction type matching ${interaction.type} in global variable`,
                );
            }
        }
    },
};
