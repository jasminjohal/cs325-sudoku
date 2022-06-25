var sampleTable = [
  [5, 1, 7, 6, 0, 0, 0, 3, 4],
  [2, 8, 9, 0, 0, 4, 0, 0, 0],
  [3, 4, 6, 2, 0, 5, 0, 9, 0],
  [6, 0, 2, 0, 0, 0, 0, 1, 0],
  [0, 3, 8, 0, 0, 6, 0, 4, 7],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 9, 0, 0, 0, 0, 0, 7, 8],
  [7, 0, 3, 4, 0, 0, 5, 6, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
];

// var sampleTable = [
//   [5, 1, 7, 6, 9, 8, 2, 3, 4],
//   [2, 8, 9, 1, 3, 4, 7, 5, 6],
//   [3, 4, 6, 2, 7, 5, 8, 9, 1],
//   [6, 7, 2, 8, 4, 9, 3, 1, 5],
//   [1, 3, 8, 5, 2, 6, 9, 4, 7],
//   [9, 5, 4, 7, 1, 3, 6, 8, 0],
//   [4, 9, 5, 3, 6, 2, 1, 7, 8],
//   [7, 2, 3, 4, 8, 1, 5, 6, 9],
//   [8, 6, 1, 9, 5, 7, 4, 2, 3]
// ];
//

function createTable(n) {
  /* Accepts an integer n and creates an nxn grid on the DOM to
  represent Sudoku board */

  var grid = document.getElementById("grid");
  // iterate over rows
  for (var i = 0; i < n; i++) {
    var row = document.createElement("div");
    row.classList.add("row");
    // iterate over columns
    for (var j = 0; j < n; j++) {
      var box = 1;
      var cell = document.createElement("div");
      cell.classList.add("cell");

      // add thick border lines
      if (j == 2 || j == 5) {
        cell.style.borderRight = "3px solid black";
      }
      if (i == 2 || i == 5) {
        cell.style.borderBottom = "3px solid black";
      }

      // assign each cell a 3x3 box class depending on its location
      // box classes range from box-1 (upper left) to box-9 (bottom right)
      if (i > 5) {
        box = 7;
      } else if (i > 2) {
        box = 4;
      }

      if (j > 5) {
        box += 2;
      } else if (j > 2) {
        box += 1;
      }

      cell.classList.add(`box-${box}`);

      // add a number to cell if its corresponding cell in sampleTable is not 0
      // these cells are 'default' (they cannot be changed)
      if (sampleTable[i][j] != 0) {
        cell.classList.add("default");
        var content = document.createTextNode(`${sampleTable[i][j]}`);
        cell.appendChild(content);
        // cells with value '0' are editable (user can change their value)
      } else {
        cell.classList.add("editable");
      }

      // give each cell a unique id based on its position
      cell.setAttribute("id", `${i},${j}`);
      row.appendChild(cell);
    }

    grid.appendChild(row);
  }

  // add click event listener for each 'editable' cell so user can enter in value into cell
  var cells = document.getElementsByClassName("cell");
  for (var c = 0; c < cells.length; c++) {
    // only 'editable' cells can be changed; 'default' cells cannot be changed
    if (!cells[c].classList.contains("default")) {
      cells[c].addEventListener("click", function (e) {
        e.preventDefault();
        // extra position from id since each cell has id 'i,j' where i is row, j is col
        var loc = this.id.split(",");
        var row = loc[0];
        var col = loc[1];
        // get user's input and place it into cell if valid
        getInputForCell(row, col);
      });
    }
  }
}

function validAddition(val, row, col) {
  /* Return true if the user input into a cell is valid based on Sudoku constraints;
  return false otherwise. Display helpful messages if false. */

  var msg = "";
  // checks if the input already exists in the selected cell's row
  if (sampleTable[row].includes(val)) {
    updateAlert("Number already exists in row.");
    return false;
  }

  // checks if the input already exists in the selected cell's column
  for (var r = 0; r < 9; r++) {
    if (sampleTable[r][col] == val) {
      updateAlert("Number already exists in column.");
      return false;
    }
  }

  // checks if the input already exists in the selected cell's 3x3 box
  var cell = document.getElementById(`${row},${col}`);
  var boxClass = cell.className.split(" ")[1];
  var cellsInBox = document.getElementsByClassName(boxClass);
  for (var c = 0; c < cellsInBox.length; c++) {
    if (cellsInBox[c].textContent == val) {
      updateAlert("Number already exists in 3x3 box.");
      return false;
    }
  }

  // user input met all constraints
  return true;
}

