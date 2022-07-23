<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Models\UserBrowserSource;

class AccountDashboardController extends Controller
{
    public function saveBrowserSourceSettings(Request $request) {
        $dataToEnter = ['user_id' => Auth::user()->id, 'name' => $request["name"], 'contents' => json_encode($request["contents"])];
        if (!is_null($request['id'])) {
            try {
                $browserSource = UserBrowserSource::find($request['id']);
                $browserSource->update($dataToEnter);

                $message = "Updated successfully";
                $success = true;
            } catch (\Illuminate\Database\QueryException $ex) {
                $success = false;
                $message = 'Update failed';
            }
        } else {
            try {
                $browserSource = UserBrowserSource::create($dataToEnter);

                $message = "Created successfully";
                $success = true;
            } catch (\Illuminate\Database\QueryException $ex) {
                $success = false;
                $message = $ex->getMessage();
            }
        }

        $response = [
            'success' => $success,
            'message' => $message,
        ];
        return response()->json($response);
    }

    public function getBrowserSourceSettings() {
        $browserSource = UserBrowserSource::where('user_id', Auth::user()->id)->get();

        $response = array();
        foreach($browserSource as $key => $value) {
            array_push($response, [
                "id" => $value->id,
                "name" => $value->name,
                "contents" => json_decode($value->contents)
            ]);
        }
        return response()->json($response);
    }

    public function getBrowserSource(Request $request) {
        $browserSource = UserBrowserSource::find($request["id"]);
        return response()->json($browserSource);
    }
}
