$(document).ready(function() {
  // Declare constants for DOM manipulations
  const yoshiScore = $("#yoshiScore");
  const yoshiWeapon = $("#yoshiWeapon");
  const yoshiAttackButton = $("yoshiAttackButton");
  const yoshiDefendButton = $("#yoshiDefendButton");
  const toadScore = $("#toadScore");
  const toadWeapon = $("#toadWeapon");
  const toadAttackButton = $("#toadAttackButton");
  const toadDefendButton = $("#toadDefendButton");
  const title = $("#title");
  const message = $("#message");
  const yoshiContainerDiv = $("#yoshiContainerDiv");
  const toadYoshiDiv = $("#toadYoshiDiv");
  const toadContainerDiv = $("#toadContainerDiv");
  const weaponDiv = $("#weaponDiv");
  const startGameDiv = $("#startGameDiv");
  const gameOverDiv = $("#gameOverDiv");
  const startButton = $("#startButton");
  const playAgainButton = $("#playAgainButton");
  const winningPlayer = $("#winningPlayer");

  // Load game
  $(yoshiContainerDiv).hide();
  $(toadContainerDiv).hide();
  $(toadYoshiDiv).hide();
  $(gameOverDiv).hide();
  $(startGameDiv).show();
  $(weaponDiv).hide();

  // Create Gameboard
  const gameBoard = new ToadYoshi("#toadYoshiDiv", 8, 10);
  gameBoard.createGrid();

  // generate random pairs
  const allPairs = randomPairs(8, 10, 12);

  const pPairs = allPairs.slice(0, 2);
  const oPairs = allPairs.slice(2, 8);
  const wPairs = allPairs.slice(8, 12);

  // Place playrs on the board
  const playerOne = new Player("toad", pPairs[0][0], pPairs[0][1], 100);
  const playerTwo = new Player("yoshi", pPairs[1][0], pPairs[1][1], 100);
  playerOne.weapon = new Weapon("cupcake", 10);
  playerTwo.weapon = new Weapon("cupcake", 10);

  gameBoard.placePlayer(playerOne);
  gameBoard.placePlayer(playerTwo);

  //Place obstacles
  gameBoard.placeObstacles(oPairs);

  // Place Weapons (Used class for extensibility)
  gameBoard.placeWeapons(wPairs);

  // set active and passive player
  gameBoard.setActivePlayer(playerOne, playerTwo);

  // onclick of the start button show the gameboard and player containers
  startButton.on("click", function() {
    $(startGameDiv).hide();
    $(toadYoshiDiv).show();
    $(gameOverDiv).hide();
    $(yoshiContainerDiv).show();
    $(toadContainerDiv).show();
    $(weaponDiv).show();
    $("body").addClass("without-after-element");
  });

  // after game-over they click the play again button
  playAgainButton.on("click", function() {
    location.reload();
  });
});
