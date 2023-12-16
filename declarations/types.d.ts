// Import types
import {
    ApplicationCommandType,
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    ClientEvents,
    Interaction,
    InteractionType,
    ContextMenuCommandBuilder,
    MessageContextMenuCommandInteraction,
    SlashCommandBuilder,
    UserContextMenuCommandInteraction,
} from "discord.js";

// Interface for locally saved application commands
interface SavedApplicationCommand {
    // Data of application command
    data: { type?: ApplicationCommandType } & (
        | SlashCommandBuilder
        | ContextMenuCommandBuilder
    );

    // Type of application command
    type: ApplicationCommandType;

    // Function to be executed on application command interaction
    execute(
        interaction:
            | ChatInputCommandInteraction
            | MessageContextMenuCommandInteraction
            | UserContextMenuCommandInteraction,
    ): Promise<void>;
}

// Interface for locally saved application commands
interface SavedApplicationCommandType {
    // Application command type
    type: ApplicationCommandType;

    // Function to be executed on application command interaction
    execute(
        interaction:
            | ChatInputCommandInteraction
            | MessageContextMenuCommandInteraction
            | UserContextMenuCommandInteraction,
    ): Promise<void>;
}

// Interface for locally saved chat input commands
interface SavedChatInputCommand extends SavedApplicationCommand {
    // Data of the chat input command
    data: SlashCommandBuilder;

    // Function to be executed on chat input command autocomplete interaction
    autocomplete(interaction: AutocompleteInteraction): Promise<void>;

    // Function to be executed on chat input command interaction
    execute(interaction: ChatInputCommandInteraction): Promise<void>;
}

// Interface for locally saved event types
interface SavedEventType {
    // Whether the event is called once
    once: boolean;

    // Type of the event
    type: keyof ClientEvents;

    // Function to be executed on event emission
    execute(...args: any[]): Promise<void>;
}

// Interface for locally saved interaction types
interface SavedInteractionType {
    // Type of interaction
    type: InteractionType;

    // Function to be executed on interaction
    execute(Interaction: Interaction): Promise<void>;
}

// Interface for locally saved message commands
interface SavedMessageCommand extends SavedApplicationCommand {
    // Data of the message command
    data: ContextMenuCommandBuilder;

    // Function to be executed on message command interaction
    execute(interaction: MessageContextMenuCommandInteraction): Promise<void>;
}

// Interface for locally saved user commands
interface SavedUserCommand extends SavedApplicationCommand {
    // Data of the user command
    data: ContextMenuCommandBuilder;

    // Function to be executed on user command interaction
    execute(interaction: UserContextMenuCommandInteraction): Promise<void>;
}
