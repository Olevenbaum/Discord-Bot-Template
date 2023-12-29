// Type imports
import {
    ActionRowBuilder,
    ApplicationCommandType,
    AutocompleteInteraction,
    BaseInteraction,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    ChannelSelectMenuBuilder,
    ChannelSelectMenuInteraction,
    ChannelType,
    ChatInputCommandInteraction,
    ClientEvents,
    ContextMenuCommandBuilder,
    ComponentEmojiResolvable,
    ComponentType,
    Interaction,
    InteractionType,
    MentionableSelectMenuBuilder,
    MentionableSelectMenuInteraction,
    MessageComponentBuilder,
    MessageComponentInteraction,
    MessageComponentType,
    MessageContextMenuCommandInteraction,
    RestOrArray,
    RoleSelectMenuBuilder,
    RoleSelectMenuInteraction,
    SlashCommandBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuInteraction,
    TextInputBuilder,
    UserContextMenuCommandInteraction,
    UserSelectMenuBuilder,
    UserSelectMenuInteraction,
} from "discord.js";

/**
 * Options that can be passed when creating an action row
 */
interface ActionRowCreateOptions extends ComponentCreateOptions {
    /**
     * Options that are passed to every component included in the action row
     */
    general?: MessageComponentCreateOptions;

    /**
     * Options that are passed to the component in the action row whose name matches the key
     */
    [key: string]: MessageComponentCreateOptions;
}

/**
 * Options that can be passed when creating a button component
 */
interface ButtonComponentCreateOptions extends MessageComponentCreateOptions {
    /**
     * Emoji being shown on the button component
     *
     * **Note:** This option overwrites the label option!
     */
    emoji?: ComponentEmojiResolvable;

    /**
     * Label of the button component
     */
    label?: string;

    /**
     * Style of the button component
     */
    style?: ButtonStyle;

    /**
     * URL linked to the button component
     */
    url?: string;
}

/**
 * Options that can be passed when creating a channel select component
 */
interface ChannelSelectComponentCreateOptions
    extends SelectComponentCreateOptions {
    /**
     * Channel type(s) that the channel can be selected from
     */
    channelTypes?: RestOrArray<ChannelType>;
}

/**
 * Options that can be passed when creating a component
 */
interface ComponentCreateOptions {
    /**
     * Additional options
     */
    [key: string]: any;
}

/**
 * Options that can be passed when creating a mentionable select component
 */
interface MentionableSelectComponentCreateOptions
    extends SelectComponentCreateOptions {}

/**
 * Options that can be passed when creating a message component
 */
interface MessageComponentCreateOptions extends ComponentCreateOptions {
    /**
     * Index of the message component if it needs to be added multiple times to one message or action row
     */
    customIdIndex?: number;

    /**
     * Whether the message component should be disabled or not
     */
    disabled?: boolean;
}

/**
 * Options that can be passed when creating a role select component
 */
interface RoleSelectComponentCreateOptions
    extends SelectComponentCreateOptions {}

/**
 * Action row imported from local file
 */
interface SavedActionRow extends SavedComponent {
    /**
     * Name (key) and number (value) of the included components
     */
    includedComponents: {
        [key: string]: number;
    };

    /**
     * Type of the action row
     */
    type: ComponentType.ActionRow;

    /**
     * The **create()** method creates an action row and the including the components listed in the
     * **includedComponents** property.
     *
     * @param interaction The interaction that caused the action row to be created
     * @param options The options that modify the included components
     *
     * @returns The action row builder including its modified components
     */
    create(
        interaction: Interaction,
        options: ActionRowCreateOptions,
    ): ActionRowBuilder;
}

/**
 * Application command imported from local file
 */
interface SavedApplicationCommand {
    /**
     * Data of the application command
     */
    data: { type?: ApplicationCommandType } & (
        | SlashCommandBuilder
        | ContextMenuCommandBuilder
    );

    /**
     * Type of the application command
     */
    type: ApplicationCommandType;

    /**
     * The **execute()** method handles the response to the application command's interaction.
     *
     * @param interaction The application command interaction to response to
     */
    execute(
        interaction:
            | ChatInputCommandInteraction
            | MessageContextMenuCommandInteraction
            | UserContextMenuCommandInteraction,
    ): Promise<void>;
}

/**
 * Application command type imported from local file
 */
interface SavedApplicationCommandType {
    /**
     * Application command type
     */
    type: ApplicationCommandType;

    /**
     * The **execute()** method handles the interaction with the application command type.
     *
     * @param interaction The interaction to be handled
     */
    execute(
        interaction:
            | ChatInputCommandInteraction
            | MessageContextMenuCommandInteraction
            | UserContextMenuCommandInteraction,
    ): Promise<void>;
}

/**
 * Button component imported from local file
 */
