<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GamesAnagramsWordStats extends Model
{
    use HasFactory;

    protected $table = "games_anagrams_word_stats";
    
    public function gamesWordsList() {
        return $this->belongsTo(GamesWordsList::class);
    }
}
