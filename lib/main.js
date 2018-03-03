import SudokuBoard from './sudoku';
import $ from 'jquery';

document.addEventListener("DOMContentLoaded", ()=> {
  setupSudoku();
  let selectedCell = $(".sudoku-cell").first();
  let selectedButton = $(".number-button").first();
  let selectedId = parseInt(selectedCell.attr('id'));
  selectedCell.addClass("selected");
  $(".number-button").on("click", (e) => {
    selectedButton.removeClass("selected");
    selectedButton = $(e.currentTarget);
    selectedButton.addClass("selected");
    let cell = board.cells[parseInt(selectedCell.attr("id"))];
    let num = parseInt(selectedButton.attr("val"));
    cell.valueVisible = true;
    cell.possibles = [false,false,false,false,false,false,false,false,false];
    cell.currentValue = num;
    board.render();
  });

  $(".sudoku-cell").on("click", (e) => {
    selectedCell.removeClass("selected");
    selectedCell = $(e.currentTarget);
    selectedId = parseInt(selectedCell.attr('id'));
    selectedCell.addClass("selected");
  });
  document.addEventListener("keydown", (e) => {
    let num = parseInt(e.keyCode) - 48;
    let cell = board.cells[parseInt(selectedCell.attr("id"))];
    if (num >= 1 && num <= 9) {
      if (cell.isGiven) {return;}
      if (e.shiftKey) {
        cell.value = 0;
        cell.valueVisible = false;
        cell.possibles[num - 1] = !cell.possibles[num - 1];
        // for (let i = 0, len = cell.possibles.length; i < len; i++) {
        //   if (cell.possibles[i]) {return;}
        // }
        // cell.valueVisible = true;
      } else {
        cell.valueVisible = true;
        cell.possibles = [false,false,false,false,false,false,false,false,false];
        cell.currentValue = num;
      }
      board.render();
    } else if (e.keyCode === 37 && selectedId % 9 !== 0) {
      selectedCell.removeClass("selected");
      selectedCell = $(`#${selectedId - 1}`);
      selectedId = parseInt(selectedCell.attr('id'));
      selectedCell.addClass("selected");
    } else if (e.keyCode === 39 && selectedId % 9 !== 8) {
      selectedCell.removeClass("selected");
      selectedCell = $(`#${selectedId + 1}`);
      selectedId = parseInt(selectedCell.attr('id'));
      selectedCell.addClass("selected");
    } else if (e.keyCode === 38 && Math.floor(selectedId / 9) !== 0) {
      selectedCell.removeClass("selected");
      selectedCell = $(`#${selectedId - 9}`);
      selectedId = parseInt(selectedCell.attr('id'));
      selectedCell.addClass("selected");
    } else if (e.keyCode === 40 && Math.floor(selectedId / 9) !== 8) {
      selectedCell.removeClass("selected");
      selectedCell = $(`#${selectedId + 9}`);
      selectedId = parseInt(selectedCell.attr('id'));
      selectedCell.addClass("selected");
    } else if (e.keyCode === 8 || e.keyCode === 32 || e.keyCode === 48) { //delete value
      if (cell.isGiven) {return;}
      cell.currentValue = 0;
      if (cell.valueVisible) {
        cell.valueVisible = false;
      } else {
        cell.possibles = [false,false,false,false,false,false,false,false,false];
      }
      board.render();
    }
  });

  const board = new SudokuBoard();
});

const setupSudoku = () => {
  $("#board").children().remove();
  let grid = $(document.createElement("div"));
  grid.attr("id", "grid");
  for (let i = 0; i < 9; i++) {
    let box = $(document.createElement("div"));
    for (let j = 0; j < 9; j++) {
      let cell = $(document.createElement("div"));
      let possibilities = $(document.createElement("div"));
      possibilities.addClass("sudoku-cell-possibilities");
      for (let k = 0; k < 9; k++) {
        let possible = $(document.createElement("div"));
        possible.addClass("sudoku-cell-possibility");
        let id = (Math.floor(i / 3) * 27) + ((i % 3) * 3) + (Math.floor(j / 3) * 9) + (j % 3);
        possible.attr('id',`${id}-${k}`);
        possibilities.append(possible);
      }
      // possibilities.attr('id',`possibilities-${id}`);
      cell.append(possibilities);
      cell.addClass("sudoku-cell");
      let id = (Math.floor(i / 3) * 27) + ((i % 3) * 3) + (Math.floor(j / 3) * 9) + (j % 3);
      cell.attr('id',`${id}`);
      box.append(cell);
    }
    box.addClass("sudoku-box");
    grid.append(box);
  }
  $("#board").append(grid);
  let numberPanel = $(document.createElement("div"));
  numberPanel.attr("id", "number-panel");
  let number;
  for (let i = 0; i < 10; i++) {
    number = $(document.createElement("div"));
    number.addClass("number-button");
    number.attr("val",`${(i + 1) % 10}`);
    number.text(`${ (i + 1) % 10}`);
    if ( i === 9) {
      number.text(``);
    }
    numberPanel.append(number);
  }
  $("#board").append(numberPanel);
};
