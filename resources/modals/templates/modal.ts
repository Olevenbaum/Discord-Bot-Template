// Type imports
import {
    ActionRowBuilder,
    ComponentType,
    ModalBuilder,
    TextInputBuilder,
} from "discord.js";
import {
    SavedModal,
    SavedTextInputComponent,
} from "../../../declarations/types";

/**
 * Template for modal
 */
export const modal: SavedModal = {
    includedTextInputComponents: {},
    name: "",

    create(options = {}) {
        /**
         * Text input components to add to the modal
         */
        const createdTextInputComponents: ActionRowBuilder<TextInputBuilder>[] =
            [];

        // Iterating over text input components
        for (const textInputComponentName in this.includedTextInputComponents) {
            /**
             * Text input component that should be added
             */
            const textInputComponent = components.get(
                textInputComponentName + `(${ComponentType.TextInput})`,
            ) as SavedTextInputComponent;

            // Iterating over counter of text input component
            for (
                let counter = 0;
                counter <
                this.includedTextInputComponents[textInputComponentName];
                counter++
            ) {
                // Adding text input component
                createdTextInputComponents.push(
                    new ActionRowBuilder().setComponents(
                        textInputComponent.create(),
                    ),
                );
            }
        }

        // Returning modal
        return new ModalBuilder()
            .setComponents(createdTextInputComponents)
            .setCustomId(this.name)
            .setTitle(options.title ?? this.name);
    },

    async execute(interaction) {},
};
