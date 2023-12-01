// Import types
import { ApplicationCommand, Client, Collection, Routes } from "discord.js";

// Export module
module.exports = async (client: Client) => {
    // Check if client is ready
    if (!client.isReady()) {
        // Print error
        console.error("[ERROR]:", "Client not ready");

        // Return
        return;
    }

    // Define registered application commands collection
    const registeredApplicationCommands: Collection<
        string,
        ApplicationCommand
    > = new Collection();

    // Request registered application commands from Discord
    const rawRegisteredApplicationCommands = (await client.rest.get(
        Routes.applicationCommands(client.application?.id)
    )) as ApplicationCommand[];

    rawRegisteredApplicationCommands.forEach(
        (registeredApplicationCommand: ApplicationCommand) =>
            registeredApplicationCommands.set(
                registeredApplicationCommand.name,
                registeredApplicationCommand
            )
    );

    // Create array for requests to be sent to Discord
    const promises: Promise<any>[] = [];

    // Iterate over application commands
    global.applicationCommands.each(
        (savedApplicationCommand, savedApplicationCommandName) => {
            // Search for applicaiton command in registered application commands
            const registeredApplicationCommand =
                registeredApplicationCommands.get(savedApplicationCommandName);

            // Check if application command is not registered
            if (!registeredApplicationCommand) {
                // Add request for registration to promises
                promises.push(
                    client.rest
                        .post(
                            Routes.applicationCommands(client.application?.id),
                            {
                                body: savedApplicationCommand,
                            }
                        )
                        .then(() => {
                            // Print information
                            console.info(
                                "[INFORMATION]:",
                                `Successfully registered new application command '${savedApplicationCommandName}'`
                            );
                        })
                        .catch((error) =>
                            // Print error
                            console.error("[ERROR]:", error)
                        )
                );
            } else if (
                !global.compareApplicationCommands(
                    registeredApplicationCommand,
                    savedApplicationCommand
                )
            ) {
                // Add request for application command update to promises
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
                            // Print information
                            console.info(
                                "[INFORMATION]:",
                                `Successfully updated application command ${savedApplicationCommandName}`
                            );
                        })
                        .catch((error) =>
                            // Print error
                            console.error("[ERROR]:", error)
                        )
                );
            }
        }
    );

    // Iterate over registered application commands
    registeredApplicationCommands.each(
        (registeredApplicationCommand, registeredApplicationCommandName) => {
            // Check if application commmand still exists
            if (
                !client.applicationCommands.has(
                    registeredApplicationCommandName
                )
            ) {
                // Add request for deletion of application command to promises
                promises.push(
                    client.rest
                        .delete(
                            Routes.applicationCommand(
                                client.application?.id,
                                registeredApplicationCommand.id
                            )
                        )
                        .then(() => {
                            // Print information
                            console.info(
                                "[INFORMATION]:",
                                `Successfully deleted application command ${registeredApplicationCommandName}`
                            );
                        })
                        .catch((error) =>
                            // Print error
                            console.error("[ERROR]:", error)
                        )
                );
            }
        }
    );

    // Execute promises
    await Promise.all(promises).catch((error: Error) =>
        // Print error
        console.error("[ERROR]:", error)
    );

    // Check if any application commands were added, deleted or updated
    if (promises.length > 0) {
        // Print information
        console.info(
            "[INFORMATION]:",
            `Successfully updated all application commands`
        );
    } else {
        // Print information
        console.info(
            "[INFORMATION]:",
            `No commands to be updated, deleted or added were found`
        );
    }
};
