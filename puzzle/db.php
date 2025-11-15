<?php

//connect to mysqli
$servername = 'localhost';
$dbname = 'puzzle game';
$username = 'root';
$password = '';



$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}
?>
