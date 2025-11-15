<?php
session_start();
require 'db.php';

header("Content-Type: application/json");

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["status" => "error", "message" => "Not logged in"]);
    exit;
}

$user_id = $_SESSION['user_id'];

$sql = "SELECT high_score, turns, time_taken, hints_used 
        FROM game_progress 
        WHERE user_id = ? 
        AND id = (SELECT MAX(id) from game_progress) ";//select the values need to display

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);//prevent sql injection -user inputs are treated as data
$stmt->execute();
$result = $stmt->get_result();
$data = $result->fetch_assoc();

if ($data) {
    echo json_encode([
        "status" => "success",
        "data" => [
            "high_score" => $data['high_score'],
            "turns" => $data['turns'],
            "time_taken" => $data['time_taken'],
            "hints_used" => $data['hints_used']
        ]
    ]);
} else {
    echo json_encode([
        "status" => "success ,no progress",
        "data" => null
    ]);
}
?>

