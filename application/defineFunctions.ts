// Type imports
import {
    ApplicationCommandOption,
    ApplicationCommandOptionType,
    Interaction,
    Team,
    User,
} from "discord.js";

// Configuration data import
import configuration from "configuration.json";

// Export lambda function
export default () => {
    Array.prototype.asynchronousFind = async function <Element>(
        predicate: (
            element: Element,
            key: number,
            array: Element[],
        ) => Promise<boolean>,
        thisArg: any = null,
    ): Promise<Element | undefined> {
        /**
         * Predicate with replaced "this" object
         */
        const boundPredicate: (
            element: Element,
            key: number,
            thisArg: any,
        ) => Promise<boolean> = predicate.bind(thisArg);

        // Iterate over keys of array
        for (const key of this.keys()) {
            // Check if callback function returns true for element
            if (await boundPredicate(this.at(key), key, this)) {
                // Return element
                return this.at(key);
            }
        }

        // Return undefined
        return undefined;
    };

    Array.prototype.rotate = function <Element>(
        counter: number = 1,
        reverse: boolean = false,
    ): Element[] {
        // Reduce counter
        counter %= this.length;

        // Check if direction is reversed
        if (reverse) {
            // Rotate array clockwise
            this.push(...this.splice(0, this.length - counter));
        } else {
            // Rotate array counterclockwise
            this.unshift(...this.splice(counter, this.length));
        }

        // Return array
        return this;
    };

    global.compareApplicationCommands = function (
        registeredApplicationCommand,
        savedApplicationCommand,
    ) {
        /**
         * Default values for Discord application commands
         */
        const defaultValues = {
            default_member_permissions: null,
            dm_permission: true,
            nsfw: false,
        };

        // Add type to application command imported from local file
        savedApplicationCommand.data.type = savedApplicationCommand.type;

        /**
         * Keys that are present in the registered and saved application command
         */
        const commonKeys = Object.keys(savedApplicationCommand.data)
            .filter((key) => key in registeredApplicationCommand)
            .sort();

        /**
         * Registered application command with sorted and formatted structure
         */
        const overwrittenRegisteredApplicationCommand = Object.fromEntries(
            commonKeys.map((key) => {
                // Differentiate between specific keys
                switch (key) {
                    case "descriptionLocalizations" || "nameLocalizations":
                        /**
                         * Value of the value key pair of the registered application command
                         */
                        const value = registeredApplicationCommand[key];

                        /**
                         * All keys of the registered application command in alphabetically sorted order
                         */
                        const keys = Object.keys(value).sort();

                        // Return key-value pair
                        return [
                            key,
                            Object.fromEntries(
                                keys.map((key) => [key, value[key]]),
                            ),
                        ];

                    case "options":
                        // Return transformed application command's options
                        return transformApplicationCommandOptions(
                            registeredApplicationCommand[key],
                            true,
                        );

                    default:
                        // Return key-value pair
                        return [key, registeredApplicationCommand[key]];
                }
            }),
        );

        /**
         * Saved application command with sorted and formatted structure
         */
        const overwrittenSavedApplicationCommand = Object.fromEntries(
            commonKeys.map((key) => {
                // Differentiate between specific keys
                switch (key) {
                    case "descriptionLocalizations" || "nameLocalizations":
                        /**
                         * Value of the value key pair of the saved application command
                         */
                        const value = savedApplicationCommand.data[key];

                        /**
                         * All keys of the saved application command in alphabetically sorted order
                         */
                        const keys = Object.keys(value).sort();

                        // Return key-value pair
                        return [
                            key,
                            Object.fromEntries(
                                keys.map((key) => [key, value[key]]),
                            ),
                        ];

                    case "options":
                        // Return transformed application command's options
                        return transformApplicationCommandOptions(
                            savedApplicationCommand.data[key],
                        );

                    default:
                        // Return key-value pair
                        return [
                            key,
                            savedApplicationCommand.data[key] ??
                                defaultValues[key],
                        ];
                }
            }),
        );

        // Return whether the application commands are identical
        return (
            JSON.stringify(overwrittenRegisteredApplicationCommand) ===
            JSON.stringify(overwrittenSavedApplicationCommand)
        );
    };

    global.isFromType = function <Type>(
        object: any,
        keys: (keyof Type)[],
    ): object is Type {
        // Check if object and keys of type exist
        if (!(object && Array.isArray(keys))) {
            // Return false
            return false;
        }

        // Return whether object has all given keys of type
        return keys.reduce(
            (implemented, key) => implemented && key in object,
            true,
        );
    };

    // TODO: comments
    global.sendNotification = async function (
        type: "error" | "information" | "warning",
        content: string | Error,
        message: string = typeof content === "string"
            ? content
            : "An error occurred!",
        interaction?: Interaction,
        sendToInteractionCreator: boolean = false,
    ) {
        // Check which type of notification should be printed
        switch (type) {
            case "error":
                console.error("[ERROR]:", content);

                break;

            case "information":
                console.info("[INFORMATION]:", content);

                break;

            case "warning":
                console.warn("[WARNING]:", content);

                break;
        }

        // Check if message should be sent to interaction creator
        if (
            interaction &&
            sendToInteractionCreator &&
            !interaction.isAutocomplete()
        ) {
            // Check if application command interaction was acknowledged
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    content: message,
                    ephemeral: true,
                });
            } else {
                await interaction.reply({
                    content: message,
                    ephemeral: true,
                });
            }
        }

        // Check if notifications are enabled (for this type)
        if (configuration.notifications) {
            // Save notifications as own variable
            const notifications = configuration.notifications;

            // Check if notification type should be sent
            if (
                typeof notifications === "boolean" ||
                !("notificationType" in notifications) ||
                type in notifications.notificationType
            ) {
                // Save owner of bot
                const owner: User | Team = interaction.client.application.owner;

                // Send message to owner
                await (owner instanceof User ? owner : owner.owner.user).send(
                    message,
                );

                // Check if team members should receive notifications
                if (
                    owner instanceof Team &&
                    (typeof notifications === "boolean" ||
                        ("enableTeamNotifications" in notifications &&
                            notifications.enableTeamNotifications))
                ) {
                    // Iterate over team members
                    for (const [teamMemberId, teamMember] of owner.members) {
                        // Check if team member wants to receive messages
                        if (
                            typeof notifications !== "boolean" &&
                            (typeof notifications.teamNotifications ===
                                "boolean" ||
                                ("excludeMembers" in
                                    notifications.teamNotifications &&
                                    !notifications.teamNotifications.excludeMembers.includes(
                                        teamMemberId,
                                    )))
                        ) {
                            // Send message to team member
                            await teamMember.user.send(message);
                        }
                    }
                }
            }
        }
    };

    global.transformApplicationCommandOptions = function (
        applicationCommandOptions,
        registered = false,
    ) {
        /**
         * Default values for Discord application command options
         */
        const defaultOptionValues = { required: false };

        // Return transformed application command's options
        return [
            "options",
            applicationCommandOptions.map((option) => {
                /**
                 * Keys of the application command option that have a defined value
                 */
                const keys = Object.keys(option).filter(
                    (key) => typeof option[key] !== "undefined",
                );

                // Compare option type
                if (
                    option.type > ApplicationCommandOptionType.SubcommandGroup
                ) {
                    // Iterate over keys of default options
                    Object.keys(defaultOptionValues).forEach((key) => {
                        // Check if key is included in keys
                        if (!keys.includes(key)) {
                            // Add key to keys
                            keys.push(key);
                        }
                    });
                }

                // Check if keys contain key "type"
                if (!keys.includes("type")) {
                    // Add key "type" to keys
                    keys.push("type");
                }

                // Sort keys
                keys.sort();

                // Return application command's options
                return Object.fromEntries(
                    keys.map((key) => {
                        // Differentiate between specific keys
                        switch (key) {
                            case "channel_types":
                                // Return sorted channel types
                                return [key, option[key].sort()];

                            case "choices":
                                // Return choices
                                return [
                                    key,
                                    option[key].map(
                                        (choice: {
                                            name: string;
                                            name_localizations?: {
                                                [key: string]: string;
                                            };
                                            value: string | number;
                                        }) => {
                                            /**
                                             * Keys of choice option
                                             */
                                            const keys =
                                                Object.keys(choice).sort();

                                            // Return choice
                                            return Object.fromEntries(
                                                keys.map((key) => {
                                                    // Differentiate between specific key
                                                    switch (key) {
                                                        case "name_localization":
                                                            /**
                                                             * Value of the key value pair of the application command option
                                                             */
                                                            const value =
                                                                choice[key];

                                                            /**
                                                             * Sorted keys of the application command option
                                                             */
                                                            const keys =
                                                                Object.keys(
                                                                    value,
                                                                ).sort();

                                                            // Return name localization
                                                            return [
                                                                key,
                                                                Object.fromEntries(
                                                                    keys.map(
                                                                        (
                                                                            key,
                                                                        ) => [
                                                                            key,
                                                                            value[
                                                                                key
                                                                            ],
                                                                        ],
                                                                    ),
                                                                ),
                                                            ];

                                                        default:
                                                            // Return key-value pair
                                                            return [
                                                                key,
                                                                choice[key],
                                                            ];
                                                    }
                                                }),
                                            );
                                        },
                                    ),
                                ];

                            case "description_localizations" ||
                                "name_localizations":
                                /**
                                 * Value of the key value pair of the application command option
                                 */
                                const entry: {
                                    [key: string]: string;
                                } = option[key];

                                /**
                                 * Sorted keys of the application command option
                                 */
                                const keys = Object.keys(entry).sort();

                                // Return sorted localizations
                                return [
                                    key,
                                    Object.fromEntries(
                                        keys.map((key) => [key, entry[key]]),
                                    ),
                                ];

                            case "options":
                                // Return transformed application command's options
                                return transformApplicationCommandOptions(
                                    option[key],
                                    registered,
                                );

                            case "type":
                                // Check if value of key exists
                                if (option[key]) {
                                    // Return type
                                    return [key, option[key]];
                                } else {
                                    // Check if any option has options
                                    if (
                                        Object.keys(option).includes("options")
                                    ) {
                                        // Check if any option has the value "type"
                                        if (
                                            option["options"].some(
                                                (
                                                    option: ApplicationCommandOption,
                                                ) =>
                                                    Object.keys(
                                                        option,
                                                    ).includes(key),
                                            )
                                        ) {
                                            // Return type
                                            return [
                                                key,
                                                ApplicationCommandOptionType.Subcommand,
                                            ];
                                        } else {
                                            // Return type
                                            return [
                                                key,
                                                ApplicationCommandOptionType.SubcommandGroup,
                                            ];
                                        }
                                    } else {
                                        // Return type
                                        return [
                                            key,
                                            ApplicationCommandOptionType.Subcommand,
                                        ];
                                    }
                                }

                            default:
                                // Return key-value pair
                                return [
                                    key,
                                    option[key] ?? defaultOptionValues[key],
                                ];
                        }
                    }),
                );
            }),
        ];
    };
};
