// Import classes and methods
import { ApplicationCommandType, SlashCommandBuilder } from "discord.js";
import { SavedChatInputCommand } from "../../../declarations/types";

// Define chat input command
export const chatInputCommand: SavedChatInputCommand = {
    // Set chat input command information and type
    data: new SlashCommandBuilder().setDescription("").setName("").setNSFW(),
    type: ApplicationCommandType.ChatInput,

    // Handle chat input command autocomplete
    async autocomplete(interaction) {},

    // Handle chat input command response
    async execute(interaction) {},
};
