// Importing modules
import fs from "node:fs";
import path from "node:path";

// Importing types
import { Client, Collection, GatewayIntentBits } from "discord.js";
import { SavedApplicationCommand, SavedEventType } from "../types";

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
        applicationCommandFileName.endsWith(".ts")
    );

// Iterate over all application command files
applicationCommandFileNames.forEach((applicationCommandFileName) => {
    // Reading application command
    const applicationCommand: SavedApplicationCommand = require(path.join(
        applicationCommandsPath,
        applicationCommandFileName
    ));

    // Adding application command to it's collection
    client.applicationCommands.set(
        applicationCommand.data.name,
        applicationCommand
    );
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
    const eventType: SavedEventType = require(path.join(
        eventTypesPath,
        eventTypeFileName
    ));

    // Checking whether event is called once
    if (eventType.once) {
        // Adding once eventlistener
        client.once(eventType.type, (...args) => eventType.execute(...args));
    } else {
        // Adding eventlistener
        client.on(eventType.type, (...args) => eventType.execute(...args));
    }
});

// Printin information
console.info("[INFORMATION]:", "Logging in bot application at Discord...");

// Searching for argument of process
const tokenArgument = process.argv.findIndex((argument) =>
    argument.startsWith("-application")
);

// Defining tokens array
const tokens = applications.map(({ token }) => token);

// Checking if argument for different token was provided
if (tokenArgument && !isNaN(parseInt(process.argv[tokenArgument + 1]))) {
    // Rotate array
    tokens.rotate(parseInt(process.argv[tokenArgument + 1]));
}

// Iterating over application tokens
tokens.asynchronousFind(async (token) => {
    // Checking if token could be valid
    if (token && token.length > 0) {
        // Trying to login application
        return await client
            .login(token)
            .then(() => {
                // Returning true
                return true;
            })
            .catch((error) => {
                // Checking if error is caused by wrong token
                if (error.code === "TokenInvalid") {
                    // Printing warning
                    console.warn(
                        "[WARNING]:",
                        "Token was not accepted by Discord"
                    );
                } else {
                    // Printing error
                    console.error("[ERROR]:", error);
                }

                // Returning false
                return false;
            });
    }
    // Printing warning
    console.warn("[WARNING]:", "Token does not meet the requirements");

    // Returning false
    return false;
});
