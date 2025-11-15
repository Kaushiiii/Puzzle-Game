<?php
session_start();
require 'db.php';

$username = $_POST['username'];
$email = $_POST['email'];
$password = password_hash($_POST['password'], PASSWORD_DEFAULT);//hash pass

$sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";//inser new user
$stmt = $conn->prepare($sql);
$stmt->bind_param("sss", $username, $email, $password);

if ($stmt->execute()) {//on success go to auth
    header("Location: auth.php");
} else {
    echo json_encode(["status" => "error", "message" => "Username or Email already exists"]);
}
?>
