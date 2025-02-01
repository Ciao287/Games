let gameData = {
  success: true,
  // difficulty: 0,
  u: false,
  e: false,
  currentPlayer: 'u',
  user: {
    ships: {
      isSet: false,
      carrier: {
        destroyed: false,
        n1: { cell: null, destroyed: false },
        n2: { cell: null, destroyed: false },
        n3: { cell: null, destroyed: false },
        n4: { cell: null, destroyed: false },
        n5: { cell: null, destroyed: false }
      },
      battleship: {
        destroyed: false,
        n1: { cell: null, destroyed: false },
        n2: { cell: null, destroyed: false },
        n3: { cell: null, destroyed: false },
        n4: { cell: null, destroyed: false }
      },
      destroyer: {
        destroyed: false,
        n1: { cell: null, destroyed: false },
        n2: { cell: null, destroyed: false },
        n3: { cell: null, destroyed: false }
      },
      submarine: {
        destroyed: false,
        n1: { cell: null, destroyed: false },
        n2: { cell: null, destroyed: false },
        n3: { cell: null, destroyed: false }
      },
      patrolBoat: {
        destroyed: false,
        n1: { cell: null, destroyed: false },
        n2: { cell: null, destroyed: false }
      }
    },
    board: {
      c1: false, c2: false, c3: false, c4: false, c5: false, c6: false, c7: false, c8: false, c9: false, c10: false,
      c11: false, c12: false, c13: false, c14: false, c15: false, c16: false, c17: false, c18: false, c19: false, c20: false,
      c21: false, c22: false, c23: false, c24: false, c25: false, c26: false, c27: false, c28: false, c29: false, c30: false,
      c31: false, c32: false, c33: false, c34: false, c35: false, c36: false, c37: false, c38: false, c39: false, c40: false,
      c41: false, c42: false, c43: false, c44: false, c45: false, c46: false, c47: false, c48: false, c49: false, c50: false,
      c51: false, c52: false, c53: false, c54: false, c55: false, c56: false, c57: false, c58: false, c59: false, c60: false,
      c61: false, c62: false, c63: false, c64: false, c65: false, c66: false, c67: false, c68: false, c69: false, c70: false,
      c71: false, c72: false, c73: false, c74: false, c75: false, c76: false, c77: false, c78: false, c79: false, c80: false,
      c81: false, c82: false, c83: false, c84: false, c85: false, c86: false, c87: false, c88: false, c89: false, c90: false,
      c91: false, c92: false, c93: false, c94: false, c95: false, c96: false, c97: false, c98: false, c99: false, c100: false
    },
    shotsFired: []
  },
  enemy: {
    ships: {
      isSet: false,
      carrier: {
        destroyed: false,
        n1: { cell: null, destroyed: false },
        n2: { cell: null, destroyed: false },
        n3: { cell: null, destroyed: false },
        n4: { cell: null, destroyed: false },
        n5: { cell: null, destroyed: false }
      },
      battleship: {
        destroyed: false,
        n1: { cell: null, destroyed: false },
        n2: { cell: null, destroyed: false },
        n3: { cell: null, destroyed: false },
        n4: { cell: null, destroyed: false }
      },
      destroyer: {
        destroyed: false,
        n1: { cell: null, destroyed: false },
        n2: { cell: null, destroyed: false },
        n3: { cell: null, destroyed: false }
      },
      submarine: {
        destroyed: false,
        n1: { cell: null, destroyed: false },
        n2: { cell: null, destroyed: false },
        n3: { cell: null, destroyed: false }
      },
      patrolBoat: {
        destroyed: false,
        n1: { cell: null, destroyed: false },
        n2: { cell: null, destroyed: false }
      }
    },
    board: {
      c1: false, c2: false, c3: false, c4: false, c5: false, c6: false, c7: false, c8: false, c9: false, c10: false,
      c11: false, c12: false, c13: false, c14: false, c15: false, c16: false, c17: false, c18: false, c19: false, c20: false,
      c21: false, c22: false, c23: false, c24: false, c25: false, c26: false, c27: false, c28: false, c29: false, c30: false,
      c31: false, c32: false, c33: false, c34: false, c35: false, c36: false, c37: false, c38: false, c39: false, c40: false,
      c41: false, c42: false, c43: false, c44: false, c45: false, c46: false, c47: false, c48: false, c49: false, c50: false,
      c51: false, c52: false, c53: false, c54: false, c55: false, c56: false, c57: false, c58: false, c59: false, c60: false,
      c61: false, c62: false, c63: false, c64: false, c65: false, c66: false, c67: false, c68: false, c69: false, c70: false,
      c71: false, c72: false, c73: false, c74: false, c75: false, c76: false, c77: false, c78: false, c79: false, c80: false,
      c81: false, c82: false, c83: false, c84: false, c85: false, c86: false, c87: false, c88: false, c89: false, c90: false,
      c91: false, c92: false, c93: false, c94: false, c95: false, c96: false, c97: false, c98: false, c99: false, c100: false
    },
    shotsFired: []
  },
  lastShot: null,
  hit: false,
  winner: false
};
let currentPlayer = 'u';
let win = false;
let isRequestInProgress = false;
let connectionError = false;
let mode;
let multiplayer = '0';
let privateToken;
let publicToken;
let fetchInterval = null;
let gameUrl = false;
let first = true;
let tryingToSetShips = false;

