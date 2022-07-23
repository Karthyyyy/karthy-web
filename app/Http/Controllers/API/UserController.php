<?php

namespace App\Http\Controllers\API;

use Session;
use App\Models\User;
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

        if (Auth::attempt($credentials)) {
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
                'user' => Auth::user()
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
}