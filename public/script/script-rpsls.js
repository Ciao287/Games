let gameData = {
    success: true,
    user: false,
    computer: false,
    winner: false,
    message: false
};
let win = false;
let isRequestInProgress = false;
let connectionError = false;
let mode;
let multiplayer;
let privateToken;
let publicToken;
let fetchInterval = null;
let gameUrl = false;
let first = true;

function checkWinner() {
    let { user, computer } = gameData;

    if (user === computer) return {
        winner: "Tie",
        message: "It's a tie!"
    };

    const winMap = {
        'scissors': { 'paper': 'Scissors cuts Paper', 'lizard': 'Scissors decapitates Lizard' },
        'paper': { 'rock': 'Paper covers Rock', 'spock': 'Paper disproves Spock' },
        'rock': { 'lizard': 'Rock crushes Lizard', 'scissors': 'Rock crushes Scissors' },
        'lizard': { 'spock': 'Lizard poisons Spock', 'paper': 'Lizard eats Paper' },
        'spock': { 'scissors': 'Spock smashes Scissors', 'rock': 'Spock vaporizes Rock' }
    };

    if (winMap[user] && winMap[user][computer]) {
        return {
            winner: "Win",
            message: winMap[user][computer]
        };
    } else {
        return {
            winner: "Lose",
            message: winMap[computer][user]
        };
    }
};

// function makeMove(cell) {
//   if(mode === '0') {
//     if (win || isRequestInProgress) return;

//     if (gameData.board[cell]) {
//       return;
//     };

//     gameData.move = cell;

//     gameData.board[cell] = currentPlayer;
//     document.getElementById(cell).disabled = true;
//     updateBoard(gameData.board);

//     sendRequest(gameData);
//   } else {
//     if (multiplayer === '0') {
//       if (win) return;

//       if (gameData.board[cell]) {
//         return;
//       };

//       const {x, o, currentPlayer} = gameData;

//       if((currentPlayer === 'X' && x === privateToken) || (currentPlayer === 'O' && o === privateToken)) {
//         gameData.move = cell;

//         gameData.board[cell] = currentPlayer;
//         document.getElementById(cell).disabled = true;
//         updateBoard(gameData.board);

//         sendMultiplayerRequest(gameData, gameUrl);
//       };

//     } else {
//       if (win) return;

//       if (gameData.board[cell]) {
//         return;
//       };

//       gameData.move = cell;

//       gameData.board[cell] = currentPlayer;
//       document.getElementById(cell).disabled = true;
//       updateBoard(gameData.board);

//       gameData.winner = checkWinner();
//       checkGameStatus(gameData);

//       currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
//     };
//   };
// };

// function sendRequest(data, retryCount = 0) {
//   isRequestInProgress = true;
//   connectionError = false;

//   axios.post(`${link}/api/tictactoe`, data).then(response => {
//     gameData = response.data;
//     updateBoard(gameData.board);
//     checkGameStatus(gameData);

//     if (!win) {
//       currentPlayer = gameData.move === 'X' ? 'O' : 'X';
//     };

//     isRequestInProgress = false;
//   }).catch(error => {
//     console.error("Request error:", error);

//     if (retryCount < 3) {
//       setTimeout(() => {
//         console.log(`Retrying request... Attempt ${retryCount + 1}`);
//         sendRequest(data, retryCount + 1);
//       }, 20000);
//     } else {
//       displayConnectionError(data);
//     };
//   });
// };

// function displayConnectionError(data) {
//   connectionError = true;
//   isRequestInProgress = true;

//   const resultMessage = document.getElementById('result-message');
//   resultMessage.textContent = "No connection. Please check your internet and press the button below to retry.";
//   resultMessage.style.display = 'block';

//   const retryButton = document.createElement('button');
//   retryButton.textContent = "Retry";
//   retryButton.id = "retry-button";
//   const endGameContainer = document.getElementById('end-game-container');
//   const gotoHomeButton = document.getElementById('go-home-button');
//   retryButton.onclick = () => {
//     retryButton.remove();
//     endGameContainer.classList.add('hidden');
//     gotoHomeButton.classList.add('hidden');
//     sendRequest(data);
//   };

//   endGameContainer.appendChild(retryButton);
//   endGameContainer.classList.remove('hidden');
//   gotoHomeButton.classList.remove('hidden');
// };

// function updateBoard(board) {
//   for (let cell in board) {
//     const cellElement = document.getElementById(cell);
//     if (cellElement) {
//       if (board[cell] === 'X') {
//         cellElement.classList.add('x');
//       } else if (board[cell] === 'O') {
//         cellElement.classList.add('o');
//       } else {
//         cellElement.classList.remove('x', 'o');
//       };
//     };
//   };
// };

