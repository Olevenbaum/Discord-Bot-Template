// Importing modules
const fs = require("node:fs");
const path = require("node:path");

// Importing classes and methods
const { Collection, InteractionType } = require("discord.js");

// Importing configuration data
const { consoleSpace } = require("../../../configuration.json");

// Reading message component types
const messageComponentTypes = new Collection();
const messageComponentsPath = path.join(__dirname, "./messageComponents");
const messageComponentFiles = fs
    .readdirSync(messageComponentsPath)
    .filter((file) => file.endsWith(".js"));
messageComponentFiles.forEach((messageComponentFile) => {
    const messageComponentType = require(path.join(
        messageComponentsPath,
        messageComponentFile
    ));
    messageComponentTypes.set(messageComponentType.type, messageComponentType);
});

module.exports = {
    // Setting message component type
    type: InteractionType.MessageComponent,

    // Handling interaction
    async execute(interaction) {
        // Searching for application command type
        const messageComponentType = messageComponentTypes.get(
            interaction.componentType
        );

        // Checking if application command type was found
        if (messageComponentType) {
            // Trying to execute message component type specific script
            await messageComponentType.execute(interaction).catch((error) => {
                // Printing error
                console.error("[ERROR]".padEnd(consoleSpace), ":", error);
            });
        } else {
            // Printing error
            console.error(
                "[ERROR]".padEnd(consoleSpace),
                ":",
                `No message component type matching ${interaction.componentType} was found`
            );
        }
    },
};
