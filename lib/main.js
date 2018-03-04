import SudokuBoard from './sudoku';
// import $ from 'jquery';

document.addEventListener("DOMContentLoaded", () => {
  const game = new SudokuGame();
})

class SudokuGame {
  constructor() {
    this.setupSudoku = this.setupSudoku.bind(this);
    this.gridProportions = this.gridProportions.bind(this);
    this.isTargetInClass = this.isTargetInClass.bind(this);
    this.dragOver = this.dragOver.bind(this);
    this.drop = this.drop.bind(this);


    this.setupSudoku();
    this.selectedCell = $(".sudoku-cell").first();
    this.selectedButton = $(".number-button").first();
    this.selectedId = parseInt(this.selectedCell.attr('id'));
    this.selectedCell.addClass("selected");

    $(window).resize(this.gridProportions);

    document.addEventListener("dragstart",(e) => {
      let target = isTargetInClass(e, "number-button");
      if (target === null) {return;}
      let cell = this.board.cells[parseInt($(e.target).attr("id"))];
      this.selectedButton.removeClass("selected");
      this.selectedButton = $(target);
      this.selectedButton.addClass("selected");
      let draggable = $(document.createElement("div"));
      draggable.attr("id","draggable-tile");
      draggable.html(target.innerText);
      $("body").append(draggable);
    });

    document.addEventListener("drag", (e) => {
      e.preventDefault();
      $("#draggable-tile").css({"top": e.clientY, "left": e.clientX});
    });

    document.addEventListener("dragend", (e) => {
      $("#draggable-tile").remove();
    });

    $(".number-button").on("click", (e) => {
      this.selectedButton.removeClass("selected");
      this.selectedButton = $(e.currentTarget);
      this.selectedButton.addClass("selected");
      let cell = this.board.cells[parseInt(this.selectedCell.attr("id"))];
      if (cell.isGiven) {return;}
      let num = parseInt(this.selectedButton.attr("val"));
      cell.valueVisible = true;
      cell.possibles = [false,false,false,false,false,false,false,false,false];
      cell.currentValue = num;
      this.board.render();
    });

    $(".sudoku-cell").on("click", (e) => {
      this.selectedCell.removeClass("selected");
      this.selectedCell = $(e.currentTarget);
      this.selectedId = parseInt(this.selectedCell.attr('id'));
      this.selectedCell.addClass("selected");
    });

    document.addEventListener("keydown", (e) => {
      let num = parseInt(e.keyCode) - 48;
      let cell = this.board.cells[parseInt(this.selectedCell.attr("id"))];
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
        this.board.render();
      } else if (e.keyCode === 37 && this.selectedId % 9 !== 0) {
        this.selectedCell.removeClass("selected");
        this.selectedCell = $(`#${this.selectedId - 1}`);
        this.selectedId = parseInt(this.selectedCell.attr('id'));
        this.selectedCell.addClass("selected");
      } else if (e.keyCode === 39 && this.selectedId % 9 !== 8) {
        this.selectedCell.removeClass("selected");
        this.selectedCell = $(`#${this.selectedId + 1}`);
        this.selectedId = parseInt(this.selectedCell.attr('id'));
        this.selectedCell.addClass("selected");
      } else if (e.keyCode === 38 && Math.floor(this.selectedId / 9) !== 0) {
        this.selectedCell.removeClass("selected");
        this.selectedCell = $(`#${this.selectedId - 9}`);
        this.selectedId = parseInt(this.selectedCell.attr('id'));
        this.selectedCell.addClass("selected");
      } else if (e.keyCode === 40 && Math.floor(this.selectedId / 9) !== 8) {
        this.selectedCell.removeClass("selected");
        this.selectedCell = $(`#${this.selectedId + 9}`);
        this.selectedId = parseInt(this.selectedCell.attr('id'));
        this.selectedCell.addClass("selected");
      } else if (e.keyCode === 8 || e.keyCode === 32 || e.keyCode === 48) { //delete value
        if (cell.isGiven) {return;}
        cell.currentValue = 0;
        if (cell.valueVisible) {
          cell.valueVisible = false;
        } else {
          cell.possibles = [false,false,false,false,false,false,false,false,false];
        }
        this.board.render();
      }
    });

