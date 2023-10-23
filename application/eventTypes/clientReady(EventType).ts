// Importing types
import { Client, Events } from "discord.js";
import { SavedEventType } from "../../types";

module.exports = {
    // Setting event kind and type
    once: true,
    type: Events.ClientReady,

    // Handling event
    async execute(client: Client) {
        // TODO: Fix type
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
} as SavedEventType; // TODO: Fix type
