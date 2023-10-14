// Importing classes and methods
const {
    ApplicationCommandType,
    ContextMenuCommandBuilder,
} = require("discord.js");

module.exports = {
    // Defining user command informationand type
    data: new ContextMenuCommandBuilder()
        .setDescription("")
        .setName("")
        .setType(this.type),
    type: ApplicationCommandType.User,

    // Handling command autocomplete
    async autocomplete(interaction) {},

    // Handling command reponse
    async execute(interaction) {},
};
