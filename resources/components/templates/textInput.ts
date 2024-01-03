// Type imports
import { ComponentType, TextInputBuilder, TextInputStyle } from "discord.js";
import { SavedTextInputComponent } from "../../../declarations/types";

/**
 * Template for text input component
 */
export const textInputComponent: SavedTextInputComponent = {
    name: "",
    type: ComponentType.TextInput,

    create(options = {}) {
        // Return text input component
        return new TextInputBuilder()
            .setCustomId(this.name + (options.customIdIndex ?? ""))
            .setLabel(options.label ?? this.name)
            .setMaxLength(options.maximalLength ?? null)
            .setMinLength(options.minimalLength ?? 1)
            .setPlaceholder(options.setPlaceholder ?? this.name)
            .setRequired(options.required ?? false)
            .setStyle(
                options.style ??
                    (TextInputStyle.Short || TextInputStyle.Paragraph),
            )
            .setValue(options.value ?? null);
    },
};
