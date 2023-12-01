// Import types
import { ApplicationCommandType, ContextMenuCommandBuilder } from "discord.js";
import { SavedMessageCommand } from "../../../declarations/types";

// Define message command
const messageCommand: SavedMessageCommand = {
    // Set message command information and type
    data: new ContextMenuCommandBuilder()
        .setName("")
        .setType(messageCommand.type),
    type: ApplicationCommandType.Message,

    // Handle command reponse
    async execute(interaction) {},
};

// Export message command
export default messageCommand;
