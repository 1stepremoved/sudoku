

document.addEventListener("DOMContentLoaded", ()=> {
  setupSudoku();
  let selectedCell = $(".sudoku-cell").first();
  let selectedId = parseInt(selectedCell.attr('id'));
  selectedCell.addClass("selected");
  $(".sudoku-cell").on("click", (e) => {
    selectedCell.removeClass("selected");
    selectedCell = $(e.target);
    selectedId = parseInt(selectedCell.attr('id'));
    selectedCell.addClass("selected");
  });
  document.addEventListener("keydown", (e) => {
    let num = parseInt(e.keyCode) - 48;
    if (num >= 1 && num <= 9) {
      selectedCell.html(`${num}`);
    }
    if (e.keyCode === 37 && selectedId % 9 !== 0) {
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
    } else if (e.keyCode === 8 || e.keyCode === 32) {
      selectedCell.html("");
    }
  });
});

const setupSudoku = () => {
  $("#board").children().remove();
  for (let i = 0; i < 9; i++) {
    let box = $(document.createElement("div"));
    for (let j = 0; j < 9; j++) {
      let cell = $(document.createElement("div"));
      cell.addClass("sudoku-cell");
      let id = (Math.floor(i / 3) * 27) + ((i % 3) * 3) + (Math.floor(j / 3) * 9) + (j % 3);
      cell.attr('id',`${id}`);
      box.append(cell);
    }
    box.addClass("sudoku-box");
    $("#board").append(box);
  }
};

class SudokuCell {
  constructor(value = 0, idx, isGiven) {
    this.currentValue = value;
    this.idx = idx;
    this.isGiven = isGiven;
    this.inConflict = false;
    this.possibles = [false,false,false,false,false,false,false,false,false];
  }

  togglePossible(idx) {
    this.possibles[idx] = !this.possibles[idx];
  }
}
