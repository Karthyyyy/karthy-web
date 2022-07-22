<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AppLevels extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('app_levels', function (Blueprint $table) {
            $table->id('level');
            $table->integer('xp_required')->index();
        });

        for ($level = 1; $level < 170; $level++) {
            $xpRequired = floor(($level*100) * pow(2, $level / 10));
            DB::table('app_levels')->insert(
                array(
                    'level' => $level,
                    'xp_required' => $xpRequired
                )
            );
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('app_levels');
    }
}
