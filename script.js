function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];
  
    for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < columns; j++) {
        board[i].push(Cell(i,j));
      }
    }
    const getBoard = () => board;
  
    const dropToken = (row, column, player) => {
        if (board[row][column].getValue()===""){
            board[row][column].addToken(player);
        }
    };
  
    const printBoard = () => {
      const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
      console.log(boardWithCellValues);
    };
    return { getBoard, dropToken, printBoard };
  }
  
  function Cell(x, y) {
    
    let value = "";
  
    const addToken = (player) => {
      value = player;
    };
  
    const getValue = () => value; 
  
    return {
      addToken,
      getValue
    };
  }
  
  function GameController(
    playerOneName = "Player One",
    playerTwoName = "Player Two"
  ) {
    const board = Gameboard();
  
    const players = [
      {
        name: playerOneName,
        token: "X"
      },
      {
        name: playerTwoName,
        token: "O"
      }
    ];
  
    let activePlayer = players[0];
  
    const switchPlayerTurn = () => {
      activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };
    const getActivePlayer = () => activePlayer;
  
    const printNewRound = () => {
      board.printBoard();
      console.log(`${getActivePlayer().name}'s turn.`);
    };
  
    const playRound = (column,row) => {
      console.log(
        `${getActivePlayer().name} has selected spot ${row} , ${column}`
      );
      board.dropToken(row, column, getActivePlayer().token);
  
      /*  This is where we would check for a winner and handle that logic,
          such as a win message. */
  
      switchPlayerTurn();
      printNewRound();
    };
  
    printNewRound();
  
    return {
      playRound,
      getActivePlayer,
      getBoard: board.getBoard
    };
  }
  
  function ScreenController() {
    const game = GameController();
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');
  
    const updateScreen = () => {
      // clear the board
      boardDiv.textContent = "";
  
      // get the newest version of the board and player turn
      const board = game.getBoard();
      const activePlayer = game.getActivePlayer();
  
      // Display player's turn
      playerTurnDiv.textContent = `${activePlayer.name}'s turn...`
  
      // Render board squares
      board.forEach(row => {
        let currentRow = board.indexOf(row);
        row.forEach((cell, index) => { 
          // Anything clickable should be a button!!
          const cellButton = document.createElement("button");
          cellButton.classList.add("cell");
          // Create a data attribute to identify the column
          // This makes it easier to pass into our `playRound` function 
          cellButton.dataset.column = index;
          cellButton.dataset.row = currentRow;
          cellButton.textContent = cell.getValue();
          boardDiv.appendChild(cellButton);
        })
        currentRow++; 
      })
    }
  
    // Add event listener for the board
    function clickHandlerBoard(e) {
      const selectedColumn = e.target.dataset.column;
      const selectedRow =e.target.dataset.row;
      // Make sure I've clicked a column and not the gaps in between
      if (!selectedColumn && !selectedRow) return;
      
      game.playRound(selectedColumn,selectedRow);
      updateScreen();
    }
    boardDiv.addEventListener("click", clickHandlerBoard);
  
    // Initial render
    updateScreen();

  }
  
  ScreenController();