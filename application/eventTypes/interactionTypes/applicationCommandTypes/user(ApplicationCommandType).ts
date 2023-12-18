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
export const applicationCommandType: SavedApplicationCommandType = {
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
