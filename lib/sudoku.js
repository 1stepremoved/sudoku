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


export default SudokuBoard;