    this.board = new SudokuBoard();

  }

  setupSudoku() {
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
      number.attr("draggable",true);
      number.text(`${ (i + 1) % 10}`);
      if ( i === 9) {
        number.text(``);
      }
      numberPanel.append(number);
    }
    $("#board").append(numberPanel);

    this.gridProportions();
  }

  gridProportions() {
    let side =  Math.max(Math.floor(Math.min($(window).height() * 0.8, $(window).width() * 0.9)), 400);
    side += (side % 9) + 2;
    $("#grid").css({"height": side, "width": side});
    $("#number-panel").css({"height": side, "width": Math.floor(0.1 * side)});
    $(".sudoku-box").css({"font-size": Math.floor(side * 0.09)});
    $(".sudoku-cell-possibility").css({"font-size": Math.floor(side * 0.03)});
    $(".number-button").css({"font-size": Math.floor(side * 0.08)});
  }

  isTargetInClass(e, className) {
    let target = e.target;
    while (target.parentElement !== null) {
      if (target.className === className) {
        return target;
      }
      target = target.parentElement;
    }
    return null;
  }

  dragOver(e, board) {
    let selectedCells = $(".selected");
    let selectedCell;
    for (let i= 0, len =selectedCells.length; i < len; i++) {
      if (selectedCells[i].className === "sudoku-cell") {
        selectedCell = selectedCell[i];
        break;
      }
    }
    let cell = board.cells[parseInt(e.target.attr("id"))];
    selectedCell.removeClass("selected");
    selectedCell = $(e.target);
    selectedCell.addClass("selected");
  }

  drop(e, board) {
    let cell = board.cells[parseInt(e.target.attr("id"))];
    let selectedCells = $(".selected");
    let selectedCell;
    for (let i= 0, len =selectedCells.length; i < len; i++) {
      if (selectedCells[i].className === "number-button") {
        selectedCell = selectedCell[i];
        break;
      }
    }
  }
}

