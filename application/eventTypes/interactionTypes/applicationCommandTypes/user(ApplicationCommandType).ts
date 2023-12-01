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

    // Handle interaction
    async execute(interaction: UserContextMenuCommandInteraction) {
        // Search for user command
        const userCommand = global.applicationCommands
            .filter(
                (applicationCommand) => applicationCommand.type === this.type
            )
            .get(interaction.commandName) as SavedUserCommand; // TODO: Fix type

        // Check if user command was found
        if (userCommand) {
            // Try to execute user command specific function
            await userCommand.execute(interaction).catch(async (error) => {
                // Print error
                console.error("[ERROR]:", error);

                // Check if user command interaction was acknowledged
                if (interaction.replied || interaction.deferred) {
                    // Send follow up message
                    interaction.followUp({
                        content: `There was an error while executing the user command \`\`${interaction.commandName}\`\`!`,
                        ephemeral: true,
                    });
                }
            });
        } else {
            // Reply to interaction
            interaction.reply({
                content: `The user command \`\`${interaction.commandName}\`\` could not be found!`,
                ephemeral: true,
            });

            // Print error
            console.error(
                "[ERROR]:",
                `No user command matching '${interaction.commandName}' was found`
            );
        }
    },
};

// Export application command type
export default applicationCommandType;
