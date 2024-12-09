<?php

declare(strict_types=1);


ini_set ('display_errors', 1);
ini_set ('display_startup_errors', 1);
error_reporting (E_ALL);

require 'vendor/autoload.php';
require 'helpers/parseoptions.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . "/..");
$dotenv->load();

header('Content-type: application/json');

$OpenaiApiKey = $_ENV['OPENAI_API_KEY'];
$assistant_id = $_ENV['OPENAI_ASSISTANT_ID'];
$client = OpenAI::client($OpenaiApiKey);

$thread = $client->threads()->create(
    [
    ],
);

$message = $client->threads()->messages()->create($thread->id, [
    'role' => 'user',
    'content' => 'Start a new adventure',
]);

$run = $client->threads()->runs()->create(
    threadId: $thread->id, 
    parameters: [
        'assistant_id' => $assistant_id,
    ],
);

while ($run->status != 'completed') {
    sleep(1);
    $run = $client->threads()->runs()->retrieve($thread->id, $run->id);

    if($run->status == 'failed') {
        echo json_encode(array('status' => 'failed', 'error' => $run->lastError));
        exit;
    }
}

$messageMostRecent = $client->threads()->messages()->list($thread->id, [
    'limit' => 1,
    'sort' => 'created_at', 
    'direction' => 'desc' 
]);


$response = json_decode($messageMostRecent->data[0]->content[0]->text->value);
$pageDescription = $response->PageDescription;

// Debug the response
error_log("Response from Assistant: " . print_r($response, true));

// Modify how we handle PageOptions
$pageOptions = [];
if (isset($response->PageOptions)) {
    if (is_object($response->PageOptions)) {
        // If PageOptions is an object, convert directly to array
        $pageOptions = (array)$response->PageOptions;
    } else {
        // Otherwise use parseOptions helper
        $pageOptions = parseOptions($response->PageOptions);
    }
}

// Debug the parsed options
error_log("Parsed options: " . print_r($pageOptions, true));

echo json_encode(array(
    'status' => 'success', 
    'thread_id' => $thread->id, 
    'run_id' => $run->id, 
    'pageDescription' => $pageDescription, 
    'pageOptions' => $pageOptions
));

