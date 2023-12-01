// Import types
import { InteractionType } from "discord.js";
import { SavedInteractionType } from "../../../../declarations/types";

// Define interaction type
const interactionType: SavedInteractionType = {
    // Set interaction type
    type:
        InteractionType.ApplicationCommand ||
        InteractionType.ApplicationCommandAutocomplete ||
        InteractionType.MessageComponent ||
        InteractionType.ModalSubmit ||
        InteractionType.Ping,

    // Handle interaction
    async execute(interaction) {},
};

// Export interaction type
export default interactionType;
