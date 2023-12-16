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
            // Send notifications
            sendNotification(
                "error",
                error,
                `There was an error executing the message command \`\`${interaction.commandName}\`\`!`,
                interaction,
            );
        });
    },
};

// Export application command type
export default applicationCommandType;
