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
        const chatInputCommand: SavedChatInputCommand | undefined =
            applicationCommands
                .filter(
                    (applicationCommand) =>
                        applicationCommand.type === this.type,
                )
                .get(interaction.commandName) as SavedChatInputCommand; // TODO: Fix type

        // Try to execute chat input command specific function
        await chatInputCommand
            .execute(interaction)
            .catch(async (error: Error) => {
                // Print error
                console.error("[ERROR]:", error);

                // Check if chat input command interaction was acknowledged
                if (interaction.replied || interaction.deferred) {
                    // Send follow-up error message
                    await interaction.followUp({
                        content: `There was an error executing the chat input command \`\`${interaction.commandName}\`\`!`,
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
