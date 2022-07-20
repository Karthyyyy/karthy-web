<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DiscordChannelPermissions extends Model
{
    use HasFactory;

    protected $table = "discord_channel_permissions";
    protected $primaryKey = "id";

    public function discordChannels() {
        return $this->belongsTo('App\Models\DiscordChannels');
    }

    public function discordChannelPermissionTypes() {
        return $this->belongsTo('App\Models\DiscordChannelPermissionTypes');
    }
}
