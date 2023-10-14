// Importing classes and methods
const {
    ApplicationCommandType,
    ContextMenuCommandBuilder,
} = require("discord.js");

module.exports = {
    // Defining message command information and type
    data: new ContextMenuCommandBuilder()
        .setDescription("")
        .setName("")
        .setType(this.type),
    type: ApplicationCommandType.Message,

    // Handling command autocomplete
    async autocomplete(interaction) {},

    // Handling command reponse
    async execute(interaction) {},
};
