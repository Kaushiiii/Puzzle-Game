var rows = 4;
var columns = 4;

var currTile;
var otherTile;

var turns = 0;

let timerValue = 0;
let timerInterval = null;

let hintsUsed = 0;


function startTimer() {
    timerInterval = setInterval(() => {
        timerValue++;
        document.getElementById("timer").innerText = timerValue + "s";
    }, 1000);
}

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

window.onload = function () {
    startTimer();
    loadProgress();
    document.getElementById("hints").innerText = hintsUsed;
    //initialize the 4x4 board
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {

            //<img>
            let tile = document.createElement("img");
            tile.src = "static/images/blank.jpg";

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
    pieces.reverse();
    for (let i = 0; i < pieces.length; i++) {
        let j = Math.floor(Math.random() * pieces.length);

        //swap
        let tmp = pieces[i];
        pieces[i] = pieces[j];
        pieces[j] = tmp;
    }

    for (let i = 0; i < pieces.length; i++) {
        let tile = document.createElement("img");
        tile.src = "static/images/" + pieces[i] + ".jpg";

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
    otherTile = this; 
}

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

function saveGameData(turns, time, hints, score) {
    fetch('save_progress.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `turns=${turns}&time=${time}&hints=${hints}&score=${score}`
    })
        .then(res => res.json())
        .then(data => console.log('Progress saved:', data));
}

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
        saveGameData(turns, timerValue, hintsUsed, 1000 - turns * 10);
        location.reload();
    }
}

// Get modal elements
const modal = document.getElementById("banana-modal");
const span = document.getElementsByClassName("close-modal")[0];

// Helper to open modal and freeze background
function openModal() {
    modal.style.display = "block";
    document.body.style.overflow = "hidden"; // DISABLE SCROLL
}

// Helper to close modal and unfreeze background
function closeModal() {
    modal.style.display = "none";
    document.body.style.overflow = "auto"; // ENABLE SCROLL
}

// Close on X click
span.onclick = function() {
    closeModal();
}

// Close on background click
window.onclick = function(event) {
    if (event.target == modal) {
        closeModal();
    }
}

const hintModal = document.getElementById("hint-modal");
const hintClose = document.getElementsByClassName("close-hint")[0];
const hintImage = document.getElementById("hint-image");

function openHintModal() {
    hintModal.style.display = "block";
    document.body.style.overflow = "hidden";
}

function closeHintModal() {
    hintModal.style.display = "none";
    document.body.style.overflow = "auto";
}

hintClose.onclick = closeHintModal;

window.addEventListener("click", function(event) {
    if (event.target === hintModal) {
        closeHintModal();
    }
});

document.getElementById("hint-btn").addEventListener("click", async () => {
    openModal();
    
    document.getElementById("banana-game").innerHTML = "<h3>Loading game...</h3>";
    
    try {
        const response = await fetch("./banana_proxy.php");
        const data = await response.json();

        const imgUrl = data.question;
        const solution = data.solution;

        document.getElementById("banana-game").innerHTML = `
            <h3>Banana Game</h3>
            <p>Solve this to get a hint!</p>
            <img src="${imgUrl}" alt="Banana Game"><br>
            <input type="number" id="banana-answer" placeholder="Enter answer">
            <button id="submit-answer">Submit</button>
        `;

        document.getElementById("submit-answer").addEventListener("click", () => {
            const userAnswer = document.getElementById("banana-answer").value;
            
            if (parseInt(userAnswer) === solution) {
                hintsUsed += 1;
                document.getElementById("hints").innerText = hintsUsed;
                alert("Correct! You earned a hint.");
                
                closeModal(); // Close modal first
                revealHint(); // Then show hint on main page
            } else {
                alert("Wrong answer, try again!");
            }
        });
    } catch (error) {
        console.error("Error loading banana game:", error);
        document.getElementById("banana-game").innerHTML = "<h3>Error loading game.</h3>";
    }
});

function doHide() {
    document.getElementById("myImage").style.display = "none";
}

function revealHint() {
    openHintModal();

    setTimeout(() => {
        closeHintModal();
    }, 3000);
}
