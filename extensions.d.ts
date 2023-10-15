// Importing types
import { Collection } from "discord.js";
import { SavedApplicationCommand } from "./types";

declare module "discord.js" {
    interface Client {
        applicationCommands: Collection<string, SavedApplicationCommand>;
    }
}
