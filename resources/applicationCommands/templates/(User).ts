// Import classes and methods
import { ApplicationCommandType, ContextMenuCommandBuilder } from "discord.js";
import { SavedUserCommand } from "../../../declarations/types";

// Define user command
const userCommand: SavedUserCommand = {
    // Set user command information and type
    data: new ContextMenuCommandBuilder().setName(""),
    type: ApplicationCommandType.User,

    // Handle command response
    async execute(interaction) {},
};

// Set user command type
userCommand.data.setType(userCommand.type);

// Export user command
export default userCommand;
