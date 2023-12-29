// Type imports
import { ComponentType } from "discord.js";

// TODO

/**
 * Button interaction handler
 */
export const buttonInteraction = {
    // Setting message component type
    type: ComponentType.Button,

    // Handling interaction
    async execute(interaction) {
        // Searching for button component
        const buttonComponent = interaction.client.messageComponents
            .filter((messageComponent) => messageComponent.type === this.type)
            .get(interaction.customId.replace(/[0-9]/g, ""));

        // Checking if button component was found
        if (buttonComponent) {
            // Trying to execute button component specific script
            await buttonComponent.execute(interaction).catch((error) => {
                // Printing error
                console.error("[ERROR]".padEnd(consoleSpace), ":", error);

                // Checking if button component interaction was acknowledged
                if (interaction.replied || interaction.deferred) {
                    // Sending follow up message
                    interaction.followUp({
                        content:
                            "There was an error while executing this button component interaction!",
                        ephemeral: true,
                    });
                }
            });
        } else {
            // Replying to interaction
            interaction.reply(
                `The button component ${interaction.customId.replace(
                    /[0-9]/g,
                    "",
                )} could not be found!`,
            );

            // Printing error message
            console.error(
                "[ERROR]".padEnd(consoleSpace),
                ":",
                `No button component matching ${interaction.customId.replace(
                    /[0-9]/g,
                    "",
                )} was found`,
            );
        }
    },
};
