// Import types
import {
    ChatInputCommandInteraction,
    InteractionType,
    MessageContextMenuCommandInteraction,
    UserContextMenuCommandInteraction,
} from "discord.js";
import { SavedInteractionType } from "../../../declarations/types";

// Define interaction type
const interactionType: SavedInteractionType = {
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
                    // Print error
                    console.error("[ERROR]:", error);
                });
        } else {
            // Print error
            console.error(
                "[ERROR]:",
                `Unable to find application command type matching '${interaction.commandType}' in global variable`,
            );

            // Send error message
            await interaction.reply({
                content: `There was an error handling the interaction \`\`${interaction.commandType}\`\`!`,
                ephemeral: true,
            });
        }
    },
};

// Export interaction type
export default interactionType;
