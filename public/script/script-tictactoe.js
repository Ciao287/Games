let gameData = {
  success: true,
  difficulty: 2,
  board: {
    c1: false, c2: false, c3: false,
    c4: false, c5: false, c6: false,
    c7: false, c8: false, c9: false
  },
  move: null,
  winner: false
};
let currentPlayer = 'X';
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

function checkAllCellsFilled() {
  let { board } = gameData;
  for (let cell in board) {
    if (board.hasOwnProperty(cell) && board[cell] === false) {
      return false;
    };
  };
  return true;
};

function checkWinner() {
  let { board } = gameData;

  if (board.c1 === "X" && board.c2 === "X" && board.c3 === "X") {
    return "X";
  } else if (board.c4 === "X" && board.c5 === "X" && board.c6 === "X") {
    return "X";
  } else if (board.c7 === "X" && board.c8 === "X" && board.c9 === "X") {
    return "X";
  } else if (board.c1 === "X" && board.c4 === "X" && board.c7 === "X") {
    return "X";
  } else if (board.c2 === "X" && board.c5 === "X" && board.c8 === "X") {
    return "X";
  } else if (board.c3 === "X" && board.c6 === "X" && board.c9 === "X") {
    return "X";
  } else if (board.c1 === "X" && board.c5 === "X" && board.c9 === "X") {
    return "X";
  } else if (board.c3 === "X" && board.c5 === "X" && board.c7 === "X") {
    return "X";
  } else if (board.c1 === "O" && board.c2 === "O" && board.c3 === "O") {
    return "O";
  } else if (board.c4 === "O" && board.c5 === "O" && board.c6 === "O") {
    return "O";
  } else if (board.c7 === "O" && board.c8 === "O" && board.c9 === "O") {
    return "O";
  } else if (board.c1 === "O" && board.c4 === "O" && board.c7 === "O") {
    return "O";
  } else if (board.c2 === "O" && board.c5 === "O" && board.c8 === "O") {
    return "O";
  } else if (board.c3 === "O" && board.c6 === "O" && board.c9 === "O") {
    return "O";
  } else if (board.c1 === "O" && board.c5 === "O" && board.c9 === "O") {
    return "O";
  } else if (board.c3 === "O" && board.c5 === "O" && board.c7 === "O") {
    return "O";
  };

  if (checkAllCellsFilled()) {
    return "Tie";
  };

  return false;
};

function checkAndDrawLine() {
  let { board } = gameData;

  if (board.c1 === "X" && board.c2 === "X" && board.c3 === "X") {
    return drawLine(['c1', 'c2', 'c3']);
  } else if (board.c4 === "X" && board.c5 === "X" && board.c6 === "X") {
    return drawLine(['c4', 'c5', 'c6']);
  } else if (board.c7 === "X" && board.c8 === "X" && board.c9 === "X") {
    return drawLine(['c7', 'c8', 'c9']);
  } else if (board.c1 === "X" && board.c4 === "X" && board.c7 === "X") {
    return drawLine(['c1', 'c4', 'c7']);
  } else if (board.c2 === "X" && board.c5 === "X" && board.c8 === "X") {
    return drawLine(['c2', 'c5', 'c8']);
  } else if (board.c3 === "X" && board.c6 === "X" && board.c9 === "X") {
    return drawLine(['c3', 'c6', 'c9']);
  } else if (board.c1 === "X" && board.c5 === "X" && board.c9 === "X") {
    return drawLine(['c1', 'c5', 'c9']);
  } else if (board.c3 === "X" && board.c5 === "X" && board.c7 === "X") {
    return drawLine(['c3', 'c5', 'c7']);
  } else if (board.c1 === "O" && board.c2 === "O" && board.c3 === "O") {
    return drawLine(['c1', 'c2', 'c3']);
  } else if (board.c4 === "O" && board.c5 === "O" && board.c6 === "O") {
    return drawLine(['c4', 'c5', 'c6']);
  } else if (board.c7 === "O" && board.c8 === "O" && board.c9 === "O") {
    return drawLine(['c7', 'c8', 'c9']);
  } else if (board.c1 === "O" && board.c4 === "O" && board.c7 === "O") {
    return drawLine(['c1', 'c4', 'c7']);
  } else if (board.c2 === "O" && board.c5 === "O" && board.c8 === "O") {
    return drawLine(['c2', 'c5', 'c8']);
  } else if (board.c3 === "O" && board.c6 === "O" && board.c9 === "O") {
    return drawLine(['c3', 'c6', 'c9']);
  } else if (board.c1 === "O" && board.c5 === "O" && board.c9 === "O") {
    return drawLine(['c1', 'c5', 'c9']);
  } else if (board.c3 === "O" && board.c5 === "O" && board.c7 === "O") {
    return drawLine(['c3', 'c5', 'c7']);
  };

  return document.getElementById('line').classList.add('hidden');
};