function makeMove(cell) {
  if(typeof cell === 'object') {

    const shipsPosition = cell;
    const { carrier, battleship, destroyer, submarine, patrolBoat } = shipsPosition;
    if(carrier.length !== 5 || battleship.length !== 4 || destroyer.length !== 3 || submarine.length !== 3 || patrolBoat.length !== 2) {
      return;
    };

    let playerShips;

    if(mode === '0') {
      playerShips = gameData.user.ships;
    } else {
      if(multiplayer === '0') {
        playerShips = gameUrl ? gameData.enemy.ships : gameData.user.ships;
      } else {

      };
    };
    
    playerShips.isSet = true;
    playerShips.carrier.n1.cell = carrier[0];
    playerShips.carrier.n2.cell = carrier[1];
    playerShips.carrier.n3.cell = carrier[2];
    playerShips.carrier.n4.cell = carrier[3];
    playerShips.carrier.n5.cell = carrier[4];
    playerShips.battleship.n1.cell = battleship[0];
    playerShips.battleship.n2.cell = battleship[1];
    playerShips.battleship.n3.cell = battleship[2];
    playerShips.battleship.n4.cell = battleship[3];
    playerShips.destroyer.n1.cell = destroyer[0];
    playerShips.destroyer.n2.cell = destroyer[1];
    playerShips.destroyer.n3.cell = destroyer[2];
    playerShips.submarine.n1.cell = submarine[0];
    playerShips.submarine.n2.cell = submarine[1];
    playerShips.submarine.n3.cell = submarine[2];
    playerShips.patrolBoat.n1.cell = patrolBoat[0];
    playerShips.patrolBoat.n2.cell = patrolBoat[1];

    tryingToSetShips = true;

    if(mode === '0') {
      return validateUserShips(gameData);
    } else {
      if(multiplayer === '0') {
        return sendMultiplayerRequest(gameData, gameUrl);
      } else {

      };
    };
  };

  if(mode === '0') {
    if (win || isRequestInProgress) return;

    if (gameData.enemy.board[cell]) {
      return;
    };

    let newCell = cell.startsWith('e') ? cell.slice(1) : cell;

    gameData.lastShot = cell;
    gameData.currentPlayer = 'e';

    document.getElementById(cell).disabled = true;
    document.getElementById(cell).classList.add('hit');

    for (const ship in gameData.enemy.ships) {
      for (const part in gameData.enemy.ships[ship]) {
        if (gameData.enemy.ships[ship][part].cell === newCell) {
          if(ship.destroyed) {
            document.getElementById(cell).classList.add('destroyed');
          };
          document.getElementById(cell).classList.add('shipcell');
          break;
        };
      };
    };
    updateBoard(gameData);

    sendRequest(gameData);
  } else {
    if (multiplayer === '0') {
      if (win) return;

      let newCell = cell.startsWith('e') ? cell.slice(1) : cell;

      if ((gameData.user.board.cell && gameData.u === privateToken) || (gameData.enemy.board.cell && gameData.e === privateToken)) {
        return;
      };

      const {u, e, currentPlayer} = gameData;

      if((currentPlayer === 'u' && u === privateToken) || (currentPlayer === 'e' && e === privateToken)) {
        gameData.lastShot = newCell;
        document.getElementById(cell).disabled = true;
        document.getElementById(cell).classList.add('hit');

        if(gameData.u === privateToken) {
          for (const ship in gameData.enemy.ships) {
            for (const part in gameData.enemy.ships[ship]) {
              if (gameData.enemy.ships[ship][part].cell === newCell) {
                if(ship.destroyed) {
                  document.getElementById(cell).classList.add('destroyed');
                };
                document.getElementById(cell).classList.add('shipcell');
                break;
              };
            };
          };
        } else {
          for (const ship in gameData.user.ships) {
            for (const part in gameData.user.ships[ship]) {
              if (gameData.user.ships[ship][part].cell === newCell) {
                if(ship.destroyed) {
                  document.getElementById(cell).classList.add('destroyed');
                };
                document.getElementById(cell).classList.add('shipcell');
                break;
              };
            };
          };
        };

        sendMultiplayerRequest(gameData, gameUrl);
      };

    } else {
      
    };
  };
};

function validateUserShips (gameData) {
  isRequestInProgress = true;
  connectionError = false;

  axios.post(`${link}/api/battleship?validateShips`, {
    ships: gameData.user.ships,
  }).then(response => {
    const { isValid } = response.data;

    if (!isValid) {
      isRequestInProgress = false;
      return;
    };

    updateBoard(gameData);
    checkGameStatus(gameData);

    isRequestInProgress = false;
  }).catch(error => {
    console.error("Request error:", error);

    if (retryCount < 3) {
      setTimeout(() => {
        console.log(`Retrying request... Attempt ${retryCount + 1}`);
        validateUserShips(gameData, retryCount + 1);
      }, 20000);
    } else {
      displayValidateConnectionError(gameData);
    };
  });
}

function displayValidateConnectionError(gameData) {
  connectionError = true;
  isRequestInProgress = true;

  const resultMessage = document.getElementById('result-message');
  resultMessage.textContent = "No connection. Please check your internet and press the button below to retry.";
  resultMessage.style.display = 'block';

  const retryButton = document.createElement('button');
  retryButton.textContent = "Retry";
  retryButton.id = "retry-button";
  const endGameContainer = document.getElementById('end-game-container');
  const gotoHomeButton = document.getElementById('go-home-button');
  retryButton.onclick = () => {
    retryButton.remove();
    endGameContainer.classList.add('hidden');
    gotoHomeButton.classList.add('hidden');
    validateUserShips(gameData);
  };

  endGameContainer.appendChild(retryButton);
  endGameContainer.classList.remove('hidden');
  gotoHomeButton.classList.remove('hidden');
};

