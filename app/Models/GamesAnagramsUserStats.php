<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GamesAnagramsUserStats extends Model
{
    use HasFactory;

    protected $table = "games_anagrams_user_stats";
    protected $primaryKey = "id";
}
