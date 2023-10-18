// Importing types
import {
    ApplicationCommand,
    ApplicationCommandOption,
    ApplicationCommandOptionType,
    Client,
    Collection,
    Routes,
} from "discord.js";
import { SavedApplicationCommand } from "../types";

// Defining function for comparison of registered and saved application command
const compareApplicationCommands = function (
    registeredApplicationCommand: ApplicationCommand,
    savedApplicationCommand: SavedApplicationCommand
) {
    // Defining default values
    const defaultValues = {
        default_member_permissions: null,
        dm_permission: true,
        nsfw: false,
    };

    // Adding application command type to saved application command data
    savedApplicationCommand.data["type"] = savedApplicationCommand.type;

    // Searching and sorting common keys
    const commonKeys = Object.keys(savedApplicationCommand.data)
        .filter((key) => key in registeredApplicationCommand)
        .sort();

    // Overwriting imported version of registered application command
    const owerwrittenRegisteredApplicationCommand = Object.fromEntries(
        commonKeys.map((key) => {
            // Checking for specific keys
            switch (key) {
                case "description_localizations" || "name_localizations":
                    // Defining entry
                    const entry = registeredApplicationCommand[key];

                    // Searching and sorting keys of entry
                    const keys = Object.keys(entry).sort();

                    // Returning sorted entry
                    return [
                        key,
                        Object.fromEntries(
                            keys.map((key) => [key, entry[key]])
                        ),
                    ];

                case "options":
                    // Transforming application command options
                    return transformApplicationCommandOptions(
                        registeredApplicationCommand[key],
                        true
                    );

                default:
                    // Returning entry
                    return [key, registeredApplicationCommand[key]];
            }
        })
    );

    // Overwriting saved application command
    const owerwrittenSavedApplicationCommand = Object.fromEntries(
        commonKeys.map((key) => {
            // Checking for specific keys
            switch (key) {
                case "description_localizations" || "name_localizations":
                    // Defining entry
                    const entry = savedApplicationCommand.data[key];

                    // Searching and sorting keys of entry
                    const keys = Object.keys(entry).sort();

                    // Returning sorted entry
                    return [
                        key,
                        Object.fromEntries(
                            keys.map((key) => [key, entry[key]])
                        ),
                    ];

                case "options":
                    // Returning transformed application command options
                    return transformApplicationCommandOptions(
                        savedApplicationCommand.data[key]
                    );

                default:
                    // Returning entry
                    return [
                        key,
                        savedApplicationCommand.data[key] ?? defaultValues[key],
                    ];
            }
        })
    );

    // Returning comparison
    return (
        JSON.stringify(owerwrittenRegisteredApplicationCommand) ===
        JSON.stringify(owerwrittenSavedApplicationCommand)
    );
};

// Defining function for transforming application command options
const transformApplicationCommandOptions = function (
    applicationCommandOptions: ApplicationCommandOption[],
    registered = false
) {
    // Defining default option values
    const defaultOptionValues = { required: false };

    // Returning edited options
    return [
        "options",
        applicationCommandOptions.map((option) => {
            // Searching keys of option
            const keys = Object.keys(option).filter(
                (key) => typeof option[key] !== "undefined"
            );

            // Checking for option type
            if (option.type > ApplicationCommandOptionType.SubcommandGroup) {
                // Iterating over keys of default option values
                Object.keys(defaultOptionValues).forEach((key) => {
                    // Checking for key in keys
                    if (!keys.includes(key)) {
                        // Adding default option value to keys
                        keys.push(key);
                    }
                });
            }

            // Checking if option contains type
            if (!keys.includes("type")) {
                // Adding type to keys
                keys.push("type");
            }

            // Sorting keys
            keys.sort();

            // Returning sorted option
            return Object.fromEntries(
                keys.map((key) => {
                    // Checking for specific keys
                    switch (key) {
                        case "channel_types":
                            // Returning sorted entry
                            return [key, option[key].sort()];

                        case "choices":
                            // Returning edited entry
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
                                        // Searching and sorting keys of choice
                                        const keys = Object.keys(choice).sort();

                                        // Returning sorted choices
                                        return Object.fromEntries(
                                            keys.map((key) => {
                                                // Checking for specific key
                                                switch (key) {
                                                    case "name_localization":
                                                        // Defining entry
                                                        const entry: {
                                                            [
                                                                key: string
                                                            ]: string;
                                                        } = choice[key];

                                                        // Searching and sorting keys of entry
                                                        const keys =
                                                            Object.keys(
                                                                entry
                                                            ).sort();

                                                        // Returning sorted entry
                                                        return [
                                                            key,
                                                            Object.fromEntries(
                                                                keys.map(
                                                                    (key) => [
                                                                        key,
                                                                        entry[
                                                                            key
                                                                        ],
                                                                    ]
                                                                )
                                                            ),
                                                        ];

                                                    default:
                                                        // Returning entry
                                                        return [
                                                            key,
                                                            choice[key],
                                                        ];
                                                }
                                            })
                                        );
                                    }
                                ),
                            ];

                        case "description_localizations" ||
                            "name_localizations":
                            // Defining entry
                            const entry: {
                                [key: string]: string;
                            } = option[key];

                            // Searching and sorting keys of entry
                            const keys = Object.keys(entry).sort();

                            // Returning sorted entry
                            return [
                                key,
                                Object.fromEntries(
                                    keys.map((key) => [key, entry[key]])
                                ),
                            ];

                        case "options":
                            // Transform options
                            return transformApplicationCommandOptions(
                                option[key],
                                registered
                            );

                        case "type":
                            // Checking for value of type
                            if (option[key]) {
                                return [key, option[key]];
                            } else {
                                // Checking if any option has options
                                if (Object.keys(option).includes("options")) {
                                    // Checking if any option has type
                                    if (
                                        option["options"].some(
                                            (
                                                option: ApplicationCommandOption
                                            ) =>
                                                Object.keys(option).includes(
                                                    key
                                                )
                                        )
                                    ) {
                                        return [
                                            key,
                                            ApplicationCommandOptionType.Subcommand,
                                        ];
                                    } else {
                                        return [
                                            key,
                                            ApplicationCommandOptionType.SubcommandGroup,
                                        ];
                                    }
                                } else {
                                    return [
                                        key,
                                        ApplicationCommandOptionType.Subcommand,
                                    ];
                                }
                            }

                        default:
                            // Returning entry
                            return [
                                key,
                                option[key] ?? defaultOptionValues[key],
                            ];
                    }
                })
            );
        }),
    ];
};

