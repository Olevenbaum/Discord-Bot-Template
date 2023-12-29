// Type imports
import { ApplicationCommandType, ContextMenuCommandBuilder } from "discord.js";
import { SavedUserCommand } from "../../../declarations/types";

/**
 * User command
 */
const userCommand: SavedUserCommand = {
    data: new ContextMenuCommandBuilder().setName(""),
    type: ApplicationCommandType.User,

    async execute(interaction) {},
};

// Set user command type
userCommand.data.setType(userCommand.type);

// Export user command
export default userCommand;