function updateCell(row, col, input, addValue) {
  /* Update the value in the grid (at position row, col) with the passed input.
  update the grid UI if addValue is true; don't if false */

  sampleTable[row][col] = input;
  var cell = document.getElementById(`${row},${col}`);

  // remove the existing value in the cell if applicable
  if (cell.firstChild) {
    cell.removeChild(cell.firstChild);
  }

  // only add the input to the grid UI if addValue is true
  // (in case of input 0, we don't want to display 0 on the UI)
  if (addValue) {
    var content = document.createTextNode(`${input}`);
    cell.appendChild(content);
  }

  // clear the alert box
  updateAlert("");
}

function getInputForCell(row, col) {
  /* Get input from user to enter into cell at position row, col. Update grid
  if input is valid (i.e. is an integer between 0 and 9 and meets grid constraints) */

  var input = parseInt(
    prompt(
      "Enter a number between 1 and 9 or enter 0 to clear existing number in cell: "
    )
  );

  // if user input is valid integer, check if it meets grid constraints
  if (Number.isInteger(input) && input >= 0 && input <= 9) {
    // update grid array and UI if input is valid
    if (input == 0) {
      updateCell(row, col, input, false);
    } else if (validAddition(input, row, col)) {
      updateCell(row, col, input, true);
    }
    // user input is not valid integer
  } else {
    updateAlert("That is not a valid integer!");
  }
}

function updateAlert(msg) {
  /* Pass in a string 'msg' and display this in the div with id 'alert' */
  var alertDiv = document.getElementById("alert");

  // remove the existing message if applicable
  if (alertDiv.firstChild) {
    alertDiv.removeChild(alertDiv.firstChild);
  }

  // display the new message
  var newMsg = document.createTextNode(msg);
  alertDiv.appendChild(newMsg);

  // change color depending on message context
  if (msg == "Solved!") {
    alertDiv.style.color = "green";
  } else {
    alertDiv.style.color = "#eb4d4b";
  }
}

function checkForDuplicates(val, i, j, grid, attribute) {
  /* Check if the val at cell (row i, col j) already exists in the passed attribute
    (box, row, or col). Return false if so; return true otherwise */

  // extract 3x3 box class name to see what box it is in
  if (attribute == "boxes") {
    var cell = document.getElementById(`${i},${j}`);
    var boxClass = cell.className.split(" ")[1];
    var key = boxClass;
    // cell is in row i so look in grid['rows'][i]
  } else if (attribute == "rows") {
    var curRow = String(i);
    var key = curRow;
    // cell is in col j so look in grid['cols'][j]
  } else if (attribute == "cols") {
    var curCol = String(j);
    var key = curCol;
  }

  // check if the specific attribute (e.g. row 2) already exists in dictionary
  if (key in grid[attribute]) {
    // if the passed val is already in the list, we have found a duplicate
    if (grid[attribute][key].includes(val)) {
      updateAlert("Invalid solution.");
      return false;
      // if the passed val is not in the list, add it to the list
    } else {
      grid[attribute][key].push(val);
    }
    // add the specific attribute to the dictionary if it doesn't already exist
  } else {
    grid[attribute][key] = [val];
  }

  return true;
}

function checkIfSolved() {
  /* Verify that a user's solution to the grid is valid (i.e. it meets all
     constraints). Return true if so, return false if not */

  // each 3x3 box gets a key in grid['boxes'], each row gets a key in grid['rows']
  // and each col gets a key in grid['cols']
  // the corresponding value is a list of all values in that box/row/col
  var grid = {
    boxes: {},
    rows: {},
    cols: {},
  };

  // iterate over each value in the grid and check if it already exists in its row/column/3x3 grid
  // if not, place it in grid dictionary in the relevant row/column/3x3 grid key
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      var val = sampleTable[i][j];

      // if a 0 exists in the grid, the puzzle has not been solved
      if (val == 0) {
        updateAlert("Invalid solution.");
        return false;
      }

      // check if duplicate values are in 3x3 grids, rows, or cols
      // return false if any of the constraints have been violated
      if (!checkForDuplicates(val, i, j, grid, "boxes")) {
        return false;
      }

      if (!checkForDuplicates(val, i, j, grid, "rows")) {
        return false;
      }
      if (!checkForDuplicates(val, i, j, grid, "cols")) {
        return false;
      }
    }
  }

  // the grid met all constraints so the solution is valid
  updateAlert("Solved!");
  confetti.start(2000);
  return true;
}

// validate user's solution when he/she presses 'Check' button
var checkButton = document.getElementById("check-button");
checkButton.addEventListener("click", function (e) {
  e.preventDefault;
  checkIfSolved();
});

createTable(9);
