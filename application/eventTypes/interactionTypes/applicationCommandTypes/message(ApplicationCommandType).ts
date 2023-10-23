// Importing types
import {
    ApplicationCommandType,
    MessageContextMenuCommandInteraction,
} from "discord.js";
import {
    SavedApplicationCommandType,
    SavedMessageCommand,
} from "../../../../types";

module.exports = {
    // Defining command type
    type: ApplicationCommandType.Message,

    // Handling interaction
    async execute(interaction: MessageContextMenuCommandInteraction) {
        // TODO: Fix type
        // Searching for message command
        const messageCommand = interaction.client.applicationCommands
            .filter(
                (applicationCommand) => applicationCommand.type === this.type
            )
            .get(interaction.commandName) as SavedMessageCommand; // TODO: Fix type

        // Checking if message command was found
        if (messageCommand) {
            // Trying to execute message command specific script
            await messageCommand.execute(interaction).catch(async (error) => {
                // Printing error
                console.error("[ERROR]:", error);

                // Checking if message command interaction was acknowledged
                if (interaction.replied || interaction.deferred) {
                    // Sending follow up message
                    interaction.followUp({
                        content: `There was an error while executing the message command \`\`${interaction.commandName}\`\`!`,
                        ephemeral: true,
                    });
                }
            });
        } else {
            // Replying to interaction
            interaction.reply({
                content: `The message command \`\`${interaction.commandName}\`\` could not be found!`,
                ephemeral: true,
            });

            // Printing error
            console.error(
                "[ERROR]:",
                `No message command matching '${interaction.commandName}' was found`
            );
        }
    },
} as SavedApplicationCommandType; // TODO: Fix type
