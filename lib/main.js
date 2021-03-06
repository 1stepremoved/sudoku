import SudokuBoard from './sudoku';
// import $ from 'jquery';

document.addEventListener("DOMContentLoaded", () => {
  const game = new SudokuGame();
  var touchsupport = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
  if (!touchsupport){ // browser doesn't support touch
      document.documentElement.className += " non-touch";
  }
});

class SudokuGame {
  constructor() {
    this.setUpSudoku = this.setUpSudoku.bind(this);
    this.setUpGrid = this.setUpGrid.bind(this);
    this.setUpNumberPanel = this.setUpNumberPanel.bind(this);
    this.setUpOptionsPanel = this.setUpOptionsPanel.bind(this);
    this.setUpPuzzleIdForm = this.setUpPuzzleIdForm.bind(this);
    this.gridProportions = this.gridProportions.bind(this);
    this.isTargetInClass = this.isTargetInClass.bind(this);
    this.dragOver = this.dragOver.bind(this);
    this.dragEnter = this.dragOver.bind(this);
    this.dragLeave = this.dragOver.bind(this);
    this.drop = this.drop.bind(this);
    this.check = this.check.bind(this);
    this.newPuzzle = this.newPuzzle.bind(this);


    this.setUpSudoku();
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
      if (parseInt(this.selectedButton.attr("val")) === 0 && this.selectedCell.hasClass("direct-error")) {
        this.board.checkForErrors();
      }
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
      } else if (e.keyCode === 37 && this.selectedId % 9 !== 0 && !$("#puzzle-id-input").is(":focus")) {
        this.selectedCell.removeClass("selected");
        this.selectedCell = $(`#${this.selectedId - 1}`);
        this.selectedId = parseInt(this.selectedCell.attr('id'));
        this.selectedCell.addClass("selected");
      } else if (e.keyCode === 39 && this.selectedId % 9 !== 8 && !$("#puzzle-id-input").is(":focus")) {
        this.selectedCell.removeClass("selected");
        this.selectedCell = $(`#${this.selectedId + 1}`);
        this.selectedId = parseInt(this.selectedCell.attr('id'));
        this.selectedCell.addClass("selected");
      } else if (e.keyCode === 38 && Math.floor(this.selectedId / 9) !== 0 && !$("#puzzle-id-input").is(":focus")) {
        this.selectedCell.removeClass("selected");
        this.selectedCell = $(`#${this.selectedId - 9}`);
        this.selectedId = parseInt(this.selectedCell.attr('id'));
        this.selectedCell.addClass("selected");
      } else if (e.keyCode === 40 && Math.floor(this.selectedId / 9) !== 8 && !$("#puzzle-id-input").is(":focus")) {
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
        if (this.selectedCell.hasClass("direct-error")){
          this.board.checkForErrors();
        }
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

    this.board = new SudokuBoard();


  }

  setUpSudoku() {
    $("#board").children().remove();
    let gameSpace = $(document.createElement("main"));
    gameSpace.attr("id", "game-space");
    $("#board").append(gameSpace);
    this.setUpGrid();
    this.setUpNumberPanel();
    this.setUpPuzzleIdForm();
    this.setUpOptionsPanel();
    this.gridProportions();
  }

  setUpGrid() {
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
    $("#game-space").append(grid);
  }

  setUpNumberPanel() {
    // if( !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    //  return;
    // }
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
    $("#game-space").append(numberPanel);
  }