function sendRequest(data, retryCount = 0) {
  isRequestInProgress = true;
  connectionError = false;

  axios.post(`${link}/api/battleship`, data).then(response => {
    if (!response.data.success && response.data.error === 'You have already hit this cell!') {
      isRequestInProgress = false;
      return;
    };

    gameData = response.data;

    updateBoard(gameData);
    checkGameStatus(gameData);

    isRequestInProgress = false;
  }).catch(error => {
    console.error("Request error:", error);

    if (retryCount < 3) {
      setTimeout(() => {
        console.log(`Retrying request... Attempt ${retryCount + 1}`);
        sendRequest(data, retryCount + 1);
      }, 20000);
    } else {
      displayConnectionError(data);
    };
  });
};

function displayConnectionError(data) {
  connectionError = true;
  isRequestInProgress = true;

  const resultMessage = document.getElementById('result-message');
  resultMessage.textContent = "No connection. Please check your internet and press the button below to retry.";
  resultMessage.style.display = 'block';

  const retryButton = document.createElement('button');
  retryButton.textContent = "Retry";
  retryButton.id = "retry-button";
  const endGameContainer = document.getElementById('end-game-container');
  const gotoHomeButton = document.getElementById('go-home-button');
  retryButton.onclick = () => {
    retryButton.remove();
    endGameContainer.classList.add('hidden');
    gotoHomeButton.classList.add('hidden');
    sendRequest(data);
  };

  endGameContainer.appendChild(retryButton);
  endGameContainer.classList.remove('hidden');
  gotoHomeButton.classList.remove('hidden');
};

function updateBoard(gameData) {
  const userBoard = gameData.user.board;
  const userShips = gameData.user.ships;
  const enemyBoard = gameData.enemy.board;
  const enemyShips = gameData.enemy.ships;

  if(mode === '0') {
    resetAllShips();
    document.getElementById('ships-container').classList.add('hidden');
    document.getElementById('setup-message').classList.add('hidden');
    document.getElementById('enemy-board').classList.remove('hidden');

    for (let cell in userBoard) {
      const cellElement = document.getElementById(cell);
      if (cellElement) {
        if (userBoard[cell]) {
          cellElement.classList.add('hit');
        } else {
          cellElement.classList.remove('hit');
        };
      };
    };
    for (let ship in userShips) {
      if (ship !== 'isSet') {
        const userShip = userShips[ship];
        for (let part in userShip) {
          if(part.startsWith('n')) {
            const shipElement = document.getElementById(userShip[part].cell);
            if (shipElement) {
              if (userShip.destroyed) {
                shipElement.classList.add('destroyed');
              };
              if (userShip[part].destroyed) {
                shipElement.classList.add('shipcell', 'hit');
              } else {
                shipElement.classList.add('shipcell');
                shipElement.classList.remove('hit');
              };
            };
          };
        };
      };
    };

    for (let cell in enemyBoard) {
      const cellElement = document.getElementById(`e${cell}`);
      if (cellElement) {
        if (enemyBoard[cell]) {
          cellElement.classList.add('hit');
        } else {
          cellElement.classList.remove('hit');
        };
      };
    };
    for (let ship in enemyShips) {
      if (ship !== 'isSet') {
        const enemyShip = enemyShips[ship];
        for (let part in enemyShip) {
          if(part.startsWith('n')) {
            const shipElement = document.getElementById(`e${enemyShip[part].cell}`);
            if (shipElement) {
              if (enemyShip.destroyed) {
                shipElement.classList.add('destroyed');
              };
              if (enemyShip[part].destroyed) {
                shipElement.classList.add('shipcell', 'hit');
              };
            };
          };
        };
      };
    };

  } else {
    if(multiplayer === '0') {
      if(!gameData.user.ships.isSet || !gameData.enemy.ships.isSet) {
        document.getElementById('enemy-board').classList.add('hidden');

        if(!gameData.user.ships.isSet && gameData.u === privateToken) {
          document.getElementById('ships-container').classList.remove('hidden');
        } else if (!gameData.enemy.ships.isSet && gameData.e === privateToken) {
          document.getElementById('ships-container').classList.remove('hidden');
        };

        if(!gameData.user.ships.isSet && !gameData.enemy.ships.isSet) {
          if(gameData.u === privateToken) {
            document.getElementById('setup-message').innerHTML = 'Waiting for you to place your ships...<br>Waiting for the enemy to place their ships...';
          } else {
            document.getElementById('setup-message').innerHTML = 'Waiting for the enemy to place their ships...<br>Waiting for you to place your ships...';
          };
        } else if(!gameData.user.ships.isSet && gameData.enemy.ships.isSet) {
          if(gameData.u === privateToken) {
            document.getElementById('setup-message').innerHTML = 'Waiting for you to place your ships...<br>The enemy placed their ships.';
          } else {
            document.getElementById('setup-message').innerHTML = 'Waiting for the enemy to place their ships...<br>You placed your ships.';
            resetAllShips();
            document.getElementById('ships-container').classList.add('hidden');
            for (let ship in enemyShips) {
              if (ship !== 'isSet') {
                const enemyShip = enemyShips[ship];
                for (let part in enemyShip) {
                  if(part.startsWith('n')) {
                    const shipElement = document.getElementById(enemyShip[part].cell);
                    if (shipElement) {
                      shipElement.classList.add('shipcell');
                      shipElement.classList.remove('hit');
                    };
                  };
                };
              };
            };
          }
        } else if(gameData.user.ships.isSet && !gameData.enemy.ships.isSet) {
          if(gameData.u === privateToken) {
            document.getElementById('setup-message').innerHTML = 'You placed your ships.<br>Waiting for the enemy to place their ships...';
            resetAllShips();
            document.getElementById('ships-container').classList.add('hidden');
            for (let ship in userShips) {
              if (ship !== 'isSet') {
                const userShip = userShips[ship];
                for (let part in userShip) {
                  if(part.startsWith('n')) {
                    const shipElement = document.getElementById(userShip[part].cell);
                    if (shipElement) {
                      shipElement.classList.add('shipcell');
                      shipElement.classList.remove('hit');
                    };
                  };
                };
              };
            };
          } else {
            document.getElementById('setup-message').innerHTML = 'The enemy placed their ships.<br>Waiting for you to place your ships...';
          }
        };

        document.getElementById('setup-message').classList.remove('hidden');
        return;
      } else {
        resetAllShips();
        if(!document.getElementById('setup-message').classList.contains('hidden')) {
          document.getElementById('setup-message').classList.add('hidden');
        };

        if(document.getElementById('enemy-board').classList.contains('hidden')) {
          document.getElementById('enemy-board').classList.remove('hidden');
        };

        if(!document.getElementById('ships-container').classList.contains('hidden')) {
          document.getElementById('ships-container').classList.add('hidden');
        };
      };

      for (let cell in userBoard) {
        const cellElement = gameData.u === privateToken ? document.getElementById(cell) : document.getElementById(`e${cell}`);
        if (cellElement) {
          if (userBoard[cell]) {
            cellElement.classList.add('hit');
          } else {
            cellElement.classList.remove('hit');
          };
        };
      };
      for (let ship in userShips) {
        if (ship !== 'isSet') {
          const userShip = userShips[ship];
          for (let part in userShip) {
            if(part.startsWith('n')) {
              const shipElement = gameData.u === privateToken ? document.getElementById(userShip[part].cell) : document.getElementById(`e${userShip[part].cell}`);
              if (shipElement) {
                if (userShip.destroyed) {
                  shipElement.classList.add('destroyed');
                };
                if(gameData.u === privateToken) {
                  if (userShip[part].destroyed) {
                    shipElement.classList.add('shipcell', 'hit');
                  } else {
                    shipElement.classList.add('shipcell');
                    shipElement.classList.remove('hit');
                  };
                } else {
                  if (userShip[part].destroyed) {
                    shipElement.classList.add('shipcell', 'hit');
                  };
                };
              };
            };
          };
        };
      };

      for (let cell in enemyBoard) {
        const cellElement = gameData.u === privateToken ? document.getElementById(`e${cell}`) : document.getElementById(cell);
        if (cellElement) {
          if (enemyBoard[cell]) {
            cellElement.classList.add('hit');
          } else {
            cellElement.classList.remove('hit');
          };
        };
      };
      for (let ship in enemyShips) {
        if (ship !== 'isSet') {
          const enemyShip = enemyShips[ship];
          for (let part in enemyShip) {
            if(part.startsWith('n')) {
              const shipElement = gameData.u === privateToken ? document.getElementById(`e${enemyShip[part].cell}`) : document.getElementById(enemyShip[part].cell);
              if (shipElement) {
                if (enemyShip.destroyed) {
                  shipElement.classList.add('destroyed');
                };
                if(gameData.e === privateToken) {
                  if (enemyShip[part].destroyed) {
                    shipElement.classList.add('shipcell', 'hit');
                  } else {
                    shipElement.classList.add('shipcell');
                    shipElement.classList.remove('hit');
                  };
                } else {
                  if (enemyShip[part].destroyed) {
                    shipElement.classList.add('shipcell', 'hit');
                  };
                };
              };
            };
          };
        };
      };
    } else {

    };
  };
};

