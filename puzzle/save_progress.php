<?php
session_start();
require 'db.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["status" => "error", "message" => "Not logged in"]);
    exit;
}

$user_id = $_SESSION['user_id'];
$turns = $_POST['turns'];
$time = $_POST['time'];
$hints = $_POST['hints'];
$score = $_POST['score'];

$sql = "INSERT INTO game_progress (user_id, high_score, turns, time_taken, hints_used)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        high_score = GREATEST(high_score, VALUES(high_score)),
        turns = VALUES(turns),
        time_taken = VALUES(time_taken),
        hints_used = VALUES(hints_used)";

$stmt = $conn->prepare($sql);
$stmt->bind_param("iiiii", $user_id, $score, $turns, $time, $hints);
$stmt->execute();

echo json_encode(["status" => "success"]);
?>
