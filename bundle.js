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
/***/ (function(module, exports) {



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


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map