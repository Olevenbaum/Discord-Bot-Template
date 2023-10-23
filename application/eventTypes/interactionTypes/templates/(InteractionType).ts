// Importing types
import { InteractionType } from "discord.js";
import { SavedInteractionType } from "../../../../types";

module.exports = {
    // Defining interaction type
    type:
        InteractionType.ApplicationCommand |
        InteractionType.ApplicationCommandAutocomplete |
        InteractionType.MessageComponent |
        InteractionType.ModalSubmit |
        InteractionType.Ping,

    // Handling interaction
    async execute(interaction) {},
} as SavedInteractionType; // TODO: Fix type