function checkGameStatus(gameData) {

  if (
    gameData.winner ||
    Object.values(gameData.user.ships).filter(ship => typeof ship === 'object').every(ship => ship.destroyed) ||
    Object.values(gameData.enemy.ships).filter(ship => typeof ship === 'object').every(ship => ship.destroyed)
  ) {
    let resultMessage;
    if(mode === '0') {
      resultMessage = gameData.winner === 'Win' ? "You Win!" : "You Lose!";
    } else {
      if(multiplayer === '0') {
        if(gameData.u === privateToken) {
          resultMessage = gameData.winner === 'Win' ? "You Win!" : "You Lose!";
        } else {
          resultMessage = gameData.winner === 'Win' ? "You Lose!" : "You Win!";
        };
      } else {
        resultMessage = gameData.winner === 'Win' ? "First player won!" : "Second player won!";
      };
    };
    fetchGame(false);
    
    document.getElementById('result-message').textContent = resultMessage;

    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
      cell.disabled = true;
    });

    win = true;

    const retryButton = document.getElementById('retry-button');
    if (retryButton) retryButton.remove();

    document.getElementById('end-game-container').classList.remove('hidden');
    document.getElementById('go-home-button').classList.remove('hidden');
  };
};

function initGame() {
  document.getElementById('difficulty-container').classList.remove('hidden');
  document.getElementById('board-container').classList.add('hidden');
  document.getElementById('end-game-container').classList.add('hidden');
  document.getElementById('go-home-button').classList.remove('hidden');

  win = false;
  isRequestInProgress = false;
  connectionError = false;
  lastShot = null;
  hit = false;
  gameData.winner = false;
  gameData.hit = false;
  gameData.lastShot = null;
  gameData.currentPlayer = 'u';

  const cells = document.querySelectorAll('.cell');
  cells.forEach(cell => {
    cell.classList.remove('shipcell', 'hit', 'destroyed');
  });

  for (const shipType in gameData.user.ships) {
    if (shipType !== 'isSet') {
      const ship = gameData.user.ships[shipType];
      for (const part in ship) {
        if (part.startsWith('n')) {
          ship[part].cell = null;
          ship[part].destroyed = false;
        } else if (part === 'destroyed') {
          ship.destroyed = false;
        };
      };
    } else if (shipType === 'isSet') {
      gameData.user.ships.isSet = false;
    };
  };

  for (const shipType in gameData.enemy.ships) {
    if (shipType !== 'isSet') {
      const ship = gameData.enemy.ships[shipType];
      for (const part in ship) {
        if (part.startsWith('n')) {
          ship[part].cell = null;
          ship[part].destroyed = false;
        } else if (part === 'destroyed') {
          ship.destroyed = false;
        };
      };
    } else if (shipType === 'isSet') {
      gameData.enemy.ships.isSet = false;
    };
  };

  for (const cell in gameData.user.board) {
    gameData.user.board[cell] = false;
  };

  for (const cell in gameData.enemy.board) {
    gameData.enemy.board[cell] = false;
  };

  gameData.user.shotsFired = [];
  gameData.enemy.shotsFired = [];

  // const mode = document.getElementById('mode').value;
  // if (mode === '0') {
  //   // document.getElementById('difficulty').classList.remove('hidden');
  //   document.getElementById('multiplayer').classList.add('hidden');
  // } else {
  //   // document.getElementById('difficulty').classList.add('hidden');
  //   document.getElementById('multiplayer').classList.remove('hidden');
  // };
};

