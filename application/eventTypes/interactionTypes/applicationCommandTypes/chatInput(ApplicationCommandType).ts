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

    // Handle interaction
    async execute(interaction: ChatInputCommandInteraction) {
        // Search for chat input command
        const chatInputCommand: SavedChatInputCommand | undefined =
            global.applicationCommands
                .filter(
                    (applicationCommand) =>
                        applicationCommand.type === this.type
                )
                .get(interaction.commandName) as SavedChatInputCommand; // TODO: Fix type

        // Check if chat input command was found
        if (chatInputCommand) {
            // Try to execute chat input command specific function
            await chatInputCommand
                .execute(interaction)
                .catch(async (error: Error) => {
                    // Print error
                    console.error("[ERROR]:", error);

                    // Check if chat input command interaction was acknowledged
                    if (interaction.replied || interaction.deferred) {
                        // Send follow up message
                        interaction.followUp({
                            content: `There was an error while executing the chat input command \`\`${interaction.commandName}\`\`!`,
                            ephemeral: true,
                        });
                    }
                });
        } else {
            // Reply to interaction
            interaction.reply({
                ephemeral: true,
                content: `The chat input command \`\`${interaction.commandName}\`\` could not be found!`,
            });

            // Print error
            console.error(
                "[ERROR]:",
                `No chat input command matching '${interaction.commandName}' was found`
            );
        }
    },
};

// Export application command type
export default applicationCommandType;
