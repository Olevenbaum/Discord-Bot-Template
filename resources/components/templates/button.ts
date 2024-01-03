// Type imports
import { ButtonBuilder, ButtonStyle, ComponentType } from "discord.js";
import { SavedButtonComponent } from "../../../declarations/types";

/**
 * Template for button component
 */
export const buttonComponent: SavedButtonComponent = {
    name: "",
    type: ComponentType.Button,

    create(options = {}) {
        /**
         * New button component
         */
        const buttonComponent = new ButtonBuilder()
            .setCustomId(this.name + (options.customIdIndex ?? ""))
            .setDisabled(options.disabled ?? false)
            .setLabel(options.label ?? this.name)
            .setStyle(
                options.style ??
                    (ButtonStyle.Danger ||
                        ButtonStyle.Link ||
                        ButtonStyle.Primary ||
                        ButtonStyle.Secondary ||
                        ButtonStyle.Success),
            );

        // Check if emoji was provided
        if (options.emoji) {
            // Set emoji of button component
            buttonComponent.setEmoji(options.emoji);
        }

        // Check if url was provided
        if (options.url) {
            // Set URL of button component
            buttonComponent.setURL(options.url);
        }

        // Return button component
        return buttonComponent;
    },

    async execute(interaction) {},
};
