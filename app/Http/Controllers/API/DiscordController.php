<?php

namespace App\Http\Controllers\API;

use App\Models\DiscordChannels;
use App\Models\DiscordServers;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Carbon\Carbon;

class DiscordController extends Controller
{
    public function createChannel(Request $request) {
        try {
            $userId = 1;
            $serverId = DiscordServers::where('discord_server_id', $request->serverId)->first()->id;
            $discordChannelId = $request->discordChannelId;
            $description = $request->description;

            $newChannel = DiscordChannels::updateOrInsert([
                "discord_channel_id" => $discordChannelId
            ],[
                "user_id" => $userId,
                "server_id" => $serverId,
                "discord_channel_id" => $discordChannelId,
                "description" => $description,
                "updated_at" => now()
            ]);

            $success = true;
            $message = 'Channel added successfully';
        } catch (\Illuminate\Database\QueryException $ex) {
            $success = false;
            $message = $ex->getMessage();
        }

        $response = [
            'success' => $success,
            'message' => $message,
        ];
        return response()->json($response);
    }

    public function deleteChannel(Request $request) {
        try {
            $serverId = DiscordServers::where('discord_server_id', $request->serverId)->first()->id;
            $discordChannelId = $request->discordChannelId;

            $channel = DiscordChannels::where([
                ['server_id', '=', $serverId],
                ['discord_channel_id', '=', $discordChannelId]
            ]);
            $channel->delete();

            $success = true;
            $message = 'Channel removed successfully';
        } catch (\Illuminate\Database\QueryException $ex) {
            $success = false;
            $message = $ex->getMessage();
        }

        $response = [
            'success' => $success,
            'message' => $message,
        ];
        return response()->json($response);
    }
}