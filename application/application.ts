// Import modules
import fs from "node:fs";
import path from "node:path";

// Import types
import {
    Client,
    DiscordAPIError,
    GatewayIntentBits,
    OAuthErrorData,
} from "discord.js";
import { SavedEventType } from "../declarations/types";

// Import configuration data
import configuration from "configuration.json";

// Create new client
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Send notifications
sendNotification("information", "Defining functions...");

// Execute script to define global functions
require("./defineFunctions.ts");

// Send notifications
sendNotification("information", "Reading files...");

// Execute script to read files
require("./readFiles.ts");

// Send notifications
sendNotification("information", "Creating event listeners...");

// Define event types path
const eventTypesPath = path.join(__dirname, "./eventTypes");

// Read event type filenames
const eventTypeFileNames = fs
    .readdirSync(eventTypesPath)
    .filter((eventTypeFileName) => eventTypeFileName.endsWith(".ts"));

// Iterate over event type files
eventTypeFileNames.forEach((eventTypeFileName) => {
    // Read event
    const eventType: SavedEventType = require(
        path.join(eventTypesPath, eventTypeFileName),
    );

    // Check whether event type is called once
    if (eventType.once) {
        // Add once event listener
        client.once(eventType.type, (...args) => eventType.execute(...args));
    } else {
        // Add event listener
        client.on(eventType.type, (...args) => eventType.execute(...args));
    }
});

// Send notifications
sendNotification("information", "Logging in bot application at Discord...");

// Search for argument of process
const argumentIndex: number | undefined = process.argv.findIndex((argument) =>
    argument.startsWith("-application"),
);

// Define tokens array
const tokens = configuration.applications.map(({ token }) => token);

// Check if argument for different token was provided
if (argumentIndex && !isNaN(parseInt(process.argv[argumentIndex + 1] || "0"))) {
    // Rotate array
    tokens.rotate(parseInt(process.argv[argumentIndex + 1] || "0") ?? null);
}

// Iterate over application tokens
tokens.asynchronousFind(async (token) => {
    // Check if token could be valid
    if (token && token.length > 0) {
        // Try to log in application
        return await client
            .login(token)
            .then((returnedToken) => {
                // Return true
                return token === returnedToken;
            })
            .catch((error: Error) => {
                // Check if error is caused by wrong token
                if (
                    error instanceof DiscordAPIError &&
                    isFromType<OAuthErrorData>(error.rawError, [
                        "error",
                        "error_description",
                    ])
                ) {
                    // Send notifications
                    sendNotification(
                        "warning",
                        "Token was not accepted by Discord",
                    );

                    // Return value based on application iteration
                    return configuration.enableApplicationIteration;
                } else {
                    // Print error
                    console.error("[ERROR]:", error);

                    // Return false
                    return false;
                }
            });
    }
    // Send notifications
    sendNotification("warning", "Token does not meet the requirements");

    // Return value based on application iteration
    return configuration.enableApplicationIteration;
});
