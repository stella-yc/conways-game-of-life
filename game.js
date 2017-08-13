const gameOfLife = {
  width: 20,
  height: 20, // width and height dimensions of the board
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
    const grid = document.createElement("tbody");
    let tablehtml = '';
    for (let h = 0; h < this.height; h++) {
      tablehtml += "<tr id='row+" + h + "'>";
      for (let w = 0; w < this.width; w++) {
        tablehtml += "<td data-status='dead' id='" + w + "-" + h + "'></td>";
      }
      tablehtml += "</tr>";
    }
    grid.innerHTML = tablehtml;

    // add the grid to the #board element
    document.getElementById('board').appendChild(grid);

    // once html elements are added to the page, attach events to them
    this.setupBoardEvents();
  },

  removeBoard: function () {
    const child = document.getElementsByTagName('tbody');
    document.getElementById('board').removeChild(child[0]);
  },

  /** Call iteratorFunc on every cell in the board **/
  forEachCell: function (iteratorFunc) {
    let coordinates, cell;
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        coordinates = String(i) + '-' + String(j);
        cell = document.getElementById(coordinates);
        if (!cell) throw new Error(coordinates);
        iteratorFunc(cell, i, j);
      }
    }
  },

  isCellAlive: function(cell) {
    return cell.dataset.status === 'alive';
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
    let r = Math.floor(Math.random() * 2) + 1;
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

    /** attach event listener to the board, and use event delegation **/
    const onCellClick = event => this.toggleCell(event.target);
    document.getElementById('board').onclick = onCellClick;

    /** Clear Button - clear the board **/
    document
      .getElementById('clear_btn')
      .addEventListener('click', () => {
        this.clearBoard();
        this.stopAutoPlay();
      });

    /** Reset Button - set the cells to random values **/
    document
      .getElementById('reset_btn')
      .addEventListener('click', () => {
        this.randomBoard();
      });

    /** Step Button **/
    document
      .getElementById('step_btn')
      .addEventListener('click', () => {
        this.step();
      });

    /** Play Button - auto plays **/
    document
      .getElementById('play_btn')
      .addEventListener('click', () => {
        this.enableAutoPlay();
      });


    document
      .getElementById('resize_btn')
      .addEventListener('click', (event) => {
        event.preventDefault();
        let customWidth = document.getElementById('width').value;
        let customHeight = document.getElementById('height').value;
        console.log(customWidth, customHeight);
        this.width = parseInt(customWidth, 10);
        this.height = parseInt(customHeight, 10);
        console.log('this.width, this.height', this.width, this.height);
        this.removeBoard();
        this.createAndShowBoard();
      });
  },

  countNeighbors: function(cell) {
    let [x, y] = cell.id.split('-').map((num => parseInt(num, 10)));
    let count = 0;
    console.log('count neighbors');
    for (let i = y - 1; i <= y + 1; i++) {
      for (let j = x - 1; j<= x + 1; j++) {
        if (i === y && j === x) {
          continue;
        }
        let neighbor = document.getElementById(`${j}-${i}`);
        if (neighbor && neighbor.className === 'alive') {
          count++;
        }
      }
    }
    return count;
  },

  cellsToChange: function() {
    let cellsToToggle = [];
    let calcNextState = (cell) => {
      let neighbors = this.countNeighbors(cell);
      if (this.isCellAlive(cell)) {
        if (neighbors < 2 || neighbors > 3) {
          cellsToToggle.push(cell);
        }
      }
      if (!this.isCellAlive(cell)) {
        if (neighbors === 3) {
          cellsToToggle.push(cell);
        }
      }
    };
    this.forEachCell(calcNextState);
    return cellsToToggle;
  },

  nextBoardState: function(arr) {
    arr.forEach((cell) => {
      this.toggleCell(cell);
    });
  },

  step: function () {
    // 1. find the cells whose status needs to change
    const toBeToggled = this.cellsToChange();

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
