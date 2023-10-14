// Importing classes and methods
const { ApplicationCommandType, SlashCommandBuilder } = require("discord.js");

module.exports = {
    // Defining chat input command informationand type
    data: new SlashCommandBuilder().setDescription("").setName("").setNSFW(),
    type: ApplicationCommandType.ChatInput,

    // Handling chat input command autocomplete
    async autocomplete(interaction) {},

    // Handling chat input command reponse
    async execute(interaction) {},
};
