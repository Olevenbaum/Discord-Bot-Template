// Importing types
import { ApplicationCommandType } from "discord.js";
import { SavedApplicationCommandType } from "../../../../../types";

module.exports = {
    // Defining application command type
    type:
        ApplicationCommandType.ChatInput |
        ApplicationCommandType.Message |
        ApplicationCommandType.User,

    // Handling interaction
    async execute(interaction) {
        // Searching for application command
        const applicationCommand = interaction.client.applicationCommands
            .filter(
                (applicationCommand) => applicationCommand.type === this.type
            )
            .get(interaction.commandName);

        // Checking if application command was found
        if (applicationCommand) {
            // Trying to execute application command specific script
            await applicationCommand
                .execute(interaction)
                .catch((error: Error) => {
                    // Printint error
                    console.error("[ERROR]:", error);

                    // Checking if application command interaction was acknowledged
                    if (interaction.replied || interaction.deferred) {
                        // Sending follow up message
                        interaction.followUp({
                            content: `There was an error while executing the application command \`\`${interaction.commandName}\`\`!`,
                            ephemeral: true,
                        });
                    }
                });
        } else {
            // Replying to interaction
            interaction.reply({
                content: `The application command \`\`${interaction.commandName}\`\` could not be found!`,
                ephemeral: true,
            });

            // Printing error
            console.error(
                "[ERROR]:",
                `No application command matching '${interaction.commandName}' was found`
            );
        }
    },
} as SavedApplicationCommandType; // TODO: Fix type
