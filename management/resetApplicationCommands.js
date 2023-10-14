// Importing modules
const fs = require("node:fs");
const path = require("node:path");

// Importing classes and methods
const { DiscordAPIError, REST, Routes } = require("discord.js");

// Importing configuration data
const { applications } = require("../configuration.json");

// Defining prototype function for asynchronous find for array
/**
 * @param {Function} predicate
 * @param {Array} array
 * @returns {Boolean | undefined}
 */
Array.prototype.asynchronousFind = async function (predicate, array = null) {
    // Binding second argument to callback function
    const boundPredicate = predicate.bind(array);

    // Iterating over keys of array
    for (const key of this.keys()) {
        // Checking if callback function returns true for element
        if (await boundPredicate(this.at(key), key, this)) {
            // Return element
            return this.at(key);
        }
    }

    // Return undefined
    return undefined;
};

// Defining prototype function for rotating arrays
/**
 * @param {Number} counter
 * @param {Boolean} reverse
 * @returns {Array}
 */
Array.prototype.rotate = function (counter = 1, reverse = false) {
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
const applicationCommands = [];

// Defining application commands path
const applicationCommandsPath = path.join(
    __dirname,
    "../resources/applicationCommands"
);

// Reading application command filenames
const applicationCommandFiles = fs
    .readdirSync(applicationCommandsPath)
    .filter((applicationCommandFile) => applicationCommandFile.endsWith(".js"));

// Iteracting over application command files
applicationCommandFiles.forEach((applicationCommandFile) => {
    // Adding application command to its collection
    applicationCommands.push(
        require(path.join(
            applicationCommandsPath,
            applicationCommandFile
        )).data.toJSON()
    );
});

// Searching for argument of process
const argumentIndex = process.argv.findIndex((argument) =>
    argument.startsWith("-application")
);

// Defining tokens array
const tokens = applications.map((application) => application.token);

// Checking if argument for different token was provided
if (argumentIndex !== -1 && !isNaN(process.argv.at(argumentIndex + 1))) {
    // Rotating array
    tokens.rotate(process.argv.at(argumentIndex + 1));
}

// Iterating over application tokens
tokens.asynchronousFind(async (token, index) => {
    // Checking if token could be valid
    if (token && typeof token === "string" && token.length > 0) {
        // Trying to login rest application
        const rest = new REST().setToken(token);
        await rest
            .put(
                Routes.applicationCommands(
                    applications.find(
                        (application) => application.token === token
                    ).applicationId
                ),
                {
                    body: applicationCommands,
                }
            )
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
            .catch((error) => {
                // Checking if error is caused by wrong token
                if (
                    error instanceof DiscordAPIError &&
                    error.rawError.message === "401: Unauthorized"
                ) {
                    // Printing warning
                    console.warn(
                        "[WARNING]:",
                        `Token from bot application at index '${
                            (index + process.argv.at(argumentIndex + 1)) %
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
        console.warn("[WARNING]:", "Token does not meet the requirements");

        // Returning false
        return false;
    }
});
