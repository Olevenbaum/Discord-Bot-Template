// Type imports
import { ComponentType, UserSelectMenuBuilder } from "discord.js";
import { SavedUserSelectComponent } from "../../../declarations/types";

/**
 * Template for user select component
 */
export const userSelectComponent: SavedUserSelectComponent = {
    name: "",
    type: ComponentType.UserSelect,

    create(options = {}) {
        // Return user select component
        return new UserSelectMenuBuilder()
            .setCustomId(this.name(options.customIdIndex ?? ""))
            .setDisabled(options.disabled ?? false)
            .setMaxValues(options.maximalValues ?? null)
            .setMinValues(options.minimalValues ?? 1)
            .setPlaceholder(options.placeholder ?? this.name);
    },

    async execute(interaction) {},
};
