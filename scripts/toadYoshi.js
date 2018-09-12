class ToadYoshi {
  // Set up number of columns and rows
  constructor(selector, numRows, numCols) {
    this.ROWS = numRows;
    this.COLUMNS = numCols;
    this.selector = selector;
    this.activePlayer = null;
    this.passivePlayer = null;
    this.highlightedCells = [];
    // initialize the default and other weapons
    this.defaultWeapon = new Weapon("cupcake", 10);
    this.weapons = {
      shell: new Weapon("shell", 20),
      coin: new Weapon("coin", 30),
      brick: new Weapon("brick", 40),
      gun: new Weapon("gun", 50)
    };
    this.setUpEventListeners();
  }

  createGrid() {
    // Initialized board object
    const $board = $(this.selector);
    for (let row = 0; row < this.ROWS; row++) {
      const $row = $("<div>").addClass("row");
      for (let col = 0; col < this.COLUMNS; col++) {
        // adding attribute to each cell to differentiate in terms
        // of their row and column
        const $cell = $("<div>")
          .addClass("col empty")
          .attr("data-col", col)
          .attr("data-row", row);
        $row.append($cell);
      }
      $board.append($row);
    }
  }

  setActivePlayer(active, passive) {
    this.activePlayer = active;
    this.passivePlayer = passive;
    this.setHighlightedCells();
  }

  setHighlightedCells() {
    // deleted all highlighted cells
    this.removeAllHighlightedCells();
    // empty the highlighted
    this.highlightedCells.length = 0;

    const currentRow = this.activePlayer.rowNumber;
    const currentCol = this.activePlayer.colNumber;

    // check all cells down
    for (let i = 1; i < 4; i++) {
      if (currentRow + i >= this.ROWS) {
        break;
      }
      // fetch current cell
      const $cell = this.getCell(currentRow + i, currentCol);
      if ($cell.hasClass("empty") === false) {
        break;
      } else {
        this.highlightedCells.push($cell);
      }
    }

    // check all cells up
    for (let i = 1; i < 4; i++) {
      if (currentRow - i < 0) {
        break;
      }
      // fetch current cell
      const $cell = this.getCell(currentRow - i, currentCol);
      if ($cell.hasClass("empty") === false) {
        break;
      } else {
        this.highlightedCells.push($cell);
      }
    }

    // check all cells right
    for (let i = 1; i < 4; i++) {
      if (currentCol + i >= this.COLUMNS) {
        break;
      }
      // fetch current cell
      const $cell = this.getCell(currentRow, currentCol + i);
      if ($cell.hasClass("empty") === false) {
        break;
      } else {
        this.highlightedCells.push($cell);
      }
    }

    // check all cells left
    for (let i = 1; i < 4; i++) {
      if (currentCol - i < 0) {
        break;
      }
      // fetch current cell
      const $cell = this.getCell(currentRow, currentCol - i);
      if ($cell.hasClass("empty") === false) {
        break;
      } else {
        this.highlightedCells.push($cell);
      }
    }

    // for every cell in the array add class highlighted
    this.highlightedCells.forEach(function(cell) {
      cell.addClass("highlighted");
    });
  }

  placePlayer(player) {
    // Pick cell from row and column number
    const $cell = this.getCell(player.rowNumber, player.colNumber);
    $cell.removeClass("empty").addClass(`${player.type}`);
  }

  // will place obstacle on gameboard
  placeObstacles(oPairs) {
    const classArray = ["tree", "obstacle"];
    oPairs.forEach(pair => {
      const $cell = this.getCell(pair[0], pair[1]);
      const randomClass =
        classArray[Math.floor(Math.random() * classArray.length)];
      $cell.removeClass("empty").addClass(randomClass);
    });
  }

  // will place weapons on gameboard
  placeWeapons(pairs) {
    let wArray = [];
    for (let k in this.weapons) {
      if (this.weapons.hasOwnProperty(k)) {
        wArray.push(this.weapons[k]);
      }
    }
    for (let i = 0; i < 4; i++) {
      // get weapon
      let currWeapon = wArray[i];
      // get pair
      const currPair = pairs[i];
      const $cell = this.getCell(currPair[0], currPair[1]);
      $cell.addClass(`weapon ${currWeapon.type}`);
    }
  }

  setUpEventListeners() {
    const $board = $(this.selector);
    const that = this;

    // Show player in translucent mode
    $board.on("mouseenter", ".col.empty", function() {
      // get the cell where we are hovering right now
      const currRow = $(this).data("row");
      const currCol = $(this).data("col");

      // check if player can be moved here
      if (that.canPlacePlayer(currRow, currCol)) {
        // get the cell where we are hovering right now
        const $currCell = that.getCell(currRow, currCol);
        $currCell.addClass(`next-${that.activePlayer.type}`);
      }
    });

    $board.on("mouseleave", ".col", function() {
      $(".col").removeClass(`next-${that.activePlayer.type}`);
    });

    $board.on("click", ".col.empty", function() {
      // get the row and column where the player is present currently
      const presentRow = that.activePlayer.rowNumber;
      const presentCol = that.activePlayer.colNumber;

      // get the cell we are hovering right now
      const clickedRow = $(this).data("row");
      const clickedCol = $(this).data("col");

      // Place player only if condition satisfies
      if (that.canPlacePlayer(clickedRow, clickedCol)) {
        // get clicked cell
        const $clickedCell = that.getCell(clickedRow, clickedCol);
        // get present cell
        const $presentCell = that.getCell(presentRow, presentCol);
        // place player on clicked cell
        $clickedCell
          .removeClass(`next-${that.activePlayer.type}`)
          .addClass(that.activePlayer.type);
        $clickedCell.removeClass("empty");
        // remove player from present cell
        $presentCell.removeClass(that.activePlayer.type).addClass("empty");
        // move player
        that.activePlayer.move(clickedRow, clickedCol);
        // increase strength of player if it captures a weapon
        that.addWeaponIfNeeded($clickedCell, $presentCell, that.activePlayer);
        that.setPlayerScores();
        if (that.checkIfAdjacent()) {
          // remove all highlighted cells
          that.removeAllHighlightedCells();
          // Logic for starting fight
          //that.startFight();
          that.switchPlayers();
        } else {
          // make the second player active now
          that.setActivePlayer(that.passivePlayer, that.activePlayer);
        }
      }
    });

    $(toadAttackButton).click(function() {
      that.performAttack();
      that.switchPlayers();
    });

    $(toadDefendButton).click(function() {
      that.performDefence();
      that.switchPlayers();
    });

    $(yoshiAttackButton).click(function() {
      that.performAttack();
      that.switchPlayers();
    });

    $(yoshiDefendButton).click(function() {
      that.performDefence();
      that.switchPlayers();
    });
  }

  performAttack() {
    if (this.passivePlayer.isAttacking === true) {
      this.passivePlayer.score -= this.activePlayer.weapon.damage;
    } else {
      this.passivePlayer.score -= Math.round(
        this.activePlayer.weapon.damage / 2
      );
    }
    this.setPlayerScores();
  }

  performDefence() {
    this.activePlayer.setIsAttacking(false);
  }

  switchPlayers() {
    if (this.passivePlayer.score <= 0) {
      $(winningPlayer).text(`${this.activePlayer.type}`);
      $(weaponDiv).hide();
      $(gameOverDiv).show();
      $(startGameDiv).hide();
      $(toadYoshiDiv).hide();
      $(yoshiContainerDiv).hide();
      $(toadContainerDiv).hide();
      return;
    }
    // switch active player
    let temp = this.activePlayer;
    this.activePlayer = this.passivePlayer;
    this.passivePlayer = temp;
    // switch back to attacking mode if the player is currently not attacking
    this.activePlayer.setIsAttacking(true);
    // set button active for active player
    if (this.activePlayer.type == "toad") {
      $(toadAttackButton)
        .removeClass("inactive")
        .addClass("active")
        .prop("disabled", false);
      $(toadDefendButton)
        .removeClass("inactive")
        .addClass("active")
        .prop("disabled", false);
      $(yoshiAttackButton)
        .removeClass("active")
        .addClass("inactive")
        .prop("disabled", true);
      $(yoshiDefendButton)
        .removeClass("active")
        .addClass("inactive")
        .prop("disabled", true);
    } else {
      $(yoshiAttackButton)
        .removeClass("inactive")
        .addClass("active")
        .prop("disabled", false);
      $(yoshiDefendButton)
        .removeClass("inactive")
        .addClass("active")
        .prop("disabled", false);
      $(toadAttackButton)
        .removeClass("active")
        .addClass("inactive")
        .prop("disabled", true);
      $(toadDefendButton)
        .removeClass("active")
        .addClass("inactive")
        .prop("disabled", true);
    }
  }

  // Check if player can be placed at this cell
  canPlacePlayer(row, col) {
    const $hoveredCell = $(`[data-col="${col}"]`).filter(`[data-row="${row}"]`);
    return $hoveredCell.hasClass("highlighted");
  }

  // get cell from row and column
  getCell(row, col) {
    return $(`[data-col="${col}"]`).filter(`[data-row="${row}"]`);
  }

  // check if the cell had any weapon
  addWeaponIfNeeded(clickedCell, presentCell, player) {
    const cRow = $(clickedCell).data("row");
    const cCol = $(clickedCell).data("col");
    const pRow = $(presentCell).data("row");
    const pCol = $(presentCell).data("col");
    let cellsToInspect = [];
    // the two cells are on the same row
    if (cRow == pRow) {
      // same row
      if (cCol > pCol) {
        for (let col = pCol + 1; col <= cCol; col++) {
          cellsToInspect.push(this.getCell(cRow, col));
        }
      } else {
        for (let col = cCol; col < pCol; col++) {
          cellsToInspect.push(this.getCell(cRow, col));
        }
      }
    } else if (cCol == pCol) {
      // same col
      if (cRow > pRow) {
        for (let row = pRow + 1; row <= cRow; row++) {
          cellsToInspect.push(this.getCell(row, cCol));
        }
      } else {
        for (let row = cRow; row < pRow; row++) {
          cellsToInspect.push(this.getCell(row, cCol));
        }
      }
    }

    // find cell with weapon in this range
    let weaponFound = false;
    let weaponCell = null;
    // for now add red border on cells
    cellsToInspect.forEach(function(cell) {
      if (cell.hasClass("weapon")) {
        console.log("weapon has been found");
        weaponFound = true;
        weaponCell = cell;
      }
    });
    // if weapon has been found drop the weapon to that cell
    if (weaponFound) {
      this.dropAndReplaceWeapon(weaponCell, player);
    }
  }

  dropAndReplaceWeapon(cellToDropAt, player) {
    // current weapon of the player
    const currentWeapon = player.weapon;
    // add weapon to player
    if (cellToDropAt.hasClass("cupcake")) {
      player.weapon = this.defaultWeapon;
    } else if (cellToDropAt.hasClass("shell")) {
      player.weapon = this.weapons.shell;
    } else if (cellToDropAt.hasClass("coin")) {
      player.weapon = this.weapons.coin;
    } else if (cellToDropAt.hasClass("brick")) {
      player.weapon = this.weapons.brick;
    } else if (cellToDropAt.hasClass("gun")) {
      player.weapon = this.weapons.gun;
    }
    // remove all weapons first
    cellToDropAt.removeClass("cupcake shell coin brick gun");
    cellToDropAt.addClass(`${currentWeapon.type}`);
  }

  // check if adjacent
  checkIfAdjacent() {
    const rowDiff = Math.abs(
      this.activePlayer.rowNumber - this.passivePlayer.rowNumber
    );
    const colDiff = Math.abs(
      this.activePlayer.colNumber - this.passivePlayer.colNumber
    );
    return rowDiff + colDiff == 1;
  }

  // clear all highlighted cells
  removeAllHighlightedCells() {
    // remove the previously highlighted cells
    this.highlightedCells.forEach(function(cell) {
      cell.removeClass("highlighted");
    });
  }

  setPlayerScores() {
    this.activePlayer.score =
      this.activePlayer.score > 0 ? this.activePlayer.score : 0;
    this.passivePlayer.score =
      this.passivePlayer.score > 0 ? this.passivePlayer.score : 0;

    if (this.activePlayer.type === "toad") {
      toadScore.innerHTML = `${this.activePlayer.score}`;
      toadWeapon.innerHTML = `${this.activePlayer.weapon.damage}`;
      yoshiScore.innerHTML = `${this.passivePlayer.score}`;
      yoshiWeapon.innerHTML = `${this.passivePlayer.weapon.damage}`;
    } else {
      yoshiScore.innerHTML = `${this.activePlayer.score}`;
      yoshiWeapon.innerHTML = `${this.activePlayer.weapon.damage}`;
      toadScore.innerHTML = `${this.passivePlayer.score}`;
      toadWeapon.innerHTML = `${this.passivePlayer.weapon.damage}`;
    }
  }
}
