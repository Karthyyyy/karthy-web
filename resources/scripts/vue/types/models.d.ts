/**
 * This file is auto generated using 'php artisan typescript:generate'
 *
 * Changes to this file will be lost when the command is run again
 */

declare namespace App.Models {
    export interface DiscordServers {
        id: number;
        user_id: number;
        discord_server_id: string;
        server_name: string;
        created_at: string;
        updated_at: string;
    }

    export interface GamesAnagramsUserStats {
        id: number;
        created_at: string | null;
        updated_at: string | null;
        user_id: number | null;
        platform: string;
        platform_user_id: string;
        platform_user_name: string;
        total_xp: number;
    }

    export interface GamesWordsList {
        id: number;
        word: string;
        char_count: Array<any> | any;
        created_at: string | null;
        updated_at: string | null;
        anagrams_word_stats?: App.Models.GamesAnagramsWordStats | null;
    }

    export interface UserBrowserSource {
        id: string;
        created_at: string | null;
        updated_at: string | null;
        user_id: number;
        name: string;
        contents: Array<any> | any;
        user?: App.Models.User | null;
    }

    export interface User {
        id: number;
        username: string;
        email: string;
        email_verified_at: string | null;
        password: string;
        remember_token: string | null;
        created_at: string | null;
        updated_at: string | null;
        user_browser_source?: Array<App.Models.UserBrowserSource> | null;
        user_browser_source_count?: number | null;
    }

    export interface GamesAnagramsWordStats {
        word_id: number;
        as_master_total_count: number;
        as_master_average_percentage_found: number;
        as_anagram_total_count: number;
        as_anagram_total_found: number;
        worth_xp: number;
        created_at: string | null;
        updated_at: string | null;
        games_words_list?: App.Models.GamesWordsList | null;
    }

    export interface DiscordChannelPermissionTypes {
        id: number;
        name: string;
        description: string;
        created_at: string;
        updated_at: string;
    }

    export interface DiscordChannels {
        id: number;
        user_id: number;
        server_id: number;
        discord_channel_id: string;
        description: string;
        created_at: string;
        updated_at: string;
        discord_servers?: App.Models.DiscordServers | null;
    }

    export interface DiscordChannelPermissions {
        id: number;
        discord_channels_id: number;
        discord_channel_permission_types_id: number;
        has_permission: boolean;
        created_at: string;
        updated_at: string;
        discord_channels?: App.Models.DiscordChannels | null;
        discord_channel_permission_types?: App.Models.DiscordChannelPermissionTypes | null;
    }

    export interface AppLevels {
        level: number;
        xp_required: number;
    }

}
