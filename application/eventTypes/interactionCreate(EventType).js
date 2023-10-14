// Importing modules
const fs = require("node:fs");
const path = require("node:path");

// Importing classes and methods
const { Collection, Events, Interaction } = require("discord.js");

// Creating interaction types collection
const interactionTypes = new Collection();

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
    const interactionType = require(path.join(
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
            `The interaction file for the interaction '${interactionType.name}' is incomplete and thereby was not added`
        );
    }
});

module.exports = {
    // Setting event kind and type
    once: false,
    type: Events.InteractionCreate,

    // Handling event
    /**
     * @param {Interaction} interaction
     */
    async execute(interaction) {
        // Searching interaction type
        const interactionType = interactionTypes.get(interaction.type);

        // Checking if interaction type was found
        if (interactionType) {
            // Trying to execute interaction type specific script
            await interactionType.execute(interaction).catch((error) => {
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
