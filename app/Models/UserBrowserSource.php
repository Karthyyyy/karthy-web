<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class UserBrowserSource extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
    use \App\Traits\TraitUuid;

    protected $table = "user_browser_source";
    protected $primaryKey = "id";
    protected $fillable = ['user_id', 'name', 'contents'];

    public function user() {
        return $this->belongsTo(User::class);
    }
}
