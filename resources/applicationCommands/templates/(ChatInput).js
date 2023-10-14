// Importing classes and methods
const {
    ApplicationCommandType,
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    SlashCommandBuilder,
} = require("discord.js");

module.exports = {
    // Defining chat input command information and type
    data: new SlashCommandBuilder().setDescription("").setName("").setNSFW(),
    type: ApplicationCommandType.ChatInput,

    // Handling chat input command autocomplete
    /**
     * @param {AutocompleteInteraction} interaction
     */
    async autocomplete(interaction) {},

    // Handling chat input command reponse
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {},
};
