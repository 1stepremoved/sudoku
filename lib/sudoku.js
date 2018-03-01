import $ from 'jquery';

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
    this.populate = this.populate.bind(this);
    this.populateBoard = this.populateBoard.bind(this);
    this.changeNeighborsPos = this.changeNeighborsPos.bind(this);
    this.solve = this.solve.bind(this);
    this.solveCycle = this.solveCycle.bind(this);
    this.resolveAmbiguity = this.resolveAmbiguity.bind(this);
    this.getLeastAmbiguousCell = this.getLeastAmbiguousCell.bind(this);
    this.depopulate = this.depopulate.bind(this);
    this.setCellPossibilities = this.setCellPossibilities.bind(this);


    this.solvedGrid = this.populateBoard();
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
      this.cells[i].possibles = [false,false,false,false,false,false,false,false,false];
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
    let pos1, pos2, temp;
    indii = shuffle(indii);
    for (let i = 0, len = cell.possibles.length; i < len; i++) {
      let posIdx = indii[i];
      if (cell.possibles[posIdx]) {
        continue;
      }

      cell.currentValue = posIdx + 1;
      this.changeNeighborsPos(cellIdx, posIdx, true);

      if (this.populate(cellIdx + 1)) {
        return true;
      } else {
        this.changeNeighborsPos(cellIdx, posIdx, false);
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
    let cell, possibles;
    while (grid.includes(0)) {
      cell = this.getLeastAmbiguousCell();
      possibles = cell.getPossibles();
      while (possibles.length > 1) {
        this.resolveAmbiguity(cell, possibles[0], Math.floor(Math.random() * 3));
        possibles = cell.getPossibles();
      }
      this.changeNeighborsPos(cell.idx, possibles[0], true);
      unsolvedGrid[cell.idx] = possibles[0] + 1;
      cell.currentValue = possibles[0] + 1;

      grid = this.solveCycle(grid);
    }
    return unsolvedGrid;
    //alternatively, if solve is unfinished, get least ambiguous cell and fill in cells until unambigious
    //these would also have to be filled in in the initial state
  }

  getLeastAmbiguousCell() {
    let cell = this.cells[0];
    let minPossibles = cell.getPossibles().length;
    let possibles;
    for (let i = 1, len = this.cells.length; i < len; i++) {
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
  }

  solveCycle(state) {
    let newState = state.slice();
    let possiblesIdx;
    let foundValue = true;
    while (foundValue) {
      foundValue = false;
      for (let i = 0, len = this.cells.length; i < len; i++) {
        if (this.cells[i].isGiven) {
          continue;
        }
        possiblesIdx = this.cells[i].getPossibles();
        if (possiblesIdx.length === 1) {
          this.cells[i].currentValue = possiblesIdx[0] + 1;
          this.changeNeighborsPos(i, possiblesIdx[0], false);
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
    //a function that will get all missing nums, and insert them if they can only be put in one place
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


export default SudokuBoard;
