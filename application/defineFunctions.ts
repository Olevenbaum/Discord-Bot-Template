// Import types
import {
    ApplicationCommandOption,
    ApplicationCommandOptionType,
    Interaction,
    Team,
    User,
} from "discord.js";

// Import configuration data
import configuration from "configuration.json";

//Export module
module.exports = () => {
    // Define asynchronous prototype find function for array
    Array.prototype.asynchronousFind = async function <Element>(
        predicate: (
            element: Element,
            key: number,
            array: Element[],
        ) => Promise<boolean>,
        thisArg: any = null,
    ): Promise<Element | undefined> {
        // Bind second argument to callback function
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

    // Define prototype rotate function for arrays
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

    // Define function for comparison of registered and saved application commands
    global.compareApplicationCommands = function (
        registeredApplicationCommand,
        savedApplicationCommand,
    ) {
        // Define default values
        const defaultValues = {
            default_member_permissions: null,
            dm_permission: true,
            nsfw: false,
        };

        // Add application command type to saved application command data
        savedApplicationCommand.data.type = savedApplicationCommand.type;

        // Search and sort common keys
        const commonKeys = Object.keys(savedApplicationCommand.data)
            .filter((key) => key in registeredApplicationCommand)
            .sort();

        // Overwrite imported version of registered application command
        const overwrittenRegisteredApplicationCommand = Object.fromEntries(
            commonKeys.map((key) => {
                // Check for specific keys
                switch (key) {
                    case "descriptionLocalizations" || "nameLocalizations":
                        // Define entry
                        const entry = registeredApplicationCommand[key];

                        // Search and sort keys of entry
                        const keys = Object.keys(entry).sort();

                        // Return sorted entry
                        return [
                            key,
                            Object.fromEntries(
                                keys.map((key) => [key, entry[key]]),
                            ),
                        ];

                    case "options":
                        // Transform application command options
                        return transformApplicationCommandOptions(
                            registeredApplicationCommand[key],
                            true,
                        );

                    default:
                        // Return entry
                        return [key, registeredApplicationCommand[key]];
                }
            }),
        );

        // Overwrite saved application command
        const overwrittenSavedApplicationCommand = Object.fromEntries(
            commonKeys.map((key) => {
                // Check for specific keys
                switch (key) {
                    case "descriptionLocalizations" || "nameLocalizations":
                        // Define entry
                        const entry = savedApplicationCommand.data[key];

                        // Search and sort keys of entry
                        const keys = Object.keys(entry).sort();

                        // Return sorted entry
                        return [
                            key,
                            Object.fromEntries(
                                keys.map((key) => [key, entry[key]]),
                            ),
                        ];

                    case "options":
                        // Return transformed application command options
                        return transformApplicationCommandOptions(
                            savedApplicationCommand.data[key],
                        );

                    default:
                        // Return entry
                        return [
                            key,
                            savedApplicationCommand.data[key] ??
                                defaultValues[key],
                        ];
                }
            }),
        );

        // Return comparison
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

        // Return whether object includes all keys of type
        return keys.reduce((impl, key) => impl && key in object, true);
    };

    // Define function to send notification to one or multiple users and print to the console
    global.sendNotification = async function (
        type: "error" | "information" | "warning",
        content: string | Error,
        message: string = typeof content === "string"
            ? content
            : "An error occurred!",
        interaction?: Interaction,
        sendToInteractionCreator: boolean = typeof configuration.notifications !==
        "boolean"
            ? configuration.notifications.defaultSendToInteractionCreator ??
              true
            : true,
    ) {
        // Check which type of notification should be printed
        switch (type) {
            case "error":
                // Print error
                console.error("[ERROR]:", content);

                // Break
                break;

            case "information":
                // Print information
                console.info("[INFORMATION]:", content);

                // Break
                break;

            case "warning":
                // Print warning
                console.warn("[WARNING]:", content);

                // Break
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
                // Send follow-up error message
                await interaction.followUp({
                    content: message,
                    ephemeral: true,
                });
            } else {
                // Send error message
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

    // Define function for transform application command options
    global.transformApplicationCommandOptions = function (
        applicationCommandOptions,
        registered = false,
    ) {
        // Define default option values
        const defaultOptionValues = { required: false };

        // Return edited options
        return [
            "options",
            applicationCommandOptions.map((option) => {
                // Search keys of option
                const keys = Object.keys(option).filter(
                    (key) => typeof option[key] !== "undefined",
                );

                // Check for option type
                if (
                    option.type > ApplicationCommandOptionType.SubcommandGroup
                ) {
                    // Iterate over keys of default option values
                    Object.keys(defaultOptionValues).forEach((key) => {
                        // Check for key in keys
                        if (!keys.includes(key)) {
                            // Add default option value to keys
                            keys.push(key);
                        }
                    });
                }

                // Check if option contains type
                if (!keys.includes("type")) {
                    // Add type to keys
                    keys.push("type");
                }

                // Sort keys
                keys.sort();

                // Return sorted option
                return Object.fromEntries(
                    keys.map((key) => {
                        // Check for specific keys
                        switch (key) {
                            case "channel_types":
                                // Return sorted entry
                                return [key, option[key].sort()];

                            case "choices":
                                // Return edited entry
                                return [
                                    key,
                                    option[key].map(
                                        (choice: {
                                            name: string;
                                            name_localizations: {
                                                [key: string]: string;
                                            };
                                            value: string | number;
                                        }) => {
                                            // Search and sort keys of choice
                                            const keys =
                                                Object.keys(choice).sort();

                                            // Return sorted choices
                                            return Object.fromEntries(
                                                keys.map((key) => {
                                                    // Check for specific key
                                                    switch (key) {
                                                        case "name_localization":
                                                            // Define entry
                                                            const entry: {
                                                                [
                                                                    key: string
                                                                ]: string;
                                                            } = choice[key];

                                                            // Search and sort keys of entry
                                                            const keys =
                                                                Object.keys(
                                                                    entry,
                                                                ).sort();

                                                            // Return sorted entry
                                                            return [
                                                                key,
                                                                Object.fromEntries(
                                                                    keys.map(
                                                                        (
                                                                            key,
                                                                        ) => [
                                                                            key,
                                                                            entry[
                                                                                key
                                                                            ],
                                                                        ],
                                                                    ),
                                                                ),
                                                            ];

                                                        default:
                                                            // Return entry
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

                            case "descriptionLocalizations" ||
                                "nameLocalizations":
                                // Define entry
                                const entry: {
                                    [key: string]: string;
                                } = option[key];

                                // Search and sort keys of entry
                                const keys = Object.keys(entry).sort();

                                // Return sorted entry
                                return [
                                    key,
                                    Object.fromEntries(
                                        keys.map((key) => [key, entry[key]]),
                                    ),
                                ];

                            case "options":
                                // Transform options
                                return transformApplicationCommandOptions(
                                    option[key],
                                    registered,
                                );

                            case "type":
                                // Check for value of type
                                if (option[key]) {
                                    return [key, option[key]];
                                } else {
                                    // Check if any option has options
                                    if (
                                        Object.keys(option).includes("options")
                                    ) {
                                        // Check if any option has type
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
                                            // Return entry
                                            return [
                                                key,
                                                ApplicationCommandOptionType.Subcommand,
                                            ];
                                        } else {
                                            // Return entry
                                            return [
                                                key,
                                                ApplicationCommandOptionType.SubcommandGroup,
                                            ];
                                        }
                                    } else {
                                        // Return entry
                                        return [
                                            key,
                                            ApplicationCommandOptionType.Subcommand,
                                        ];
                                    }
                                }

                            default:
                                // Return entry
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