function drawLine(cells) {
  const board = document.querySelector('.board');
  const line = document.getElementById('line');

  const cell1 = document.getElementById(cells[0]);
  const cell3 = document.getElementById(cells[2]);

  const rect1 = cell1.getBoundingClientRect();
  const rect3 = cell3.getBoundingClientRect();

  const center1 = {
    x: rect1.left + rect1.width / 2,
    y: rect1.top + rect1.height / 2,
  };
  const center3 = {
    x: rect3.left + rect3.width / 2,
    y: rect3.top + rect3.height / 2,
  };

  const boardRect = board.getBoundingClientRect();
  const x1 = center1.x - boardRect.left;
  const y1 = center1.y - boardRect.top;
  const x2 = center3.x - boardRect.left;
  const y2 = center3.y - boardRect.top;

  const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

  const lineThickness = 4;
  const centeredY = y1 - lineThickness / 2;

  line.style.width = `${distance}px`;
  line.style.top = `${centeredY}px`;
  line.style.left = `${x1}px`;
  line.style.transform = `rotate(${angle}deg) scaleX(0)`;
  line.classList.remove('hidden');

  setTimeout(() => {
    line.style.transform = `rotate(${angle}deg) scaleX(1)`;
  }, 250);
};

function makeMove(cell) {
  if(mode === '0') {
    if (win || isRequestInProgress) return;

    if (gameData.board[cell]) {
      return;
    };

    gameData.move = cell;

    gameData.board[cell] = currentPlayer;
    document.getElementById(cell).disabled = true;
    updateBoard(gameData.board);

    sendRequest(gameData);
  } else {
    if (multiplayer === '0') {
      if (win) return;

      if (gameData.board[cell]) {
        return;
      };

      const {x, o, currentPlayer} = gameData;

      if((currentPlayer === 'X' && x === privateToken) || (currentPlayer === 'O' && o === privateToken)) {
        gameData.move = cell;

        gameData.board[cell] = currentPlayer;
        document.getElementById(cell).disabled = true;
        updateBoard(gameData.board);

        sendMultiplayerRequest(gameData, gameUrl);
      };

    } else {
      if (win) return;

      if (gameData.board[cell]) {
        return;
      };

      gameData.move = cell;

      gameData.board[cell] = currentPlayer;
      document.getElementById(cell).disabled = true;
      updateBoard(gameData.board);

      gameData.winner = checkWinner();
      checkGameStatus(gameData);

      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    };
  };
};

