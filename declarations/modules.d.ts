// Interface for application data
interface Application {
    applicationId: string;
    publicKey: string;
    token: string;
}

// Interface for configuration data
interface Configuration {
    // Array of the provided bots
    applications: Application[];
    // Whether the next available bot should be started when token gets refused
    enableApplicationIteration?: boolean;
    // Whether the list of IDs of blocked users should be active
    enableBlockedUsers?: boolean;
    // Whether the owner (or team members) should receive messages about the bots status
    notifications?: boolean | Notifications;
}

// Interface for notification options
interface Notifications {
    // Whether the message is sent to the interaction creator by default
    defaultSendToInteractionCreator?: boolean;
    // Types of events that should be sent as notification
    notificationType?: ("error" | "information" | "warning")[];
    // Whether team members should receive notifications
    teamNotifications?: boolean | TeamNotifications;
}

// Interface for team notifications
interface TeamNotifications {
    // Array of the excluded team members who do not want or should not to receive messages
    excludeMembers?: string[];
}

// Module to export configuration data
declare module "configuration.json" {
    const value: Configuration;
    export default value;
}
