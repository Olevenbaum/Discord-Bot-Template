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

    // Handle interaction
    async execute(interaction: MessageContextMenuCommandInteraction) {
        // Search for message command
        const messageCommand = global.applicationCommands
            .filter(
                (applicationCommand) => applicationCommand.type === this.type
            )
            .get(interaction.commandName) as SavedMessageCommand; // TODO: Fix type

        // Check if message command was found
        if (messageCommand) {
            // Try to execute message command specific function
            await messageCommand.execute(interaction).catch(async (error) => {
                // Print error
                console.error("[ERROR]:", error);

                // Check if message command interaction was acknowledged
                if (interaction.replied || interaction.deferred) {
                    // Send follow up message
                    interaction.followUp({
                        content: `There was an error while executing the message command \`\`${interaction.commandName}\`\`!`,
                        ephemeral: true,
                    });
                }
            });
        } else {
            // Reply to interaction
            interaction.reply({
                content: `The message command \`\`${interaction.commandName}\`\` could not be found!`,
                ephemeral: true,
            });

            // Print error
            console.error(
                "[ERROR]:",
                `No message command matching '${interaction.commandName}' was found`
            );
        }
    },
};

// Export application command type
export default applicationCommandType;
