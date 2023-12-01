// Import types
import {
    ChatInputCommandInteraction,
    InteractionType,
    MessageContextMenuCommandInteraction,
    UserContextMenuCommandInteraction,
} from "discord.js";
import { SavedInteractionType } from "../../../declarations/types";

const interactionType: SavedInteractionType = {
    // Set interaction type
    type: InteractionType.ApplicationCommand,

    // Handle interaction
    async execute(
        interaction:
            | ChatInputCommandInteraction
            | MessageContextMenuCommandInteraction
            | UserContextMenuCommandInteraction
    ) {
        // Search for application command type
        const applicationCommandType = global.applicationCommandTypes.get(
            interaction.commandType
        );

        // Check if application command type was found
        if (applicationCommandType) {
            // Try to execute application command type specific function
            await applicationCommandType
                .execute(interaction)
                .catch((error: Error) => {
                    // Print error
                    console.error("[ERROR]:", error);
                });
        } else {
            // Print error
            console.error(
                "[ERROR]:",
                `No application command type file for application command type '${interaction.commandType}' was found`
            );
        }
    },
};

// Export interaction type
export default interactionType;
