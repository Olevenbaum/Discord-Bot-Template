// Type imports
import {
    ApplicationCommand,
    ApplicationCommandOption,
    ApplicationCommandType,
    Collection,
    InteractionType,
    MessageComponentType,
} from "discord.js";
import {
    InteractionErrorResponse,
    Notification,
    SavedApplicationCommand,
    SavedApplicationCommandType,
    SavedComponent,
    SavedInteractionType,
    SavedMessageComponentType,
} from "./types";

declare global {
    /**
     * Collection of all application commands imported from local files
     */
    const applicationCommands: Collection<string, SavedApplicationCommand>;

    /**
     * Collection of all application command types imported from local files
     */
    const applicationCommandTypes: Collection<
        ApplicationCommandType,
        SavedApplicationCommandType
    >;

    /**
     * Array of the blocked user's IDs imported from local file
     */
    const blockedUsers: string[];

    /**
     * Collection of all interaction types imported from local files
     */
    const interactionTypes: Collection<InteractionType, SavedInteractionType>;

    /**
     * Collection of all message components imported from local files
     */
    const components: Collection<string, SavedComponent>;

    /**
     * Collection of all message component types
     */
    const messageComponentTypes: Collection<
        MessageComponentType,
        SavedMessageComponentType
    >;

    /**
     * The **compareApplicationCommands()** function compares a registered application command linked and saved to the
     * bot at Discord with an application command imported from a local file by sorting all keys, adding default
     * key-value pairs and transforming options with the **transformApplicationCommandOptions()** function.
     *
     * @param registeredApplicationCommand An application command in the format as registered at Discord
     * @param savedApplicationCommand An application command imported from a local file
     *
     * @returns Whether the application command imported from a local file is identical to the already registered one
     */
    function compareApplicationCommands(
        registeredApplicationCommand: ApplicationCommand,
        savedApplicationCommand: SavedApplicationCommand,
    ): boolean;

    /**
     * The **isFromType<>()** function checks if the object has every given key of the type and thereby could be of this
     * type.
     *
     * @param object The object to check the type of
     * @param keys The keys that have to be present in the object to let the test pass
     *
     * @returns Whether the object matches the types structure and thereby could be from this type
     */
    function isFromType<Type>(
        object: any,
        keys: (keyof Type)[],
    ): object is Type;

    /**
     * The **sendNotification()** function prints the notification's content to the terminal or console and can send the
     * message to the interaction creator if there was one and to the bots owner or team if enabled.
     *
     * @param notification The notification that should be sent to the owner, owner of the developer team or all team
     * members and printed to the console
     * @param interactionErrorResponse The response to the interaction that caused the error if there was one
     */
    function sendNotification(
        notification?: Notification,
        interactionErrorResponse?: InteractionErrorResponse,
    ): void;

    /**
     * The **transformApplicationCommandOptions()** method transforms the application command's options of application
     * commands to make them comparable.
     *
     * @param applicationCommandOptions The application command's options to be transformed
     * @param registered Whether the application command format equals the format of registered application commands or
     * application commands being imported from a local file
     *
     * @returns The transformed application command's options
     */
    function transformApplicationCommandOptions(
        applicationCommandOptions: ApplicationCommandOption[],
        registered?: boolean,
    ): any;

    /**
     * The standard Array but with some additional features
     */
    interface Array<T> {
        /**
         * The **asynchronousFind()** method equals the **find()** method, but accepts asynchronous callback
         * functions.
         *
         * @param predicate The asynchronous callback function that states if the element meets the requirements
         * @param thisArg This argument replaces the "this"  object of the method
         *
         * @returns The element of the array that the callback function returns "true" for
         */
        asynchronousFind(
            predicate: (
                element: T,
                key: number,
                array: T[],
            ) => Promise<boolean>,
            thisArg?: any,
        ): Promise<T | undefined>;

        /**
         * The **rotate()** method rotates the array by the given amount in the given direction.
         *
         * @param counter The number of rotations that should be performed
         * @param reverse The direction of the rotation
         *
         * @returns The array that was rotated
         */
        rotate(counter?: number, reverse?: boolean): T[];
    }
}

// Export global variables
export {};
