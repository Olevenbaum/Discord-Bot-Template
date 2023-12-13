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
    // Collection to save all application commands
    const applicationCommands: Collection<string, SavedApplicationCommand>;

    // Collection to save all application command types
    const applicationCommandTypes: Collection<
        ApplicationCommandType,
        SavedApplicationCommandType
    >;

    // Array to save the IDs of blocked users
    const blockedUsers: string[];

    // Collection to save all interaction Types
    const interactionTypes: Collection<InteractionType, SavedInteractionType>;

    // Function to compare saved and registered application commands
    function compareApplicationCommands(
        registeredApplicationCommand: ApplicationCommand,
        savedApplicationCommand: SavedApplicationCommand,
    ): boolean;

    // Function to check whether object represents a specific type
    function isFromType<Type>(
        object: any,
        keys: (keyof Type)[],
    ): object is Type;

    // Function to transform application command options
    function transformApplicationCommandOptions(
        applicationCommandOptions: ApplicationCommandOption[],
        registered?: boolean,
    ): any;

    // Add additional functions to arrays
    interface Array<T> {
        // Function to find an element in the array with an asynchronous predicate
        asynchronousFind(
            predicate: (
                element: T,
                key: number,
                array: T[],
            ) => Promise<boolean>,
            thisArg?: any,
        ): Promise<T | undefined>;

        // Function to rotate the array
        rotate(counter?: number, reverse?: boolean): T[];
    }
}

// Export global variables
export {};
