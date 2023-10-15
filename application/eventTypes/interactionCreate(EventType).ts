// Importing modules
import fs from "node:fs";
import path from "node:path";

// Importing types
import { Collection, Events, Interaction, InteractionType } from "discord.js";
import { SavedInteractionType } from "../../types";

// Creating interaction types collection
const interactionTypes: Collection<InteractionType, SavedInteractionType> =
    new Collection();

// Defining interaction types path
const interactionTypesPath = path.join(__dirname, "./interactionTypes");

// Reading interacion type filenames
const interactionTypeFileNames = fs
    .readdirSync(interactionTypesPath)
    .filter((interactionTypeFileName) =>
        interactionTypeFileName.endsWith(".js")
    );

// Iterating over interaction type files
interactionTypeFileNames.forEach((interactionTypeFileName) => {
    // Reading interaction type
    const interactionType: SavedInteractionType = require(path.join(
        interactionTypesPath,
        interactionTypeFileName
    ));

    // Checking required parts of interaction type
    if ("execute" in interactionType) {
        // Adding interaction type to it's collection
        interactionTypes.set(interactionType.type, interactionType);
    } else {
        // Printing warning
        console.warn(
            "[WARNING]:",
            `Missing required 'execute' property of interaction type ${interactionType.type}`
        );

        // Printing information
        console.info(
            "[INFORMATION]:",
            `The interaction file for the interaction '${interactionType.type}' is incomplete and thereby was not added`
        );
    }
});

module.exports = {
    // Setting event kind and type
    once: false,
    type: Events.InteractionCreate,

    // Handling event
    async execute(interaction: Interaction) {
        // Searching interaction type
        const interactionType = interactionTypes.get(interaction.type);

        // Checking if interaction type was found
        if (interactionType) {
            // Trying to execute interaction type specific script
            await interactionType.execute(interaction).catch((error: Error) => {
                // Replying to interaction
                interaction.reply({
                    ephemeral: true,
                    content: "There was an error handling your interaction!",
                });

                // Printing error
                console.error("[ERROR]:", error);
            });
        } else {
            // Replying to interaction
            interaction.reply({
                ephemeral: true,
                content: "Your interaction could not be resolved!",
            });

            // Printing error
            console.error("[ERROR]:", "Unknown interaction type");
        }
    },
};