function sendRequest(data, retryCount = 0) {
  isRequestInProgress = true;
  connectionError = false;

  axios.post(`${link}/api/tictactoe`, data).then(response => {
    gameData = response.data;
    updateBoard(gameData.board);
    checkGameStatus(gameData);

    if (!win) {
      currentPlayer = gameData.move === 'X' ? 'O' : 'X';
    };

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

function updateBoard(board) {
  for (let cell in board) {
    const cellElement = document.getElementById(cell);
    if (cellElement) {
      if (board[cell] === 'X') {
        cellElement.classList.add('x');
      } else if (board[cell] === 'O') {
        cellElement.classList.add('o');
      } else {
        cellElement.classList.remove('x', 'o');
      };
    };
  };
};

function checkGameStatus(gameData) {
  if (gameData.winner || Object.values(gameData.board).every(cell => cell)) {
    let resultMessage;
    if(mode === '0') {
      resultMessage = gameData.winner === 'X' ? "You Win!" : (gameData.winner === 'O' ? "You Lose!" : "It's a Tie!");
    } else {
      if(multiplayer === '0') {
        if(gameData.x === privateToken) {
          resultMessage = gameData.winner === 'X' ? "You Win!" : (gameData.winner === 'O' ? "You Lose!" : "It's a Tie!");
        } else {
          resultMessage = gameData.winner === 'X' ? "You Lose!" : (gameData.winner === 'O' ? "You Win!" : "It's a Tie!");
        };
      } else {
        resultMessage = gameData.winner === 'X' ? "X Won!" : (gameData.winner === 'O' ? "O Won!" : "It's a Tie!");
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
    checkAndDrawLine();
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

  const mode = document.getElementById('mode').value;
  if(mode === '0') {
    document.getElementById('difficulty').classList.remove('hidden');
    document.getElementById('multiplayer').classList.add('hidden');
  } else {
    document.getElementById('difficulty').classList.add('hidden');
    document.getElementById('multiplayer').classList.remove('hidden');
  };
};

function startNewGame() {
  document.getElementById('go-home-button').classList.add('hidden');
  fetchGame(false);
  mode = document.getElementById('mode').value;
  if(mode === '0') {
    const difficulty = document.getElementById('difficulty').value;
    gameData.difficulty = parseInt(difficulty);
    gameData.board = {
      c1: false, c2: false, c3: false,
      c4: false, c5: false, c6: false,
      c7: false, c8: false, c9: false
    };
    currentPlayer = 'X';
    updateBoard(gameData.board);
    document.getElementById('difficulty-container').classList.add('hidden');
    document.getElementById('board-container').classList.remove('hidden');

    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
      cell.disabled = false;
      cell.textContent = '';
    });

    win = false;
    isRequestInProgress = false;
    connectionError = false;
  } else {
    multiplayer = document.getElementById('multiplayer').value;
    if(multiplayer === '0') {
      document.getElementById('token-container').classList.remove('hidden');
      fetchTokens();
    } else {
      gameData.board = {
        c1: false, c2: false, c3: false,
        c4: false, c5: false, c6: false,
        c7: false, c8: false, c9: false
      };
      currentPlayer = 'X';
      updateBoard(gameData.board);
      document.getElementById('difficulty-container').classList.add('hidden');
      document.getElementById('board-container').classList.remove('hidden');
  
      const cells = document.querySelectorAll('.cell');
      cells.forEach(cell => {
        cell.disabled = false;
        cell.textContent = '';
      });
  
      win = false;
    };
  };
};

function fetchTokens(retryCount = 0) {
  axios.post(`${link}/api/generatetoken?tictactoe`).then(response => {
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
          if(!url) url = `${link}/api/tictactoe/multiplayer/${privateToken}`;
          axios.get(url).then(response => {
            gameData = response.data;

            updateBoard(gameData.board);
            checkGameStatus(gameData);
            if(first) {
              document.getElementById('end-game-container').classList.add('hidden');
              document.getElementById('go-home-button').classList.add('hidden');

              document.getElementById('difficulty-container').classList.add('hidden');
              document.getElementById('token-container').classList.add('hidden');
              document.getElementById('invitation-container').classList.add('hidden');
              document.getElementById('board-container').classList.remove('hidden');

              const cells = document.querySelectorAll('.cell');
              cells.forEach(cell => {
                cell.disabled = false;
                cell.textContent = '';
              });

              win = false;
              first = false;
            };
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

  url = gameUrl ? gameUrl : `${link}/api/tictactoe/multiplayer/${privateToken}`;
  axios.post(url, data).then(response => {
    gameData = response.data;
    updateBoard(gameData.board);
    checkGameStatus(gameData);

    if (!win) {
      currentPlayer = gameData.move === 'X' ? 'O' : 'X';
    };

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
  data.board = {
    c1: false, c2: false, c3: false,
    c4: false, c5: false, c6: false,
    c7: false, c8: false, c9: false
  };
  currentPlayer = 'X';
  updateBoard(data.board);
  document.getElementById('difficulty-container').classList.add('hidden');
  document.getElementById('token-container').classList.add('hidden');
  document.getElementById('invitation-container').classList.add('hidden');
  document.getElementById('board-container').classList.remove('hidden');

  const cells = document.querySelectorAll('.cell');
  cells.forEach(cell => {
    cell.disabled = false;
    cell.textContent = '';
  });

  win = false;
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
  document.getElementById('line').classList.add('hidden');
  initGame();
};

function handleModeChange() {
  fetchGame(false);
  const mode = document.getElementById('mode').value;
  document.getElementById('token-container').classList.add('hidden');

  if (mode === "0") {
    document.getElementById('difficulty').classList.remove('hidden');
    document.getElementById('multiplayer').classList.add('hidden');
  } else {
    document.getElementById('difficulty').classList.add('hidden');
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
  document.getElementById('difficulty').addEventListener('change', clearToken);
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