// Import types
import {
    ApplicationCommandType,
    UserContextMenuCommandInteraction,
} from "discord.js";
import {
    SavedApplicationCommandType,
    SavedUserCommand,
} from "../../../../declarations/types";

// Define application command type
const applicationCommandType: SavedApplicationCommandType = {
    // Set application command type
    type: ApplicationCommandType.User,

    // Handle user command interaction
    async execute(interaction: UserContextMenuCommandInteraction) {
        // Search for user command
        const userCommand = applicationCommands
            .filter(
                (applicationCommand) => applicationCommand.type === this.type,
            )
            .get(interaction.commandName) as SavedUserCommand; // TODO: Fix type

        // Try to execute user command specific function
        await userCommand.execute(interaction).catch(async (error) => {
            // Print error
            console.error("[ERROR]:", error);

            // Check if user command interaction was acknowledged
            if (interaction.replied || interaction.deferred) {
                // Send follow-up error message
                await interaction.followUp({
                    content: `There was an error while executing the user command \`\`${interaction.commandName}\`\`!`,
                    ephemeral: true,
                });
            } else {
                // Send error message
                await interaction.reply({
                    content: `There was an error executing the user command \`\`${interaction.commandName}\`\`!`,
                    ephemeral: true,
                });
            }
        });
    },
};

// Export application command type
export default applicationCommandType;
