// Import types
import { Events, Interaction, InteractionType } from "discord.js";
import { SavedEventType } from "../../declarations/types";

// Import configuration data
import configuration from "configuration.json";

// Define event type
const eventType: SavedEventType = {
    // Set event kind and type
    once: false,
    type: Events.InteractionCreate,

    // Handle event
    async execute(interaction: Interaction) {
        // Check if user is allowed to interact with bot
        if (
            configuration.enableBlockedUsers &&
            blockedUsers.includes(interaction.user.id) &&
            interaction.type !== InteractionType.ApplicationCommandAutocomplete
        ) {
            // Reply to interaction
            interaction.reply({
                ephemeral: true,
                content: "You are not allowed to interact with this bot!",
            });
        } else {
            // Search for interaction type
            const interactionType = interactionTypes.get(interaction.type);

            // Check if interaction type was found
            if (interactionType) {
                // Try to execute interaction type specific function
                await interactionType
                    .execute(interaction)
                    .catch((error: Error) => {
                        // Send notifications
                        sendNotification(
                            "error",
                            error,
                            `There was an error handling the interaction '${interaction.type}'!`,
                            interaction,
                        );
                    });
            } else {
                // Send notifications
                sendNotification(
                    "error",
                    `Unable to find interaction type matching ${interaction.type} in global variable`,
                );
            }
        }
    },
};

// Export event type
export default eventType;
