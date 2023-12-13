// Import types
import {
    ApplicationCommandType,
    MessageContextMenuCommandInteraction,
} from "discord.js";
import {
    SavedApplicationCommandType,
    SavedMessageCommand,
} from "../../../../declarations/types";

// Define application command type
const applicationCommandType: SavedApplicationCommandType = {
    // Set application command type
    type: ApplicationCommandType.Message,

    // Handle message command interaction
    async execute(interaction: MessageContextMenuCommandInteraction) {
        // Search for message command
        const messageCommand = applicationCommands
            .filter(
                (applicationCommand) => applicationCommand.type === this.type,
            )
            .get(interaction.commandName) as SavedMessageCommand; // TODO: Fix type

        // Try to execute message command specific function
        await messageCommand.execute(interaction).catch(async (error) => {
            // Print error
            console.error("[ERROR]:", error);

            // Check if message command interaction was acknowledged
            if (interaction.replied || interaction.deferred) {
                // Send follow-up error message
                await interaction.followUp({
                    content: `There was an error while executing the message command \`\`${interaction.commandName}\`\`!`,
                    ephemeral: true,
                });
            } else {
                // Send error message
                await interaction.reply({
                    content: `There was an error executing the message command \`\`${interaction.commandName}\`\`!`,
                    ephemeral: true,
                });
            }
        });
    },
};

// Export application command type
export default applicationCommandType;
