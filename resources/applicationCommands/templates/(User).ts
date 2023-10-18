// Importing classes and methods
import {
    ApplicationCommandType,
    ContextMenuCommandBuilder,
    UserContextMenuCommandInteraction,
} from "discord.js";
import { SavedUserCommand } from "../../../types";

module.exports = {
    // Defining user command information and type
    data: new ContextMenuCommandBuilder().setName("").setType(this.type),
    type: ApplicationCommandType.User,

    // Handling command reponse
    async execute(interaction: UserContextMenuCommandInteraction) {},
} as SavedUserCommand;
