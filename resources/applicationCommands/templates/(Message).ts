// Type imports
import { ApplicationCommandType, ContextMenuCommandBuilder } from "discord.js";
import { SavedMessageCommand } from "../../../declarations/types";

/**
 * Message command
 */
const messageCommand: SavedMessageCommand = {
    data: new ContextMenuCommandBuilder().setName(""),
    type: ApplicationCommandType.Message,

    async execute(interaction) {},
};

// Set message command type
messageCommand.data.setType(messageCommand.type);

// Export message command
export default messageCommand;
