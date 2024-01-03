// Type imports
import { ChannelSelectMenuInteraction, ComponentType } from "discord.js";
import {
    PredefinedInteractionErrorResponse,
    SavedChannelSelectComponent,
    SavedMessageComponentType,
} from "../../../../declarations/types";

/**
 * Channel select component interaction handler
 */
export const channelSelectComponentInteraction: SavedMessageComponentType = {
    type: ComponentType.ChannelSelect,

    async execute(interaction: ChannelSelectMenuInteraction) {
        /**
         * Channel select component that was interacted with
         */
        const channelSelectComponent = components.get(
            interaction.customId.replace(/[0-9]/g, "") + `(${this.type})`,
        ) as SavedChannelSelectComponent;

        // Try to forward channel select component interaction response prompt
        await channelSelectComponent
            .execute(interaction)
            .catch((error: Error) => {
                // Send notifications
                sendNotification(
                    {
                        consoleOutput: `Error handling interaction with channel select component '${interaction.customId}'`,
                        content: `There was an error handling the interaction with the channel select component \`\`${interaction.customId}\`\`!`,
                        error: error,
                        interaction,
                        owner: interaction.client.application.owner,
                        type: "error",
                    },
                    {
                        content:
                            PredefinedInteractionErrorResponse.errorHandlingInteraction,
                        interaction,
                    },
                );
            });
    },
};
