// Import modules
import { readdirSync } from "node:fs";
import { join } from "node:path";

// Import types
import { DiscordAPIError, OAuthErrorData, REST, Routes } from "discord.js";
import { SavedApplicationCommand } from "../declarations/types";

// Import configuration data
import {
    applications,
    enableApplicationIteration,
} from "../configuration.json";

// Create array for application commands
const applicationCommands: SavedApplicationCommand[] = [];

// Define application commands path
const applicationCommandsPath = join(
    __dirname,
    "../resources/applicationCommands",
);

// Read application command filenames
const applicationCommandFileNames = readdirSync(applicationCommandsPath).filter(
    (applicationCommandFileName) => applicationCommandFileName.endsWith(".ts"),
);

// Iterate over application command files
applicationCommandFileNames.forEach((applicationCommandFileName) => {
    // Add application command to its collection
    applicationCommands.push(
        require(
            join(applicationCommandsPath, applicationCommandFileName),
        ).data.toJSON(),
    );
});

// Search for argument of process
const argumentIndex = process.argv.findIndex((argument) =>
    argument.startsWith("-application"),
);

// Define tokens array
const tokens = applications.map(({ token }) => token);

// Check if argument for different token was provided
if (
    argumentIndex !== -1 &&
    !isNaN(parseInt(process.argv[argumentIndex + 1] || "0"))
) {
    // Rotate array
    tokens.rotate(parseInt(process.argv[argumentIndex + 1] || "0") ?? null);
}

// Iterate over application tokens
tokens.asynchronousFind(async (token, index) => {
    // Check if token could be valid
    if (token && token.length > 0) {
        // Create rest application
        const rest = new REST().setToken(token);

        // Search for application
        const application = applications.find(
            (application) => application.token === token,
        );

        // Check if application was found
        if (application?.applicationId) {
            // Try to log in rest application
            return await rest
                .put(Routes.applicationCommands(application.applicationId), {
                    body: applicationCommands,
                })
                .then(() => {
                    // Print information
                    console.info(
                        "[INFORMATION]:",
                        `Successfully logged in at Discord as bot application at index '${
                            (index +
                                Number(
                                    argumentIndex === -1
                                        ? 0
                                        : process.argv.at(argumentIndex + 1),
                                )) %
                            tokens.length
                        }'`,
                    );

                    // Print information
                    console.info(
                        "[INFORMATION]:",
                        "Successfully reloaded all application commands.",
                    );

                    // Return true
                    return true;
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
                        // Print warning
                        console.warn(
                            "[WARNING]:",
                            `Token from bot application at index '${
                                (index +
                                    parseInt(
                                        process.argv[argumentIndex + 1] || "0",
                                    )) %
                                tokens.length
                            }' was not accepted by Discord`,
                        );

                        // Return value based on application iteration
                        return enableApplicationIteration;
                    } else {
                        // Print error
                        console.error("[ERROR]:", error);

                        // Return false
                        return false;
                    }
                });
        } else {
            // Print warning
            console.warn(
                "[INFORMATION]:",
                `Application at index '${
                    (index + parseInt(process.argv[argumentIndex + 1] || "0")) %
                    tokens.length
                }' has no application id`,
            );

            // Return value based on application iteration
            return enableApplicationIteration;
        }
    } else {
        // Print warning
        console.warn("[WARNING]:", "Token does not meet the requirements");

        // Return value based on application iteration
        return enableApplicationIteration;
    }
});
