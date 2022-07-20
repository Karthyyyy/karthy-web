<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DiscordServers extends Model
{
    use HasFactory;

    protected $table = "discord_servers";
    protected $primaryKey = "id";
}
