<?php

namespace App\Http\Controllers\API;

use Session;
use App\Models\User;
use App\Models\UserIntegrationTwitch;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Controller;

class UserController extends Controller
{
    /**
     * Register
     */
    public function register(Request $request)
    {
        try {
            $user = new User();
            $user->username = $request->username;
            $user->email = $request->email;
            $user->password = Hash::make($request->password);
            $user->save();

            $success = true;
            $data = null;
            $message = 'Your account has been created, please log in';
        } catch (\Illuminate\Database\QueryException $ex) {
            $success = false;
            $data = $ex->getMessage();
            $message = 'Sorry your account could not be created';
        }

        // response
        $response = [
            'success' => $success,
            'data' => $data,
            'message' => $message,
        ];
        return response()->json($response);
    }

    /**
     * Login
     */
    public function login(Request $request)
    {
        $credentials = [
            'email' => $request->email,
            'password' => $request->password,
        ];

        if (Auth::attempt($credentials, true)) {
            $success = true;
            $message = 'User login successfully';
            $authData = array(
                'isLoggedin' => true,
                'user' => Auth::user()
            );
        } else {
            $success = false;
            $message = 'Unauthorised';
            $authData = array();
        }

        $response = [
            'authData' => $authData,
            'success' => $success,
            'message' => $message,
        ];
        return response()->json($response);
    }

    /**
     * Logout
     */
    public function logout()
    {
        try {
            Session::flush();
            $success = true;
            $data = null;
            $message = 'Successfully logged out';
        } catch (\Illuminate\Database\QueryException $ex) {
            $success = false;
            $data = $ex->getMessage();
            $message = 'There was a problem logging you out';
        }

        // response
        $response = [
            'authData' => array(),
            'data' => $data,
            'success' => $success,
            'message' => $message,
        ];
        return response()->json($response);
    }

    /**
     * Check authentication
     */
    public function checkauth()
    {
        if (Auth::check()) {
            $success = true;
            $authData = array(
                'isLoggedin' => true,
                'user' => Auth::user(),
                'twitch' => Auth::user()->userIntegrationTwitch()->first()
            );
        } else {
            $success = false;
            $authData = array();
        }

        // response
        $response = [
            'authData' => $authData,
            'success' => $success,
        ];
        return response()->json($response);
    }

    public function getIntegrationsTwitch() {
        try {
            $users = UserIntegrationTwitch::get();

            $data = $users;
            $success = true;
        } catch (\Illuminate\Database\QueryException $ex) {
            $success = false;
            $data = null;
        }

        $response = [
            'success' => $success,
            'data' => $data,
        ];
        return response()->json($response);
    }

    public function integrateTwitch(Request $request) {
        $dataToEnter = [
            'user_id' => Auth::user()->id,
            'access_token' => $request['access_token'],
            'refresh_token' => $request['refresh_token'],
            'twitch_id' => $request['twitch_id'],
            'twitch_login' => $request['twitch_login'],
            'twitch_display_name' => $request['twitch_display_name'],
            'twitch_email' => $request['twitch_email'],
            'broadcaster_type' => $request['broadcaster_type'],
            'view_count' => $request['view_count']
        ];
        if ($twitch = UserIntegrationTwitch::where('user_id', Auth::user()->id)->first()) {
            $success = false;
            $message = 'Twitch has already been integrated!';
        } else {
            try {
                $twitch = UserIntegrationTwitch::create($dataToEnter);
                $message = "Created successfully";
                $success = true;
            } catch (\Illuminate\Database\QueryException $ex) {
                $success = false;
                $message = 'There was a problem saving your integration';
            }

        }

        $response = [
            'success' => $success,
            'message' => $message,
        ];
        return response()->json($response);
    }

    public function revokeTwitchAccess() {
        if ($twitch = UserIntegrationTwitch::where('user_id', Auth::user()->id)->first()) {
            $twitch->forceDelete();
        }
    }
}