// function checkGameStatus(gameData) {
//   if (gameData.winner || Object.values(gameData.board).every(cell => cell)) {
//     let resultMessage;
//     if(mode === '0') {
//       resultMessage = gameData.winner === 'X' ? "You Win!" : (gameData.winner === 'O' ? "You Lose!" : "It's a Tie!");
//     } else {
//       if(multiplayer === '0') {
//         if(gameData.x === privateToken) {
//           resultMessage = gameData.winner === 'X' ? "You Win!" : (gameData.winner === 'O' ? "You Lose!" : "It's a Tie!");
//         } else {
//           resultMessage = gameData.winner === 'X' ? "You Lose!" : (gameData.winner === 'O' ? "You Win!" : "It's a Tie!");
//         };
//       } else {
//         resultMessage = gameData.winner === 'X' ? "X Won!" : (gameData.winner === 'O' ? "O Won!" : "It's a Tie!");
//       };
//     };
//     fetchGame(false);
    
//     document.getElementById('result-message').textContent = resultMessage;

//     const cells = document.querySelectorAll('.cell');
//     cells.forEach(cell => {
//       cell.disabled = true;
//     });

//     win = true;

//     const retryButton = document.getElementById('retry-button');
//     if (retryButton) retryButton.remove();

//     document.getElementById('end-game-container').classList.remove('hidden');
//     document.getElementById('go-home-button').classList.remove('hidden');
//     checkAndDrawLine();
//   };
// };

function initGame() {
  document.getElementById('difficulty-container').classList.remove('hidden');
//   document.getElementById('board-container').classList.add('hidden');
  document.getElementById('end-game-container').classList.add('hidden');
  document.getElementById('go-home-button').classList.remove('hidden');
  win = false;
  isRequestInProgress = false;
  connectionError = false;

  const mode = document.getElementById('mode').value;
  if(mode === '0') {
    document.getElementById('multiplayer').classList.add('hidden');
  } else {
    document.getElementById('multiplayer').classList.remove('hidden');
  };
};

// function startNewGame() {
//   document.getElementById('go-home-button').classList.add('hidden');
//   fetchGame(false);
//   mode = document.getElementById('mode').value;
//   if(mode === '0') {
//     const difficulty = document.getElementById('difficulty').value;
//     gameData.difficulty = parseInt(difficulty);
//     gameData.board = {
//       c1: false, c2: false, c3: false,
//       c4: false, c5: false, c6: false,
//       c7: false, c8: false, c9: false
//     };
//     currentPlayer = 'X';
//     updateBoard(gameData.board);
//     document.getElementById('difficulty-container').classList.add('hidden');
//     document.getElementById('board-container').classList.remove('hidden');

//     const cells = document.querySelectorAll('.cell');
//     cells.forEach(cell => {
//       cell.disabled = false;
//       cell.textContent = '';
//     });

//     win = false;
//     isRequestInProgress = false;
//     connectionError = false;
//   } else {
//     multiplayer = document.getElementById('multiplayer').value;
//     if(multiplayer === '0') {
//       document.getElementById('token-container').classList.remove('hidden');
//       fetchTokens();
//     } else {
//       gameData.board = {
//         c1: false, c2: false, c3: false,
//         c4: false, c5: false, c6: false,
//         c7: false, c8: false, c9: false
//       };
//       currentPlayer = 'X';
//       updateBoard(gameData.board);
//       document.getElementById('difficulty-container').classList.add('hidden');
//       document.getElementById('board-container').classList.remove('hidden');
  
//       const cells = document.querySelectorAll('.cell');
//       cells.forEach(cell => {
//         cell.disabled = false;
//         cell.textContent = '';
//       });
  
//       win = false;
//     };
//   };
// };

