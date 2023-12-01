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

    // Handle interaction
    async execute(interaction: AutocompleteInteraction) {
        // Search for chat input command
        const chatInputCommand = global.applicationCommands
            .filter(
                (applicationCommand) =>
                    applicationCommand.type === ApplicationCommandType.ChatInput
            )
            .get(interaction.commandName) as SavedChatInputCommand; // TODO: Fix type

        // Check if chat input command was found
        if (chatInputCommand) {
            // Try to execute chat input command specific function
            await chatInputCommand
                .autocomplete(interaction)
                .catch(async (error) => {
                    // Print error
                    console.error("[ERROR]:", error);
                });
        } else {
            // Print error
            console.error(
                "[ERROR]:",
                `No chat input command matching '${interaction.commandName}' was found`
            );
        }
    },
};

// Export interaction type
export default interactionType;
