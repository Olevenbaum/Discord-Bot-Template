// Import types
import {
    ApplicationCommand,
    ApplicationCommandOption,
    ApplicationCommandType,
    Collection,
    InteractionType,
} from "discord.js";
import {
    SavedApplicationCommand,
    SavedApplicationCommandType,
    SavedInteractionType,
} from "./types";

// Declare global variables
declare global {
    var applicationCommands: Collection<string, SavedApplicationCommand>;
    var applicationCommandTypes: Collection<
        ApplicationCommandType,
        SavedApplicationCommandType
    >;
    var interactionTypes: Collection<InteractionType, SavedInteractionType>;
    function compareApplicationCommands(
        registeredApplicationCommand: ApplicationCommand,
        savedApplicationCommand: SavedApplicationCommand
    ): boolean;
    function transformApplicationCommandOptions(
        applicationCommandOptions: ApplicationCommandOption[],
        registered?: boolean
    ): any;
}

// Export global variables
export {};
