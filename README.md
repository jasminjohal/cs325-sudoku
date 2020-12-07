# Sudoku

Play the game online [here!](https://jjrx.github.io/cs340_sudoku/index.html)

## Rules

The game follows the usual rules of Sudoku. In order to solve the 9x9 puzzle, you must enter an integer from 1 to 9 (inclusive) into each cell. The number you can enter is also constrained in the following ways:
* Two of the same number cannot exist in the same row.
* Two of the same number cannot exist in the same column.
* Two of the same number cannot exist in the same 3x3 grid.

Note: you cannot change the cells that were initialized with numbers at the start of the game. 

## Instructions

Click on a cell to enter in a number. A prompt will appear requesting a number between 1 and 9. Enter in a number and press OK. The program will fill in the cell with the inputted number. Alternatively, you can enter '0' which will clear the selected cell. If an input is invalid, the application will not fill in the cell and it will indicate the reason for failure in red text under the grid. Once you have filled in all cells with a number, press the 'Check' button and the application will verify that your solution is valid. If so, it will display 'Solved!' If not, it will display 'Invalid Solution.'

