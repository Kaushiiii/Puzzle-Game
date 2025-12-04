<?php
session_start();
session_unset();
session_destroy();
header("Location: ./auth.php");//clear session redirect to auth page
exit;
?>
