const inputCode = {
  49: 1,
  50: 2,
  51: 3,
  52: 4,
  53: 5,
  54: 6,
  55: 7,
  56: 8,
  57: 9
};

document.addEventListener("DOMContentLoaded", ()=> {
  setupSudoku();
  let selectedCell = $(".sudoku-cell").first();
  let selectedId = parseInt(selectedCell.attr('id'));
  selectedCell.addClass("selected");
  $(".sudoku-cell").on("click", (e) => {
    // debugger
    selectedCell.removeClass("selected");
    selectedCell = $(e.currentTarget);
    selectedId = parseInt(selectedCell.attr('id'));
    selectedCell.addClass("selected");
  });
  document.addEventListener("keydown", (e) => {
    // debugger
    let num = parseInt(e.keyCode) - 48;
    let cell = board.cells[parseInt(selectedCell.attr("id"))];
    if (num >= 1 && num <= 9) {
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
    } else if (e.keyCode === 8 || e.keyCode === 32 || e.keyCode === 48) {
      cell.currentValue = 0;
      board.valueVisible = false;
      board.render();
    }
  });

  let board = new SudokuBoard();
  board.render();
});

const setupSudoku = () => {
  $("#board").children().remove();
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
    $("#board").append(box);
  }
};

class SudokuBoard {
  constructor() {
    this.boxes = [];
    this.cells = [];
    for (let i = 0; i < 9; i++) {
      this.boxes.push(new SudokuBox(i));
    }
    let boxIdx, sudokuCell;
    for (let i = 0; i < 81; i++) {
      sudokuCell = new SudokuCell((i % 9) + 1, i, false);
      this.cells.push(sudokuCell);
      boxIdx = (Math.floor(i / 27) * 3) + Math.floor((i % 9) / 3);
      sudokuCell.box = this.boxes[boxIdx];
      this.boxes[boxIdx].cells.push(sudokuCell);
    }
    this.render = this.render.bind(this);
  }

  render() {
    let cell, children, possibilities;
    for (let i = 0, len = this.cells.length; i < len; i++) {
      cell = $(`#${i}`);
      for (let j = 0, posLen = this.cells[i].possibles.length; j < posLen; j++) {
        $(`#${i}-${j}`).text(this.cells[i].possibles[j] ? j + 1 : "");
      }
      children = cell.children();
      cell.text(this.cells[i].currentValue !== 0 && this.cells[i].valueVisible ? this.cells[i].currentValue : "");
      cell.append(children);
      if (this.cells[i].valueVisible) {
        cell.children().removeClass("visible");
        cell.children().addClass("hidden");
      } else {
        cell.children().removeClass("hidden");
        cell.children().addClass("visible");
      }
    }
  }
}

class SudokuBox {
  constructor(idx) {
    this.idx = idx;
    this.cells = [];
    this.box = null;
  }
}

class SudokuCell {
  constructor(value = 0, idx, isGiven) {
    this.currentValue = value;
    this.valueVisible = true;
    this.idx = idx;
    this.isGiven = isGiven;
    this.inConflict = false;
    this.possibles = [false,false,false,false,false,false,false,false,false];
  }

  togglePossible(idx) {
    this.possibles[idx] = !this.possibles[idx];
  }
}
