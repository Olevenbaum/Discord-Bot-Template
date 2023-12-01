// Importe types
import { Events, Interaction, InteractionType } from "discord.js";
import { SavedEventType } from "../../declarations/types";

const eventType: SavedEventType = {
    // Set event kind and type
    once: false,
    type: Events.InteractionCreate,

    // Handle event
    async execute(interaction: Interaction) {
        // Search for interaction type
        const interactionType = global.interactionTypes.get(interaction.type);

        // Check if interaction type was found
        if (interactionType) {
            // Try to execute interaction type specific function
            await interactionType.execute(interaction).catch((error: Error) => {
                // Check if interaction type is autocomplete
                if (
                    interaction.type !==
                    InteractionType.ApplicationCommandAutocomplete
                ) {
                    // Replying to interaction
                    interaction.reply({
                        ephemeral: true,
                        content:
                            "There was an error handling your interaction!",
                    });
                }

                // Print error
                console.error("[ERROR]:", error);
            });
        } else {
            // Check if interaction type is autocomplete
            if (
                interaction.type !==
                InteractionType.ApplicationCommandAutocomplete
            ) {
                // Reply to interaction
                interaction.reply({
                    ephemeral: true,
                    content: "Your interaction could not be resolved!",
                });
            }

            // Print error
            console.error("[ERROR]:", "Unknown interaction type");
        }
    },
};

// Export event type
export default eventType;
