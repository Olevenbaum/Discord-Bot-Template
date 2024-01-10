// Declare configuration data module
declare module "configuration.json" {
    import { Snowflake } from "discord.js";

    /**
     * Bot saved in the data of the configuration file
     */
    interface Application {
        applicationId: Snowflake;
        publicKey: string;
        token: string;
    }

    /**
     * Data saved in the configuration file
     */
    interface Configuration {
        /**
         * Provided bot or array of the provided bots if there are multiple bots
         */
        applications: Application | Application[];

        /**
         * Whether the next available bot should be started when token gets refused
         */
        enableApplicationIteration?: boolean;

        /**
         * Whether the list of IDs of blocked users should be active
         */
        enableBlockedUsers?: boolean;

        /**
         * Whether bots can interact with this bot
         */
        enableBotInteraction?: boolean;

        /**
         * Whether the owner (or team members) should receive messages about the bots status
         */
        notifications?: boolean | Notifications;
    }

    /**
     * Notification options saved in the data of the configuration file
     */
    interface Notifications {
        /**
         * Whether the message is sent to the interaction creator by default
         */
        defaultSendToInteractionCreator?: boolean;

        /**
         * Types of events that should be sent as notification
         */
        notificationType?: ("error" | "information" | "warning")[];

        /**
         * Priority that is important enough to cause notifications being sent over Discord
         */
        priority?: number;

        /**
         * Whether team members should receive notifications
         */
        teamNotifications?: boolean | TeamNotifications;
    }

    /**
     * Team notification options saved in the notification options of the data of the configuration file
     */
    interface TeamNotifications {
        /**
         * Array of the excluded team members who do not want to or should not receive messages
         */
        excludeMembers?: string[];
    }

    /**
     * Configuration data
     */
    const configuration: Configuration;

    // Export module data
    export = configuration;
}
