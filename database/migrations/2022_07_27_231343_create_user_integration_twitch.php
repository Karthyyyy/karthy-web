<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_integration_twitch', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignId('user_id')->references('id')->on('users');
            $table->string('access_token');
            $table->string('refresh_token');
            $table->string('twitch_id');
            $table->string('twitch_login');
            $table->string('twitch_display_name');
            $table->string('twitch_email');
            $table->string('broadcaster_type')->nullable(true);
            $table->integer('view_count');
            $table->json('module_metadata')->default('{}');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('user_integration_twitch');
    }
};
