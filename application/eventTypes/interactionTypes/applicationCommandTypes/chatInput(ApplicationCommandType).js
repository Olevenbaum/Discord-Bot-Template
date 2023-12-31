// Importing classes and methods
const {
    ApplicationCommandType,
    ChatInputCommandInteraction,
} = require("discord.js");

module.exports = {
    // Defining application command type
    type: ApplicationCommandType.ChatInput,

    // Handling interaction
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        // Searching for chat input command
        const chatInputCommand = interaction.client.applicationCommands
            .filter(
                (applicationCommand) => applicationCommand.type === this.type
            )
            .get(interaction.commandName);

        // Checking if chat input command was found
        if (chatInputCommand) {
            // Trying to execute chat input command specific script
            await chatInputCommand.execute(interaction).catch(async (error) => {
                // Printing error
                console.error("[ERROR]:", error);

                // Checking if chat input command interaction was acknowledged
                if (interaction.replied || interaction.deferred) {
                    // Sending follow up message
                    interaction.followUp({
                        content: `There was an error while executing the chat input command **${interaction.commandName}**!`,
                        ephemeral: true,
                    });
                }
            });
        } else {
            // Replying to interaction
            interaction.reply({
                ephemeral: true,
                content: `The chat input command **${interaction.commandName}** could not be found!`,
            });

            // Printing error
            console.error(
                "[ERROR]:",
                `No chat input command matching '${interaction.commandName}' was found`
            );
        }
    },
};
