// Module imports
import { readdirSync } from "node:fs";
import { join } from "node:path";

// Type imports
import {
    Application,
    DiscordAPIError,
    OAuthErrorData,
    REST,
    RESTPostAPIChatInputApplicationCommandsJSONBody,
    RESTPostAPIContextMenuApplicationCommandsJSONBody,
    Routes,
    Snowflake,
} from "discord.js";
import { SavedApplicationCommand } from "../declarations/types";

// Configuration data imports
import configuration from "configuration.json";

/**
 * Array for application commands imported from local files
 */
const applicationCommands: (
    | RESTPostAPIChatInputApplicationCommandsJSONBody
    | RESTPostAPIContextMenuApplicationCommandsJSONBody
)[] = [];

/**
 * Path of application commands imported from local files
 */
const applicationCommandsPath = join(
    __dirname,
    "../resources/applicationCommands",
);

/**
 * Application command file names of application commands imported from local files
 */
const applicationCommandFileNames = readdirSync(applicationCommandsPath).filter(
    (applicationCommandFileName) => applicationCommandFileName.endsWith(".ts"),
);

// Iterate over application command files
applicationCommandFileNames.forEach((applicationCommandFileName) => {
    // Add application command to its collection
    applicationCommands.push(
        (
            require(
                join(applicationCommandsPath, applicationCommandFileName),
            ) as SavedApplicationCommand
        ).data.toJSON(),
    );
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
     * Provided bots
     */
    const applications = configuration.applications.map((application) => {
        return {
            applicationId: application.applicationId,
            token: application.token,
        };
    });

    // Check if argument for different bot was provided
    if (argumentIndex !== -1) {
        applications.rotate(index);
    }

    // Try to log in bot at Discord
    applications
        .asynchronousFind(async (application) => {
            /**
             * Access point to Discord
             */
            const rest = new REST().setToken(application.token);

            // Return whether re-registering application commands was successfully
            return await rest
                .put(Routes.applicationCommands(application.applicationId), {
                    body: applicationCommands,
                })
                .then(() => {
                    // Return true
                    return true;
                })
                .catch((error: Error) => {
                    // Send notifications
                    sendNotification({
                        content:
                            "Something went wrong trying to log in your bot",
                        error,
                        type: "error",
                    });

                    // Return boolean based on configuration
                    return configuration.enableApplicationIteration;
                });
        })
        .catch((error: Error) => {
            // Send notifications
            sendNotification({
                content: "Something went wrong trying to log in your bot",
                error,
                type: "error",
            });

            // Return boolean based on configuration
            return configuration.enableApplicationIteration;
        });
} else {
    /**
     * Access point to Discord
     */
    const rest = new REST().setToken(configuration.applications.token);

    // Return whether re-registering application commands was successfully
    rest.put(
        Routes.applicationCommands(configuration.applications.applicationId),
        {
            body: applicationCommands,
        },
    )
        .then(() => {
            // Return true
            return true;
        })
        .catch((error: Error) => {
            // Send notifications
            sendNotification({
                content: "Something went wrong trying to log in your bot",
                error,
                type: "error",
            });

            // Return boolean based on configuration
            return configuration.enableApplicationIteration;
        });
}
