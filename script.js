//DOM
function generateBoard(totalSquares) {
  //define function and takes one input called totalSquares
  const board = document.getElementById("board");
  //gets the <div id="board"> element from html and stores it ina variable called board
  const radius = 200;
  //variable so circle size can be changed
  squares = [];
  //resets array when a new board is generated
  //this is needed if the players want to restart the game

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
    square.style.margin = `${-squareSize / 2}px 0px 0px ${-(squareSize / 2)}px`;
    //value then literal text then second value and literal text
    //teme literal

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
    squares.push(square);
    //square[0] is the 1st and square [5] is the 6th etc...
    //the squares array is refilled with each new board built
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
const messageDiv = document.getElementById("messages");
const buyPromptDiv = document.getElementById("buy-prompt");
const buyTextP = document.getElementById("buy-text");
const buyYesButton = document.getElementById("buy-yes");
const buyNoButton = document.getElementById("buy-no");
const winnerDiv = document.getElementById("winner");
//getting winner div
const playerInfoDiv = document.getElementById("player-info");
//grab player info div
const actionsDiv = document.getElementById("actions");
const endGameButton = document.getElementById("endGameButton");

let playerList;
let currentPlayer = 0;
//start at 0 for player 1
let boardSize;
let squares = [];
let cycleSquares = [];
//declares a variable to hold the cycle square data
//Arrray of booleans
//cycle is a flag on the position not a type of square
let squareData;
let pendingBuyer;
let pendingProperty;

const PROPERTY_NAMES = [
  //const  do not modify
  "Fleet Street",
  "Bond Street",
  "Dragon Alley",
  "Kent Road",
  "Mayfair",
  "Park Lane",
  "Oxford Street",
  "Regent Street",
  "Piccadilly",
  "Strand",
  "Cambridge Crescent",
  "Cardiff Road",
  "Belfast Street",
  "Edinburgh Drive",
  "York Way",
  "Surrey Street",
  "Bristol Avenue",
  "Oak Lane",
  "Maple Avenue",
  "Willow Road",
  "River Street",
  "Meadow Way",
  "Hilltop Drive",
  "Sunset Boulevard",
  "Victory Road",
  "Fortune Square",
  "Quantum Street",
  "Pixel Street",
  "Code Avenue",
  "Logic Lane",
  "Platinum Way",
  "Sapphire Street",
  "Emerald Avenue",
  "Diamond Drive",
  "Royal Crescent",
];

function generateSquareData(boardSize) {
  //takes boardSize and returns an array of square data objects
  //build the data different from generateBoard which is visual squares
  const namesPool = PROPERTY_NAMES.slice();
  //when a name is used remove it from the list of property names to avoid repetition
  //spread also works but slice looks clearer to me

  const squareData = [];
  //empty array to collect details

  for (let i = 0; i < boardSize; i++) {
    if (i === 0) {
      squareData.push({ type: "road", name: "Home" });
      continue;
    }
    // Protects home square

    let purchasePrice;

    //the condition checks the rules are same ones I wrote for Java
    if (i < boardSize / 3) {
      purchasePrice = 10 + Math.floor(Math.random() * 191);
      //range from 10 to 200 in price and round down if not an int
    } else if (i < 2 * (boardSize / 3)) {
      purchasePrice = 200 + Math.floor(Math.random() * 111);
      //range from 200 to 310
    } else {
      purchasePrice = 310 + Math.floor(Math.random() * 191);
      //last 1/3
      //range from 310 to 500
    }

    purchasePrice = Math.floor(purchasePrice / 10) * 10;
    //rounding the int

    const rentalPrice = Math.floor(purchasePrice / 3);
    //rent is always the purchasePrice / 3 I have just kept the rule constant for simplicity
    // / 10 made the game go forever so this will tripple the rent prices
    //rounded because decimals does not make it look nice
    if (Math.random() < 0.1) {
      //10% chance road
      squareData.push({ type: "road" });
      //adds road object to array
    } else if (Math.random() < 0.6) {
      //only if cond 1 is false 60% chance of properties
      const randomIndex = Math.floor(Math.random() * namesPool.length);
      //picks a random index into the pool
      //Math.random = 0.37 * 20 is 7.4 then round down to 7
      //but 35 is what it is multiplied by in the game 20 is an example

      const name = namesPool.splice(randomIndex, 1)[0];
      //removes and takes name from the pool 2 steps in one line
      //needs splice to remove it could be picked again without it
      squareData.push({
        type: "property",
        name: name,
        price: purchasePrice,
        rent: rentalPrice,
        owner: null,
        //every property starts unowned
        //when someone buys it the owner is set to player object
      });
      //60% chance property and adds property object to array
    } else {
      squareData.push({ type: "road" });
      //remaining 30% road and adds road object
    }
  }

  //stations
  let numOfStations = Math.floor(boardSize / 6);
  //divide the board by 6 and round down
  if (numOfStations < 2) {
    //if the result of the division is less than 2
    numOfStations = 2;
    //there are 2 stations
  }

  const spacing = Math.floor(boardSize / numOfStations);
  //distance between station and int division to match my java
  for (let j = 0; j < numOfStations; j++) {
    const stationPosition = 1 + j * spacing;
    //1st station is at 1 to protect Home square next one is spacing itself further
    squareData[stationPosition] = { type: "station" };
    //overwrites whatever road/property was there
  }
  return squareData;
}

//add event listener
startButton.addEventListener("click", function () {
  //read values then validate
  //read
  boardSize = Number(boardSizeInput.value);
  const players = Number(playersInput.value);
  //note the values are strings not numbers the .value returns a string
  //so use Number()

  //validate with an if statement
  if (boardSize < 10 || boardSize > 50) {
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
  messageDiv.classList.remove("hidden");
  playerInfoDiv.classList.remove("hidden");
  //unhide start handler

  generateBoard(boardSize);
  //builds the board with the size the user inputs
  squareData = generateSquareData(boardSize);
  //the data array exists in every game that is played

  //The cycleData depends on the squareData
  //nothing earlier can know whichsquares are built
  cycleSquares = new Array(boardSize).fill(false);
  //every square on the board will have a default array of false
  const roadPositions = [];
  //the index of every road square will be held in this array

  //3 random positions might land on properties or stations
  //cycle square must be a road so collect and store all the road squares
  //excluding home first
  for (let i = 1; i < squareData.length; i++) {
    //start at 1 because the Home square is protected
    //the and is to pick 3 but fewer than 3 stops just to prevent a crash
    if (squareData[i].type === "road") {
      roadPositions.push(i);
    }
  }

  //collecting all the road positions
  for (let k = 0; k < 3 && roadPositions.length > 0; k++) {
    //pick 3 random roads from the list of available roads and stop early if there are less than 3
    //this is extremely unlikely but is there just in case
    const Ivar = Math.floor(Math.random() * roadPositions.length);
    //Ivar is just index but index cannot be used to name the var
    //a randon number between 0 and excluding 6 is muliplied by the number of roads in the array
    //the answer is rounded down and that becomes the index
    cycleSquares[roadPositions[Ivar]] = true;
    //the position(index) is marked as a cycle square
    roadPositions.splice(Ivar, 1);
    //remove selection to stop it being picked twice
    //same thing as the namesPool
  }

  for (const player of playerList) {
    //loop through each players object in the playerList array
    //the dots will all eb on top of eachother they are there but only one is visible before the players move
    const token = document.createElement("div");
    //makes a new empty div
    token.className = "token";
    //gives it a class so my .token css is applied
    token.style.backgroundColor = player.color;
    //sets the token to a colour goes in order of what I have typed
    squares[0].appendChild(token);
    //squares array that was added hold every square element on the board
    //grabs the 1st square all players start there
    //same as board.appenChild(square) this one puts the token div inside the square 0
    //visually it should put the coloured dot inside square 0/1st dquare
    player.token = token;
    //adds a new property called token and puts it in the player object
    //I need this because later when a player moves their dot has to be moved
  }
});

rollButton.addEventListener("click", function () {
  //it was roll, log then get player but for the cyce square to work it has to be
  //get player, roll,check cycle restriction then log details
  const player = playerList[currentPlayer];
  //get the current player first because the cycle check needs the player
  let result = rollDice();
  const originalResult = result;
  //save the actual roll to be logged

  if (player.cycleRestriction) {
    //if the player is restriced by their dice roll
    if (result >= 4) {
      result = 0;
      //rolling a 4+ means they don't move for CURRENT TURN
    }

    player.cycleRestriction = false;
    //clear the flag back to false because the restriction only lasts one turn
  }

  messageDiv.textContent += "Rolled a " + originalResult + "\n";
  //log the number the player rolled not the overrirden one
  messageDiv.textContent += player.name + "'s turn\n";
  //log whose turn it is

  //movement
  const oldPosition = player.position;
  //must be saved before the move happens
  //const because it is set once the old pos does not change
  player.position = (player.position + result) % boardSize;
  //moves the player
  messageDiv.textContent +=
    player.name + " is now on position " + player.position + "\n";
  //writes to message div where the player landed

  //token movement
  player.token.remove();
  //takes the token off the square that t was on
  squares[player.position].appendChild(player.token);
  //puts it on the new square depending on what the player rolls

  //Pass Home is checked immediately after the move, before landing logic.
  //This way the roll's wrap is checked separately from the teleport's wrap.
  //Two independent checks so no double bonus for a single wrap.

  //pass home bonus check
  if (player.position < oldPosition) {
    player.balance = player.balance + 200;
    messageDiv.textContent += player.name + " passed Home. + £200\n";
    //there is no need for an else if the player didn pass home there is nothing to do
  }

  //Checking what square a player has landed on if unowned property show prompt from html
  const landedSquare = squareData[player.position];
  //landedSquare holds the object for what square the player landed on

  if (landedSquare.type === "property" && landedSquare.owner === null) {
    //if it's a property and unowned

    //who is buying and what are they buying
    pendingBuyer = player;
    pendingProperty = landedSquare;

    buyTextP.textContent =
      "You have landed on " +
      landedSquare.name +
      " would you like to buy " +
      landedSquare.name +
      " for £" +
      landedSquare.price +
      "?";
    buyPromptDiv.classList.remove("hidden");
    //this prompt appears every time a player lands on an unowned property
    //Disappears when the player buys or skips
    rollButton.disabled = true;
    //pause the game so the user must decide before continuing
  } else if (
    landedSquare.type === "property" &&
    landedSquare.owner !== player
  ) {
    //property and the owner is not the current player
    player.balance = player.balance - landedSquare.rent;
    //reduce rent from current player
    landedSquare.owner.balance = landedSquare.owner.balance + landedSquare.rent;
    //add rent money to the current owner balance
    messageDiv.textContent +=
      player.name +
      " paid £" +
      landedSquare.rent +
      " rent to " +
      landedSquare.owner.name +
      "\n";
    //message to show

    //call method
    handleBankruptcy(player);
    //check if rent payment left the player in debt
    //the buy section doesnt need a bankruptcy check
    //the player pays rent without their balance being checked here
  } else if (landedSquare.type === "station") {
    const stationPositions = [];
    //const because once placed the station positions don't change on the board
    //Build station positions array
    for (let i = 0; i < squareData.length; i++) {
      //Home square is already protected it is always considered a road so iteration can start at 0
      if (squareData[i].type === "station") {
        stationPositions.push(i);
      }
    }
    //loop ends

    const otherStations = stationPositions.filter(
      (pos) => pos !== player.position,
    );
    //when the player is standing on a station remove the current station from the array
    //They should teleport to a different station
    const randomIndex = Math.floor(Math.random() * otherStations.length);
    const newStationPos = otherStations[randomIndex];
    //pick a random station of the remaining
    const currentStation = player.position;

    player.position = newStationPos;
    //save to compare old and new stations in case of passing home
    //then move the player

    player.token.remove();
    squares[player.position].appendChild(player.token);
    //same pattern for roll this is to move the token

    //IF HOME IS PASSED
    if (player.position < currentStation) {
      player.balance += 200;
      //if they passed Home give the player 200
      messageDiv.textContent += player.name + " passed Home. + £200\n";
    }
    messageDiv.textContent +=
      player.name + " teleported to station " + player.position + "\n";
    //log teleport

    //After the property checks and a cycle can never be a station so there are no collisions
  } else if (cycleSquares[player.position]) {
    //if the player lands on a cycle square
    player.cycleRestriction = true;
    //flag the player their next roll will be restricted
    messageDiv.textContent +=
      player.name + " landed on a cycle square. Next roll restricted.\n";
    //log the future restriction
  }

  currentPlayer = (currentPlayer + 1) % playerList.length;
  //advance to the next player
  //next index
  //goes back to 0 after the last player's turn
  //assigns back to the current player

  //After turn check if there is anyone left on the list
  //if there is only 1, game over
  if (playerList.length === 1) {
    //if only one player remains
    declareWinner();
    //call function declareWinner()
  }

  //refresh player info display
  playerInfoDiv.textContent = playerList
  .map((p) => p.name + ": £" + Math.floor(p.balance) + " cash | £" + Math.floor(calculateAssets(p)) + " total")
  .join("\n");
  //tuurns array of player objects into an array of strings
  //joins them with a newline
  //asigns the result to playerInfoDiv.textContent
  //after every roll the player-info panal shows all the balances for each player

  //reveal End Game button after the first roll
  if (actionsDiv.classList.contains("hidden")) {
    actionsDiv.classList.remove("hidden");
  }
});

buyYesButton.addEventListener("click", function () {
  if (pendingBuyer.balance >= pendingProperty.price) {
    //checks if the player can even afford the property
    //condition for yes they can afford it
    pendingBuyer.balance = pendingBuyer.balance - pendingProperty.price;
    //new owner balance after buyiing the property
    pendingProperty.owner = pendingBuyer;
    //set the property's owner
    messageDiv.textContent +=
      pendingBuyer.name +
      " bought " +
      pendingProperty.name +
      " for £" +
      pendingProperty.price +
      "\n";
    //message to show they have bought the property
  } else {
    messageDiv.textContent +=
      pendingBuyer.name + " cannot afford " + pendingProperty.name + "\n";
    //can't afford case if they click yes without being able to afford it
  }
  buyPromptDiv.classList.add("hidden");
  //hide the prompt
  rollButton.disabled = false;
  //game resumes — next player can roll

  playerInfoDiv.textContent = playerList
  .map((p) => p.name + ": £" + Math.floor(p.balance) + " cash | £" + Math.floor(calculateAssets(p)) + " total")
  .join("\n");
});

buyNoButton.addEventListener("click", function () {
  messageDiv.textContent +=
    pendingBuyer.name + " does not want to buy " + pendingProperty.name + "\n";
  buyPromptDiv.classList.add("hidden");
  //hide the prompt
  rollButton.disabled = false;
  //game resumes so the next player can roll

playerInfoDiv.textContent = playerList
  .map((p) => p.name + ": £" + Math.floor(p.balance) + " cash | £" + Math.floor(calculateAssets(p)) + " total")
  .join("\n");
});

//Event listener for endGameButton
endGameButton.addEventListener("click", function () {
  //end game button
  declareWinner();
});

//handle Bankruptcy function
function handleBankruptcy(player) {
  while (player.balance < 0) {
    //while loop because the player might need to keep selling until balance is 0 or above
    let cheapest = null;
    //reset at the start of each iteration

    for (let i = 0; i < squareData.length; i++) {
      //loop through every square on the board
      if (squareData[i].type === "property" && squareData[i].owner === player) {
        //the square is a property and owned by the bankrupt player both conditions must be valid
        if (cheapest === null || squareData[i].price < cheapest.price) {
          //second nested if statement
          //there is no owned property for the bankrupt player or the found new property is cheaper than the current cheapest property
          cheapest = squareData[i];
          //store new cheapest if there is a new cheapest
        }
      }
    }

    if (cheapest === null) {
      //if cheapest is still null the bankrupt player owns nothing
      break;
      //exit loop
    }

    player.balance = player.balance + cheapest.price / 2;
    //sell property at 1/2 price and add the amount to the bankrupt player's balance
    //There is no auctioning the property is returned to the "bank"
    cheapest.owner = null;
    //property goes back to being unowned

    messageDiv.textContent +=
      player.name +
      " sold " +
      cheapest.name +
      " for £" +
      cheapest.price / 2 +
      "\n";
    //log the sale
  }

  if (player.balance < 0) {
    //after selling everything possible check balance again

    const index = playerList.indexOf(player);
    //find the player's index in the playerList

    playerList.splice(index, 1);
    //remove bankrupt player from array

    if (currentPlayer >= playerList.length) {
      currentPlayer = 0;
    }
    //reset turn pointer if it now points past the end of the array

    messageDiv.textContent +=
      player.name + " is bankrupt and out of the game.\n";
    //log the removal of the bankrupt player
  }
}

//A helper for declareWinner function
function calculateAssets(player) {
  //defines function and takes player input

  let total = player.balance;
  //total starts at player'scash balance
  for (let i = 0; i < squareData.length; i++) {
    //loop through every square on board
    if (squareData[i].type === "property" && squareData[i].owner === player) {
      //two conditions must be true
      total = total + squareData[i].price;
      //add property's price to total
    }
  }
  return total;
  //returns final number
}

function declareWinner() {
  let winner = playerList[0];
  let highestAssets = calculateAssets(winner);

  for (let i = 1; i < playerList.length; i++) {
    const assets = calculateAssets(playerList[i]);
    if (assets > highestAssets) {
      highestAssets = assets;
      winner = playerList[i];
    }
  }
  
  //check for a tie
  //collect every player whose assets equal the highest
  const topPlayers = [];
  for (const player of playerList) {
    if (calculateAssets(player) === highestAssets) {
      topPlayers.push(player);
      //every player tied for first
    }
  }

  if (topPlayers.length > 1) {
    //check array length
    const names = topPlayers.map((p) => p.name).join(", ");
    //use names
    messageDiv.textContent += "Game over. It's a tie between " + names + "!\n";
    winnerDiv.textContent = "It's a tie! " + names + " all finished with £" + Math.floor(highestAssets) + " total assets.\n";
  } else {
  messageDiv.textContent += "Game over, " + winner.name + " wins. !\n";
  //log to record the winner with their balance
  winnerDiv.textContent =
    "Congratulations " +
    winner.name +
    " you have won the game with £" +
    Math.floor(highestAssets) +
    " total assets!\n";
  }
  //The win message in the panner both message and winner divs are needed
  winnerDiv.classList.remove("hidden");
  //makes the panel visible
  //the whole game starts hidden
  //once there is a winner it is visible
  rollButton.disabled = true;
  //the players can no longer click on the roll button because the game is over
  endGameButton.disabled = true;
  //can;tcloickon End Game twice
  buyYesButton.disabled = true;
  //Buy button disabled
  buyNoButton.disabled = true;
  //skip button disabled
  buyPromptDiv.classList.add("hidden");
  //prompt is gone
}

function createPlayers(count) {
  //define function and takes one input called count
  const players = [];

  const colors = [
    "red",
    "orange",
    "yellow",
    "green",
    "blue",
    "indigo",
    "violet",
    "pink",
    "white",
    "black",
  ];
  //10 colors for max of 10 players
  //adds colors array

  for (let i = 0; i < count; i++) {
    const obj = {
      name: `Player ${i + 1}`,
      balance: 1000,
      position: 0,
      color: colors[i],
      cycleRestriction: false,
      //every player starts false
      //when players land becomes true
      //next turn the roll checks and applies the rule
      //then after that turn goes back to false (default)
    };
    //starting points
    //when i = 0 string is Player 1
    //when i = 1 string is Player 2 etc...
    //now player 1 gets red and it goes in the order I have inputed
    players.push(obj);
    //adding the elements to the end of the array
  }
  return players;
}

function rollDice() {
  return Math.floor(Math.random() * 6) + 1;
  //every roll lands between 1 and 6 with equal chance
}
