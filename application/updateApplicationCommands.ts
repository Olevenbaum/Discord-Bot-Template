// Type imports
import { ApplicationCommand, Client, Collection, Routes } from "discord.js";

// Export lambda function
export default async (client: Client) => {
    // Check if client is ready
    if (!client.isReady()) {
        // Return
        return;
    }

    /**
     * Collection of registered application commands
     */
    const registeredApplicationCommands: Collection<
        string,
        ApplicationCommand
    > = new Collection();

    /**
     * Requested registered application commands from Discord
     */
    const rawRegisteredApplicationCommands = (await client.rest.get(
        Routes.applicationCommands(client.application.id),
    )) as ApplicationCommand[]; // TODO: Fix type

    // Iterate over requested registered application commands
    rawRegisteredApplicationCommands.forEach(
        (registeredApplicationCommand: ApplicationCommand) =>
            registeredApplicationCommands.set(
                registeredApplicationCommand.name,
                registeredApplicationCommand,
            ),
    );

    /**
     * Array of promises to be sent to Discord
     */
    const promises: Promise<any>[] = [];

    // Iterate over application commands imported from local files
    applicationCommands.each(
        (savedApplicationCommand, savedApplicationCommandName) => {
            /**
             * Registered application command matching the saved application command
             */
            const registeredApplicationCommand =
                registeredApplicationCommands.get(savedApplicationCommandName);

            // Check if application command is not registered
            if (!registeredApplicationCommand) {
                // Add request to promises
                promises.push(
                    client.rest
                        .post(
                            Routes.applicationCommands(client.application.id),
                            {
                                body: savedApplicationCommand.data.toJSON(),
                            },
                        )
                        .then(() => {
                            // Send notifications
                            sendNotification({
                                consoleOutput: `Successfully registered new application command '${savedApplicationCommandName}'`,
                                content: `Your bots new application command \`\`${savedApplicationCommandName}\`\` was registered successfully! Please note, that it can take some time that the application command can be used.`,
                                owner: client.application.owner,
                                type: "information",
                            });
                        })
                        .catch((error: Error) =>
                            // Send notifications
                            sendNotification({
                                consoleOutput: `Error registering new application command '${savedApplicationCommandName}'`,
                                content: `There was an error registering your bots application command \`\`${savedApplicationCommandName}\`\`!`,
                                error,
                                owner: client.application.owner,
                                type: "error",
                            }),
                        ),
                );
            } else if (
                !compareApplicationCommands(
                    registeredApplicationCommand,
                    savedApplicationCommand,
                )
            ) {
                // Add request to promises
                promises.push(
                    client.rest
                        .patch(
                            Routes.applicationCommand(
                                client.application.id,
                                registeredApplicationCommand.id,
                            ),
                            {
                                body: savedApplicationCommand.data.toJSON(),
                            },
                        )
                        .then(() => {
                            // Send notifications
                            sendNotification({
                                consoleOutput: `Successfully updated application command '${savedApplicationCommandName}'`,
                                content: `Your bots application command \`\`${savedApplicationCommandName}\`\` was updated successfully! Please not, that it can take some time that the application commands changes are active.`,
                                owner: client.application.owner,
                                type: "information",
                            });
                        })
                        .catch((error: Error) =>
                            // Send notifications
                            sendNotification({
                                consoleOutput: `Error updating application command '${savedApplicationCommandName}'`,
                                content: `There was an error registering your bots application command \`\`${savedApplicationCommandName}\`\`!`,
                                error,
                                owner: client.application.owner,
                                type: "error",
                            }),
                        ),
                );
            }
        },
    );

    // Iterate over registered application commands
    registeredApplicationCommands.each(
        (registeredApplicationCommand, registeredApplicationCommandName) => {
            // Check if application command still exists in local files
            if (!applicationCommands.has(registeredApplicationCommandName)) {
                // Add request to promises
                promises.push(
                    client.rest
                        .delete(
                            Routes.applicationCommand(
                                client.application.id,
                                registeredApplicationCommand.id,
                            ),
                        )
                        .then(() => {
                            // Send notifications
                            sendNotification({
                                consoleOutput: `Successfully unregistered old application command '${registeredApplicationCommandName}'`,
                                content: `Your bots old application command \`\`${registeredApplicationCommandName}\`\` was unregistered successfully! Please note, that it can take some time that the application command cannot be used anymore.`,
                                owner: client.application.owner,
                                type: "information",
                            });
                        })
                        .catch((error: Error) =>
                            // Send notifications
                            sendNotification({
                                consoleOutput: `Error unregistering old application command '${registeredApplicationCommandName}'`,
                                content: `There was an error unregistering your bots old application command \`\`${registeredApplicationCommandName}\`\`!`,
                                error,
                                owner: client.application.owner,
                                type: "error",
                            }),
                        ),
                );
            }
        },
    );

    // Send promises to Discord
    await Promise.all(promises).catch((error: Error) =>
        // Send notifications
        sendNotification({
            consoleOutput: `Error (un-)registering or updating application commands`,
            content: `There was an error (un-)registering or updating your bots application commands!`,
            error,
            owner: client.application.owner,
            type: "error",
        }),
    );

    // Check if any application commands were added, deleted or updated
    if (promises.length > 0) {
        // Send notifications
        sendNotification({
            consoleOutput: "Successfully refreshed all application commands",
            content: "Your bots application commands are now up to date!",
            owner: client.application.owner,
            type: "information",
        });
    } else {
        // Send notifications
        sendNotification({
            consoleOutput:
                "No new, changed or old application commands were found",
            content:
                "There were no application commands that needed to be (un-)registered or updated!",
            owner: client.application.owner,
            type: "information",
        });
    }
};
