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
$threadId = "thread_$matches[1]";
$runId = "run_$matches[2]";

$OpenaiApiKey = $_ENV['OPENAI_API_KEY'];
$assistant_id = $_ENV['OPENAI_ASSISTANT_ID'];


if($requestMethod === 'POST') {
    // output the request body to the log
    $requestBody = file_get_contents('php://input');
    error_log("Request body: " . $requestBody);
}

$requestObject = json_decode($requestBody);

$optionId = isset($requestObject->option) ? ($requestObject->option) : '';
$optionLabel = isset($requestObject->optionLabel) ? ($requestObject->optionLabel) : '';
$pageDescription = isset($requestObject->pageDescription) ? ($requestObject->pageDescription) : '';

error_log("optionId: $optionId");
error_log("optionLabel: $optionLabel");
error_log("pageDescription: $pageDescription");
//error_log("pageOptionsPrevious: " . json_encode($pageOptionsPrevious));

$client = OpenAI::client($OpenaiApiKey);

if(isset($optionLabel) && $optionLabel != '') {
    $pageOptionPrevious = "$optionId: " . $optionLabel; 
} else {
    $pageOptionPrevious = "$optionId";
}

$message = $client->threads()->messages()->create($threadId, [
    'role' => 'user',
    'content' => $pageOptionPrevious,
    //'content' => $optionId,
]);

try {
    $run = $client->threads()->runs()->create(
        threadId: $threadId, 
        parameters: [
            'assistant_id' => $assistant_id,
        ],
    );
    
    $runId = $run->id;
    
} catch (Exception $e) {
    echo json_encode(array('status' => 'failed', 'error' => $e->getMessage()));
    exit;
}

// Check if the run retrieval was successful
if ($run->status === 'failed') {
    echo json_encode(array('status' => 'failed', 'error' => $run->lastError));
    exit;
}


$retries = 0;
while ($run->status != 'completed') {

    sleep(1);

    $run = $client->threads()->runs()->retrieve($threadId, $runId);
    error_log("Run status: " . $run->status);

    if($run->status == 'failed') {
        echo json_encode(array('status' => 'failed', 'error' => $run->lastError, 'message' => 'Something has gone awry. We must begin anew. '));
        exit;
    }

    if($run->status == 'expired') {
        echo json_encode(array('status' => 'failed', 'error' => "Thread expired", "message" => "Your adventure has expired. We must begin anew. "));
        exit;
    }

    if(++$retries > 30) {
        echo json_encode(array('status' => 'failed', 'error' => 'Timeout waiting for response (' . $run->status . ')', 'message' => 'Our AI is taking too long to respond. Please try again later. '));
        exit;
    }
}

$messageMostRecent = $client->threads()->messages()->list($threadId, [
    'limit' => 1,
    'sort' => 'created_at',
    'direction' => 'desc'
]);

// Get the assistant messages
$assistantMessages = array_filter($messageMostRecent->data, function($message) {
    //if($message->role != 'assistant') {
    //    error_log("Message role is not assistant: " . $message->role);
    //    return false;
    //}
    if(count($message->content) == 0) {
        error_log("Message content is empty");
        return false;
    }
    return true;
});

$assistantMessages = reset($assistantMessages);

// Update this section to handle text responses
$messageContent = $assistantMessages['content'][0]['text']['value'];
$response = null;

// Try parsing as JSON first
$response = json_decode($messageContent);

// If JSON parsing fails, try to parse the text format
if(is_null($response) || !isset($response->PageOptions)) {
    // Extract description and options from text format
    $parts = explode("\n\n", $messageContent);
    $pageDescription = $parts[0];
    $options = array();
    
    if(count($parts) > 1) {
        $optionLines = array_filter(explode("\n", $parts[1]));
        foreach($optionLines as $line) {
            if(preg_match('/Option (\d+): (.+)/', $line, $matches)) {
                $options["Option {$matches[1]}"] = $matches[2];
            }
        }
    }
    
    $response = (object)[
        'PageDescription' => $pageDescription,
        'PageOptions' => $options
    ];
}

// Debug the response
error_log("Response from Assistant: " . print_r($messageContent, true));
error_log("Parsed response: " . print_r($response, true));

$pageDescription = $response->PageDescription ?: '';
$pageOptions = parseOptions($response->PageOptions ?: []);

// Debug the parsed options
error_log("Parsed options: " . print_r($pageOptions, true));

echo json_encode(array(
    'status' => 'success', 
    'thread_id' => $threadId, 
    'run_id' => $runId, 
    'pageDescription' => $pageDescription, 
    'pageOptionSelected' => $pageOptionPrevious,
    'pageOptions' => $pageOptions,
    //'pageOptionsPrevious' => $pageOptionsPrevious,
));
