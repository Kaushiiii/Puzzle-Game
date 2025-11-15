<?php
header("Access-Control-Allow-Origin: *");//allow cross-origin requests and declare JSON response
header("Content-Type: application/json");

$url = "http://marcconrad.com/uob/banana/api.php?out=json";
$response = file_get_contents($url);//fetch the external API response server side

echo $response;//return the API response directly to the browser
?>
