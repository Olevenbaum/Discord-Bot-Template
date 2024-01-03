// Module imports
import fs from "node:fs";
import path from "node:path";

// Type imports
import { Client } from "discord.js";
import {
    SavedApplicationCommand,
    SavedApplicationCommandType,
    SavedInteractionType,
    SavedMessageComponentType,
} from "../declarations/types";

// Configuration data import
import configuration from "configuration.json";

export default (client: Client) => {
    // Send notifications
    sendNotification({
        content: "Creating interaction types collection...",
        owner: client.application.owner,
        type: "information",
    });

    /**
     * Path of interaction types imported from local files
     */
    const interactionTypesPath = path.join(
        __dirname,
        "./eventTypes/interactionTypes",
    );

    /**
     * Interaction type file names of interaction types imported from local files
     */
    const interactionTypeFileNames = fs
        .readdirSync(interactionTypesPath)
        .filter(
            (interactionTypeFileName) =>
                interactionTypeFileName.endsWith(".js") ||
                interactionTypeFileName.endsWith(".ts"),
        );

    // Iterate over interaction type file names
    interactionTypeFileNames.forEach((interactionTypeFileName) => {
        /**
         * Interaction type imported from local file
         */
        const interactionType: SavedInteractionType = require(
            path.join(interactionTypesPath, interactionTypeFileName),
        );

        // Add interaction type to its collection
        interactionTypes.set(interactionType.type, interactionType);
    });

    // Send notifications
    sendNotification({
        content: "Creating application command types collection...",
        owner: client.application.owner,
        type: "information",
    });

    /**
     * Path of application command types imported from local files
     */
    const applicationCommandTypesPath = path.join(
        __dirname,
        "./eventTypes/interactionTypes/applicationCommandTypes",
    );

    /**
     * Application command type file names of application command types imported from local files
     */
    const applicationCommandTypeFileNames = fs
        .readdirSync(applicationCommandTypesPath)
        .filter(
            (applicationCommandTypeFileName) =>
                applicationCommandTypeFileName.endsWith(".js") ||
                applicationCommandTypeFileName.endsWith(".js"),
        );

    // Iterate over application command type file names
    applicationCommandTypeFileNames.forEach(
        (applicationCommandTypeFileName) => {
            /**
             * Application command type imported from local file
             */
            const applicationCommandType: SavedApplicationCommandType = require(
                path.join(
                    applicationCommandTypesPath,
                    applicationCommandTypeFileName,
                ),
            );

            // Add application command type tp its collection
            applicationCommandTypes.set(
                applicationCommandType.type,
                applicationCommandType,
            );
        },
    );

    // Send notifications
    sendNotification({
        content: "Importing message component type collection...",
        owner: client.application.owner,
        type: "information",
    });

    /**
     * Path of message component types imported from local files
     */
    const messageComponentTypesPath = path.join(
        __dirname,
        "./eventTypes/interactionTypes/messageComponentTypes",
    );

    /**
     * Message component type file names of message component types imported from local files
     */
    const messageComponentTypeFileNames = fs
        .readdirSync(messageComponentTypesPath)
        .filter(
            (messageComponentTypeFileName) =>
                messageComponentTypeFileName.endsWith(".ts") ||
                messageComponentTypeFileName.endsWith(".js"),
        );

    // Iterate over message component type file names
    messageComponentTypeFileNames.forEach((messageComponentTypeFileName) => {
        /**
         * Message component type imported from local file
         */
        const messageComponentType: SavedMessageComponentType = require(
            path.join(messageComponentTypesPath, messageComponentTypeFileName),
        );

        // Add message component type to its collection
        messageComponentTypes.set(
            messageComponentType.type,
            messageComponentType,
        );
    });

    // Send notifications
    sendNotification({
        content: "Creating application commands collection...",
        owner: client.application.owner,
        type: "information",
    });

    /**
     * Path of application commands imported from local files
     */
    const applicationCommandsPath = path.join(
        __dirname,
        "../resources/applicationCommands",
    );

    /**
     * Application command file names of application commands imported from local files
     */
    const applicationCommandFileNames = fs
        .readdirSync(applicationCommandsPath)
        .filter(
            (applicationCommandFileName) =>
                applicationCommandFileName.endsWith(".ts") ||
                applicationCommandFileName.endsWith(".js"),
        );

    // Iterate over application command file names
    applicationCommandFileNames.forEach((applicationCommandFileName) => {
        /**
         * Application command imported from local file
         */
        const applicationCommand: SavedApplicationCommand = require(
            path.join(applicationCommandsPath, applicationCommandFileName),
        );

        // Add application command to its collection
        applicationCommands.set(
            applicationCommand.data.name,
            applicationCommand,
        );
    });

    // Send notifications
    sendNotification({
        content: "Creating components collection...",
        owner: client.application.owner,
        type: "information",
    });

    /**
     * Path of components imported from local files
     */
    const componentsPath = path.join(__dirname, "../resources/components");

    /**
     * Component file names of components imported from local files
     */
    const componentFileNames = fs
        .readdirSync(componentsPath)
        .filter(
            (componentFileName) =>
                componentFileName.endsWith(".ts") ||
                componentFileName.endsWith(".js"),
        );

    // Iterate over component file names
    componentFileNames.forEach((componentFileName) => {
        /**
         * Component imported from local file
         */
        const component = require(path.join(componentsPath, componentFileName));

        // Add component to its collection
        components.set(component.name, component);
    });

    // Check if blocked users are enabled
    if (configuration.enableBlockedUsers) {
        // Send notifications
        sendNotification({
            content: "Importing blocked users...",
            owner: client.application.owner,
            type: "information",
        });

        // Add blocked user IDs imported from file
        blockedUsers.push(require("../resources/blockedUsers.json"));
    }
};