  gridProportions() {
    let side;
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      side =  Math.max(Math.floor(Math.min(window.screen["availHeight"] * 0.8, window.screen["availWidth"] * 0.75)), 250);
    } else {
      side =  Math.max(Math.floor(Math.min($(window).height() * 0.8, $(window).width() * 0.9)), 350);
    }
    side -= (side % 9);
    $("#grid").css({"height": side, "width": side});
    $("#number-panel").css({"height": side, "width": Math.floor(0.1 * side)});
    $(".sudoku-box").css({"font-size": Math.floor(side * 0.085)});
    $(".sudoku-cell-possibility").css({"font-size": Math.floor(side * 0.03)});
    $(".number-button").css({"font-size": Math.floor(side * 0.08)});
    $("#puzzle-id-input").css({"width": Math.floor(side - 50)});
    // if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    $(".option-button").css({"width": Math.floor((side + Math.floor(side * 0.08) + 42) / 4)});
   // } else {
   //   $("#options-panel").css({"padding-left": 20});
   //   $(".option-button").css({"width": Math.floor((side + 10) / 4)});
   // }
    // $("#options-panel").css({"margin-left": $("#grid").offset()["left"]});
  }

  setUpOptionsPanel() {
    let optionsPanel = $(document.createElement("div"));
    optionsPanel.attr("id", "options-panel");
    let option = $(document.createElement("div"));
    option.addClass("option-button");
    option.attr("id", "new-puzzle-button");
    option.html("NEW");
    option.on("click", this.newPuzzle);
    option.on("touchend", this.newPuzzle);
    optionsPanel.append(option);
    option = $(document.createElement("div"));
    option.addClass("option-button");
    option.attr("id", "clear-button");
    option.html("CLEAR");
    option.on("click", () => (this.board.clear(false)));
    option.on("touchend", () => (this.board.clear(false)));
    optionsPanel.append(option);
    option = $(document.createElement("div"));
    option.addClass("option-button");
    option.attr("id", "hint-button");
    option.html("HINT");
    optionsPanel.append(option);
    option.on("click", () => (this.board.hint()));
    option.on("touchend", () => (this.board.hint()));
    option = $(document.createElement("div"));
    option.addClass("option-button");
    option.attr("id", "check-submit-button");
    option.html("CHECK");
    option.on("click", this.check);
    option.on("touchend", this.check);
    optionsPanel.append(option);
    $("#board").append(optionsPanel);
  }

  setUpPuzzleIdForm() {
    let puzzleIdForm = $(document.createElement("form"));
    puzzleIdForm.attr("id","puzzle-id-form");
    let puzzleIdLabel = $(document.createElement("div"));
    puzzleIdLabel.html("Puzzle ID:");
    puzzleIdLabel.attr("id","puzzle-id-label");
    puzzleIdLabel.attr("data","original");
    puzzleIdForm.append(puzzleIdLabel);
    puzzleIdLabel.on("click", (e) => {
      if (puzzleIdLabel.attr("data") === "original") {
        puzzleIdLabel.html("Copy");
        puzzleIdInput.select();
        document.execCommand("Copy");
        document.getSelection().empty();
      } else {
        puzzleIdForm.submit();
      }
    });
    puzzleIdLabel.on("mouseenter", ()=> {
      if (puzzleIdLabel.attr("data") === "original") {
        puzzleIdLabel.html("Copy");
      }
    });
    puzzleIdLabel.on("mouseleave", ()=> {
      if (puzzleIdLabel.attr("data") === "original") {
        puzzleIdLabel.html("Puzzle ID");
      }
    });
    let puzzleIdInput = $(document.createElement("input"));
    puzzleIdInput.attr("id","puzzle-id-input");
    puzzleIdInput.attr("autocomplete","off");
    puzzleIdInput.on("input", ()=> {
      if (puzzleIdInput.val() !== this.board.uniqueId) {
        puzzleIdLabel.attr("data","changed");
        puzzleIdLabel.html("Go to puzzle");
      }
    });
    const that = this;
    puzzleIdInput.on("focusout", ()=> {
      if (puzzleIdInput.val() === "" || puzzleIdInput.val() === this.board.uniqueId) {
        puzzleIdInput.val(this.board.uniqueId);
        puzzleIdLabel.attr("data","original");
        puzzleIdLabel.html("Puzzle ID:");
      }
    });
    puzzleIdInput.on("focus", ()=> {
      puzzleIdInput.select();
    });
    puzzleIdForm.on("submit",(e) => {
      e.preventDefault();
      if ($("#puzzle-id-input").val().length === 81) {
        this.board.clear(true);
        this.board.makeGameFromKey($("#puzzle-id-input").val());
        $("#time-display").remove();
        window.scroll({"top": 0, "behavior": "smooth"});
        puzzleIdLabel.attr("data","original");
        puzzleIdLabel.html("Puzzle ID");
      }
    });
    puzzleIdForm.append(puzzleIdInput);
    $("#board").append(puzzleIdForm);
  }

  newPuzzle() {
    this.board.clear(true);
    this.board.makeGame();
    $("#time-display").remove();
    window.scroll({"top": 0, "behavior": "smooth"});
  }

  check() {
    if (this.board.checkForErrors()) {
      if (this.board.isFull()) {
        for (let i = 0, len = this.board.cells.length; i < len; i++) {
          $(`#${i}`).addClass("solved");
        }
        this.totalTime = Date.now() - this.board.startTime;
        this.makeTimeDisplay();
      } else {
        $(".sudoku-cell").addClass("green-text");
        $(".sudoku-box").addClass("green-text");
        $("#grid").addClass("green-text");
        setTimeout(() => {
          $(".sudoku-cell").removeClass("green-text");
          $(".sudoku-box").removeClass("green-text");
          $("#grid").removeClass("green-text");
        }, 250);
      }
    }
  }

  makeTimeDisplay() {
    let timeDisplay = $(document.createElement("div"));
    timeDisplay.attr("id", "time-display");
    timeDisplay.html(`Your time is ${this.totalTime}`);
    $("#board").append(timeDisplay);
    document.getElementById("time-display").scrollIntoView({"behavior": "smooth"});
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
      if (num === 0 && target.hasClass("direct-error")) {
        this.board.checkForErrors();
      }
      this.board.render();
    }
    this.selectedCell = target;
    this.selectedId = parseInt(this.selectedCell.attr('id'));
  }
}
