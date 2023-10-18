// Importing classes and methods
const {
    ApplicationCommandType,
    AutocompleteInteraction,
    InteractionType,
} = require("discord.js");

module.exports = {
    // Setting interaction type
    type: InteractionType.ApplicationCommandAutocomplete,

    // Handling interaction
    /**
     * @param {AutocompleteInteraction} interaction
     */
    async execute(interaction) {
        // Searching for chat input command
        const chatInputCommand = interaction.client.applicationCommands
            .filter(
                (applicationCommand) =>
                    applicationCommand.type === ApplicationCommandType.ChatInput
            )
            .get(interaction.commandName);

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
