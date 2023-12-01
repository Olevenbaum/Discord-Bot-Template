// Import types
import { ApplicationCommandType } from "discord.js";
import { SavedApplicationCommandType } from "../../../../../declarations/types";

// Define application command type
const applicationCommandType: SavedApplicationCommandType = {
    // Define application command type
    type:
        ApplicationCommandType.ChatInput ||
        ApplicationCommandType.Message ||
        ApplicationCommandType.User,

    // Handle interaction
    async execute(interaction) {
        // Search for application command
        const applicationCommand = global.applicationCommands
            .filter(
                (applicationCommand) => applicationCommand.type === this.type
            )
            .get(interaction.commandName);

        // Check if application command was found
        if (applicationCommand) {
            // Try to execute application command specific function
            await applicationCommand
                .execute(interaction)
                .catch((error: Error) => {
                    // Printint error
                    console.error("[ERROR]:", error);

                    // Check if application command interaction was acknowledged
                    if (interaction.replied || interaction.deferred) {
                        // Send follow up message
                        interaction.followUp({
                            content: `There was an error while executing the application command \`\`${interaction.commandName}\`\`!`,
                            ephemeral: true,
                        });
                    }
                });
        } else {
            // Reply to interaction
            interaction.reply({
                content: `The application command \`\`${interaction.commandName}\`\` could not be found!`,
                ephemeral: true,
            });

            // Print error
            console.error(
                "[ERROR]:",
                `No application command matching '${interaction.commandName}' was found`
            );
        }
    },
};

// Export application command type
export default applicationCommandType;
