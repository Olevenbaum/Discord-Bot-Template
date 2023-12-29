// Module imports
import fs from "node:fs";
import path from "node:path";

// Type imports
import {
    Client,
    DiscordAPIError,
    GatewayIntentBits,
    OAuthErrorData,
} from "discord.js";
import { SavedEventType } from "../declarations/types";

// Configuration data import
import configuration from "configuration.json";

/**
 * Client hosting the bot
 */
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// TODO: Better notification system
// Send notifications
sendNotification("information", "Defining global functions...");

// Define global functions
require("./defineFunctions.ts");

// TODO: Better notification system
// Send notifications
sendNotification("information", "Reading files...");

// Read files
require("./readFiles.ts");

// TODO: Better notification system
// Send notifications
sendNotification("information", "Creating event listeners...");

/**
 * Path of locally saved event type files
 */
const eventTypesPath = path.join(__dirname, "./eventTypes");

/**
 * Event type file names of locally saved event types
 */
const eventTypeFileNames = fs
    .readdirSync(eventTypesPath)
    .filter((eventTypeFileName) => eventTypeFileName.endsWith(".ts"));

// Iterate over event type file names
eventTypeFileNames.forEach((eventTypeFileName) => {
    /**
     * Event type file
     */
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

// TODO: Better notification system
// Send notifications
sendNotification("information", "Logging in bot at Discord...");

// Check if multiple bots are provided
if (Array.isArray(configuration.applications)) {
    /**
     * Index of provided bot index argument
     */
    const argumentIndex = process.argv.findIndex((argument) =>
        argument.startsWith("-bot-index"),
    );

    /**
     * Provided index of bot to be started
     */
    const index = parseInt(process.argv[argumentIndex + 1] || "0");

    /**
     * Tokens of provided bots
     */
    const tokens = configuration.applications.map(({ token }) => token);

    // Check if argument for different token was provided
    if (argumentIndex !== -1) {
        tokens.rotate(index);
    }

    // Try to log in bot at Discord
    tokens
        .asynchronousFind(async (token) => {
            // Check if token could be valid
            if (token && token.length > 0) {
                // TODO: Check token length and format
                // Return whether token was accepted by Discord
                return await client
                    .login(token)
                    .then((returnedToken) => {
                        // Return whether token was right
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
                            // TODO: Better notification system
                            // Send notifications
                            sendNotification(
                                "warning",
                                "Token was not accepted by Discord",
                            );

                            // Return boolean based on configuration
                            return configuration.enableApplicationIteration;
                        } else {
                            // TODO: Better notification system
                            // Send notifications
                            sendNotification("error", error);

                            // Return false
                            return false;
                        }
                    });
            }

            // TODO: Better notification system
            // Send notifications
            sendNotification("warning", "Token does not meet the requirements");

            // Return boolean based on configuration
            return configuration.enableApplicationIteration;
        })
        .catch((error: Error) => {
            // TODO: Better notification system
            // Send notifications
            sendNotification("error", error);
        });
} else {
    // Try to log in bot at Discord
    client.login(configuration.applications.token).catch((error: Error) => {
        // TODO: Better notification system
        // Send notifications
        sendNotification("error", error);
    });
}
