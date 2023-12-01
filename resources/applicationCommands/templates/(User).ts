// Importing classes and methods
import { ApplicationCommandType, ContextMenuCommandBuilder } from "discord.js";
import { SavedUserCommand } from "../../../declarations/types";

// Define user command
const userCommand: SavedUserCommand = {
    // Set user command information and type
    data: new ContextMenuCommandBuilder().setName("").setType(this.type),
    type: ApplicationCommandType.User,

    // Handle command reponse
    async execute(interaction) {},
};

// Export user command
export default userCommand;
