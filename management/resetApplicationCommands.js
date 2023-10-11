// Importing modules
const fs = require("node:fs");
const path = require("node:path");

// Importing classes and methods
const { REST, Routes } = require("discord.js");

// Importing configuration data
const { application } = require("../configuration.json");

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

// Logging in bot application at Discord
const rest = new REST().setToken(application.token);

(async () => {
    try {
        // Printing information
        console.info(
            "[INFORMATION]:",
            `Started refreshing ${applicationCommands.length} application commands.`
        );

        // Updating registered application commands at Discord
        const data = await rest.put(
            Routes.applicationCommands(application.applicationId),
            {
                body: applicationCommands,
            }
        );

        // Printing information
        console.info(
            "[INFORMATION]:",
            `Successfully reloaded ${data.length} application commands.`
        );
    } catch (error) {
        // Printing error
        console.error("[ERROR]:", error);
    }
})();
