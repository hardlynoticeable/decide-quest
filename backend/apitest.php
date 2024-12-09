<?php

declare(strict_types=1);

?>
<h6>Assistant</h6>
<ul>
<?php

ini_set ('display_errors', 1);
ini_set ('display_startup_errors', 1);
error_reporting (E_ALL);

require 'vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

//echo $_ENV['OPENAI_API_KEY'] . "\n";
$OpenaiApiKey = $_ENV['OPENAI_API_KEY'];

$assistant_id = 'asst_8vA5dtrcZyLihl0jP3sXcIRr';
$client = OpenAI::client($OpenaiApiKey);


function output($str) {
    $type = gettype($str);
    if($type == "array") {
        $str = json_encode($str, JSON_PRETTY_PRINT);
    }
    if($type == "integer" || $type == "double") {
        $str = strval($str);
    }
    if($type == "NULL") {
        $str = "null";
    }
    $str = str_replace("\n", "<br>", $str);
    echo "<li>$str</li>\n";
}

$assistant = $client->assistants()->retrieve($assistant_id);
output ($assistant->id); // 'asst_...'
output ($assistant->object); // 'assistant'
output ($assistant->createdAt); // 1623936000
output ($assistant->name); // 'Math Tutor'
output ($assistant->instructions); // 'You are a personal math tutor. When asked a question, write and run Python code to answer the question.'
output ($assistant->model); // 'gpt-4'
output ($assistant->description); // null
//echo ($assistant->tools)[0]->type; // 'code_interpreter'
//echo ($assistant->fileIds); // []
//echo ($assistant->metadata); // []

//print_r($assistant->toArray()); // ['id' => 'asst_gxzBkD1wkKEloYqZ410pT5pd', ...]

?>

<h6>thread</h6>
<ul>
<?php

$thread = $client->threads()->create(
    [
    ],
);

output($thread->id); // 'thread_...'
output($thread->object); // 'thread'
output($thread->createdAt); // ...


?>
</ul>

<h6>Message</h6>

<ul>

<?php

$message = $client->threads()->messages()->create($thread->id, [
    'role' => 'user',
    'content' => 'Start a new adventure',
]);

output($message->id); // 'msg_SKYwvF3zcigxthfn6F4hnpdU'
output($message->object); // 'thread.message'
output($message->createdAt); // 1623936000
output($message->threadId); // 'thread_tKFLqzRN9n7MnyKKvc1Q7868'
output($message->role); // 'user'
output($message->content[0]->type); // 'text'
output($message->content[0]->text->value); // 'What is the sum of 5 and 7?'
output($message->content[0]->text->annotations); // []
output($message->assistantId); // null
output($message->runId); // null
output($message->fileIds); // []
output($message->metadata); // []

output($message->toArray()); // ['id' => 'msg_SKYwvF3zcigxthfn6F4hnpdU', ...]

?>
</ul>

<h6>Run</h6>

<ul>

<?php

$run = $client->threads()->runs()->create(
    threadId: $thread->id, 
    parameters: [
        'assistant_id' => $assistant_id,
    ],
);

output($run->id); // 'run_4RCYyYzX9m41WQicoJtUQAb8'
output($run->object); // 'thread.run'
output($run->createdAt); // 1623936000
output($run->assistantId); // 'asst_gxzBkD1wkKEloYqZ410pT5pd'
output($run->threadId); // 'thread_tKFLqzRN9n7MnyKKvc1Q7868'
output($run->status); // 'queued'
output($run->startedAt); // null
output($run->expiresAt); // 1699622335
output($run->cancelledAt); // null
output($run->failedAt); // null
output($run->completedAt); // null
output($run->lastError); // null
output($run->model); // 'gpt-4'
output($run->instructions); // null
//output($run->tools[0]->type); // 'code_interpreter'
output($run->fileIds); // []
output($run->metadata); // []

output($run->toArray()); // ['id' => 'run_4RCYyYzX9m41WQicoJtUQAb8', ...]



?>
</ul>


<?php
$run = $client->threads()->runs()->retrieve($thread->id, $run->id); 
while ($run->status != 'completed') {
    echo "|{$run->status}|";
  sleep(1);
  $run = $client->threads()->runs()->retrieve($thread->id, $run->id);
}
echo "|{$run->status}|";

print_r($run);

$messageMostRecent = $client->threads()->messages()->list($thread->id, [
    'limit' => 1,
    'sort' => 'created_at', 
    'direction' => 'desc' 
  ]); 
print_r($messageMostRecent);


// Get response message
$response = $client->threads()->messages()->retrieve($thread->id, $message->id);

print_r($response);

output($messageMostRecent->data[0]->content[0]->text->value);