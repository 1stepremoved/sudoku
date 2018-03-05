/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__sudoku__ = __webpack_require__(1);

// import $ from 'jquery';

document.addEventListener("DOMContentLoaded", () => {
  const game = new SudokuGame();
});

class SudokuGame {
  constructor() {
    this.setupSudoku = this.setupSudoku.bind(this);
    this.gridProportions = this.gridProportions.bind(this);
    this.isTargetInClass = this.isTargetInClass.bind(this);
    this.dragOver = this.dragOver.bind(this);
    this.dragEnter = this.dragOver.bind(this);
    this.dragLeave = this.dragOver.bind(this);
    this.drop = this.drop.bind(this);


    this.setupSudoku();
    this.selectedCell = $(".sudoku-cell").first();
    this.selectedButton = $(".number-button").first();
    this.selectedId = parseInt(this.selectedCell.attr('id'));
    this.selectedCell.addClass("selected");

    $(window).resize(this.gridProportions);

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

    document.addEventListener("dragstart",(e) => {
      let target = this.isTargetInClass(e, "number-button");
      if (target === null) {return;}
      let cell = this.board.cells[parseInt($(e.target).attr("id"))];
      this.selectedButton.removeClass("selected");
      this.selectedButton = $(target);
      // this.selectedButton.addClass("selected");
      // let draggable = $(document.createElement("div"));
      // draggable.attr("id","draggable-tile");
      // draggable.html(target.innerText);
      // $("body").append(draggable);
    });

    document.addEventListener("drag", (e) => {
      e.preventDefault();
      $("#draggable-tile").css({"top": e.clientY, "left": e.clientX});
    });

    document.addEventListener("dragend", (e) => {
      $("#draggable-tile").remove();
    });


    $(".sudoku-cell").on("dragover", this.dragOver);
    $(".sudoku-cell").on("dragenter", this.dragEnter);
    $(".sudoku-cell").on("drop", this.drop);
    $(".sudoku-cell").on("dragleave", this.dragLeave);

    this.board = new __WEBPACK_IMPORTED_MODULE_0__sudoku__["a" /* default */]();


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
    side -= (side % 9);
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

  dragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    let target = $(e.target);
    this.selectedCell.removeClass("selected");
    this.selectedCell = target;
    this.selectedId = parseInt(this.selectedCell.attr('id'));
    this.selectedCell.addClass("selected");
  }

  dragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  dragEnter(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  drop(e) {
    e.preventDefault();
    e.stopPropagation();
    let target = $(e.target);
    let cell = this.board.cells[parseInt(target.attr("id"))];
    if (!cell.isGiven) {
      let num = parseInt(this.selectedButton.attr("val"));
      cell.valueVisible = true;
      cell.possibles = [false,false,false,false,false,false,false,false,false];
      cell.currentValue = num;
      this.board.render();
    }
    this.selectedCell = target;
    this.selectedId = parseInt(this.selectedCell.attr('id'));
  }
}


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// import $ from 'jquery';

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

class SudokuBoard {
  constructor() {
    this.boxes = [];
    this.cells = [];
    for (let i = 0; i < 9; i++) {
      this.boxes.push(new SudokuBox(i));
    }
    let boxIdx, sudokuCell;
    for (let i = 0; i < 81; i++) {
      sudokuCell = new SudokuCell(0, i, false);
      this.cells.push(sudokuCell);
      boxIdx = (Math.floor(i / 27) * 3) + Math.floor((i % 9) / 3);
      sudokuCell.box = this.boxes[boxIdx];
      this.boxes[boxIdx].cells.push(sudokuCell);
    }
    this.render = this.render.bind(this);
    this.setup = this.setup.bind(this);
    this.populate = this.populate.bind(this);
    this.populateBoard = this.populateBoard.bind(this);
    this.changeNeighborsPos = this.changeNeighborsPos.bind(this);
    this.changeNeighborsPosStep = this.changeNeighborsPosStep.bind(this);
    this.solve = this.solve.bind(this);
    this.solveCycle = this.solveCycle.bind(this);
    this.resolveAmbiguity = this.resolveAmbiguity.bind(this);
    this.getLeastAmbiguousCell = this.getLeastAmbiguousCell.bind(this);
    this.depopulate = this.depopulate.bind(this);
    this.setCellPossibilities = this.setCellPossibilities.bind(this);

    this.solvedGrid = this.populateBoard();
    this.depopulate(60);
    this.setCellPossibilities();
    let puzzle = new Array(this.cells.length);
    for (let i = 0, len = puzzle.length; i < len; i++) {
      puzzle[i] = this.cells[i].currentValue;
    }
    puzzle = this.solve(puzzle);
    this.setup(puzzle);
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

  setup(puzzle) {
    for (let i = 0, len = puzzle.length; i < len; i++) {
      if (puzzle[i] > 0) {
        this.cells[i].isGiven = true;
        $(`#${i}`).addClass("given");
      }
      this.cells[i].possibles = [false,false,false,false,false,false,false,false,false];
      this.cells[i].currentValue = puzzle[i];
    }
    this.render();
  }

  populateBoard() {
    for (let i = 0, len = this.cells.length; i < len; i++) {
      this.cells[i].possibles = [0,0,0,0,0,0,0,0,0];
    }
    while (true) {
      if (this.populate(0)){
        break;
      }
    }
    for (let i = 0, len = this.cells.length; i < len; i++) {
      this.cells[i].possibles = [false,false,false,false,false,false,false,false,false];
    }
    let solvedGrid = new Array(this.cells.length);
    for (let i = 0, len = this.cells.length; i < len; i++) {
      solvedGrid[i] = this.cells[i].currentValue;
    }
    return solvedGrid;
  }

  populate(cellIdx) {
    if (cellIdx >= 81) {
      return true;
    }
    let indii = new Array(9);
    let cell = this.cells[cellIdx];
    for (let i = 0, len = indii.length; i < len; i++) {
      indii[i] = i;
    }
    indii = shuffle(indii);
    for (let i = 0, len = cell.possibles.length; i < len; i++) {
      let posIdx = indii[i];
      if (cell.possibles[posIdx]) {
        continue;
      }

      cell.currentValue = posIdx + 1;
      this.changeNeighborsPosStep(cellIdx, posIdx, 1);

      if (this.populate(cellIdx + 1)) {
        return true;
      } else {
        this.changeNeighborsPosStep(cellIdx, posIdx, -1);
        this.currentValue = 0;
      }
    }
    return false;
  }

  depopulate(num) {
    let idxs = [];
    for (let i = 0, len = this.cells.length; i < len; i++) {
      if (this.cells[i].currentValue !== 0){
        idxs.push(i);
      }
    }
    idxs = shuffle(idxs);
    for (let i = 0, len = Math.min(num, this.cells.length); i < len; i++) {
      this.cells[idxs.pop()].currentValue = 0;
    }
  }

  changeNeighborsPos(cellIdx, posIdx, value) {
    for (let j = 0, boxLen = this.cells[cellIdx].box.cells.length; j < boxLen; j++) {
      this.cells[cellIdx].box.cells[j].possibles[posIdx] = value;
    }
    let startRow = Math.floor(cellIdx / 9) * 9;
    for (let j = 0; j < 9; j++) {
      this.cells[startRow + j].possibles[posIdx] = value;
    }
    let startCol = Math.floor(cellIdx % 9);
    for (let j = 0; j < 9; j++) {
      this.cells[(9 * j) + startCol].possibles[posIdx] = value;
    }
  }

  changeNeighborsPosStep(cellIdx, posIdx, step) {
    for (let j = 0, boxLen = this.cells[cellIdx].box.cells.length; j < boxLen; j++) {
      this.cells[cellIdx].box.cells[j].possibles[posIdx] += step;
    }
    let startRow = Math.floor(cellIdx / 9) * 9;
    for (let j = 0; j < 9; j++) {
      this.cells[startRow + j].possibles[posIdx] += step;
    }
    let startCol = Math.floor(cellIdx % 9);
    for (let j = 0; j < 9; j++) {
      this.cells[(9 * j) + startCol].possibles[posIdx] += step;
    }
  }

  setCellPossibilities() {
    for (let i = 0, len = this.cells.length; i < len; i++) {
      this.cells[i].possibles = [true,true,true,true,true,true,true,true,true];
    }
    for (let i = 0, len = this.cells.length; i < len; i++) {
      if (this.cells[i].currentValue > 0) {
        this.cells[i].possibles = [false,false,false,false,false,false,false,false,false];
        this.cells[i].isGiven = true;
        this.changeNeighborsPos(i, this.cells[i].currentValue - 1, false);
      }
    }
  }

  solve() {
    //store initial state of grid
    //call solve, and store the state that it returns
    //if solve finished, reset to initial state and return true
    //if unsolved, get cell with least ambiguity and cycle through guesses, calling solve after each
    //if solve returns true only once, reset to inital state and return true
    //else, reset to initial state and return false
    let unsolvedGrid = new Array(this.cells.length);
    for (let i = 0, len = unsolvedGrid.length; i < len; i++) {
      unsolvedGrid[i] = this.cells[i].currentValue;
    }
    let grid = this.solveCycle(unsolvedGrid);
    let cell, givenCell, possibles;
    while (grid.includes(0)) {
      cell = this.getLeastAmbiguousCell();
      possibles = cell.getPossibles();
      while (possibles.length > 1) {
        givenCell = this.resolveAmbiguity(cell, possibles[0], Math.floor(Math.random() * 3));
        unsolvedGrid[givenCell.idx] = possibles[0] + 1;
        possibles = cell.getPossibles();
      }

      grid = this.solveCycle(grid);
    }
    return unsolvedGrid;
    //alternatively, if solve is unfinished, get least ambiguous cell and fill in cells until unambigious
    //these would also have to be filled in in the initial state
  }

  getLeastAmbiguousCell() {
    let idx = 0;
    while (this.cells[idx].currentValue > 0) {
      idx += 1;
    }
    let cell = this.cells[idx];
    let minPossibles = cell.getPossibles().length;
    let possibles;
    for (let i = 1, len = this.cells.length; i < len; i++) {
      if (this.cells[i].currentValue > 0) {
        continue;
      }
      possibles = this.cells[i].getPossibles().length;
      if (possibles < minPossibles) {
        cell = this.cells[i];
        minPossibles = possibles;
      }
    }
    return cell;
  }

  resolveAmbiguity(cell, num, dir = 0) {
    let targetCell;
    if ( dir === 0) { // get cell from box
      for (let i = 0, len = cell.box.cells.length; i < len; i++) {
        if (this.solvedGrid[cell.box.cells[i].idx] === num + 1 ) {
          targetCell = cell.box.cells[i];
          break;
        }
      }
    } else if (dir === 1) { //get cell from row
      let startRow = Math.floor(cell.idx / 9) * 9;
      for (let i = 0; i < 9; i++) {
        if (this.solvedGrid[startRow + i] === num + 1 ){
          targetCell = this.cells[startRow+i];
          break;
        }
      }
    } else { //get cell from col
      let startCol = Math.floor(cell.idx % 9);
      for (let i = 0; i < 9; i++) {
        if (this.solvedGrid[(9 * i) + startCol] === num + 1) {
          targetCell = this.cells[(9 * i) + startCol];
          break;
        }
      }
    }
    this.changeNeighborsPos(targetCell.idx, num, false);
    targetCell.currentValue = num + 1;
    targetCell.possibles = [false,false,false,false,false,false,false,false,false];
    return targetCell;
  }

  solveCycle(state) {
    let newState = state.slice();
    let possiblesIdx;
    let foundValue = true;
    let solutions;
    while (foundValue) {
      foundValue = false;
      for (let i = 0, len = this.cells.length; i < len; i++) {
        if (this.cells[i].isGiven) {
          continue;
        }
        possiblesIdx = this.cells[i].getPossibles();
        if (possiblesIdx.length === 1) {
          this.cells[i].currentValue = possiblesIdx[0] + 1;
          this.cells[i].possibles = [false,false,false,false,false,false,false,false,false];
          this.changeNeighborsPos(i, possiblesIdx[0], false);
          foundValue = true;
        }
      }
      for (let i = 0, len = this.boxes.length; i <len; i++) {
        solutions = this.boxes[i].checkForSolutions();
        for (let j = 0, solsLen = solutions.length; j < solsLen; j++) {
          solutions[j][0].currentValue = solutions[j][1];
          solutions[j][0].possibles = [false,false,false,false,false,false,false,false,false];
          this.changeNeighborsPos(solutions[j][0].idx, solutions[j][1] - 1, false);
          foundValue = true;
        }
      }
    }
    for (let i = 0, len = this.cells.length; i < len; i++) {
      newState[i] = this.cells[i].currentValue;
    }
    return newState;
    //cycle through grid, get all cells with one possible value
    //set all selected cells to possible value
    //repeat until no cells have single value or solved
  }
}

class SudokuBox {
  constructor(idx) {
    this.idx = idx;
    this.cells = [];
    this.box = null;
  }

