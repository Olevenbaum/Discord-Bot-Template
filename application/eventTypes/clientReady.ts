// Type imports
import { Client, Events } from "discord.js";
import { SavedEventType } from "../../declarations/types";

/**
 * Client ready event handler
 */
export const eventType: SavedEventType = {
    once: true,
    type: Events.ClientReady,

    async execute(client: Client) {
        // Update registered application commands
        await require("../updateApplicationCommands.ts")(client);

        // Check if client is ready
        if (client.isReady()) {
            // TODO: Better notification system
            // Send notifications
            sendNotification(
                "information",
                `Successfully logged in at Discord with username '${client.user.username}'`,
                `Your bot ${client.user.username} is online now!`,
            );
        }
    },
};