function fetchTokens(retryCount = 0) {
  axios.post(`${link}/api/generatetoken?rpsls`).then(response => {
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

// function fetchGame(start = true, url) {
//   if (start) {
//     if(!fetchInterval) {
//       fetchInterval = setInterval(() => {
//         if(privateToken) {
//           if(!url) url = `${link}/api/tictactoe/multiplayer/${privateToken}`;
//           axios.get(url).then(response => {
//             gameData = response.data;

//             updateBoard(gameData.board);
//             checkGameStatus(gameData);
//             if(first) {
//               document.getElementById('end-game-container').classList.add('hidden');
//               document.getElementById('go-home-button').classList.add('hidden');

//               document.getElementById('difficulty-container').classList.add('hidden');
//               document.getElementById('token-container').classList.add('hidden');
//               document.getElementById('invitation-container').classList.add('hidden');
//               document.getElementById('board-container').classList.remove('hidden');

//               const cells = document.querySelectorAll('.cell');
//               cells.forEach(cell => {
//                 cell.disabled = false;
//                 cell.textContent = '';
//               });

//               win = false;
//               first = false;
//             };
//           }).catch(error => {
//             if (error.response?.data?.success !== false) {
//               console.error("Error fetching the game:", error);
//             };
//           });
//         };
//       }, 5000);
//     };
//   } else {
//     if(fetchInterval) {
//       clearInterval(fetchInterval);
//       fetchInterval = null;
//     };
//   };
// };

// function sendMultiplayerRequest(data, gameUrl, retryCount = 0) {
//   isRequestInProgress = true;
//   connectionError = false;

//   url = gameUrl ? gameUrl : `${link}/api/tictactoe/multiplayer/${privateToken}`;
//   axios.post(url, data).then(response => {
//     gameData = response.data;
//     updateBoard(gameData.board);
//     checkGameStatus(gameData);

//     if (!win) {
//       currentPlayer = gameData.move === 'X' ? 'O' : 'X';
//     };

//     isRequestInProgress = false;
//   }).catch(error => {
//     console.error("Request error:", error);

//     if (retryCount < 3) {
//       setTimeout(() => {
//         console.log(`Retrying request... Attempt ${retryCount + 1}`);
//         sendMultiplayerRequest(data, gameUrl, retryCount + 1);
//       }, 20000);
//     } else {
//       displayMultiplayerConnectionError(data, gameUrl);
//     };
//   });
// };

// function displayMultiplayerConnectionError(data, gameUrl) {
//   connectionError = true;
//   isRequestInProgress = true;

//   const resultMessage = document.getElementById('result-message');
//   resultMessage.textContent = "No connection. Please check your internet and press the button below to retry.";
//   resultMessage.style.display = 'block';

//   const retryButton = document.createElement('button');
//   retryButton.textContent = "Retry";
//   retryButton.id = "retry-button";
//   const endGameContainer = document.getElementById('end-game-container');
//   const gotoHomeButton = document.getElementById('go-home-button');
//   retryButton.onclick = () => {
//     retryButton.remove();
//     endGameContainer.classList.add('hidden');
//     gotoHomeButton.classList.add('hidden');
//     sendMultiplayerRequest(data, gameUrl);
//   };

//   endGameContainer.appendChild(retryButton);
//   endGameContainer.classList.remove('hidden');
//   gotoHomeButton.classList.remove('hidden');
// };

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
      inputError.style = 'color: red; margin-top: 5px';

      tokenContainer.appendChild(inputError);
    };
  };
};

function verifyToken(data, retryCount = 0) {
  axios.post(`${link}/api/verifycode`, data).then(response => {
    gameUrl = response.data.url;

    fetchGame(false);

    fetchGame(true, gameUrl);

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
        inputError.style = 'color: red; margin-top: 5px';

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
          inputError.style = 'color: red; margin-top: 5px';

          tokenContainer.appendChild(inputError);
        };
      };
    };
  });
};

// function startMultiplayerGame(data) {
//   data.board = {
//     c1: false, c2: false, c3: false,
//     c4: false, c5: false, c6: false,
//     c7: false, c8: false, c9: false
//   };
//   currentPlayer = 'X';
//   updateBoard(data.board);
//   document.getElementById('difficulty-container').classList.add('hidden');
//   document.getElementById('token-container').classList.add('hidden');
//   document.getElementById('invitation-container').classList.add('hidden');
//   document.getElementById('board-container').classList.remove('hidden');

//   const cells = document.querySelectorAll('.cell');
//   cells.forEach(cell => {
//     cell.disabled = false;
//     cell.textContent = '';
//   });

//   win = false;
// };

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
  // document.getElementById('go-home-button').classList.add('hidden');
  document.getElementById('line').classList.add('hidden');
  initGame();
};

function handleModeChange() {
  fetchGame(false);
  const mode = document.getElementById('mode').value;
  document.getElementById('token-container').classList.add('hidden');

  if (mode === "0") {
    // document.getElementById('difficulty').classList.remove('hidden');
    document.getElementById('multiplayer').classList.add('hidden');
  } else {
    // document.getElementById('difficulty').classList.add('hidden');
    document.getElementById('multiplayer').classList.remove('hidden');
  };
};

function clearToken() {
  fetchGame(false);
  document.getElementById('token-container').classList.add('hidden');
};

function initBoard() {
  const cells = document.querySelectorAll('.cell');
  cells.forEach(cell => {
    cell.addEventListener('click', () => makeMove(cell.id));
  });
  document.getElementById('start-game').addEventListener('click', startNewGame);
  document.getElementById('restart-game').addEventListener('click', restartGame);
  document.getElementById('mode').addEventListener('change', handleModeChange);
//   document.getElementById('difficulty').addEventListener('change', clearToken);
  document.getElementById('multiplayer').addEventListener('change', clearToken);
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

initBoard();
initGame();