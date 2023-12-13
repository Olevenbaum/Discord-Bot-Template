// Import types
import { ApplicationCommandType } from "discord.js";
import { SavedApplicationCommandType } from "../../../../../declarations/types";

// Define application command type
const applicationCommandType: SavedApplicationCommandType = {
    // Set application command type
    type:
        ApplicationCommandType.ChatInput ||
        ApplicationCommandType.Message ||
        ApplicationCommandType.User,

    // Handle application command interaction
    async execute(interaction) {
        // Search for application command
        const applicationCommand = applicationCommands
            .filter(
                (applicationCommand) => applicationCommand.type === this.type,
            )
            .get(interaction.commandName);

        // Try to execute application command specific function
        await applicationCommand
            .execute(interaction)
            .catch(async (error: Error) => {
                // Print error
                console.error("[ERROR]:", error);

                // Check if application command interaction was acknowledged
                if (interaction.replied || interaction.deferred) {
                    // Send follow-up message
                    await interaction.followUp({
                        content: `There was an error executing the application command \`\`${interaction.commandName}\`\`!`,
                        ephemeral: true,
                    });
                } else {
                    // Send error message
                    await interaction.reply({
                        content: `There was an error executing the chat input command \`\`${interaction.commandName}\`\`!`,
                        ephemeral: true,
                    });
                }
            });
    },
};

// Export application command type
export default applicationCommandType;
