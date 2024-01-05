// Type imports
import {
    ApplicationCommandType,
    AutocompleteInteraction,
    InteractionType,
} from "discord.js";
import {
    SavedChatInputCommand,
    SavedInteractionType,
} from "../../../declarations/types";

/**
 * Chat input command autocomplete interaction handler
 */
export const chatInputCommandAutocompleteInteraction: SavedInteractionType = {
    type: InteractionType.ApplicationCommandAutocomplete,

    async execute(interaction: AutocompleteInteraction) {
        /**
         * Chat input command that the autocomplete was requested for
         */
        const chatInputCommand = applicationCommands
            .filter(
                (applicationCommand) =>
                    applicationCommand.type ===
                    ApplicationCommandType.ChatInput,
            )
            .get(interaction.commandName) as SavedChatInputCommand; // TODO: Fix type

        // Try to forward chat input command autocomplete interaction response prompt
        await chatInputCommand
            .autocomplete(interaction)
            .catch(async (error) => {
                // Send notifications
                sendNotification(
                    {
                        consoleOutput: `Error handling chat input command autocomplete of chat input command '${interaction.commandName}'`,
                        content: `There was an error handling the autocomplete interaction of the chat input command \`\`${interaction.commandName}\`\`!`,
                        error,
                        interaction,
                        owner: interaction.client.application.owner,
                        type: "error",
                    },
                    null,
                );
            });
    },
};
