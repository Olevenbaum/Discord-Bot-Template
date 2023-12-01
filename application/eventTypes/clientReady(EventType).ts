// Import types
import { Client, Events } from "discord.js";
import { SavedEventType } from "../../declarations/types";

const eventType: SavedEventType = {
    // Set event kind and type
    once: true,
    type: Events.ClientReady,

    // Handle event
    async execute(client: Client) {
        // Update registered application commands
        require("../updateApplicationCommands.ts")(client);

        // Print information
        console.info(
            "[INFORMATION]:",
            `Successfully logged in at Discord with username '${
                client.user?.username ?? "unknown"
            }'`
        );
    },
};

// Export event type
export default eventType;
