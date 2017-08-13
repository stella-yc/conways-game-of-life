var gameOfLife = {
  width: 12,
  height: 12, // width and height dimensions of the board
  stepInterval: null, // should be used to hold reference to an interval that is "playing" the game

  createAndShowBoard: function () {
    /** create <table> element **/
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

    // add table to the #board element
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

  setupBoardEvents: function() {
    // each board cell has an CSS id in the format of: "x-y"
    // where x is the x-coordinate and y the y-coordinate
    // uses this fact to loop through all the ids and assign
    // them "click" events that allow a user to click on
    // cells to setup the initial state of the game
    // before clicking "Step" or "Auto-Play"

    /** clicking on a cell toggles the cell between "alive" & "dead" **/
    var onCellClick = function (e) {
      if (this.dataset.status == 'dead') {
        this.className = 'alive';  // 'this' will refer to the cell
        this.dataset.status = 'alive';
      } else {
        this.className = 'dead';
        this.dataset.status = 'dead';
      }
    };
    // iterate through all cells and attach event listener
    this.forEachCell(function(cell) {
      cell.addEventListener('click', onCellClick);
    });

    /** Clear the board **/
    var clearCell = function (cell) {
        cell.className = 'dead';
        cell.dataset.status = 'dead';
    };
    var clearBtn = document.getElementById('clear_btn');
    clearBtn.addEventListener('click', function() {
      gameOfLife.forEachCell(clearCell);
    });

    /** Reset Button - set the board's to random values **/
    var random = function(cell) {
      var r = Math.floor(Math.random() * 2) + 1;
      if (r === 1) {
        cell.className = 'dead';
        cell.dataset.status = 'dead';
      } else {
        cell.className = 'alive';
        cell.dataset.status = 'alive';
      }
    };
    var resetBtn = document.getElementById('reset_btn');
    resetBtn.addEventListener('click', function() {
      gameOfLife.forEachCell(random);
    });

    /** Step Button **/
    var stepBtn = document.getElementById('step_btn');
    stepBtn.addEventListener('click', this.step.bind(this));

    /** Play Button - auto plays **/
    var playBtn = document.getElementById('play_btn');
    playBtn.addEventListener('click', this.enableAutoPlay.bind(this));
  },

  step: function () {
    // Here is where you want to loop through all the cells
    // on the board and determine, based on it's neighbors,
    // whether the cell should be dead or alive in the next
    // evolution of the game.
    //
    // You need to:
    // 1. Count alive neighbors for all cells
    // 2. Set the next state of all cells based on their alive neighbors
    var countNeighbors = function(cell) {
      var [x, y] = cell.id.split('-').map((num => parseInt(num, 10)));
      let count = 0;
      for (var i = y - 1; i <= y + 1; i++) {
        for (var j = x - 1; j<= x + 1; j++) {
          if (i === y && j === x) {
            continue;
          }
          let cell = document.getElementById(`${j}-${i}`);
          if (cell && cell.className === 'alive') {
            count++;
          }
        }
      }
      // if (count > 0) console.log(`count for ${x}-${y}`, count);
      return count;
    };

    var calcNextState = function(cell) {
      let neighbors = countNeighbors(cell);
      if (neighbors < 2 || neighbors > 3) {
        cell.dataset.status = 'dead';
      }
      if (neighbors === 3) {
        cell.dataset.status = 'alive';
      }
    }
    this.forEachCell(calcNextState);

    var stepState = function(cell) {
      let newStatus = cell.dataset.status;
      cell.className = newStatus;
    }
    this.forEachCell(stepState);
  },

  enableAutoPlay: function () {
    // Start Auto-Play by running the 'step' function
    // automatically repeatedly every fixed time interval
    if (!this.stepInterval) {
      this.stepInterval = setInterval(this.step.bind(this), 200);
    } else {
      clearInterval(this.stepInterval);
      this.stepInterval = null;
    }
  }

};

gameOfLife.createAndShowBoard();
