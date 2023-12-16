// Import types
import {
    ApplicationCommandType,
    ChatInputCommandInteraction,
} from "discord.js";
import {
    SavedApplicationCommandType,
    SavedChatInputCommand,
} from "../../../../declarations/types";

// Define application command type
const applicationCommandType: SavedApplicationCommandType = {
    // Set application command type
    type: ApplicationCommandType.ChatInput,

    // Handle chat input command interaction
    async execute(interaction: ChatInputCommandInteraction) {
        // Search for chat input command
        const chatInputCommand = applicationCommands
            .filter(
                (applicationCommand) => applicationCommand.type === this.type,
            )
            .get(interaction.commandName) as SavedChatInputCommand; // TODO: Fix type

        // Try to execute chat input command specific function
        await chatInputCommand
            .execute(interaction)
            .catch(async (error: Error) => {
                // Send notifications
                sendNotification(
                    "error",
                    error,
                    `There was an error executing the chat input command \`\`${interaction.commandName}\`\`!`,
                    interaction,
                );
            });
    },
};

// Export application command type
export default applicationCommandType;
