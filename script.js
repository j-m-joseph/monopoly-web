//DOM
function generateBoard(totalSquares) {
    //definer function and takes one input called totalSquares
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
generateBoard();
//calls generateBoard function created earlier to generate the board
