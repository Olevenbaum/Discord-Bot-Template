// Importing types
import {
    ApplicationCommandType,
    UserContextMenuCommandInteraction,
} from "discord.js";

module.exports = {
    // Setting command type
    type: ApplicationCommandType.User,

    // Handling interaction
    async execute(interaction: UserContextMenuCommandInteraction) {
        // Searching for user command
        const userCommand = interaction.client.applicationCommands
            .filter(
                (applicationCommand) => applicationCommand.type === this.type
            )
            .get(interaction.commandName);

        // Checking if user command was found
        if (userCommand) {
            // Trying to execute user command specific script
            await userCommand.execute(interaction).catch(async (error) => {
                // Printing error
                console.error("[ERROR]:", error);

                // Checking if user command interaction was acknowledged
                if (interaction.replied || interaction.deferred) {
                    // Sending follow up message
                    interaction.followUp({
                        content: `There was an error while executing the user command '${interaction.commandName}'!`,
                        ephemeral: true,
                    });
                }
            });
        } else {
            // Replying to interaction
            interaction.reply({
                content: `The user command '${interaction.commandName}' could not be found!`,
                ephemeral: true,
            });

            // Printing error
            console.error(
                "[ERROR]:",
                `No user command matching '${interaction.commandName}' was found`
            );
        }
    },
};
