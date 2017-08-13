var gameOfLife = {
  width: 12,
  height: 12, // width and height dimensions of the board
  stepInterval: null, // should be used to hold reference to an interval that is "playing" the game

  patterns: {
    acorn: [
      "..OO......",
      "O..O......",
      "OO.O.OO...",
      ".O.O..O...",
      ".O....O.OO",
      "..OOO.O.OO",
      ".....O....",
      "....O.....",
      "....OO...."
    ]
  },

  createAndShowBoard: function () {
    // build the grid
    var grid = document.createElement("tbody");
    var tablehtml = '';
    for (var h=0; h<this.height; h++) {
      tablehtml += "<tr id='row+" + h + "'>";
      for (var w=0; w<this.width; w++) {
        tablehtml += "<td data-status='dead' id='" + w + "-" + h + "'></td>";
      }
      tablehtml += "</tr>";
    }
    grid.innerHTML = tablehtml;

    // add the grid to the #board element
    var board = document.getElementById('board');
    board.appendChild(grid);

    // once html elements are added to the page, attach events to them
    this.setupBoardEvents();
  },

  /** Call iteratorFunc on every cell in the board **/
  forEachCell: function (iteratorFunc) {
    var coordinates, cell;
    for (var i = 0; i < this.width; i++) {
      for (var j = 0; j < this.height; j++) {
        coordinates = String(j) + '-' + String(i);
        cell = document.getElementById(coordinates);
        iteratorFunc(cell, i, j);
      }
    }
  },
  getCellStatus: function(cell) {
    return cell.dataset.status;
  },

  setCellStatus: function(status, cell) {
    cell.className = status;
    cell.dataset.status = status;
  },

  clearBoard: function() {
    this.forEachCell(this.setCellStatus.bind(null, 'dead'));
  },

  /** clicking on a cell toggles the cell between "alive" & "dead" **/
  toggleCell: function(cell) {
    if (cell.dataset.status === 'dead') {
      this.setCellStatus('alive', cell);
    } else {
      this.setCellStatus('dead', cell);
    }
  },

  randomCellState: function(cell) {
    var r = Math.floor(Math.random() * 2) + 1;
    if (r === 1) {
      this.setCellStatus('dead', cell);
    } else {
      this.setCellStatus('alive', cell);
    }
  },

  randomBoard: function() {
    this.forEachCell(this.randomCellState.bind(this));
  },

  setupBoardEvents: function() {
    // each board cell has an id in the format of: "x-y"
    // where x is the x-coordinate and y the y-coordinate
    // uses this fact to loop through all the ids and assign
    // them "click" events

    var gol = this;
    /** iterate through all cells and attach event listener **/
    gol.forEachCell(function(cell) {
      cell.addEventListener('click', function() {
        gol.toggleCell(cell);
      });
    });

    /** Clear Button - clear the board **/
    document
      .getElementById('clear_btn')
      .addEventListener('click', function() {
        gol.clearBoard();
        gol.stopAutoPlay();
      });

    /** Reset Button - set the cells to random values **/
    document
      .getElementById('reset_btn')
      .addEventListener('click', gol.randomBoard.bind(gol));

    /** Step Button **/
    document
      .getElementById('step_btn')
      .addEventListener('click', gol.step.bind(gol));

    /** Play Button - auto plays **/
    document
      .getElementById('play_btn')
      .addEventListener('click', gol.enableAutoPlay.bind(gol));
  },

  countNeighbors: function(cell) {
    var [x, y] = cell.id.split('-').map((num => parseInt(num, 10)));
    var count = 0;
    for (var i = y - 1; i <= y + 1; i++) {
      for (var j = x - 1; j<= x + 1; j++) {
        if (i === y && j === x) {
          continue;
        }
        var neighbor = document.getElementById(`${j}-${i}`);
        if (neighbor && neighbor.className === 'alive') {
          count++;
        }
      }
    }
    return count;
  },

  cellsToChange: function() {
    var gol = this;
    var cellsToToggle = [];
    var calcNextState = function(cell) {
      let neighbors = gol.countNeighbors(cell);
      if (cell.dataset.status === 'alive') {
        if (neighbors < 2 || neighbors > 3) {
          cellsToToggle.push(cell);
        }
      }
      if (cell.dataset.status === 'dead') {
        if (neighbors === 3) {
          cellsToToggle.push(cell);
        }
      }
    };
    gol.forEachCell(calcNextState);
    return cellsToToggle;
  },

  nextBoardState: function(arr) {
    var gol = this;
    arr.forEach(function(cell) {
      gol.toggleCell(cell);
    });
  },

  step: function () {
    // 1. find the cells whose status needs to change
    var toBeToggled = this.cellsToChange();

    // 2. apply changes to the board
    this.nextBoardState(toBeToggled);
  },

  stopAutoPlay: function() {
    if (this.stepInterval) {
      clearInterval(this.stepInterval);
      this.stepInterval = null;
      document
        .getElementById('play_btn')
        .innerText = 'Play';
    }
  },

  enableAutoPlay: function () {
    // Start Auto-Play by running the 'step' function
    // automatically repeatedly every fixed time interval
    if (!this.stepInterval) {
      this.stepInterval = setInterval(this.step.bind(this), 200);
      document
        .getElementById('play_btn')
        .innerText = 'Stop';
    } else {
      this.stopAutoPlay();
    }
  }

};

gameOfLife.createAndShowBoard();
