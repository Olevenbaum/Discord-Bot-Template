// Importing types
import {
    ApplicationCommandType,
    ContextMenuCommandBuilder,
    MessageContextMenuCommandInteraction,
} from "discord.js";
import { SavedMessageCommand } from "../../../types";

module.exports = {
    // Defining message command information and type
    data: new ContextMenuCommandBuilder().setName("").setType(this.type),
    type: ApplicationCommandType.Message,

    // Handling command reponse
    async execute(interaction: MessageContextMenuCommandInteraction) {},
} as SavedMessageCommand;
