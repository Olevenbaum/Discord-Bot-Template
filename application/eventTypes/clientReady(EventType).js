// Importing classes and methods
const { Client, Events } = require("discord.js");

module.exports = {
    // Setting event kind and type
    once: true,
    type: Events.ClientReady,

    // Handling event
    /**
     * @param {Client} client
     */
    async execute(client) {
        // Updating registered application commands
        require("../updateApplicationCommands.js")(client);

        // Printing information
        console.info(
            "[INFORMATION]:",
            `Successfully logged in at Discord with username '${client.user.username}'`
        );
    },
};
