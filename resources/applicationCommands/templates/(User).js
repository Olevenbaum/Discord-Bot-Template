// Importing classes and methods
const {
    ApplicationCommandType,
    ContextMenuCommandBuilder,
    UserContextMenuCommandInteraction,
} = require("discord.js");

module.exports = {
    // Defining user command information and type
    data: new ContextMenuCommandBuilder()
        .setDescription("")
        .setName("")
        .setType(this.type),
    type: ApplicationCommandType.User,

    // Handling command reponse
    /**
     * @param {UserContextMenuCommandInteraction} interaction
     */
    async execute(interaction) {},
};
