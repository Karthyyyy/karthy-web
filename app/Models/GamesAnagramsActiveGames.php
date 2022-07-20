<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GamesAnagramsActiveGames extends Model
{
    use HasFactory;

    protected $table = "games_anagrams_active_games";
    protected $primaryKey = "id";
    protected $fillable = ['user_id', 'game_xp', 'score_data', 'created_at', 'updated_at'];

    public function user() {
        return $this->belongsTo(User::class);
    }
}
