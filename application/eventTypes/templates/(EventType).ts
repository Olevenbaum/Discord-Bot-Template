// Importing types
import { Events } from "discord.js";
import { SavedEventType } from "../../../types";

module.exports = {
    // Defining event kind and type
    once: false,
    type:
        Events.ApplicationCommandPermissionsUpdate |
        Events.AutoModerationActionExecution |
        Events.AutoModerationRuleCreate |
        Events.AutoModerationRuleDelete |
        Events.AutoModerationRuleUpdate |
        Events.CacheSweep |
        Events.ChannelCreate |
        Events.ChannelDelete |
        Events.ChannelPinsUpdate |
        Events.ChannelUpdate |
        Events.ClientReady |
        Events.Debug |
        Events.Error |
        Events.GuildAuditLogEntryCreate |
        Events.GuildAvailable |
        Events.GuildBanAdd |
        Events.GuildBanRemove |
        Events.GuildDelete |
        Events.GuildEmojiCreate |
        Events.GuildEmojiDelete |
        Events.GuildEmojiUpdate |
        Events.GuildIntegrationsUpdate |
        Events.GuildMemberAdd |
        Events.GuildMemberAvailable |
        Events.GuildMemberRemove |
        Events.GuildMemberUpdate |
        Events.GuildMembersChunk |
        Events.GuildRoleCreate |
        Events.GuildRoleDelete |
        Events.GuildRoleUpdate |
        Events.GuildScheduledEventCreate |
        Events.GuildScheduledEventDelete |
        Events.GuildScheduledEventUpdate |
        Events.GuildScheduledEventUserAdd |
        Events.GuildStickerCreate |
        Events.GuildStickerDelete |
        Events.GuildStickerUpdate |
        Events.InteractionCreate |
        Events.Invalidated |
        Events.InviteCreate |
        Events.InviteDelete |
        Events.MessageBulkDelete |
        Events.MessageCreate |
        Events.MessageDelete |
        Events.MessageReactionAdd |
        Events.MessageReactionRemove |
        Events.MessageReactionRemoveAll |
        Events.MessageReactionRemoveEmoji |
        Events.MessageUpdate |
        Events.PresenceUpdate |
        Events.Raw |
        Events.ShardDisconnect |
        Events.ShardError |
        Events.ShardReady |
        Events.ShardReconnecting |
        Events.ShardResume |
        Events.StageInstanceCreate |
        Events.StageInstanceDelete |
        Events.StageInstanceUpdate |
        Events.ThreadCreate |
        Events.ThreadDelete |
        Events.ThreadListSync |
        Events.ThreadMemberUpdate |
        Events.ThreadMembersUpdate |
        Events.ThreadUpdate |
        Events.TypingStart |
        Events.UserUpdate |
        Events.VoiceServerUpdate |
        Events.VoiceStateUpdate |
        Events.Warn |
        Events.WebhooksUpdate,

    // Handling event
    async execute(interaction) {},
} as SavedEventType;
