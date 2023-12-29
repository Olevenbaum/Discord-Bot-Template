// Type imports
import { ApplicationCommandType, SlashCommandBuilder } from "discord.js";
import { SavedChatInputCommand } from "../../../declarations/types";

/**
 * Chat input command
 */
export const chatInputCommand: SavedChatInputCommand = {
    data: new SlashCommandBuilder().setDescription("").setName("").setNSFW(),
    type: ApplicationCommandType.ChatInput,

    async autocomplete(interaction) {},

    async execute(interaction) {},
};
