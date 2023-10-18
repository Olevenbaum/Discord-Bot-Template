// Importing types
import {
    ApplicationCommandType,
    AutocompleteInteraction,
    InteractionType,
} from "discord.js";
import { SavedChatInputCommand } from "../../../types";

module.exports = {
    // Defining interaction type
    type: InteractionType.ApplicationCommandAutocomplete,

    // Handling interaction
    async execute(interaction: AutocompleteInteraction) {
        // Searching for chat input command
        const chatInputCommand = interaction.client.applicationCommands
            .filter(
                (applicationCommand) =>
                    applicationCommand.type === ApplicationCommandType.ChatInput
            )
            .get(interaction.commandName) as SavedChatInputCommand;

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
};
