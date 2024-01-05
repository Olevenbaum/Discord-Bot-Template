// Type imports
import { Events, Interaction, InteractionType, userMention } from "discord.js";
import {
    PredefinedInteractionErrorResponse,
    SavedEventType,
} from "../../declarations/types";

// Configuration data import
import configuration from "configuration.json";

/**
 * Interaction event handler
 */
export const eventType: SavedEventType = {
    once: false,
    type: Events.InteractionCreate,

    async execute(interaction: Interaction) {
        // Check if user is allowed to interact with bot
        if (
            interaction.type !==
                InteractionType.ApplicationCommandAutocomplete &&
            ((configuration.enableBlockedUsers &&
                blockedUsers.includes(interaction.user.id)) ||
                (!configuration.enableBotInteraction && interaction.user.bot))
        ) {
            // Send notifications
            sendNotification(
                {
                    consoleOutput: `${
                        interaction.user.bot
                            ? "Bot"
                            : `User '${interaction.user.username}', who currently is blocked from using your bot,`
                    } tried to interact with your bot`,
                    content: `The ${
                        (interaction.user.bot
                            ? "bot"
                            : `user ${userMention(
                                  interaction.user.id,
                              )}, who currently is blocked from using your bot,`) +
                        interaction.user.username
                    } tried to interact with your bot`,
                    owner: interaction.client.application.owner,
                    type: "warning",
                },
                {
                    content: PredefinedInteractionErrorResponse.cannotInteract,
                    interaction,
                },
            );
        } else {
            /**
             * Interaction type handler matching the interaction type
             */
            const interactionType = interactionTypes.get(interaction.type);

            // Check if interaction type was found
            if (interactionType) {
                // Try to forward interaction response prompt
                await interactionType
                    .execute(interaction)
                    .catch((error: Error) => {
                        // Send notification
                        sendNotification(
                            {
                                consoleOutput: `Error handling interaction type '${interaction.type}'`,
                                content: `The interaction type \`\`${interaction.type}\`\` could not be handled!`,
                                error,
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
            } else {
                // Send notification
                sendNotification(
                    {
                        consoleOutput: `No file found for interaction type '${interaction.type}'`,
                        content: `Unable to find interaction type matching ${interaction.type} in global variable`,
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
            }
        }
    },
};
