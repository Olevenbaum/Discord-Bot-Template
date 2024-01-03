// Type imports
import { ChannelSelectMenuBuilder, ComponentType } from "discord.js";
import { SavedChannelSelectComponent } from "../../../declarations/types";

/**
 * Template for channel select component
 */
export const channelSelectComponent: SavedChannelSelectComponent = {
    name: "",
    type: ComponentType.ChannelSelect,

    create(options = {}) {
        // Return channel select component
        return new ChannelSelectMenuBuilder()
            .setChannelTypes(options.channelTypes ?? null)
            .setCustomId(this.name + (options.customIdIndex ?? ""))
            .setDisabled(options.disabled ?? false)
            .setMaxValues(options.maximalValues ?? null)
            .setMinValues(options.minimalValues ?? 1)
            .setPlaceholder(options.placeholder ?? this.name);
    },

    async execute(interaction) {},
};
