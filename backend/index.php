<?php

declare(strict_types=1);
//error_log("Request received: " . $_SERVER['REQUEST_URI']);

ini_set ('display_errors', 1);
ini_set ('display_startup_errors', 1);
error_reporting (E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

session_start();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Status: 204 No Content");
    header('Access-Control-Allow-Methods: OPTIONS, POST, GET');
    header('Access-Control-Max-Age: 86400');    
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    exit;
}

require 'vendor/autoload.php';

$request = $_SERVER['REQUEST_URI'];
error_log("Request received: " . $request);
// is this a POST, PUT or GET request?
$requestMethod = $_SERVER['REQUEST_METHOD'];
error_log("Request method: " . $requestMethod);

if($requestMethod === 'POST') {
    // output the request body to the log
    $requestBody = file_get_contents('php://input');
    error_log("Request body: " . $requestBody);
}

if(strtolower($request) == '/newadventure') {

    error_log("Matched route: newadventure");
    require __DIR__ . '/routes/newadventure.php';

} else if(preg_match('/\/page\/thread_([a-zA-Z0-9]+)\/run_([a-zA-Z0-9]+)/', $request, $matches)) {

    error_log("Matched route: page");
    require __DIR__ . '/routes/page.php';

} else {

    error_log("Matched route: 404");
    require __DIR__ . '/routes/404.php';

}