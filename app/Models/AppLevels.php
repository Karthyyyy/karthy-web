<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AppLevels extends Model
{
    use HasFactory;

    protected $table = "app_levels";
    protected $primaryKey = "level";
 
    public static function getCurrentLevel($xp) {
        $level = self::orderBy('xp_required', 'DESC')->where('xp_required', '<=', $xp)->first();
 
        return $level;
    }

    public static function getNextLevel($xp) {
        $level = self::where('xp_required', '>=', $xp)->first();
 
        return $level;
    }
}
