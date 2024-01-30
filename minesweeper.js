var board = [];
var minesLocation = [];
var rows = [8, 10, 20];
var columns = [8, 10, 20];
var minesCount = [10, 15, 40];
var difficulty = 0;
var tilesClicked = 0; 
var flagOn = false;
var gameOver = false;



window.onload = function(){
    startGame();
    const flagButton = document.getElementById("flag-button");
    flagButton.addEventListener("click", setFlag);
    document.getElementById("dig-button").addEventListener("click", setDig);
    document.getElementById("reset-button").addEventListener("click", function(){
        resetGame(difficulty);
    });
    document.getElementById("easy-button").addEventListener("click", function(){
        resetGame(0);
    });
    document.getElementById("medium-button").addEventListener("click", function(){
        resetGame(1);
    });
    document.getElementById("hard-button").addEventListener("click", function(){
        resetGame(2);
    });
    document.getElementById("dark-button").addEventListener("click", darkMode);
}

function placeMines(){
    let setMines = 0;
    while(setMines != minesCount[difficulty]){
        let x = Math.floor(Math.random() * rows[difficulty]);
        let y = Math.floor(Math.random() * columns[difficulty]);
        let id = x.toString() + "-" + y.toString();
        if(!minesLocation.includes(id)){
            minesLocation.push(id);
            setMines++;
        }
    }
}

function resetGame(diff){
    difficulty = diff;
    document.getElementById("board").innerHTML = "";
    board = [];
    gameOver = false;
    flagOn = false;
    minesLocation = [];
    tilesClicked = 0;
    startGame();
}


function startGame(){
    console.log(difficulty);
    document.getElementById("reset-button").innerHTML = "🙂";
    document.getElementById("mines-count").innerText = minesCount[difficulty];
    document.getElementById("dug-tiles").innerText = tilesClicked;
    placeMines();
    //populate board
    for(let r = 0; r < rows[difficulty]; r++){
        let row = [];
        for(let c = 0; c < columns[difficulty]; c++){
            let tile = document.createElement('DIV');
            tile.id = r.toString() + "-" + c.toString();
            tile.addEventListener("click", clicked);
            if(difficulty === 2){
                tile.classList.add("hard");
            } else if (difficulty === 1){
                tile.classList.add("medium");
            }
            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }
    
    console.log(board);
}

function setDig(){
    if(flagOn){
        flagOn = false;
        document.getElementById("dig-button").style.backgroundColor = "darkgray";
        document.getElementById("dig-button").style.border = "none";
        document.getElementById("flag-button").style.backgroundColor = "lightgray";
        document.getElementById("flag-button").style.border = "1px solid";
    }
}

function setFlag(){
    if(!flagOn){
        flagOn = true;
        document.getElementById("flag-button").style.backgroundColor = "darkgray";
        document.getElementById("flag-button").style.border = "none";
        document.getElementById("dig-button").style.backgroundColor = "lightgray";
        document.getElementById("dig-button").style.border = "1px solid";
    }
}

function clicked(){
    if(gameOver || this.classList.contains("tile-clicked")){
        return;
    }
    let tile = this;
    if(flagOn){
        if(tile.innerText == "") {
            tile.innerText = "🚩";
        } else {
            tile.innerText = "";
        }
        return;
    }

    if(minesLocation.includes(tile.id)) {
        document.getElementById("mines-count").innerText = "EXPLODED";
        document.getElementById("reset-button").innerHTML = "💀";
        gameOver = true;
        for(let r = 0; r < rows[difficulty]; r++){
            for(let c = 0; c < columns[difficulty]; c++){
                let tile = board[r][c];
                if(minesLocation.includes(tile.id)){
                    tile.innerText = "💥";
                }
            }
        }
        return;
    }

    let coordinates = tile.id.split("-");
    let r = parseInt(coordinates[0]);
    let c = parseInt(coordinates[1]);
    checkMine(r,c);
}

function checkMine(r, c){
    if(r < 0 || r >= rows[difficulty] || c < 0 || c >= columns[difficulty]){
        return;
    }
    if(board[r][c].classList.contains("tile-clicked")){
        return;
    }
    board[r][c].classList.add("tile-clicked");
    tilesClicked += 1;
    let minesFound = 0;

    for(let x = -1; x <= 1; x++){
        for(y = -1; y <= 1; y++){
            minesFound += checkTile(r + x, c + y);
        }
    }

    if(minesFound > 0){
        board[r][c].innerText = minesFound;
        board[r][c].classList.add("icon" + minesFound.toString());
    } else {
        for(let i = -1; i <= 1; i++){
            for(j = -1; j <= 1; j++){
                minesFound += checkMine(r + i, c + j);
            }
        } 
    }
    document.getElementById("dug-tiles").innerText = tilesClicked;

    if(tilesClicked == (rows[difficulty] * columns[difficulty] - minesCount[difficulty])){
        document.getElementById("mines-count").innerText = "Cleared";
        document.getElementById("reset-button").innerHTML = "😆";
        gameOver = true;
    }

}

function checkTile(r, c){
    if(r < 0 || r >= rows[difficulty] || c < 0 || c >= columns[difficulty]){
        return 0;
    }
    if(minesLocation.includes(r.toString() + "-" + c.toString())){
        return 1;
    }
    return 0;
}

function darkMode(){
    var element = document.body;
    element.classList.toggle("dark-mode");
}