function startNewGame() {
  document.getElementById('go-home-button').classList.add('hidden');
  fetchGame(false);
  mode = document.getElementById('mode').value;
  if(mode === '0') {
    // const difficulty = document.getElementById('difficulty').value;
    // gameData.difficulty = parseInt(difficulty);
    gameData.user.board = {
      c1: false, c2: false, c3: false, c4: false, c5: false, c6: false, c7: false, c8: false, c9: false, c10: false,
      c11: false, c12: false, c13: false, c14: false, c15: false, c16: false, c17: false, c18: false, c19: false, c20: false,
      c21: false, c22: false, c23: false, c24: false, c25: false, c26: false, c27: false, c28: false, c29: false, c30: false,
      c31: false, c32: false, c33: false, c34: false, c35: false, c36: false, c37: false, c38: false, c39: false, c40: false,
      c41: false, c42: false, c43: false, c44: false, c45: false, c46: false, c47: false, c48: false, c49: false, c50: false,
      c51: false, c52: false, c53: false, c54: false, c55: false, c56: false, c57: false, c58: false, c59: false, c60: false,
      c61: false, c62: false, c63: false, c64: false, c65: false, c66: false, c67: false, c68: false, c69: false, c70: false,
      c71: false, c72: false, c73: false, c74: false, c75: false, c76: false, c77: false, c78: false, c79: false, c80: false,
      c81: false, c82: false, c83: false, c84: false, c85: false, c86: false, c87: false, c88: false, c89: false, c90: false,
      c91: false, c92: false, c93: false, c94: false, c95: false, c96: false, c97: false, c98: false, c99: false, c100: false
    };
    currentPlayer = 'u';

    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
      if(cell.id) {
        if(cell.id.startsWith('e')) {
          cell.disabled = false;
        } else {
          cell.disabled = true;
        };
      } else {
        cell.disabled = true;
      };
    });

    win = false;
    isRequestInProgress = false;
    connectionError = false;

    fetchEnemyShips();
  } else {
    // multiplayer = document.getElementById('multiplayer').value;
    if(multiplayer === '0') {
      document.getElementById('token-container').classList.remove('hidden');
      fetchTokens();
    } else {

    };
  };
};

function fetchEnemyShips(retryCount = 0) {
  axios.post(`${link}/api/battleship?generateShips`).then(response => {
    const { ships } = response.data;

    gameData.enemy.ships = ships;

    document.getElementById('difficulty-container').classList.add('hidden');
    document.getElementById('board-container').classList.remove('hidden');
    document.getElementById('enemy-board').classList.add('hidden');
    document.getElementById('ships-container').classList.remove('hidden');
  }).catch(error => {
    console.error("Error fetching enemy ships:", error);

    if (retryCount < 3) {
      setTimeout(() => {
        console.log(`Retrying fetchEnemyShips... Attempt ${retryCount + 1}`);
        fetchEnemyShips(retryCount + 1);
      }, 20000);
    } else {
      displayRetryFetchingShipsButton();
    };
  });
};

function fetchTokens(retryCount = 0) {
  axios.post(`${link}/api/generatetoken?battleship`).then(response => {
    const { publicToken: serverPublicToken, privateToken: serverPrivateToken } = response.data;

    privateToken = serverPrivateToken;
    publicToken = serverPublicToken;

    const tokenDisplay = `<p id="invitation-code" onclick="copyText()">Invitation Code: <strong>${serverPublicToken}</strong>\n  <span id="invitation-description">Share this code with a friend to start the game!<br>Click to copy</span>\n</p>`;

    const tokenContainer = document.getElementById('token-container');
    tokenContainer.innerHTML = tokenDisplay;
    tokenContainer.classList.remove('hidden');

    document.getElementById('end-game-container').classList.add('hidden');
    document.getElementById('go-home-button').classList.remove('hidden');

    const invitationContainer = document.createElement('div');
    invitationContainer.id = 'invitation-container';

    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.id = 'invite-code';
    inputField.placeholder = 'Enter 6-character code';
    inputField.style = 'margin-right: 7px'
    inputField.setAttribute('minlength', '6');
    inputField.setAttribute('maxlength', '6');

    const verifyButton = document.createElement('button');
    verifyButton.textContent = 'Verify Code';
    verifyButton.id = 'verify-code';

    invitationContainer.appendChild(inputField);
    invitationContainer.appendChild(verifyButton);
    tokenContainer.appendChild(invitationContainer);
    verifyButton.addEventListener('click', verifyCode);
    fetchGame(true);
  }).catch(error => {
    console.error("Error fetching tokens:", error);

    if (retryCount < 3) {
      setTimeout(() => {
        console.log(`Retrying fetchTokens... Attempt ${retryCount + 1}`);
        fetchTokens(retryCount + 1);
      }, 20000);
    } else {
      displayRetryButton();
    }
  });
};

