// Importing classes and methods
import { ApplicationCommandType, SlashCommandBuilder } from "discord.js";
import { SavedChatInputCommand } from "../../../types";

module.exports = {
    // Defining chat input command information and type
    data: new SlashCommandBuilder().setDescription("").setName("").setNSFW(),
    type: ApplicationCommandType.ChatInput,

    // Handling chat input command autocomplete

    async autocomplete(interaction) {},

    // Handling chat input command reponse
    async execute(interaction) {},
} as SavedChatInputCommand; // TODO: Fix type
