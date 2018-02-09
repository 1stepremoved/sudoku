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
      if (cell.valueVisible) {
        cell.valueVisible = false;
      } else {
        cell.possibles = [false,false,false,false,false,false,false,false,false];
      }
      board.render();
    }
  });

  let board = new __WEBPACK_IMPORTED_MODULE_0__sudoku__["a" /* default */]();
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


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
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
    this.populate = this.populate.bind(this);
    this.populateBoard = this.populateBoard.bind(this);


    this.populateBoard();
    this.render();
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
    let pos1, pos2, temp;
    for (let i = 0; i < 100; i++) {
      pos1 = Math.floor(Math.random() * 9);
      pos2 = Math.floor(Math.random() * 9);
      temp = indii[pos1];
      indii[pos1] = indii[pos2];
      indii[pos2] = temp;
    }
    
    for (let i = 0, len = cell.possibles.length; i < len; i++) {
      let posIdx = indii[i];
      if (cell.possibles[posIdx]) {
        continue;
      }
      cell.currentValue = posIdx + 1;

      // change neigbhors possibles
      for (let j = 0, boxLen = cell.box.cells.length; j < boxLen; j++) {
        cell.box.cells[j].possibles[posIdx] += 1;
      }
      let startRow = Math.floor(cellIdx / 9) * 9;
      for (let j = 0; j < 9; j++) {
        // debugger
        this.cells[startRow + j].possibles[posIdx] += 1;
      }
      let startCol = Math.floor(cellIdx % 9);
      for (let j = 0; j < 9; j++) {
        this.cells[(9 * j) + startCol].possibles[posIdx] += 1;
      }


      if (this.populate(cellIdx + 1)) {
        return true;
      } else {
        // change neighbors possibles
        for (let j = 0, boxLen = cell.box.cells.length; j < boxLen; j++) {
          cell.box.cells[j].possibles[posIdx] -= 1;
        }
        for (let j = 0; j < 9; j++) {
          this.cells[startRow + j].possibles[posIdx] -= 1;
        }
        for (let j = 0; j < 9; j++) {
          this.cells[(9 * j) + startCol].possibles[posIdx] -= 1;
        }
        this.currentValue = 0;
      }
    }
    return false;
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


/* harmony default export */ __webpack_exports__["a"] = (SudokuBoard);


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map