function fetchGame(start = true, url) {
  if (start) {
    if(!fetchInterval) {
      fetchInterval = setInterval(() => {
        if(privateToken) {
          if(!url) url = `${link}/api/battleship/multiplayer/${privateToken}`;
          axios.get(url).then(response => {
            gameData = response.data;

            if(first) {
              document.getElementById('end-game-container').classList.add('hidden');
              document.getElementById('go-home-button').classList.add('hidden');

              document.getElementById('difficulty-container').classList.add('hidden');
              document.getElementById('token-container').classList.add('hidden');
              document.getElementById('invitation-container').classList.add('hidden');
              document.getElementById('board-container').classList.remove('hidden');

              const cells = document.querySelectorAll('.cell');
              cells.forEach(cell => {
                if (cell.id) {
                  if(cell.id.startsWith('e')) {
                    cell.disabled = false;
                  } else {
                    cell.disabled = true;
                  };
                } else {
                  cell.disabled = true;
                };
              });

              win = false;
              first = false;
            };
            
            updateBoard(gameData);
            checkGameStatus(gameData);

          }).catch(error => {
            if (error.response?.data?.success !== false) {
              console.error("Error fetching the game:", error);
            };
          });
        };
      }, 5000);
    };
  } else {
    if(fetchInterval) {
      clearInterval(fetchInterval);
      fetchInterval = null;
    };
  };
};

function sendMultiplayerRequest(data, gameUrl, retryCount = 0) {
  isRequestInProgress = true;
  connectionError = false;

  url = gameUrl ? gameUrl : `${link}/api/battleship/multiplayer/${privateToken}`;
  axios.post(url, data).then(response => {
    if(!response.data.success && response.data.error === 'You have already hit this cell!') {
      isRequestInProgress = false;
      return;
    };
    gameData = response.data;

    if(tryingToSetShips) {
      tryingToSetShips = false;

      const cells = document.querySelectorAll('.cell');
      cells.forEach(cell => {
        if (cell.id) {
          cell.disabled = false;
        };
      });
    };

    updateBoard(gameData);
    checkGameStatus(gameData);

    isRequestInProgress = false;
  }).catch(error => {
    console.error("Request error:", error);

    if (retryCount < 3) {
      setTimeout(() => {
        console.log(`Retrying request... Attempt ${retryCount + 1}`);
        sendMultiplayerRequest(data, gameUrl, retryCount + 1);
      }, 20000);
    } else {
      displayMultiplayerConnectionError(data, gameUrl);
    };
  });
};

function displayMultiplayerConnectionError(data, gameUrl) {
  connectionError = true;
  isRequestInProgress = true;

  const resultMessage = document.getElementById('result-message');
  resultMessage.textContent = "No connection. Please check your internet and press the button below to retry.";
  resultMessage.style.display = 'block';

  const retryButton = document.createElement('button');
  retryButton.textContent = "Retry";
  retryButton.id = "retry-button";
  const endGameContainer = document.getElementById('end-game-container');
  const gotoHomeButton = document.getElementById('go-home-button');
  retryButton.onclick = () => {
    retryButton.remove();
    endGameContainer.classList.add('hidden');
    gotoHomeButton.classList.add('hidden');
    sendMultiplayerRequest(data, gameUrl);
  };

  endGameContainer.appendChild(retryButton);
  endGameContainer.classList.remove('hidden');
  gotoHomeButton.classList.remove('hidden');
};

function verifyCode() {
  const inputField = document.getElementById('invite-code');
  let inputError = document.getElementById('input-error');

  if(inputError) inputError.classList.add('hidden');
  const inputValue = inputField.value;
  
  if (inputValue.length === 6 && inputValue !== publicToken) {
    data = {
      code: inputValue,
      privateToken: privateToken,
    };

    verifyToken(data);
  } else {
    let textError;
    if(inputValue === publicToken) {
      textError = "You can't play against yourself.";
    } else {
      textError = 'The code must be 6 characters long.';
    };

    const tokenContainer = document.getElementById('token-container');
    
    if(inputError) {
      inputError.textContent = textError;
      inputError.classList.remove('hidden');
    } else {
      inputError = document.createElement('p');
      inputError.id = 'input-error';
      inputError.textContent = textError;
      inputError.classList.add('red');
      inputError.style = 'margin-top: 5px';

      tokenContainer.appendChild(inputError);
    };
  };
};

