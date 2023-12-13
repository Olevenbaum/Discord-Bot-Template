// Import types
import {
    ApplicationCommandType,
    AutocompleteInteraction,
    InteractionType,
} from "discord.js";
import {
    SavedChatInputCommand,
    SavedInteractionType,
} from "../../../declarations/types";

// Define interaction type
const interactionType: SavedInteractionType = {
    // Set interaction type
    type: InteractionType.ApplicationCommandAutocomplete,

    // Handle application command autocomplete interaction
    async execute(interaction: AutocompleteInteraction) {
        // Search for chat input command
        const chatInputCommand = applicationCommands
            .filter(
                (applicationCommand) =>
                    applicationCommand.type ===
                    ApplicationCommandType.ChatInput,
            )
            .get(interaction.commandName) as SavedChatInputCommand; // TODO: Fix type

        // Try to execute chat input command specific function
        await chatInputCommand
            .autocomplete(interaction)
            .catch(async (error) => {
                // Print error
                console.error("[ERROR]:", error);
            });
    },
};

// Export interaction type
export default interactionType;