  checkForSolutions() {
    let nums = [0,0,0,0,0,0,0,0,0];
    for (let i = 0, len = this.cells.length; i < len; i++) {
      if (this.cells[i].currentValue > 0) {
        nums[this.cells[i].currentValue - 1] = 1;
      }
    }
    let blanks = [];
    for (let i = 0, len = nums.length; i < len; i++) {
      if (!nums[i]){
        blanks.push(i);
      }
    }
    let solutions = [];
    let cell;
    for (let i = 0, len = blanks.length; i < len; i++) {
      cell = null;
      for (let j = 0, cellsLen = this.cells.length; j < cellsLen; j++) {
        if (this.cells[j].possibles[blanks[i]]) {
          if (cell !== null) {
            cell = -1;
            break;
          }
          cell = this.cells[j];
        }
      }
      if (cell !== -1 && cell !== null) {
        solutions.push([cell, blanks[i] + 1]);
      }
    }
    return solutions;
    //will get all missing nums, and insert them if they can only be put in one place
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

    this.togglePossible = this.togglePossible.bind(this);
    this.getPossibles = this.getPossibles.bind(this);
  }

  togglePossible(idx) {
    this.possibles[idx] = !this.possibles[idx];
  }

  getPossibles() {
    let possiblesIdx = [];
    for (let i = 0, len = this.possibles.length; i < len; i++) {
      if (this.possibles[i]) {
        possiblesIdx.push(i);
      }
    }
    return possiblesIdx;
  }
}


/* harmony default export */ __webpack_exports__["a"] = (SudokuBoard);


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map