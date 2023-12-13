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
    data: SlashCommandBuilder | ContextMenuCommandBuilder;
    type: ApplicationCommandType;
    execute(
        interaction:
            | ChatInputCommandInteraction
            | MessageContextMenuCommandInteraction
            | UserContextMenuCommandInteraction,
    ): Promise<void>;
}

// Interface for locally saved application commands
interface SavedApplicationCommandType {
    type: ApplicationCommandType;
    execute(
        interaction:
            | ChatInputCommandInteraction
            | MessageContextMenuCommandInteraction
            | UserContextMenuCommandInteraction,
    ): Promise<void>;
}

// Interface for locally saved chat input commands
interface SavedChatInputCommand extends SavedApplicationCommand {
    data: SlashCommandBuilder;
    autocomplete(interaction: AutocompleteInteraction): Promise<void>;
    execute(interaction: ChatInputCommandInteraction): Promise<void>;
}

// Interface for locally saved event types
interface SavedEventType {
    once: boolean;
    type: keyof ClientEvents;
    execute(...args: any[]): Promise<void>;
}

// Interface for locally saved interaction types
interface SavedInteractionType {
    type: InteractionType;
    execute(Interaction: Interaction): Promise<void>;
}

// Interface for locally saved message commands
interface SavedMessageCommand extends SavedApplicationCommand {
    data: ContextMenuCommandBuilder;
    execute(interaction: MessageContextMenuCommandInteraction): Promise<void>;
}

// Interface for locally saved user commands
interface SavedUserCommand extends SavedApplicationCommand {
    data: ContextMenuCommandBuilder;
    execute(interaction: UserContextMenuCommandInteraction): Promise<void>;
}
