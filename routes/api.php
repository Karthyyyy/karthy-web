<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\AnagramsController;
use App\Http\Controllers\API\DiscordController;
use App\Http\Controllers\API\AccountDashboardController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('/games/words/load_game', [AnagramsController::class, 'loadGame']);
Route::post('/games/words/save_game', [AnagramsController::class, 'saveGame']);
Route::get('/games/words/new_round', [AnagramsController::class, 'newRound']);
Route::post('/games/words/save_round', [AnagramsController::class, 'saveAndReturnResults']);
Route::get('/games/words/initialize_words', [AnagramsController::class, 'initializeWords']);

Route::post('/discord/channel/create', [DiscordController::class, 'createChannel']);
Route::post('/discord/channel/delete', [DiscordController::class, 'deleteChannel']);

Route::post('/login', [UserController::class, 'login']);
Route::post('/register', [UserController::class, 'register']);
Route::post('/logout', [UserController::class, 'logout'])->middleware('auth:sanctum');
Route::post('/checkauth', [UserController::class, 'checkauth']);

Route::post('/account/save_browser_source', [AccountDashboardController::class, 'saveBrowserSourceSettings']);
Route::post('/account/get_browser_source', [AccountDashboardController::class, 'getBrowserSource']);
Route::get('/account/get_browser_sources', [AccountDashboardController::class, 'getBrowserSourceSettings']);