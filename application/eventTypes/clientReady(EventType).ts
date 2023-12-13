// Import types
import { Client, Events, User } from "discord.js";
import { SavedEventType } from "../../declarations/types";

// Import configuration data
import { enableNotifications } from "../../configuration.json";

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
            // Print information
            console.info(
                "[INFORMATION]:",
                `Successfully logged in at Discord with username '${client.user.username}'`
            );

            // Check if notifications are enabled
            if (enableNotifications) {
                const owner = client.application.owner;
                // Check if application is owned by team
                if (owner instanceof User) {
                    // Send message to owner
                    await owner.send(
                        `Your bot ${client.user.username} is online now!`
                    );
                } else {
                    // Send message to team owner
                    await owner.owner.user.send(
                        `Your team's bot ${client.user.username} is online now!`
                    );
                }
            }
        }
    },
};

// Export event type
export default eventType;
