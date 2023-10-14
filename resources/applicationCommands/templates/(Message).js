// Importing classes and methods
const {
    ApplicationCommandType,
    ContextMenuCommandBuilder,
    MessageContextMenuCommandInteraction,
} = require("discord.js");

module.exports = {
    // Defining message command information and type
    data: new ContextMenuCommandBuilder()
        .setDescription("")
        .setName("")
        .setType(this.type),
    type: ApplicationCommandType.Message,

    // Handling command reponse
    /**
     * @param {MessageContextMenuCommandInteraction} interaction
     */
    async execute(interaction) {},
};
