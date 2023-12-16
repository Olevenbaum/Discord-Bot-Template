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
                // Send notifications
                sendNotification(
                    "error",
                    error,
                    `There was an error executing the application command \`\`${interaction.commandName}\`\`!`,
                    interaction,
                );
            });
    },
};

// Export application command type
export default applicationCommandType;
