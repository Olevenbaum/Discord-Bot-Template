// Type imports
import { ComponentType, StringSelectMenuBuilder } from "discord.js";
import { SavedStringSelectComponent } from "../../../declarations/types";

/**
 * Template for string select component
 */
export const stringSelectComponent: SavedStringSelectComponent = {
    name: "",
    options: [],
    type: ComponentType.StringSelect,

    create(options) {
        // Return string select component
        return new StringSelectMenuBuilder()
            .setCustomId(this.name + (options.customIdIndex ?? ""))
            .setDisabled(options.disabled ?? false)
            .setMaxValues(
                options.maximalValues ??
                    options.options.length ??
                    this.options.length,
            )
            .setMinValues(options.minimalValues ?? 1)
            .setOptions(options.options ?? this.options)
            .setPlaceholder(options.placeholder ?? this.name);
    },

    async execute(interaction) {},
};
