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

// Send notifications
sendNotification({
    content: "Defining global functions...",
    owner: client.application.owner,
    type: "information",
});

// Define global functions
require("./defineFunctions.ts");

// Send notifications
sendNotification({
    content: "Reading files...",
    owner: client.application.owner,
    type: "information",
});

// Read files
require("./readFiles.ts")(client);

// Send notifications
sendNotification({
    content: "Creating event listeners...",
    owner: client.application.owner,
    type: "information",
});

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

// Send notifications
sendNotification({
    content: "Logging in bot at Discord...",
    owner: client.application.owner,
    type: "information",
});

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
                            // Send notifications
                            sendNotification({
                                content: "Token was not accepted by Discord",
                                owner: client.application.owner,
                                type: "warning",
                            });

                            // Return boolean based on configuration
                            return configuration.enableApplicationIteration;
                        } else {
                            // Send notifications
                            sendNotification({
                                content:
                                    "Something went wrong trying to log in you bot",
                                error,
                                owner: client.application.owner,
                                type: "error",
                            });

                            // Return false
                            return false;
                        }
                    });
            }

            // Send notifications
            sendNotification({
                content: "Token does not meet the requirements",
                owner: client.application.owner,
                type: "warning",
            });

            // Return boolean based on configuration
            return configuration.enableApplicationIteration;
        })
        .catch((error: Error) => {
            // Send notifications
            sendNotification({
                content: "Something went wrong trying to log in you bot",
                error,
                owner: client.application.owner,
                type: "error",
            });
        });
} else {
    // Try to log in bot at Discord
    client.login(configuration.applications.token).catch((error: Error) => {
        // Send notifications
        sendNotification({
            content: "Something went wrong trying to log in you bot",
            error,
            owner: client.application.owner,
            type: "error",
        });
    });
}
