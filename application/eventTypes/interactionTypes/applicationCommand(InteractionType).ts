// Importing modules
import fs from "node:fs";
import path from "node:path";

// Importing types
import {
    ApplicationCommandType,
    ChatInputCommandInteraction,
    Collection,
    InteractionType,
    MessageContextMenuCommandInteraction,
    UserContextMenuCommandInteraction,
} from "discord.js";
import {
    SavedApplicationCommandType,
    SavedInteractionType,
} from "../../../types";

// Creating application commands types collection
const applicationCommandTypes: Collection<
    ApplicationCommandType,
    SavedApplicationCommandType
> = new Collection();

// Defining application command types path
const applicationCommandTypesPath = path.join(
    __dirname,
    "./applicationCommandTypes"
);

// Reading application command type filenames
const applicationCommandTypeFileNames = fs
    .readdirSync(applicationCommandTypesPath)
    .filter((applicationCommandTypeFileName) =>
        applicationCommandTypeFileName.endsWith(".js")
    );

// Iterating over application command types
applicationCommandTypeFileNames.forEach((applicationCommandTypeFileName) => {
    // Reading application command type
    const applicationCommandType: SavedApplicationCommandType = require(path.join(
        applicationCommandTypesPath,
        applicationCommandTypeFileName
    ));

    // Cecking required parts of application command type
    if ("execute" in applicationCommandType) {
        // Adding application command type to it's collection
        applicationCommandTypes.set(
            applicationCommandType.type,
            applicationCommandType
        );
    } else {
        // Printing warning
        console.warn(
            "[WARNING]:",
            `Missing required 'execute' property of application command type '${applicationCommandType.type}'`
        );

        // Printing information
        console.info(
            "[INFORMATION]:",
            `The application command type file for the application command type '${applicationCommandType.type}' is incomplete and thereby was not added`
        );
    }
});

module.exports = {
    // Setting interaction type
    type: InteractionType.ApplicationCommand,

    // Handling interaction
    async execute(
        interaction:
            | ChatInputCommandInteraction
            | MessageContextMenuCommandInteraction
            | UserContextMenuCommandInteraction
    ) {
        // Searching for application command type
        const applicationCommandType = applicationCommandTypes.get(
            interaction.commandType
        );

        // Checking if application command type was found
        if (applicationCommandType) {
            // Trying to execute application command type specific script
            await applicationCommandType
                .execute(interaction)
                .catch((error: Error) => {
                    // Printing error
                    console.error("[ERROR]:", error);
                });
        } else {
            // Printing error
            console.error(
                "[ERROR]:",
                `No application command type file for application command type '${interaction.commandType}' was found`
            );
        }
    },
} as SavedInteractionType;
