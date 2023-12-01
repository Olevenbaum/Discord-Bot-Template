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

// Create interfaces
interface SavedApplicationCommand {
    data: SlashCommandBuilder | ContextMenuCommandBuilder;
    type: ApplicationCommandType;
    execute(
        interacion:
            | ChatInputCommandInteraction
            | MessageContextMenuCommandInteraction
            | UserContextMenuCommandInteraction
    ): Promise<void>;
}

interface SavedApplicationCommandType {
    type: ApplicationCommandType;
    execute(
        interacion:
            | ChatInputCommandInteraction
            | MessageContextMenuCommandInteraction
            | UserContextMenuCommandInteraction
    ): Promise<void>;
}

interface SavedChatInputCommand extends SavedApplicationCommand {
    data: SlashCommandBuilder;
    autocomplete(interacion: AutocompleteInteraction): Promise<void>;
    execute(interacion: ChatInputCommandInteraction): Promise<void>;
}

interface SavedEventType {
    once: boolean;
    type: keyof ClientEvents;
    execute(...args: any[]): Promise<void>;
}

interface SavedInteractionType {
    type: InteractionType;
    execute(Interaction: Interaction): Promise<void>;
}

interface SavedMessageCommand extends SavedApplicationCommand {
    data: ContextMenuCommandBuilder;
    execute(interacion: MessageContextMenuCommandInteraction): Promise<void>;
}

interface SavedUserCommand extends SavedApplicationCommand {
    data: ContextMenuCommandBuilder;
    execute(interacion: UserContextMenuCommandInteraction): Promise<void>;
}
