<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Models\GamesWordsList;
use App\Http\Controllers\Controller;
use App\Models\GamesAnagramsActiveGames;
use App\Models\GamesAnagramsUserStats;
use App\Models\AppLevels;
use App\Models\User;
use Carbon\Carbon;

class AnagramsController extends Controller
{
    public function loadGame(Request $request) {
        try {
            $activeGame = GamesAnagramsActiveGames::where('user_id', $request["userId"])->first();
            $user = User::find($request["userId"])->first();
            $userTwitch = User::find($request["userId"])->userIntegrationTwitch()->first();
            if ($activeGame) {
                $response = [
                    'activeGame' => $activeGame,
                    'user' => $user,
                    'userTwitch' => $userTwitch
                ];
            } else {
                $response = [
                    'activeGame' => null,
                    'user' => $user,
                    'userTwitch' => $userTwitch
                ];
            }
        } catch (Throwable $e) {
            $response = $e;
        }

        return response()->json($response);
    }

    public function saveGame(Request $request) {
        try {
            $activeGame = GamesAnagramsActiveGames::updateOrCreate(
                [
                    'user_id' => $request["userId"]
                ],
                [
                    'updated_at' => Carbon::now()->toDateTimeString(),
                    'game_xp' => $request["gameXp"], 
                    'score_data' => json_encode($request["userResults"])
                ]
            );
            $data = $request;
            $success = true;
        } catch (Throwable $e) {
            $success = false;
            $data = $e;
        }

        $response = [
            'success' => $success,
            'data' => $data,
        ];
        return response()->json($response);
    }

    public function newRound() {
        set_time_limit(0);
        ini_set('memory_limit', '1024M');
        $gamesWordsList = new GamesWordsList;
        $masterWord = $gamesWordsList->whereRaw('LENGTH(word) = 10')->inRandomOrder()->first();
        $masterCharCount = strlen($masterWord["word"]);
        $allWords = $gamesWordsList->query();
        $masterLetters = json_decode($masterWord["char_count"], true);

        $allWords = $allWords->whereRaw('LENGTH(word) < '.$masterCharCount)->get();

        $anagramsByLetters = array();
        $anagramsUngrouped = array();
        foreach($allWords as $key => $word) {
            $isAnagram = true;
            $wordCharCount = json_decode($word["char_count"]);
            foreach($wordCharCount as $letter => $count) {        
                if (array_key_exists($letter, $masterLetters)) {
                    if ($count > $masterLetters[$letter]) {
                        $isAnagram = false;
                    }
                } else {
                    $isAnagram = false;
                }
            }
            if ($isAnagram) {
                $wordLength = (strlen($word["word"]) >= 9) ? "9+" : strlen($word["word"]);
                if (!array_key_exists($wordLength, $anagramsByLetters)) {
                    $anagramsByLetters[$wordLength] = array();
                }
                if (!array_key_exists($word["word"], $anagramsUngrouped)) {
                    $anagramsUngrouped[$word["word"]] = array(
                        "word" => $word["word"],
                        "groupedKey" => $wordLength,
                        "wordId" => $word["id"],
                        "isWordFound" => false,
                        "foundByUser" => null
                    );
                }
                array_push($anagramsByLetters[$wordLength], $word);
            }
        }

        $wordsGame = array(
            "masterWord" => $masterWord,
            "masterLetters" => $masterLetters,
            "anagramsByLetters" => $anagramsByLetters,
            "anagramsUngrouped" => $anagramsUngrouped
        );

        $response =  $wordsGame;
        return response()->json($response);
    }

    public function saveAndReturnResults(Request $request) {
        $returnData = array();
        foreach ($request["userResults"] as $username => $userData) {
            if ($gaus = GamesAnagramsUserStats::where('platform_user_id', '=', $userData['userId'])
                            ->where('platform', '=', $userData['platform'])->first()) {
                $gaus->total_xp = $gaus->total_xp + $userData["xpGained"];
                $gaus->save();
            } else {
                $gaus = new GamesAnagramsUserStats();
                $gaus->platform = $userData["platform"];
                $gaus->platform_user_id = $userData["userId"];
                $gaus->platform_user_name = $username;
                $gaus->total_xp = $userData["xpGained"];
                $gaus->save();
            }
            $toArray = $gaus->toArray();
            $toArray['currentLevel'] = AppLevels::getCurrentLevel($gaus->total_xp);
            $toArray['nextLevel'] = AppLevels::getNextLevel($gaus->total_xp);
            $returnData[$username] = $toArray;
        }
        return response()->json($returnData);
    }

    /**
     * Run once to initalize list of words to database
     */

    public function initializeWords() {
        set_time_limit(0);
        GamesWordsList::truncate();
        $wordsArray = array();
        $wordsJson = file_get_contents(base_path()."/resources/json/words_dictionary.json");
        $wordsJsonArray = json_decode($wordsJson);
        foreach ($wordsJsonArray as $word => $count) {
            if ($this->validateWord($word, $wordsArray)) {
                array_push($wordsArray, $word);
                $letterCountArray = array();
                foreach (count_chars($word, 1) as $i => $count) {
                    $letterCountArray[chr($i)] = $count;
                }
                $gamesWordsList = new GamesWordsList;
                $gamesWordsList->word = $word;
                $gamesWordsList->char_count = json_encode($letterCountArray);
                $gamesWordsList->save();
            }
        }
        
        $wordsGame = array(
            "allWords" => $wordsArray
        );
        $response =  $wordsGame;
        return response()->json($response);
    }

    /**
     * Validates words for initalization
     */
    private function validateWord($word, $wordsArray) {
        $word = trim($word);
        switch ($word) {
            case (in_array($word, $wordsArray)):
                return false;
            case (strlen($word) < 4):
                return false;
            case (!preg_match("/^[a-zA-Z]+$/", $word)):
                return false;
            default:
                return $word;
        }
    }
}
