// Importing modules
const fs = require("node:fs");
const path = require("node:path");

// Importing classes and methods
const { Client, Collection, GatewayIntentBits } = require("discord.js");

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
            // Returning element
            return this.at(key);
        }
    }

    // Returning undefined
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

// Creating new client
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Printin information
console.info("[INFORMATION]:", "Creating application commands collection...");

// Creating application commands collection
client.applicationCommands = new Collection();

// Defining application commands path
const applicationCommandsPath = path.join(
    __dirname,
    "../resources/applicationCommands"
);

// Reading application command filenames
const applicationCommandFileNames = fs
    .readdirSync(applicationCommandsPath)
    .filter((applicationCommandFileName) =>
        applicationCommandFileName.endsWith(".js")
    );

// Iterate over all application command files
applicationCommandFileNames.forEach((applicationCommandFileName) => {
    // Reading application command
    const applicationCommand = require(path.join(
        applicationCommandsPath,
        applicationCommandFileName
    ));

    // Checking required parts of application command
    if (
        "data" in applicationCommand &&
        "execute" in applicationCommand &&
        "type" in applicationCommand
    ) {
        // Adding application command to it's collection
        client.applicationCommands.set(
            applicationCommand.data.name,
            applicationCommand
        );
    } else {
        // Printing warning
        console.warn(
            "[WARNING]:",
            `Missing required 'data' or 'execute' property of application command '${applicationCommand.data.name}'`
        );

        // Printing information
        console.info(
            "[INFORMATION]:",
            `The application command file for the application command '${applicationCommand.name}' is incomplete and thereby was not added`
        );
    }
});

// Printin information
console.info("[INFORMATION]:", "Creating event listeners...");

// Defining events path
const eventTypesPath = path.join(__dirname, "./eventTypes");

// Reading event filenames
const eventTypeFileNames = fs
    .readdirSync(eventTypesPath)
    .filter((eventTypeFileName) => eventTypeFileName.endsWith(".js"));

// Iterate over event files
eventTypeFileNames.forEach((eventTypeFileName) => {
    // Reading event
    const eventType = require(path.join(eventTypesPath, eventTypeFileName));

    // Checking required parts of event
    if ("execute" in eventType) {
        // Checking whether event is called once
        if (eventType.once) {
            // Adding once eventlistener
            client.once(eventType.type, (...arguments) =>
                eventType.execute(...arguments)
            );
        } else {
            // Adding eventlistener
            client.on(eventType.type, (...arguments) =>
                eventType.execute(...arguments)
            );
        }
    } else {
        // Printing warning
        console.warn(
            "[WARNING]:",
            `Missing required 'execute' property of event '${eventType.type}'`
        );

        // Printing information
        console.info(
            "[INFORMATION]:",
            `The event file for the event '${eventType.name}' is incomplete and thereby was not added`
        );
    }
});

// Printin information
console.info("[INFORMATION]:", "Logging in bot application at Discord...");

// Searching for argument of process
const tokenArgument = process.argv.findIndex((argument) =>
    argument.startsWith("-application")
);

// Defining tokens array
const tokens = applications.map((application) => application.token);

// Checking if argument for different token was provided
if (tokenArgument && !isNaN(process.argv.at(tokenArgument + 1))) {
    // Rotate array
    tokens.rotate(process.argv.at(tokenArgument + 1));
}

// Iterating over application tokens
tokens.asynchronousFind(async (token) => {
    // Checking if token could be valid
    if (token && typeof token === "string" && token.length > 0) {
        // Trying to login application
        return await client.login(token).catch((error) => {
            // Checking if error is caused by wrong token
            if (error.code === "TokenInvalid") {
                // Printing warning
                console.warn("[WARNING]:", "Token was not accepted by Discord");
            } else {
                // Printing error
                console.error("[ERROR]:", error);
            }
        });
    } else {
        // Printing warning
        console.warn("[WARNING]:", "Token does not meet the requirements");

        // Returning false
        return false;
    }
});
