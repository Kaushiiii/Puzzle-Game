<?php
session_start();
$timeout = 300; 

if (!isset($_SESSION['user_id'])) {
    header("Location: auth.php?login_required=1");
    exit();
}


if (isset($_SESSION['last_activity']) && (time() - $_SESSION['last_activity'] > $timeout)) {
    session_unset();
    session_destroy();
    header("Location: auth.php?timeout=1");
    exit();
}
$_SESSION['last_activity'] = time();
?>


<html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Puzzle Game</title>
        <link rel="stylesheet" href="./static/css/puzzle.css">
    </head>

    <body>
        <h1>Puzzle Game 🧩</h1> 
        <img id="myImage" src="./static/images/jinu.jpg" style="display: none;" alt="Image">
        <div id="board"></div>
        <h3> Previous game progress :- 🔂Turns: <span id="pre-turns">0</span> | ⏳Timer: <span id="pre-timer">  </span> | 💡Hint used: <span id="pre-hints"></span> | 🏆Score: <span id="pre-score"></span> </h3>
        <h3>🔂Turns: <span id="turns">0</span> | ⏳Timer: <span id="timer">  </span> | 💡Hint used: <span id="hints"></span> </h3>
        <div id="pieces"></div>
        <button id="hint-btn">Get Hint 🍌</button>
        <div id="banana-game"></div>
            <script src="./static/js/puzzle.js"></script>
    </body>
</html>
