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
import { applications, applicationIteration } from "../configuration.json";

// Create new client
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Print information
console.info("[INFORMATION]:", "Defining functions...");

// Execute script for defining functions
require("./defineFunctions.ts");

// Print information
console.info(
    "[INFORMATION]:",
    "Reading files and adding them to their collections..."
);

// Execute script for adding files to their collections
require("./createCollections.ts");

// Print information
console.info("[INFORMATION]:", "Creating event listeners...");

// Define event types path
const eventTypesPath = path.join(__dirname, "./eventTypes");

// Read event type filenames
const eventTypeFileNames = fs
    .readdirSync(eventTypesPath)
    .filter((eventTypeFileName) => eventTypeFileName.endsWith(".ts"));

// Iterate over event type files
eventTypeFileNames.forEach((eventTypeFileName) => {
    // Read event
    const eventType: SavedEventType = require(path.join(
        eventTypesPath,
        eventTypeFileName
    ));

    // Check whether event type is called once
    if (eventType.once) {
        // Add once eventlistener
        client.once(eventType.type, (...args) => eventType.execute(...args));
    } else {
        // Add eventlistener
        client.on(eventType.type, (...args) => eventType.execute(...args));
    }
});

// Print information
console.info("[INFORMATION]:", "Logging in bot application at Discord...");

// Search for argument of process
const argumentIndex: number | undefined = process.argv.findIndex((argument) =>
    argument.startsWith("-application")
);

// Define tokens array
const tokens = applications.map(({ token }) => token);

// Check if argument for different token was provided
if (argumentIndex && !isNaN(parseInt(process.argv[argumentIndex + 1] || "0"))) {
    // Rotate array
    tokens.rotate(parseInt(process.argv[argumentIndex + 1] || "0") ?? null);
}

// Iterate over application tokens
tokens.asynchronousFind(async (token) => {
    // Check if token could be valid
    if (token && token.length > 0) {
        // Try to login application
        return await client
            .login(token)
            .then(() => {
                // Return true
                return true;
            })
            .catch((error: DiscordAPIError) => {
                // Check if error is caused by wrong token
                if (error.code === "TokenInvalid") {
                    // Print warning
                    console.warn(
                        "[WARNING]:",
                        "Token was not accepted by Discord"
                    );
                } else {
                    // Print error
                    console.error("[ERROR]:", error);
                }

                // Return value based on application iteration
                return applicationIteration;
            });
    }
    // Print warning
    console.warn("[WARNING]:", "Token does not meet the requirements");

    // Return value based on application iteration
    return applicationIteration;
});
