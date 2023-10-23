// Importing types
import {
    ApplicationCommandType,
    AutocompleteInteraction,
    InteractionType,
} from "discord.js";
import { SavedChatInputCommand, SavedInteractionType } from "../../../types";

module.exports = {
    // Defining interaction type
    type: InteractionType.ApplicationCommandAutocomplete,

    // Handling interaction
    async execute(interaction: AutocompleteInteraction) {
        // TODO: Fix type
        // Searching for chat input command
        const chatInputCommand = interaction.client.applicationCommands
            .filter(
                (applicationCommand) =>
                    applicationCommand.type === ApplicationCommandType.ChatInput
            )
            .get(interaction.commandName) as SavedChatInputCommand; // TODO: Fix type

        // Checking if chat input command was found
        if (chatInputCommand) {
            // Trying to execute chat input command specific script
            await chatInputCommand
                .autocomplete(interaction)
                .catch(async (error) => {
                    // Printing error
                    console.error("[ERROR]:", error);
                });
        } else {
            // Printing error
            console.error(
                "[ERROR]:",
                `No chat input command matching '${interaction.commandName}' was found`
            );
        }
    },
} as SavedInteractionType; // TODO: Fix type