function verifyToken(data, retryCount = 0) {
  axios.post(`${link}/api/verifycode`, data).then(response => {
    gameUrl = response.data.url;

    fetchGame(false);

    fetchGame(true, gameUrl);

    document.getElementById('go-home-button').classList.add('hidden');
    startMultiplayerGame(gameData);
  }).catch(error => {
    console.error("Request error:", error);

    if (error.response?.data?.errorCode) {
      let inputError = document.getElementById('input-error');
      const tokenContainer = document.getElementById('token-container');
      let textError;
        
      if(error.response.data.errorCode === 1) {
        textError = 'Your private token has expired. Please regenerate it and try again.';
      } else if (error.response.data.errorCode === 2) {
        textError = 'Invalid or expired invitation code. Please check the code and try again.';
      } else if (error.response.data.errorCode === 3) {
        textError = "You can't play against yourself.";
      } else if (error.response.data.errorCode === 4) {
        textError = "The user you are trying to play with is already in another game.";
      } else if (error.response.data.errorCode === 5) {
        textError = "You are already in a game.";
      } else {
        textError = "The user you are trying to play with is playing a different game.";
      };

      if(inputError) {
        inputError.textContent = textError;
        inputError.classList.remove('hidden');
      } else {
        inputError = document.createElement('p');
        inputError.id = 'input-error';
        inputError.textContent = textError;
        inputError.classList.add('red');
        inputError.style = 'margin-top: 5px';

        tokenContainer.appendChild(inputError);
      };
    } else {
      if (retryCount < 3) {
        setTimeout(() => {
          console.log(`Retrying request... Attempt ${retryCount + 1}`);
          verifyToken(data, retryCount + 1);
        }, 20000);
      } else {
        let inputError = document.getElementById('input-error');
        const tokenContainer = document.getElementById('token-container');

        if(inputError) {
          inputError.textContent = 'Failed to verify the code. Please try again.';
          inputError.classList.remove('hidden');
        } else {
          inputError = document.createElement('p');
          inputError.id = 'input-error';
          inputError.textContent = 'Failed to verify the code. Please try again.';
          inputError.classList.add('red');
          inputError.style = 'margin-top: 5px';

          tokenContainer.appendChild(inputError);
        };
      };
    };
  });
};

function startMultiplayerGame(data) {
  updateBoard(data);
  document.getElementById('difficulty-container').classList.add('hidden');
  document.getElementById('token-container').classList.add('hidden');
  document.getElementById('invitation-container').classList.add('hidden');
  document.getElementById('board-container').classList.remove('hidden');
  document.getElementById('ships-container').classList.remove('hidden');
  document.getElementById('enemy-board').classList.add('hidden');

  const cells = document.querySelectorAll('.cell');
  cells.forEach(cell => {
    cell.disabled = true;
  });

  win = false;
  isRequestInProgress = false;
  connectionError = false;
};

function displayRetryFetchingShipsButton() {
  const endGameContainer = document.getElementById('end-game-container');
  const gotoHomeButton = document.getElementById('go-home-button');
  const retryButton = document.createElement('button');
  retryButton.textContent = "Retry Fetching Enemy Ships";
  retryButton.id = "retry-fetch-ships";

  retryButton.onclick = () => {
    endGameContainer.classList.add('hidden');
    gotoHomeButton.classList.add('hidden');
    fetchEnemyShips();
  };

  endGameContainer.innerHTML = '<p>Failed to fetch enemy ships. Please try again.</p>';
  endGameContainer.appendChild(retryButton);
  endGameContainer.classList.remove('hidden');
  gotoHomeButton.classList.remove('hidden');
};

function displayRetryButton() {
  const endGameContainer = document.getElementById('end-game-container');
  const gotoHomeButton = document.getElementById('go-home-button');
  const retryButton = document.createElement('button');
  retryButton.textContent = "Retry Fetching Tokens";
  retryButton.id = "retry-fetch-tokens";

  retryButton.onclick = () => {
    endGameContainer.classList.add('hidden');
    gotoHomeButton.classList.add('hidden');
    fetchTokens();
  };

  endGameContainer.innerHTML = '<p>Failed to fetch tokens. Please try again.</p>';
  endGameContainer.appendChild(retryButton);
  endGameContainer.classList.remove('hidden');
  gotoHomeButton.classList.remove('hidden');
};

function restartGame() {
  privateToken = false;
  fetchInterval = null;
  gameUrl = false;
  first = true;
  document.getElementById('end-game-container').classList.add('hidden');
  initGame();
};

function resetAllShips() {
  const shipContainers = document.querySelectorAll('.ship-container');
  shipContainers.forEach(shipContainer => {
    const ship = shipContainer.querySelector('.ship');
    const previousCellIds = JSON.parse(ship.getAttribute('data-cells'));

    previousCellIds.forEach(cellId => {
      const cell = document.getElementById(cellId);
      if (cell) {
        while (cell.firstChild) {
          ship.appendChild(cell.firstChild);
        };
      };
    });

    ship.setAttribute('data-cells', JSON.stringify([]));

    shipContainer.querySelector('.rotate-button').classList.remove('hidden');
    shipContainer.querySelector('.reset-button').classList.add('hidden');
  });
};

function handleModeChange() {
  fetchGame(false);
  // const mode = document.getElementById('mode').value;
  document.getElementById('token-container').classList.add('hidden');

  // if (mode === "0") {
  //   // document.getElementById('difficulty').classList.remove('hidden');
  //   document.getElementById('multiplayer').classList.add('hidden');
  // } else {
  //   // document.getElementById('difficulty').classList.add('hidden');
  //   document.getElementById('multiplayer').classList.remove('hidden');
  // };
};

function clearToken() {
  fetchGame(false);
  document.getElementById('token-container').classList.add('hidden');
};

function initBoard() {
  const cells = document.querySelectorAll('.cell');
  cells.forEach(cell => {
    if(cell.id.startsWith('e')) {
      cell.addEventListener('click', () => makeMove(cell.id));
    };
  });
  addDragAndDropEventListeners();
  document.getElementById('start-game').addEventListener('click', startNewGame);
  document.getElementById('restart-game').addEventListener('click', restartGame);
  document.getElementById('mode').addEventListener('change', handleModeChange);
  // document.getElementById('difficulty').addEventListener('change', clearToken);
  // document.getElementById('multiplayer').addEventListener('change', clearToken);
};

function copyText() {
  const textToCopy = document.querySelector('strong').textContent;
  
  navigator.clipboard.writeText(textToCopy).then(() => {
    alert('Text copied!');
  }).catch(err => {
    console.error('Error copying text: ', err);
  });
};

