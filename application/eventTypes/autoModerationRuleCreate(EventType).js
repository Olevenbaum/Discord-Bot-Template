// Importing classes and methods
const { Events, Interaction } = require("discord.js");

module.exports = {
    // Defining event kind and type
    once: false,
    type: Events.AutoModerationRuleCreate,

    // Handling event
    /**
     * @param {Interaction} interaction
     */
    execute(interaction) {},
};
