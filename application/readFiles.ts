// Import modules
import fs from "node:fs";
import path from "node:path";

// Import types
import {
    SavedApplicationCommand,
    SavedApplicationCommandType,
    SavedInteractionType,
} from "../declarations/types";

// Export module
module.exports = () => {
    // Send notifications
    sendNotification("information", "Creating interaction types collection...");

    // Define interaction types path
    const interactionTypesPath = path.join(__dirname, "./interactionTypes");

    // Read interaction type filenames
    const interactionTypeFileNames = fs
        .readdirSync(interactionTypesPath)
        .filter((interactionTypeFileName) =>
            interactionTypeFileName.endsWith(".js"),
        );

    // Iterate over interaction type files
    interactionTypeFileNames.forEach((interactionTypeFileName) => {
        // Read interaction type
        const interactionType: SavedInteractionType = require(
            path.join(interactionTypesPath, interactionTypeFileName),
        );

        // Add interaction type to it's collection
        interactionTypes.set(interactionType.type, interactionType);
    });

    // Send notifications
    sendNotification(
        "information",
        "Creating application command types collection...",
    );

    // Define application command types path
    const applicationCommandTypesPath = path.join(
        __dirname,
        "./applicationCommandTypes",
    );

    // Read application command type filenames
    const applicationCommandTypeFileNames = fs
        .readdirSync(applicationCommandTypesPath)
        .filter((applicationCommandTypeFileName) =>
            applicationCommandTypeFileName.endsWith(".js"),
        );

    // Iterate over application command types
    applicationCommandTypeFileNames.forEach(
        (applicationCommandTypeFileName) => {
            // Read application command type
            const applicationCommandType: SavedApplicationCommandType = require(
                path.join(
                    applicationCommandTypesPath,
                    applicationCommandTypeFileName,
                ),
            );

            // Add application command type to it's collection
            applicationCommandTypes.set(
                applicationCommandType.type,
                applicationCommandType,
            );
        },
    );

    // Send notifications
    sendNotification(
        "information",
        "Creating application commands collection...",
    );

    // Define application commands path
    const applicationCommandsPath = path.join(
        __dirname,
        "../resources/applicationCommands",
    );

    // Read application command filenames
    const applicationCommandFileNames = fs
        .readdirSync(applicationCommandsPath)
        .filter((applicationCommandFileName) =>
            applicationCommandFileName.endsWith(".ts"),
        );

    // Iterate over all application command files
    applicationCommandFileNames.forEach((applicationCommandFileName) => {
        // Read application command
        const applicationCommand: SavedApplicationCommand = require(
            path.join(applicationCommandsPath, applicationCommandFileName),
        );

        // Add application command to it's collection
        applicationCommands.set(
            applicationCommand.data.name,
            applicationCommand,
        );
    });

    // Send notifications
    sendNotification("information", "Importing blocked users...");

    // Import blocked users
    blockedUsers.push(require("../resources/blockedUsers.json"));
};
