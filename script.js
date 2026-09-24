console.log("To confirm JS link works");
//DOM
function generateBoard() {
  const boardElement = document.getElementById("board");
  //Find the  board element
  for (let i = 0; i < 16; i++) {
    //loops 16 exactly for now
    const newSquare = document.createElement("div");
    //loop creates a new div element
    newSquare.className = "square";
    //add a class named square
    newSquare.setAttribute("data-position", i);
    //stores what the square's index is
    boardElement.appendChild(newSquare);
    //the new square visually appears on the board
  }
}
generateBoard();
//calls generateBoard function created earlier to generate the board
