//DOM
function generateBoard(totalSquares) {
    //define function and takes one input called totalSquares
    const board = document.getElementById("board");
    //gets the <div id="board"> element from html and stores it ina variable called board
    const radius = 200;
    //variable so circle size can be changed

    //CALCULATING SQUARE SIZE 
    let circumference = 2 * Math.PI * radius;
    //circumference calculation
    let arcPerSquare = circumference / totalSquares;
    //arc length per square calculation
    //working out square size
    let squareSize = Math.min(arcPerSquare * 0.65, 60);
    //working out square size
    //Caps dimensions at 60px for visual clarity

    for (let i = 0; i < totalSquares; i++) {
        //for loop using numbers passed in function
         const square = document.createElement("div");
         //brand new empty div element creation and stores in a variable called square
         square.className = "square";
         //new div gets the class square so the css #board rules apply
         const angle = (360 / totalSquares) * i;
         //angle around the circle where square should sit
         //360 / 16 = 22.5. So each square gets 22.5° of the circle
         //works for any number

         //Applying sizing
         square.style.width = squareSize + "px";
         //adding unit to number
         square.style.height = squareSize + "px";
         //same thing because squares must be equal width and height
         square.style.margin = `${(-squareSize / 2)}px 0px 0px ${-(squareSize / 2)}px`;
         //value then literal text then second value and literal text
         //template literal

         //TRANSFORM CODE
         //RoTATE BEFORE TRANSLATE
         square.style.transform = `
         rotate(${angle}deg)
         translate(${radius}px)
         rotate(-${angle}deg)`;
         //1. tilt the square so its front (default moves right) JUST POINTS at its spot on the circle
         //2. "walk" so the square goes to the rim in the direction it is facing
         //3. tilt back to the same way so square is now upright and in the right position

         board.appendChild(square);
         //to appear
        }
    }

//declare
 const boardSizeInput = document.getElementById("boardSize");
 const playersInput = document.getElementById("numOfPlayers");
 const startButton = document.getElementById("startButton");
 const rollButton = document.getElementById("rollButton");
 //cannot be named the same as the function

 //references to the form elements
 const setupDiv = document.getElementById("setup");
 const boardDiv = document.getElementById("board");
 const diceDiv = document.getElementById("dice");

 let playerList;
 let currentPlayer = 0;
 //start at 0 for player 1
 
 //add event listener
 startButton.addEventListener("click", function() {
    //read values then validate
    //read
    const size = Number(boardSizeInput.value);
    const players = Number(playersInput.value);
    //note the values are strings not numbers the .value returns a string
    //so use Number()

    //validate with an if statement
    if (size < 10 || size> 50) {
        alert("Board size must be between 10 and 50");
        return;
    }

    if (players < 2 || players > 10) {
        alert("The number of players must be between 2 and 10");
        return;
    }

    // creatPlayers
    playerList = createPlayers(players);
    //runs the createPlayers function
    //players = number the user types in the form
    //takes array and stores in in new variable playerList
    setupDiv.classList.add("hidden");
    //adds the class hidden from css to the setup div
    boardDiv.classList.remove("hidden");
    //removes the hidden class from board so that it can become visible
    diceDiv.classList.remove("hidden");
    //same thing as board all in the setup
    //same flow as how I want it to be when the user plays
    generateBoard(size);
    //builds the board with the size the user inputs

 });

rollButton.addEventListener("click", function() {
    const result = rollDice();
    console.log(result);
    const player = playerList[currentPlayer];
    //recording whose turn it is 
    console.log(player.name + "'s turn");
    //log player's name in the console
    currentPlayer = (currentPlayer + 1) % playerList.length;
    //advance to next player
    //next index
    //goes back to 0 after the last player's turn
    //assigns back to the current player 

});

function createPlayers (count) {
    //define function and takes one input called count
    const players = [];

    for (let i = 0; i < count; i++ ) {
        const obj = {name: `Player ${i + 1}`, balance: 1000, position: 0};
        //starting points
        //when i = 0 string is Player 1
        //when i = 1 string is Player 2 etc...

        players.push(obj);
        //adding the elements to the end of the array
    }
    return players;
}

function rollDice () {
    return Math.floor(Math.random() * 6) + 1;
    //every roll lands between 1 and 6 with equal chance
}