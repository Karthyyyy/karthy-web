<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DiscordChannels extends Model
{
    use HasFactory;

    protected $table = "discord_channels";
    protected $primaryKey = "id";

    protected $fillable = [
        'userId',
        'serverId',
        'discordChannelId',
        'description',
    ];

    public function users() {
        return $this->belongsTo('App\Models\Users');
    }

    public function discordServers() {
        return $this->belongsTo('App\Models\DiscordServers');
    }
}
