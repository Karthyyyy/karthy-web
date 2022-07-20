<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DiscordChannelPermissionTypes extends Model
{
    use HasFactory;

    protected $table = "discord_channel_permission_types";
    protected $primaryKey = "id";
}