module.exports = async (client: Client) => {
    // Defining registered application commands collection
    const registeredApplicationCommands: Collection<
        string,
        ApplicationCommand
    > = new Collection();

    // Requesting registered application commands from Discord
    (
        await client.rest.get(
            Routes.applicationCommands(client.application?.id)
        )
    ).forEach((registeredApplicationCommand: ApplicationCommand) =>
        registeredApplicationCommands.set(
            registeredApplicationCommand.name,
            registeredApplicationCommand
        )
    );

    // Creating array for requests to be sent to Discord
    const promises: Promise<any>[] = [];

    // Iterating over application commands
    client.applicationCommands.each(
        (savedApplicationCommand, savedApplicationCommandName) => {
            // Searching for applicaiton command in registered application commands
            const registeredApplicationCommand =
                registeredApplicationCommands.get(savedApplicationCommandName);

            // Checking if application command is not registered
            if (!registeredApplicationCommand) {
                // Adding request for registration to promises
                promises.push(
                    client.rest
                        .post(
                            Routes.applicationCommands(client.application?.id),
                            {
                                body: savedApplicationCommand,
                            }
                        )
                        .then(() => {
                            // Printing information
                            console.info(
                                "[INFORMATION]:",
                                `Successfully registered new application command '${savedApplicationCommandName}'`
                            );
                        })
                        .catch((error) =>
                            // Printing error
                            console.error("[ERROR]:", error)
                        )
                );
            } else if (
                !compareApplicationCommands(
                    registeredApplicationCommand,
                    savedApplicationCommand
                )
            ) {
                // Adding request for application command update to promises
                promises.push(
                    client.rest
                        .patch(
                            Routes.applicationCommand(
                                client.application?.id,
                                registeredApplicationCommand.id
                            ),
                            {
                                body: savedApplicationCommand,
                            }
                        )
                        .then(() => {
                            // Printing information
                            console.info(
                                "[INFORMATION]:",
                                `Successfully updated application command ${savedApplicationCommandName}`
                            );
                        })
                        .catch((error) =>
                            // Printing error
                            console.error("[ERROR]:", error)
                        )
                );
            }
        }
    );

    // Iterating over registered application commands
    registeredApplicationCommands.each(
        (registeredApplicationCommand, registeredApplicationCommandName) => {
            // Checking if application commmand still exists
            if (
                !client.applicationCommands.has(
                    registeredApplicationCommandName
                )
            ) {
                // Adding request for deletion of application command to promises
                promises.push(
                    client.rest
                        .delete(
                            Routes.applicationCommand(
                                client.application?.id,
                                registeredApplicationCommand.id
                            )
                        )
                        .then(() => {
                            // Printing information
                            console.info(
                                "[INFORMATION]:",
                                `Successfully deleted application command ${registeredApplicationCommandName}`
                            );
                        })
                        .catch((error) =>
                            // Printing error
                            console.error("[ERROR]:", error)
                        )
                );
            }
        }
    );

    // Executing promises
    await Promise.all(promises).catch((error) =>
        // Printing error
        console.error("[ERROR]:", error)
    );

    // Checking if any application commands were added, deleted or updated
    if (promises.length > 0) {
        // Printing information
        console.info(
            "[INFORMATION]:",
            `Successfully updated all application commands`
        );
    } else {
        // Printing information
        console.info(
            "[INFORMATION]:",
            `No commands to be updated, deleted or added were found`
        );
    }
};
