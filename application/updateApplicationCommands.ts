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
                                body: savedApplicationCommand,
                            },
                        )
                        .then(() => {
                            // Send notifications
                            sendNotification(
                                "information",
                                `Successfully registered new application command '${savedApplicationCommandName}'`,
                            );
                        })
                        .catch((error: Error) =>
                            // Send notifications
                            sendNotification("error", error),
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
                                body: savedApplicationCommand,
                            },
                        )
                        .then(() => {
                            // Send notifications
                            sendNotification(
                                "information",
                                `Successfully updated application command ${savedApplicationCommandName}`,
                            );
                        })
                        .catch((error: Error) =>
                            // Send notifications
                            sendNotification("error", error),
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
                            sendNotification(
                                "information",
                                `Successfully deleted application command ${registeredApplicationCommandName}`,
                            );
                        })
                        .catch((error: Error) =>
                            // Send notifications
                            sendNotification("error", error),
                        ),
                );
            }
        },
    );

    // Send promises to Discord
    await Promise.all(promises).catch((error: Error) =>
        // Send notifications
        sendNotification("error", error),
    );

    // Check if any application commands were added, deleted or updated
    if (promises.length > 0) {
        // Send notifications
        sendNotification(
            "information",
            "Successfully updated all application commands",
        );
    } else {
        // Send notifications
        sendNotification(
            "information",
            "No commands to be updated, deleted or added were found",
        );
    }
};
