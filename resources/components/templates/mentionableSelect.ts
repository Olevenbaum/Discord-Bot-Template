// Type imports
import { ComponentType, MentionableSelectMenuBuilder } from "discord.js";
import { SavedMentionableSelectComponent } from "../../../declarations/types";

/**
 * Template for mentionable select component
 */
export const mentionableSelectComponent: SavedMentionableSelectComponent = {
    name: "",
    type: ComponentType.MentionableSelect,

    create(options = {}) {
        // Return mentionable select component
        return new MentionableSelectMenuBuilder()
            .setCustomId(this.name + (options.customIdIndex ?? ""))
            .setDisabled(options.disabled ?? false)
            .setMaxValues(options.maximalValues ?? null)
            .setMinValues(options.minimalValues ?? 1)
            .setPlaceholder(options.placeholder ?? this.name);
    },

    async execute(interaction) {},
};
