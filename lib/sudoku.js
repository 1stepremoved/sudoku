// import $ from 'jquery';

function shuffle(array) {
  let currentIndex = array.length, temporaryValue, randomIndex;

  while (0 !== currentIndex) {

    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

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
    this.makeGame = this.makeGame.bind(this);
    this.clear = this.clear.bind(this);
    this.clearErrors = this.clearErrors.bind(this);
    this.checkForErrors = this.checkForErrors.bind(this);
    this.checkRowsOrColsForErrors = this.checkRowsOrColsForErrors.bind(this);
    this.clearErrors = this.clearErrors.bind(this);
    this.hint = this.hint.bind(this);

    this.gaveHint = false;
    this.makeGame();
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

  makeGame(){
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

  hint() {
    const blanks = [];
    for (let i = 0, len = this.cells.length; i < len; i++) {
      if (!this.cells[i].isGiven && this.cells[i].currentValue === 0) {
        blanks.push(i);
      }
    }
    if (blanks.length === 0) {return;}
    this.gaveHint = true;
    const idx = blanks[Math.floor(Math.random() * blanks.length)];
    this.cells[idx].currentValue = this.solvedGrid[idx];
    this.cells[idx].isGiven = true;
    $(`#${idx}`).addClass("given");
    this.render();
  }

  isFull() {
    for (let i = 0, len = this.cells.length; i < len; i++) {
      if (!this.cells[i].isGiven && this.cells[i].currentValue === 0) {
        return false;
      }
    }
    return true;
  }

  isSolved() {
    for (let i = 0, len = this.cells.length; i < len; i++) {
      if (this.cells[i].currentValue !== this.solvedGrid[i]) {
        return false;
      }
    }
    return true;
  }

  clear(givens) {
    this.clearErrors();
    for (let i = 0, len = this.cells.length; i <len; i++) {
      if (givens || !this.cells[i].isGiven) {
        this.cells[i].currentValue = 0;
        this.cells[i].possibles = [false,false,false,false,false,false,false,false,false];
        this.cells[i].isGiven = false;
        this.cells[i].inConflict = false;
        $(`#${i}`).removeClass("given");
      }
    }
    this.render();
  }

  clearErrors() {
    for (let i = 0, len = this.cells.length; i < len; i++) {
      $(`#${i}`).removeClass("indirect-error");
      $(`#${i}`).removeClass("direct-error");
    }
  }

  checkForErrors() {
    this.clearErrors();
    const cells = {};
    const rows = this.checkRowsOrColsForErrors(cells, true);
    const cols = this.checkRowsOrColsForErrors(cells, false);
    const boxes = [];
    let error;
    for (let i = 0, len = this.boxes.length; i < len; i++) {
      error = this.boxes[i].checkForErrors(cells);
      if (error) {
        boxes.push(i);
      }
    }

    if (boxes.length === 0 && rows.length === 0 && cols.length === 0) {
      return true;
    }

    for (let i = 0, rowTot = rows.length; i < rowTot; i++) {
      for (let j = 0; j < 9; j++) {
        this.cells[(rows[i] * 9) + j].toggleErrorColor(false);
      }
    }
    for (let i = 0, colTot = cols.length; i < colTot; i++) {
      for (let j = 0; j < 9; j++) {
        this.cells[(9 * j) + cols[i]].toggleErrorColor(false);
      }
    }
    for (let i = 0, len = boxes.length; i < len; i++) {
      this.boxes[boxes[i]].toggleErrorColor();
    }
    Object.keys(cells).forEach((el) => {
      $(`#${el}`).addClass("direct-error");
      $(`#${el}`).removeClass("indirect-error");
    });
    return false;
  }


  checkRowsOrColsForErrors(cells, checkRows) {
    let idx;
    let errors = [];
    // debugger
    for (let i = 0, len = Math.sqrt(this.cells.length); i < len; i++) {
      // debugger
      let section = [false,false,false,false,false,false,false,false,false];
      for (let j = 0; j < len; j++) {
        if (checkRows) {idx = (i * 9) + j;}
        else {idx = (j * 9) + i;}

        if (this.cells[idx].currentValue === 0) {
          continue;
        } else if (section[this.cells[idx].currentValue - 1] !== false) {
          cells[idx] = true;
          cells[section[this.cells[idx].currentValue - 1]] = true;
          errors.push(i);
        } else {
          section[this.cells[idx].currentValue - 1] = idx;
        }
      }
    }
    return errors;
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
    if (cellIdx >= 81) { return true;}

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
      if (this.cells[i].currentValue > 0) { continue; }
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

    this.checkForSolutions = this.checkForSolutions.bind(this);
    this.checkForErrors = this.checkForErrors.bind(this);
    this.toggleErrorColor = this.toggleErrorColor.bind(this);
  }

  checkForErrors(cells) {
    const nums = [false, false, false, false, false, false, false, false, false];
    let errors = false;
    for (let i = 0, len = this.cells.length; i < len; i++) {
      if (this.cells[i].currentValue === 0) {
        continue;
      } else if (nums[this.cells[i].currentValue - 1] !== false) {
        cells[this.cells[i].idx] = true;
        cells[nums[this.cells[i].idx]] = true;
        errors = true;
      } else {
        nums[this.cells[i].currentValue - 1] = this.cells[i].idx;
      }
    }
    return errors;
  }

  toggleErrorColor(toggleOn = true) {
    for (let i = 0, len = this.cells.length; i < len; i++) {
      if (toggleOn) {
        $(`#${this.cells[i].idx}`).addClass("indirect-error");
        $(`#${this.cells[i].idx}`).addClass("indirect-error");
      } else {
        $(`#${this.cells[i].idx}`).removeClass("indirect-error");
        $(`#${this.cells[i].idx}`).removeClass("indirect-error");
      }
    }
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
    this.toggleErrorColor = this.toggleErrorColor.bind(this);
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

  toggleErrorColor(direct, toggleOn = true) {
    if (toggleOn) {
      if (direct) {
        $(`#${this.idx}`).addClass("direct-error");
        $(`#${this.idx}`).removeClass("indirect-error");
      } else {
        $(`#${this.idx}`).addClass("indirect-error");
      }
    } else {
      $(`#${this.idx}`).removeClass("direct-error");
    }
  }
}


export default SudokuBoard;
