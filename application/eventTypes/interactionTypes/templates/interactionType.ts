// Type imports
import { InteractionType } from "discord.js";
import { SavedInteractionType } from "../../../../declarations/types";

/**
 * Template for interaction handler
 */
export const interactionType: SavedInteractionType = {
    type:
        InteractionType.ApplicationCommand ||
        InteractionType.ApplicationCommandAutocomplete ||
        InteractionType.MessageComponent ||
        InteractionType.ModalSubmit ||
        InteractionType.Ping,

    async execute(interaction) {},
};