interface SavedButtonComponent extends SavedMessageComponent {
    /**
     * Type of the button message component
     */
    type: ComponentType.Button;

    /**
     * The **create()** method creates the button component modified by the given options.
     *
     * @param interaction The interaction that caused the button component to be created
     * @param options The options that modify the button component
     *
     * @returns The button builder modified by the options
     */
    create(
        interaction: Interaction,
        options: ButtonComponentCreateOptions,
    ): ButtonBuilder;

    /**
     * The **execute()** method handles the response to the button interaction.
     *
     * @param interaction The button interaction to response to
     */
    execute(interaction: ButtonInteraction): Promise<void>;
}

/**
 * Channel select component imported from local file
 */
interface SavedChannelSelectComponent extends SavedMessageComponent {
    /**
     * Type of the channel select component
     */
    type: ComponentType.ChannelSelect;

    /**
     * The **create()** method creates the channel select component modified by the given options.
     *
     * @param interaction The interaction that caused the channel select component to be created
     * @param options The options that modify the channel select component
     *
     * @returns The channel select builder modified by the options
     */
    create(
        interaction: ChannelSelectMenuInteraction,
        options: ChannelSelectComponentCreateOptions,
    ): ChannelSelectMenuBuilder;

    /**
     * The **execute()** method handles the response to the channel select component interaction.
     *
     * @param interaction The channel select component interaction to response to
     */
    execute(interaction: ChannelSelectMenuInteraction): Promise<void>;
}

/**
 * Chat input command imported from local file
 */
interface SavedChatInputCommand extends SavedApplicationCommand {
    /**
     * Data of the chat input command
     */
    data: SlashCommandBuilder;
    /**
     * Type of the chat input command
     */
    type: ApplicationCommandType.ChatInput;

    /**
     * The **autocomplete** method handles an autocomplete interaction. It returns the values that match the users
     * input to Discord.
     *
     * @param interaction The autocomplete interaction
     */
    autocomplete(interaction: AutocompleteInteraction): Promise<void>;

    /**
     * The **execute()** method handles the response to the chat input command interaction.
     *
     * @param interaction The chat input command interaction to response to
     */
    execute(interaction: ChatInputCommandInteraction): Promise<void>;
}

/**
 * Component imported from local file
 */
interface SavedComponent {
    /**
     * Name of the component
     */
    name: string;

    /**
     * Type of the component
     */
    type: ComponentType;
}

/**
 * Event type imported from local file
 */
interface SavedEventType {
    /**
     * Whether the event is called once
     */
    once: boolean;

    /**
     * Type of the event
     */
    type: keyof ClientEvents;

    /**
     * The **execute()** method forwards the prompt to response to the interaction or handles it by itself.
     *
     * @param args The needed arguments to response to an interaction or the emitted event
     */
    execute(...args: any[]): Promise<void>;
}

/**
 * Interaction type imported from local file
 */
interface SavedInteractionType {
    /**
     * Type of the interaction
     */
    type: InteractionType;

    /**
     * The **execute()** method forwards the interaction to be handled or handles it by itself.
     *
     * @param interaction The interaction to respond to
     */
    execute(interaction: BaseInteraction): Promise<void>;
}

/**
 * Mentionable select component imported from local file
 */
interface SavedMentionableSelectComponent extends SavedMessageComponent {
    /**
     * Type of the mentionable select component
     */
    type: ComponentType.MentionableSelect;

    /**
     * The **create()** method creates the mentionable select component modified by the given options.
     *
     * @param interaction The interaction that caused the mentionable select component to be created
     * @param options The options that modify the mentionable select component
     *
     * @returns The mentionable select builder modified by the options
     */
    create(
        interaction: MentionableSelectMenuInteraction,
        options: MentionableSelectComponentCreateOptions,
    ): MentionableSelectMenuBuilder;

    /**
     * The **execute()** method handles the response to the mentionable select component interaction.
     *
     * @param interaction The mentionable select component interaction to respond to
     */
    execute(interaction: MentionableSelectMenuInteraction): Promise<void>;
}

/**
 * Message command imported from local file
 */
interface SavedMessageCommand extends SavedApplicationCommand {
    /**
     * Data of the message command
     */
    data: ContextMenuCommandBuilder;

    /**
     * Type of the message command
     */
    type: ApplicationCommandType.Message;

    /**
     * The **execute()** method handles the response to the message command interaction.
     *
     * @param interaction The message command interaction to respond to
     */
    execute(interaction: MessageContextMenuCommandInteraction): Promise<void>;
}

/**
 * Message component imported from local file
 */
interface SavedMessageComponent extends SavedComponent {
    /**
     * Type of the message component
     */
    type: MessageComponentType;

    /**
     * The **create()** method creates the message component modified by the given options.
     *
     * @param interaction The interaction that caused the message component to be created
     * @param options The options to modify the message component
     *
     * @returns The message component builder modified by the options
     */
    create(
        interaction: Interaction,
        options?: MessageComponentCreateOptions,
    ): MessageComponentBuilder | ActionRowBuilder;

