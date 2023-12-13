// Import types
import { ApplicationCommandType, ContextMenuCommandBuilder } from "discord.js";
import { SavedMessageCommand } from "../../../declarations/types";

// Define message command
const messageCommand: SavedMessageCommand = {
    // Set message command information and type
    data: new ContextMenuCommandBuilder().setName(""),
    type: ApplicationCommandType.Message,

    // Handle command response
    async execute(interaction) {},
};

// Set message command type
messageCommand.data.setType(messageCommand.type);

// Export message command
export default messageCommand;
