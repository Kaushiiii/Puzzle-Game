var rows = 4;
var columns = 4;

var currTile;
var otherTile;

var turns = 0;//count of swaps the player has made

let timerValue = 0;
let timerInterval = null;//id for set interval 

let hintsUsed = 0;//how many banana-hints the player used


//set timer stars at 1 
function startTimer() {
    timerInterval = setInterval(() => {
        timerValue++;
        document.getElementById("timer").innerText = timerValue + "s";
    }, 1000);
}

//retrieve the most recent saved game progress for the logged in user
function loadProgress() {
      fetch('load_progress.php', {
        method: 'GET',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
        .then(res => res.json())
        .then(data => {
            document.getElementById("pre-turns").innerText = data.data.turns;
            document.getElementById("pre-timer").innerText = data.data.time_taken + "s";
            document.getElementById("pre-hints").innerText = data.data.hints_used;
            document.getElementById("pre-score").innerText = data.data.high_score;
        });
}

//call timer and progress
window.onload = function () {
    startTimer();
    loadProgress();
    document.getElementById("hints").innerText = hintsUsed;


    //initialize the 4x4 board
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {

            //<img>
            let tile = document.createElement("img");
            tile.src = "./static/images/blank.jpg";

            //DRAG FUNCTIONALITY
            tile.addEventListener("dragstart", dragStart); //click on image to drag
            tile.addEventListener("dragover", dragOver);   //drag an image
            tile.addEventListener("dragenter", dragEnter); //dragging an image into another one
            tile.addEventListener("dragleave", dragLeave); //dragging an image away from another one
            tile.addEventListener("drop", dragDrop);       //drop an image onto another one
            tile.addEventListener("dragend", dragEnd);      //after you completed dragDrop

            document.getElementById("board").append(tile);
        }
    }

    //pieces
    let pieces = [];
    for (let i = 1; i <= rows * columns; i++) {
        pieces.push(i.toString()); //put "1" to "16" into the array (puzzle images names)
    }

    //random order of shuffled puzzle pieces
    pieces.reverse();
    for (let i = 0; i < pieces.length; i++) {
        let j = Math.floor(Math.random() * pieces.length);

        //swap
        let tmp = pieces[i];
        pieces[i] = pieces[j];
        pieces[j] = tmp;
    }


    //Create <img> elements for each shuffled piece and add them to pieces
    for (let i = 0; i < pieces.length; i++) {
        let tile = document.createElement("img");
        tile.src = "./static/images/" + pieces[i] + ".jpg";

        //DRAG FUNCTIONALITY
        tile.addEventListener("dragstart", dragStart); //click on image to drag
        tile.addEventListener("dragover", dragOver);   //drag an image
        tile.addEventListener("dragenter", dragEnter); //dragging an image into another one
        tile.addEventListener("dragleave", dragLeave); //dragging an image away from another one
        tile.addEventListener("drop", dragDrop);       //drop an image onto another one
        tile.addEventListener("dragend", dragEnd);      //after you completed dragDrop

        document.getElementById("pieces").append(tile);
    }
}

//DRAG TILES
function dragStart() {
    currTile = this; //this refers to image that was clicked on for dragging
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
}

function dragLeave() {

}

function dragDrop() {
    otherTile = this; //this refers to image that is being dropped on
}

//prevent swapping a blank
function dragEnd() {
    if (currTile.src.includes("blank")) {
        return;
    }

    // Swap the images
    let currImg = currTile.src;
    let otherImg = otherTile.src;
    currTile.src = otherImg;
    otherTile.src = currImg;

    turns += 1;
    document.getElementById("turns").innerText = turns;

    // After each move, check if puzzle is solved
    checkPuzzleSolved();
}

//update DB
function saveGameData(turns, time, hints, score) {
    fetch('save_progress.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `turns=${turns}&time=${time}&hints=${hints}&score=${score}`
    })
        .then(res => res.json())
        .then(data => console.log('Progress saved:', data));
}

//compares to the expected position
function checkPuzzleSolved() {
    const boardTiles = document.getElementById("board").getElementsByTagName("img");
    let isSolved = true;

    for (let i = 0; i < boardTiles.length; i++) {
        const imgNum = boardTiles[i].src.split("/").pop().split(".")[0];
        if (imgNum != (i + 1)) {
            isSolved = false;
            break;
        }
    }

    if (isSolved) {
        clearInterval(timerInterval);
        alert(`You solved the puzzle in ${turns} turns.`);
        saveGameData(turns, timerValue, hintsUsed, 1160 - turns * 10);//calculate score
        location.reload();
    }
}


//fetch banana cal
document.getElementById("hint-btn").addEventListener("click", async () => {
    const response = await fetch("banana_proxy.php");
    const data = await response.json();

    const imgUrl = data.question;
    const solution = data.solution;

    document.getElementById("banana-game").innerHTML = `
        <h3>Banana Game</h3>
        <img src="${imgUrl}" alt="Banana Game" style="width:200px;"><br>
        <input type="number" id="banana-answer" placeholder="Enter your answer">
        <button id="submit-answer">Submit</button>
    `;

    document.getElementById("submit-answer").addEventListener("click", () => {
        const userAnswer = document.getElementById("banana-answer").value;
        if (parseInt(userAnswer) === solution) {
                hintsUsed += 1
                document.getElementById("hints").innerText = hintsUsed;
            alert("Correct! You earned a hint.");
            revealHint();
        } else {
            alert("Wrong answer, try again!");
        }
    });

    
});

function doHide() {
    document.getElementById("myImage").style.display = "none";
}

//reveal hint for 3s and hide
function revealHint() {
    document.getElementById("myImage").style.display = "block";
    setTimeout("doHide()", 3000);
}
