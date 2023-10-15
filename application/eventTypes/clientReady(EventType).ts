// Importing types
import { Client, Events } from "discord.js";

module.exports = {
    // Setting event kind and type
    once: true,
    type: Events.ClientReady,

    // Handling event
    async execute(client: Client) {
        // Updating registered application commands
        require("../updateApplicationCommands.js")(client);

        // Printing information
        console.info(
            "[INFORMATION]:",
            `Successfully logged in at Discord with username '${
                client.user?.username ?? "unknown"
            }'`
        );
    },
};