// document.addEventListener("DOMContentLoaded", ()=> {
//   setupSudoku();
//   let selectedCell = $(".sudoku-cell").first();
//   let selectedButton = $(".number-button").first();
//   let selectedId = parseInt(selectedCell.attr('id'));
//   selectedCell.addClass("selected");
//
//   $(window).resize(gridProportions);
//
//   document.addEventListener("dragstart",(e) => {
//     let target = isTargetInClass(e, "number-button");
//     if (target === null) {return;}
//     let cell = board.cells[parseInt($(e.target).attr("id"))];
//     selectedButton.removeClass("selected");
//     selectedButton = $(target);
//     selectedButton.addClass("selected");
//     let draggable = $(document.createElement("div"));
//     draggable.attr("id","draggable-tile");
//     draggable.html(target.innerText);
//     $("body").append(draggable);
//   });
//
//   document.addEventListener("drag", (e) => {
//     e.preventDefault();
//     $("#draggable-tile").css({"top": e.clientY, "left": e.clientX});
//   });
//
//   document.addEventListener("dragend", (e) => {
//     $("#draggable-tile").remove();
//   });
//
//   $(".number-button").on("click", (e) => {
//     selectedButton.removeClass("selected");
//     selectedButton = $(e.currentTarget);
//     selectedButton.addClass("selected");
//     let cell = board.cells[parseInt(selectedCell.attr("id"))];
//     if (cell.isGiven) {return;}
//     let num = parseInt(selectedButton.attr("val"));
//     cell.valueVisible = true;
//     cell.possibles = [false,false,false,false,false,false,false,false,false];
//     cell.currentValue = num;
//     board.render();
//   });
//
//   $(".sudoku-cell").on("click", (e) => {
//     selectedCell.removeClass("selected");
//     selectedCell = $(e.currentTarget);
//     selectedId = parseInt(selectedCell.attr('id'));
//     selectedCell.addClass("selected");
//   });
//
//   document.addEventListener("keydown", (e) => {
//     let num = parseInt(e.keyCode) - 48;
//     let cell = board.cells[parseInt(selectedCell.attr("id"))];
//     if (num >= 1 && num <= 9) {
//       if (cell.isGiven) {return;}
//       if (e.shiftKey) {
//         cell.value = 0;
//         cell.valueVisible = false;
//         cell.possibles[num - 1] = !cell.possibles[num - 1];
//         // for (let i = 0, len = cell.possibles.length; i < len; i++) {
//         //   if (cell.possibles[i]) {return;}
//         // }
//         // cell.valueVisible = true;
//       } else {
//         cell.valueVisible = true;
//         cell.possibles = [false,false,false,false,false,false,false,false,false];
//         cell.currentValue = num;
//       }
//       board.render();
//     } else if (e.keyCode === 37 && selectedId % 9 !== 0) {
//       selectedCell.removeClass("selected");
//       selectedCell = $(`#${selectedId - 1}`);
//       selectedId = parseInt(selectedCell.attr('id'));
//       selectedCell.addClass("selected");
//     } else if (e.keyCode === 39 && selectedId % 9 !== 8) {
//       selectedCell.removeClass("selected");
//       selectedCell = $(`#${selectedId + 1}`);
//       selectedId = parseInt(selectedCell.attr('id'));
//       selectedCell.addClass("selected");
//     } else if (e.keyCode === 38 && Math.floor(selectedId / 9) !== 0) {
//       selectedCell.removeClass("selected");
//       selectedCell = $(`#${selectedId - 9}`);
//       selectedId = parseInt(selectedCell.attr('id'));
//       selectedCell.addClass("selected");
//     } else if (e.keyCode === 40 && Math.floor(selectedId / 9) !== 8) {
//       selectedCell.removeClass("selected");
//       selectedCell = $(`#${selectedId + 9}`);
//       selectedId = parseInt(selectedCell.attr('id'));
//       selectedCell.addClass("selected");
//     } else if (e.keyCode === 8 || e.keyCode === 32 || e.keyCode === 48) { //delete value
//       if (cell.isGiven) {return;}
//       cell.currentValue = 0;
//       if (cell.valueVisible) {
//         cell.valueVisible = false;
//       } else {
//         cell.possibles = [false,false,false,false,false,false,false,false,false];
//       }
//       board.render();
//     }
//   });
//
//   const board = new SudokuBoard();
// });
//
// const setupSudoku = () => {
//   $("#board").children().remove();
//   let grid = $(document.createElement("div"));
//   grid.attr("id", "grid");
//   for (let i = 0; i < 9; i++) {
//     let box = $(document.createElement("div"));
//     for (let j = 0; j < 9; j++) {
//       let cell = $(document.createElement("div"));
//       let possibilities = $(document.createElement("div"));
//       possibilities.addClass("sudoku-cell-possibilities");
//       for (let k = 0; k < 9; k++) {
//         let possible = $(document.createElement("div"));
//         possible.addClass("sudoku-cell-possibility");
//         let id = (Math.floor(i / 3) * 27) + ((i % 3) * 3) + (Math.floor(j / 3) * 9) + (j % 3);
//         possible.attr('id',`${id}-${k}`);
//         possibilities.append(possible);
//       }
//       // possibilities.attr('id',`possibilities-${id}`);
//       cell.append(possibilities);
//       cell.addClass("sudoku-cell");
//       let id = (Math.floor(i / 3) * 27) + ((i % 3) * 3) + (Math.floor(j / 3) * 9) + (j % 3);
//       cell.attr('id',`${id}`);
//       box.append(cell);
//     }
//     box.addClass("sudoku-box");
//     grid.append(box);
//   }
//   $("#board").append(grid);
//
//   let numberPanel = $(document.createElement("div"));
//   numberPanel.attr("id", "number-panel");
//   let number;
//   for (let i = 0; i < 10; i++) {
//     number = $(document.createElement("div"));
//     number.addClass("number-button");
//     number.attr("val",`${(i + 1) % 10}`);
//     number.attr("draggable",true);
//     number.text(`${ (i + 1) % 10}`);
//     if ( i === 9) {
//       number.text(``);
//     }
//     numberPanel.append(number);
//   }
//   $("#board").append(numberPanel);
//
//   gridProportions();
// };
//
// function gridProportions() {
//   let side =  Math.max(Math.floor(Math.min($(window).height() * 0.8, $(window).width() * 0.9)), 400);
//   side += (side % 9) + 2;
//   $("#grid").css({"height": side, "width": side});
//   $("#number-panel").css({"height": side, "width": Math.floor(0.1 * side)});
//   $(".sudoku-box").css({"font-size": Math.floor(side * 0.09)});
//   $(".sudoku-cell-possibility").css({"font-size": Math.floor(side * 0.03)});
//   $(".number-button").css({"font-size": Math.floor(side * 0.08)});
// }
//
// function isTargetInClass(e, className) {
//   let target = e.target;
//   while (target.parentElement !== null) {
//     if (target.className === className) {
//       return target;
//     }
//     target = target.parentElement;
//   }
//   return null;
// }
//
// function dragOver(e, board) {
//   let selectedCells = $(".selected");
//   let selectedCell;
//   for (let i= 0, len =selectedCells.length; i < len; i++) {
//     if (selectedCells[i].className === "sudoku-cell") {
//       selectedCell = selectedCell[i];
//       break;
//     }
//   }
//   let cell = board.cells[parseInt(e.target.attr("id"))];
//   selectedCell.removeClass("selected");
//   selectedCell = $(e.target);
//   selectedCell.addClass("selected");
// }
//
// function drop(e, board) {
//   let cell = board.cells[parseInt(e.target.attr("id"))];
//   let selectedCells = $(".selected");
//   let selectedCell;
//   for (let i= 0, len =selectedCells.length; i < len; i++) {
//     if (selectedCells[i].className === "number-button") {
//       selectedCell = selectedCell[i];
//       break;
//     }
//   }
// }
