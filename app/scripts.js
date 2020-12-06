var sampleTable = [
    [5,1,7,6,0,0,0,3,4],
    [2,8,9,0,0,4,0,0,0],
    [3,4,6,2,0,5,0,9,0],
    [6,0,2,0,0,0,0,1,0],
    [0,3,8,0,0,6,0,4,7],
    [0,0,0,0,0,0,0,0,0],
    [0,9,0,0,0,0,0,7,8],
    [7,0,3,4,0,0,5,6,0],
    [0,0,0,0,0,0,0,0,0]
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


function createTable(n) {
  var grid = document.getElementById('grid');
  // iterate over rows
  for (var i = 0; i < n; i++) {
    var row = document.createElement('div');
    row.classList.add('row');
    // iterate over columns
    for (var j = 0; j < n; j++) {
      var box = 1
      var cell = document.createElement('div');
      cell.classList.add('cell');

      // add thick border lines
      if (j == 2 || j == 5) {
          cell.style.borderRight = '3px solid black';
      }
      if (i == 2 || i == 5) {
        cell.style.borderBottom = '3px solid black';
      }

      // assign each cell a 3x3 box class depending on its location
      if (i > 5) {
        box = 7
      } else if (i > 2) {
        box = 4
      }

      if (j > 5) {
        box += 2
      } else if (j > 2) {
        box += 1
      }

      cell.classList.add(`box-${box}`);

      // add a number to cell if its corresponding cell in sampleTable is not 0
      if (sampleTable[i][j] != 0) {
        cell.classList.add('default');
        var content = document.createTextNode(`${sampleTable[i][j]}`);
        cell.appendChild(content);
      } else {
        cell.classList.add('editable');
      }

      // give each cell a unique id based on its position
      cell.setAttribute('id', `${i},${j}`);
      row.appendChild(cell);
    }
    grid.appendChild(row);
  }


  // add click event listener for each cell
  var cells = document.getElementsByClassName('cell');
  for (var c = 0; c < cells.length; c++) {
    if (!cells[c].classList.contains('default')) {
      cells[c].addEventListener('click', function(e) {
        e.preventDefault();
        var loc = this.id.split(',');
        var row = loc[0];
        var col = loc[1];
        getInputForCell(row,col);
      })
    }

  }
}

function validAddition(val,row,col) {
  var msg = ''
  // checks if the input already exists in the selected cell's row
  if (sampleTable[row].includes(val)) {
    updateAlert('Number already exists in row.');
    return false;
  }

  // checks if the input already exists in the selected cell's column
  for (var r = 0; r < 9; r++) {
    if (sampleTable[r][col] == val) {
      updateAlert('Number already exists in column.');
      return false;
    }
  }

  // checks if the input already exists in the selected cell's 3x3 block
  var cell = document.getElementById(`${row},${col}`);
  var boxClass = cell.className.split(" ")[1];
  var cellsInBox = document.getElementsByClassName(boxClass);
  for (var c = 0; c < cellsInBox.length; c++) {
    if (cellsInBox[c].textContent == val) {
      updateAlert('Number already exists in 3x3 box.');
      return false;
    }
  }

  return true;
}

function getInputForCell(row,col) {
  var input = parseInt(prompt('Enter a number between 1 and 9 or enter 0 to clear existing number in cell: '));
  if (Number.isInteger(input) && input >= 0 && input <= 9) {
    if (input == 0) {
      updateCell(row, col, input, false);
    } else if (validAddition(input, row, col)) {
      updateCell(row, col, input, true);
      // checkIfSolved();
    }
    // else {
    //   updateAlert('This is not a valid addition!');
    // }
  } else {
    updateAlert('That is not a valid integer!');
  }
}

function updateCell(row, col, input, addValue) {
  sampleTable[row][col] = input;
  var cell = document.getElementById(`${row},${col}`);
  if (cell.firstChild) {
    cell.removeChild(cell.firstChild);
  }
  if (addValue) {
    var content = document.createTextNode(`${input}`);
    cell.appendChild(content);
  }
  updateAlert('');
}

function updateAlert(msg) {
  var alertDiv = document.getElementById('alert');
  if (alertDiv.firstChild) {
    alertDiv.removeChild(alertDiv.firstChild);
  }
  var newMsg = document.createTextNode(msg);
  alertDiv.appendChild(newMsg);

  // change color depending on message context
  if (msg == 'Solved!') {
    alertDiv.style.color = 'green';
  } else {
    alertDiv.style.color = '#eb4d4b';
  }
}

function checkForDuplicates(val, i, j, grid, attribute) {
  if (attribute == 'boxes') {
    var cell = document.getElementById(`${i},${j}`);
    var boxClass = cell.className.split(" ")[1];
    var key = boxClass;
  } else if (attribute == 'rows') {
    var curRow = String(i);
    var key = curRow;
  } else if (attribute == 'cols') {
    var curCol = String(j);
    var key = curCol;
  }

  if (key in grid[attribute]) {
    if (grid[attribute][key].includes(val)) {
      updateAlert('Invalid solution.');
      return false;
    } else {
      grid[attribute][key].push(val);
    }
  } else {
    grid[attribute][key] = [val];
  }

  return true;
}

function checkIfSolved() {
  var grid = {boxes: {}, rows: {}, cols: {}};
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      var val = sampleTable[i][j];

      // if a 0 exists in the grid, the puzzle has not been solved
      if (val == 0) {
        updateAlert('Invalid solution.');
        return false;
      }

      // check if duplicate values are in 3x3 grids, rows, or cols
      if (!checkForDuplicates(val, i, j, grid, 'boxes')) {
        return false;
      }

      if (!checkForDuplicates(val, i, j, grid, 'rows')) {
        return false;
      }

      if (!checkForDuplicates(val, i, j, grid, 'cols')) {
        return false;
      }
    }
  }

  updateAlert('Solved!');
  confetti.start(2000);
  return true;
}


createTable(9);
//
// var resetButton = document.getElementById('reset-button');
// resetButton.addEventListener('click', function(e) {
//   e.preventDefault;
//   createTable(9);
// })

var checkButton = document.getElementById('check-button');
checkButton.addEventListener('click', function(e) {
  e.preventDefault;
  checkIfSolved();
})
