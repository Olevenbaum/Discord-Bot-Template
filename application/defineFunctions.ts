// Import types
import {
    ApplicationCommandOption,
    ApplicationCommandOptionType,
} from "discord.js";

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
        savedApplicationCommand.data["type"] = savedApplicationCommand.type;

        // Search and sort common keys
        const commonKeys = Object.keys(savedApplicationCommand.data)
            .filter((key) => key in registeredApplicationCommand)
            .sort();

        // Overwrite imported version of registered application command
        const overwrittenRegisteredApplicationCommand = Object.fromEntries(
            commonKeys.map((key) => {
                // Check for specific keys
                switch (key) {
                    case "description_localizations" || "name_localizations":
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

        // Overwrite saved application command
        const overwrittenSavedApplicationCommand = Object.fromEntries(
            commonKeys.map((key) => {
                // Check for specific keys
                switch (key) {
                    case "description_localizations" || "name_localizations":
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

                            case "description_localizations" ||
                                "name_localizations":
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
