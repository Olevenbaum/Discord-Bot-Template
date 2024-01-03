// Type imports
import { ComponentType, RoleSelectMenuBuilder } from "discord.js";
import { SavedRoleSelectComponent } from "../../../declarations/types";

/**
 * Template for role select component
 */
export const roleSelectComponent: SavedRoleSelectComponent = {
    name: "",
    type: ComponentType.RoleSelect,

    create(options = {}) {
        // Return role select component
        return new RoleSelectMenuBuilder()
            .setCustomId(this.name + (options.customIdIndex ?? ""))
            .setDisabled(options.disabled ?? false)
            .setMaxValues(options.maximalValues ?? null)
            .setMinValues(options.minimalValues ?? 1)
            .setPlaceholder(options.placeholder ?? this.name);
    },

    async execute(interaction) {},
};
