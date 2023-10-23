// Importing types
import { ApplicationCommandType, ContextMenuCommandBuilder } from "discord.js";
import { SavedMessageCommand } from "../../../types";

module.exports = {
    // Defining message command information and type
    data: new ContextMenuCommandBuilder().setName("").setType(this.type),
    type: ApplicationCommandType.Message,

    // Handling command reponse
    async execute(interaction) {},
} as SavedMessageCommand; // TODO: Fix type
