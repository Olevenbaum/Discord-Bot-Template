// Type imports
import { ComponentType, RoleSelectMenuInteraction } from "discord.js";
import {
    PredefinedInteractionErrorResponse,
    SavedMessageComponentType,
    SavedRoleSelectComponent,
} from "../../../../declarations/types";

/**
 * Role select component interaction handler
 */
export const roleSelectComponentInteraction: SavedMessageComponentType = {
    type: ComponentType.RoleSelect,

    async execute(interaction: RoleSelectMenuInteraction) {
        /**
         * Role select component that was interacted with
         */
        const roleSelectComponent = components.get(
            interaction.customId.replace(/[0-9]/g, "") + `(${this.type})`,
        ) as SavedRoleSelectComponent;

        // Try to forward role select component interaction response prompt
        await roleSelectComponent.execute(interaction).catch((error: Error) => {
            // Send notifications
            sendNotification(
                {
                    consoleOutput: `Error handling interaction with role select component '${interaction.customId}'`,
                    content: `There was an error handling the interaction with the role select component \`\`${interaction.customId}\`\`!`,
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
