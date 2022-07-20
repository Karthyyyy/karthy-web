<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GamesWordsList extends Model
{
    use HasFactory;

    protected $table = "games_words_list";
    protected $primaryKey = "id";

    public function anagramsWordStats() {
        return $this->hasOne(GamesAnagramsWordStats::class);
    }
}
