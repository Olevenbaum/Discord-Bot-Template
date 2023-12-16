// Import types
import { Client, Events } from "discord.js";
import { SavedEventType } from "../../declarations/types";

// Define event type
const eventType: SavedEventType = {
    // Set event kind and type
    once: true,
    type: Events.ClientReady,

    // Handle event
    async execute(client: Client) {
        // Update registered application commands
        await require("../updateApplicationCommands.ts")(client);

        // Check if client is ready
        if (client.isReady()) {
            // Send notifications
            sendNotification(
                "information",
                `Successfully logged in at Discord with username '${client.user.username}'`,
                `Your bot ${client.user.username} is online now!`,
            );
        }
    },
};

// Export event type
export default eventType;
