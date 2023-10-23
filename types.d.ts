// Importing types
import {
    ApplicationCommandType,
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    Events,
    Interaction,
    InteractionType,
    MessageContextMenuCommandInteraction,
    UserContextMenuCommandInteraction,
} from "discord.js";

interface SavedApplicationCommand {
    data: {};
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
    autocomplete(interacion: AutocompleteInteraction): Promise<void>;
    execute(interacion: ChatInputCommandInteraction): Promise<void>;
}

interface SavedEventType {
    once: boolean;
    type: Events;
    execute(...args: any[]): Promise<void>;
}

interface SavedInteractionType {
    type: InteractionType;
    execute(Interaction: Interaction): Promise<void>;
}

interface SavedMessageCommand extends SavedApplicationCommand {
    execute(interacion: MessageContextMenuCommandInteraction): Promise<void>;
}

interface SavedUserCommand extends SavedApplicationCommand {
    execute(interacion: UserContextMenuCommandInteraction): Promise<void>;
}