document.getElementById('go-home-button').onclick = function() {
  window.location.href = '/';
};

function addDragAndDropEventListeners () {
  const ships = document.querySelectorAll('.ship');
  const cells = document.querySelectorAll('.cell');
  let draggedShip = null;
  let offset = 0;

  ships.forEach(ship => {
    ship.addEventListener('dragstart', (e) => {
      draggedShip = e.target;
      e.dataTransfer.setData('text/plain', e.target.id);

      const shipRect = ship.getBoundingClientRect();
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      const shipCells = Array.from(ship.children);
      if (ship.classList.contains('vertical')) {
        offset = Math.floor((mouseY - shipRect.top) / shipCells[0].offsetHeight);
      } else {
        offset = Math.floor((mouseX - shipRect.left) / shipCells[0].offsetWidth);
      };
    });

    ship.setAttribute('data-cells', JSON.stringify([]));
  });

  document.querySelectorAll('.rotate-button').forEach(button => {
    button.addEventListener('click', (e) => {
      const shipContainer = e.target.closest('.ship-container');
      const ship = shipContainer.querySelector('.ship');
      ship.classList.toggle('vertical');
    });
  });

  document.querySelectorAll('.reset-button').forEach(button => {
    button.addEventListener('click', (e) => {
      const shipContainer = e.target.closest('.ship-container');
      const ship = shipContainer.querySelector('.ship');
      const previousCellIds = JSON.parse(ship.getAttribute('data-cells'));

      previousCellIds.forEach(cellId => {
        const cell = document.getElementById(cellId);
        if (cell) {
          while (cell.firstChild) {
            ship.appendChild(cell.firstChild);
          };
        };
      });

      ship.setAttribute('data-cells', JSON.stringify([]));

      shipContainer.querySelector('.rotate-button').classList.remove('hidden');
      shipContainer.querySelector('.reset-button').classList.add('hidden');
    });
  });

  cells.forEach(cell => {
    cell.addEventListener('dragover', (e) => {
      e.preventDefault();
    });

    cell.addEventListener('drop', (e) => {
      e.preventDefault();
      const shipId = e.dataTransfer.getData('text/plain');
      const ship = document.getElementById(shipId);
      if (!ship) return;
      const shipSize = parseInt(ship.getAttribute('data-size'), 10);
      const cellId = e.target.id;
      const cellNumber = parseInt(cellId.slice(1), 10);
      const row = Math.floor((cellNumber - 1) / 10);
      const col = (cellNumber - 1) % 10;

      const startRow = ship.classList.contains('vertical') ? row - offset : row;
      const startCol = ship.classList.contains('vertical') ? col : col - offset;

      const previousCellIds = JSON.parse(ship.getAttribute('data-cells'));
      previousCellIds.forEach(cellId => {
        const cell = document.getElementById(cellId);
        if (cell) {
          while (cell.firstChild) {
            ship.appendChild(cell.firstChild);
          };
        };
      });

      let canPlaceShip = true;
      const shipCells = Array.from(ship.children);
      const newCellIds = [];
      for (let i = 0; i < shipSize; i++) {
        const currentCellId = ship.classList.contains('vertical')
          ? `c${(startRow + i) * 10 + startCol + 1}`
          : `c${startRow * 10 + startCol + i + 1}`;
        const currentCell = document.getElementById(currentCellId);
        if (!currentCell || currentCell.children.length > 0) {
          canPlaceShip = false;
          break;
        };
        newCellIds.push(currentCellId);
      };

      if (canPlaceShip) {
        if (ship.classList.contains('vertical')) {
          const colCheck = newCellIds.every((id, index) => {
            const expectedCol = startCol + 1;
            const actualCol = parseInt(id.slice(1)) % 10;
            return actualCol === expectedCol;
          });
          canPlaceShip = colCheck;
        } else {
          const rowCheck = newCellIds.every((id, index) => {
            const expectedRow = startRow;
            const actualRow = Math.floor((parseInt(id.slice(1)) - 1) / 10);
            return actualRow === expectedRow;
          });
          canPlaceShip = rowCheck;
        };
      };

      if (canPlaceShip) {
        for (let i = 0; i < shipSize; i++) {
          const currentCellId = newCellIds[i];
          const currentCell = document.getElementById(currentCellId);
          const shipCell = shipCells[i];
          if (shipCell) {
            currentCell.appendChild(shipCell);
          } else {
            console.error(`Ship cell not found for index ${i}`);
          };
        };
        ship.setAttribute('data-cells', JSON.stringify(newCellIds));

        const shipContainer = ship.closest('.ship-container');
        shipContainer.querySelector('.rotate-button').classList.add('hidden');
        shipContainer.querySelector('.reset-button').classList.remove('hidden');
      } else {
        previousCellIds.forEach((cellId, index) => {
          const cell = document.getElementById(cellId);
          if (cell) {
            cell.appendChild(shipCells[index]);
          };
        });
      };
    });
  });

  document.getElementById('check-positions').addEventListener('click', () => {
    const positions = {};
    let allShipsCorrectlyPlaced = true;

    ships.forEach(ship => {
      const cellIds = JSON.parse(ship.getAttribute('data-cells'));
      
      let isCorrectlyPlaced = true;
      cellIds.forEach(cellId => {
        const cell = document.getElementById(cellId);
        if (!cell || !cell.classList.contains('cell')) {
          isCorrectlyPlaced = false;
        };
      });

      if (isCorrectlyPlaced) {
        positions[ship.id] = cellIds;
      } else {
        positions[ship.id] = null;
        allShipsCorrectlyPlaced = false;
      };
    });

    makeMove(positions);
  });
};

initBoard();
initGame();