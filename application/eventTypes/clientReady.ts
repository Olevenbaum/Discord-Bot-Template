// Type imports
import { Client, Events, userMention } from "discord.js";
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
            // Send notifications
            sendNotification(
                {
                    consoleOutput: `Successfully logged in bot at Discord with username '${client.user.username}'`,
                    content: `Your bot ${userMention(
                        client.user.id,
                    )} is online now!`,
                    owner: client.application.owner,
                    type: "information",
                },
                null,
            );
        }
    },
};
