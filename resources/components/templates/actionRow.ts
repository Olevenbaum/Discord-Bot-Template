// Type imports
import {
    ActionRowBuilder,
    ComponentType,
    MessageComponentBuilder,
    TextInputBuilder,
} from "discord.js";
import {
    SavedActionRow,
    SavedMessageComponent,
    SavedTextInputComponent,
} from "../../../declarations/types";

/**
 * Template for action row
 */
export const actionRow: SavedActionRow = {
    includedComponents: {},
    name: "",
    type: ComponentType.ActionRow,

    create(options = {}) {
        /**
         * Message components or text input components to add to the action row
         */
        const createdComponents: MessageComponentBuilder[] = [];

        // Iterate over included components
        for (const componentName in this.includedComponents) {
            /**
             * Component that should be added
             */
            const component = components.get(
                componentName + `(${this.type})`,
            ) as SavedMessageComponent;

            // Iterate over number of single component
            for (
                let counter = 0;
                counter < this.includedComponents[componentName];
                counter++
            ) {
                // Check if custom ID index is needed
                if (this.includedComponents[componentName] > 1) {
                    // Set index of component
                    options[componentName].customIdIndex = counter;
                }

                // Add message component to array
                createdComponents.push(
                    component.create({
                        ...options.general,
                        ...options[componentName],
                    }),
                );
            }
        }

        // Return action row
        return new ActionRowBuilder().setComponents(createdComponents);
    },
};