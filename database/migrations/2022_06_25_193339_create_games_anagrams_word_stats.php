<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGamesAnagramsWordStats extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('games_anagrams_word_stats', function (Blueprint $table) {
            $table->foreignId('word_id');
            $table->integer('as_master_total_count')->default(0);
            $table->decimal('as_master_average_percentage_found', $precision = 3, $scale = 2)->default(1.00);
            $table->integer('as_anagram_total_count')->default(0);
            $table->integer('as_anagram_total_found')->default(0);
            $table->integer('worth_xp')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('games_anagrams_word_stats');
    }
}
