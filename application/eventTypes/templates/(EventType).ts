// Importing types
import { ClientEvents, Events, Interaction } from "discord.js";
import { SavedEventType } from "../../../types";

module.exports = {
    // Defining event kind and type
    once: false,
    type: Events,

    // Handling event
    execute(interaction: Interaction) {},
} as SavedEventType;
