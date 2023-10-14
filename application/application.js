// Importing modules
const fs = require("node:fs");
const path = require("node:path");

// Importing classes and methods
const { Client, Collection, GatewayIntentBits } = require("discord.js");

// Importing configuration data
const { application } = require("../configuration.json");

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
            `The applicaion command file for the application command '${applicationCommand.name}' is incomplete and thereby was not added`
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

// Logging in bot application at Discord
client.login(application.token);
