// Importing modules
import { readdirSync } from "node:fs";
import { join } from "node:path";

// Importing types
import { DiscordAPIError, REST, Routes } from "discord.js";
import { SavedApplicationCommand } from "../types";

// Importing configuration data
import { applications } from "../configuration.json";

// Defining prototype function for asynchronous find for array
Array.prototype.asynchronousFind = async function <Element>(
    predicate: (
        element: Element,
        key: number,
        array: Element[]
    ) => Promise<boolean>,
    thisArg: any = null
): Promise<Element | undefined> {
    // Binding second argument to callback function
    const boundPredicate: (
        element: Element,
        key: number,
        thisArg: any
    ) => Promise<boolean> = predicate.bind(thisArg);

    // Iterating over keys of array
    for (const key of this.keys()) {
        // Checking if callback function returns true for element
        if (await boundPredicate(this.at(key), key, this)) {
            // Returning element
            return this.at(key);
        }
    }

    // Returning undefined
    return undefined;
};

// Defining prototype function for rotating arrays
Array.prototype.rotate = function <Element>(
    counter: number = 1,
    reverse: boolean = false
): Element[] {
    // Reducing counter
    counter %= this.length;

    // Checking if direction is reversed
    if (reverse) {
        // Rotating array clockwise
        this.push(...this.splice(0, this.length - counter));
    } else {
        // Rotating array counterclockwise
        this.unshift(...this.splice(counter, this.length));
    }

    // Returning array
    return this;
};

// Creating array for application commands
const applicationCommands: SavedApplicationCommand[] = [];

// Defining application commands path
const applicationCommandsPath = join(
    __dirname,
    "../resources/applicationCommands"
);

// Reading application command filenames
const applicationCommandFileNames = readdirSync(applicationCommandsPath).filter(
    (applicationCommandFileName) => applicationCommandFileName.endsWith(".ts")
);

// Iteracting over application command files
applicationCommandFileNames.forEach((applicationCommandFileName) => {
    // Adding application command to its collection
    applicationCommands.push(
        require(join(
            applicationCommandsPath,
            applicationCommandFileName
        )).data.toJSON()
    );
});

// Searching for argument of process
const argumentIndex = process.argv.findIndex((argument) =>
    argument.startsWith("-application")
);

// Defining tokens array
const tokens = applications.map(({ token }) => token);

// Checking if argument for different token was provided
if (argumentIndex !== -1 && !isNaN(parseInt(process.argv[argumentIndex + 1]))) {
    // Rotating array
    tokens.rotate(parseInt(process.argv[argumentIndex + 1]));
}

// Iterating over application tokens
tokens.asynchronousFind(async (token, index) => {
    // Checking if token could be valid
    if (token && token.length > 0) {
        // Creating rest application
        const rest = new REST().setToken(token);

        // Searching for application
        const application = applications.find(
            (application) => application.token === token
        );

        // Checking if application was found
        if (application?.applicationId) {
            // Trying to login rest application
            return await rest
                .put(Routes.applicationCommands(application.applicationId), {
                    body: applicationCommands,
                })
                .then(() => {
                    // Printing information
                    console.info(
                        "[INFORMATION]:",
                        `Successfully logged in at Discord as bot application at index '${
                            (index +
                                Number(
                                    argumentIndex === -1
                                        ? 0
                                        : process.argv.at(argumentIndex + 1)
                                )) %
                            tokens.length
                        }'`
                    );

                    // Printing information
                    console.info(
                        "[INFORMATION]:",
                        "Successfully reloaded all application commands."
                    );

                    // Returning true
                    return true;
                })
                .catch((error: Error) => {
                    // Checking if error is caused by wrong token
                    if (
                        error instanceof DiscordAPIError &&
                        error.rawError.message === "401: Unauthorized"
                    ) {
                        // Printing warning
                        console.warn(
                            "[WARNING]:",
                            `Token from bot application at index '${
                                (index +
                                    parseInt(process.argv[argumentIndex + 1])) %
                                tokens.length
                            }' was not accepted by Discord`
                        );
                    } else {
                        // Printing error
                        console.error("[ERROR]:", error);
                    }

                    // Returning false
                    return false;
                });
        } else {
            // Printing warning
            console.warn(
                "[INFORMATION]:",
                `Application at index '${
                    (index + parseInt(process.argv[argumentIndex + 1])) %
                    tokens.length
                }' has no application id`
            );

            // Returning false
            return false;
        }
    } else {
        // Printing warning
        console.warn("[WARNING]:", "Token does not meet the requirements");

        // Returning false
        return false;
    }
});