    /**
     * The **execute()** method handles the response to the message component interaction
     *
     * @param interaction The message component interaction to response to
     */
    execute?(interaction: MessageComponentInteraction): Promise<void>;
}

/**
 * Message component type imported from local file
 */
interface SavedMessageComponentType {
    /**
     * Message component type
     */
    type: MessageComponentType;

    /**
     * The **execute()** method handles the interaction with the message component type.
     *
     * @param interaction The interaction to response to
     */
    execute(interaction: MessageComponentInteraction): Promise<void>;
}

/**
 * Role select component imported from local file
 */
interface SavedRoleSelectComponent extends SavedMessageComponent {
    /**
     * Type of the role select component
     */
    type: ComponentType.RoleSelect;

    /**
     * The **create()** method creates the role select component modified by the given options.
     *
     * @param interaction The interaction that caused the role select component to be created
     * @param options The options to modify the roles select component
     *
     * @returns The role select builder modified by the options
     */
    create(
        interaction: Interaction,
        options?: RoleSelectComponentCreateOptions,
    ): RoleSelectMenuBuilder;

    /**
     * The **execute()** method handles the response to the role select component interaction
     *
     * @param interaction The role select component interaction to response to
     */
    execute?(interaction: RoleSelectMenuInteraction): Promise<void>;
}

/**
 * String select component imported from local file
 */
interface SavedStringSelectComponent extends SavedMessageComponent {
    /**
     * Options of the string select component
     */
    options: string[];

    /**
     * Type of the string select component
     */
    type: ComponentType.StringSelect;

    /**
     * The **create()** method creates the string select component modified by the given options.
     *
     * @param interaction The interaction that caused the string select component to be created
     * @param options The options to modify the string select component
     *
     * @returns The string select builder modified by the options
     */
    create(
        interaction: Interaction,
        options?: StringSelectComponentCreateOptions,
    ): StringSelectMenuBuilder;

    /**
     * The **execute()** method handles the response to the string select component interaction
     *
     * @param interaction The string select component interaction to response to
     */
    execute?(interaction: StringSelectMenuInteraction): Promise<void>;
}

/**
 * Text input component imported from local file
 */
interface SavedTextInputComponent extends SavedComponent {
    /**
     * Type of the text input component
     */
    type: ComponentType.TextInput;

    /**
     * The **create()** method creates the text input component modified by the given options.
     *
     * @param interaction The interaction that caused the text input component to be created
     * @param options The options to modify the text input component
     *
     * @returns The text input component builder modified by the options
     */
    create(
        interaction: Interaction,
        options?: TextInputComponentCreateOptions,
    ): TextInputBuilder;
}

/**
 * User command imported from local file
 */
interface SavedUserCommand extends SavedApplicationCommand {
    /**
     * Data of the user command
     */
    data: ContextMenuCommandBuilder;

    /**
     * Type of the user command
     */
    type: ApplicationCommandType.User;

    /**
     * The **execute()** method handles the response to the user command interaction.
     *
     * @param interaction The interaction to respond to
     */
    execute(interaction: UserContextMenuCommandInteraction): Promise<void>;
}

/**
 * User select component imported from local file
 */
interface SavedUserSelectComponent extends SavedMessageComponent {
    /**
     * Type of the user select component
     */
    type: ComponentType.UserSelect;

    /**
     * The **create()** method creates the user select component modified by the given options.
     *
     * @param interaction The interaction that caused the user select component to be created
     * @param options The options to modify the user select component
     *
     * @returns The user select builder modified by the options
     */
    create(
        interaction: Interaction,
        options?: UserSelectComponentCreateOptions,
    ): UserSelectMenuBuilder;

    /**
     * The **execute()** method handles the response to the user select component interaction.
     *
     * @param interaction The user select component interaction to response to
     */
    execute?(interaction: UserSelectMenuInteraction): Promise<void>;
}

/**
 * Options that can be passed when creating a select component
 */
interface SelectComponentCreateOptions extends MessageComponentCreateOptions {
    /**
     * The maximal number of options that have to be chosen
     */
    maximalValues?: number;

    /**
     * The minimal number of options that have to be chosen
     */
    minimalValues?: number;

    /**
     * The text that is written in the select menu if it is empty
     */
    placeholder?: string;
}

/**
 * Options that can be passed when creating a string select component
 */
interface StringSelectComponentCreateOptions
    extends SelectComponentCreateOptions {}

/**
 * Options that can be passed when creating a text input component
 */
interface TextInputComponentCreateOptions extends ComponentCreateOptions {}

/**
 * Options that can be passed when creating a user select component
 */
interface UserSelectComponentCreateOptions
    extends SelectComponentCreateOptions {}
