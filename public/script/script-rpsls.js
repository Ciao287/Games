let gameData = {
    success: true,
    user: false,
    enemy: false,
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
    let { user, enemy } = gameData;

    if (user === enemy) return {
        winner: "Tie",
        message: "It's a Tie!"
    };

    const winMap = {
        'scissors': { 'paper': 'Scissors cuts Paper', 'lizard': 'Scissors decapitates Lizard' },
        'paper': { 'rock': 'Paper covers Rock', 'spock': 'Paper disproves Spock' },
        'rock': { 'lizard': 'Rock crushes Lizard', 'scissors': 'Rock crushes Scissors' },
        'lizard': { 'spock': 'Lizard poisons Spock', 'paper': 'Lizard eats Paper' },
        'spock': { 'scissors': 'Spock smashes Scissors', 'rock': 'Spock vaporizes Rock' }
    };

    if (winMap[user] && winMap[user][enemy]) {
        return {
            winner: "Win",
            message: winMap[user][enemy] +"a"
        };
    } else {
        return {
            winner: "Lose",
            message: winMap[enemy][user]
        };
    }
};

function makeMove(cell) {
  if(cell.endsWith('2') && mode === '0') return;
  if(cell.endsWith('2') && mode === '1' && multiplayer === '0') return;
  if(mode === '0') {
    if (win || isRequestInProgress) return;

    if (gameData.user) return;

    gameData.user = cell;

    document.getElementById('button-container').classList.add('hidden');

    const boardContainer = document.getElementById('board-container');
    const buttonContainer = document.getElementById('button-container');
    let userMove = document.getElementById('user-move');
    let enemyMove = document.getElementById('enemy-move');
    if(!userMove) {
      userMove = document.createElement('h2');
      userMove.id = 'user-move';
      boardContainer.insertBefore(userMove, buttonContainer);
    };

    if(!enemyMove) {
      enemyMove = document.createElement('h2');
      enemyMove.id = 'enemy-move';
      boardContainer.insertBefore(enemyMove, buttonContainer);
    };

    userMove.textContent = `You chose ${cell}`;
    enemyMove.textContent = `Waiting for the enemy...`;
    userMove.classList.remove('hidden');
    enemyMove.classList.remove('hidden');
    sendRequest(gameData);
  } else {
    if (multiplayer === '0') {
      if (win) return;

      const boardContainer = document.getElementById('board-container');
      const buttonContainer = document.getElementById('button-container');
      let userMove = document.getElementById('user-move');
      let enemyMove = document.getElementById('enemy-move');
      if(!userMove) {
        userMove = document.createElement('h2');
        userMove.id = 'user-move';
        userMove.classList.add('hidden');
        boardContainer.insertBefore(userMove, buttonContainer);
      };

      if(!enemyMove) {
        enemyMove = document.createElement('h2');
        enemyMove.id = 'enemy-move';
        enemyMove.classList.add('hidden');
        boardContainer.insertBefore(enemyMove, buttonContainer);
      };

      if(privateToken === gameData.u) {
        if (!gameData.user) gameData.user = cell;
        userMove.textContent = `You chose ${gameData.user}`;
      } else if(privateToken === gameData.e) {
        if (!gameData.enemy) gameData.enemy = cell;
        enemyMove.textContent = `You chose ${gameData.enemy}`;
      } else return;

      userMove.classList.remove('hidden');
      enemyMove.classList.remove('hidden');
      buttonContainer.classList.add('hidden');

      sendMultiplayerRequest(gameData, gameUrl);
    } else {
      if (win) return;

      if(gameData.user && gameData.enemy) return;

      if(cell.endsWith('2')) {
        gameData.enemy = cell.slice(0, -1);
      } else {
        if(!gameData.user) gameData.user = cell;
      };

      const buttonContainer = document.getElementById('button-container');
      const buttonContainer2 = document.getElementById('button-container2');
      buttonContainer.classList.add('hidden');

      const boardContainer = document.getElementById('board-container');
      let userMove = document.getElementById('user-move');
      let enemyMove = document.getElementById('enemy-move');
      if(!userMove) {
        userMove = document.createElement('h2');
        userMove.id = 'user-move';
        userMove.classList.add('hidden');
        boardContainer.insertBefore(userMove, buttonContainer);
      };

      if(!enemyMove) {
        enemyMove = document.createElement('h2');
        enemyMove.id = 'enemy-move';
        enemyMove.classList.add('hidden');
        boardContainer.insertBefore(enemyMove, buttonContainer);
      };

      buttonContainer2.classList.remove('hidden');
      userMove.textContent = `Ther first player chose`;
      enemyMove.textContent = `Waiting for the second player...`;

      if(cell.endsWith('2')) {
        buttonContainer2.classList.add('hidden');
        userMove.textContent = `The first player chose ${gameData.user}`;
        enemyMove.textContent = `The second player chose ${gameData.enemy}`;
      };

      userMove.classList.remove('hidden');
      enemyMove.classList.remove('hidden');

      if(cell.endsWith('2')) {
        const { winner, message } = checkWinner();
        gameData.winner = winner;
        gameData.message = message;
        checkGameStatus(gameData);
      };
    };
  };
};

function sendRequest(data, retryCount = 0) {
  isRequestInProgress = true;
  connectionError = false;

  axios.post(`${link}/api/rpsls`, data).then(response => {
    gameData = response.data;
    const enemyMove = document.getElementById('enemy-move');
    enemyMove.textContent = `The computer chose ${gameData.enemy}`;
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

function checkGameStatus(gameData) {
  if (gameData.winner) {
    let resultMessage;
    if(mode === '0') {
      resultMessage = gameData.winner === 'Win' ? `You Win!<br>${gameData.message}` : (gameData.winner === 'Lose' ? `You Lose!<br>${gameData.message}` : gameData.message);
    } else {
      if(multiplayer === '0') {
        if(gameData.u === privateToken) {
          resultMessage = gameData.winner === 'Win' ? `You Win!<br>${gameData.message}` : (gameData.winner === 'Lose' ? `You Lose!<br>${gameData.message}` : gameData.message);
        } else {
          resultMessage = gameData.winner === 'Win' ? `You Lose!<br>${gameData.message}` : (gameData.winner === 'Lose' ? `You Win!<br>${gameData.message}` : gameData.message);
        };
      } else {
        resultMessage = gameData.winner === 'Win' ? `First player won!<br>${gameData.message}` : (gameData.winner === 'Lose' ? `Second player won!<br>${gameData.message}` : gameData.message);
      };
    };
    fetchGame(false);
    
    document.getElementById('result-message').innerHTML = resultMessage;

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
  document.getElementById('button-container').classList.remove('hidden');
  const userMove = document.getElementById('user-move')
  if(userMove) userMove.classList.add('hidden');
  const enemyMove =document.getElementById('enemy-move')
  if(enemyMove) enemyMove.classList.add('hidden');

  win = false;
  isRequestInProgress = false;
  connectionError = false;
  gameData.user = false;
  gameData.enemy = false;
  gameData.winner = false;
  gameData.message = false;

  const mode = document.getElementById('mode').value;
  if(mode === '0') {
    document.getElementById('multiplayer').classList.add('hidden');
  } else {
    document.getElementById('multiplayer').classList.remove('hidden');
  };
  
  removeMediaQueryRule();
};

function startNewGame() {
  document.getElementById('go-home-button').classList.add('hidden');
  fetchGame(false);
  mode = document.getElementById('mode').value;
  if(mode === '0') {
    gameData.user = false;
    gameData.enemy = false;

    document.getElementById('difficulty-container').classList.add('hidden');
    document.getElementById('board-container').classList.remove('hidden');

    win = false;
    isRequestInProgress = false;
    connectionError = false;
  } else {
    multiplayer = document.getElementById('multiplayer').value;
    if(multiplayer === '0') {
      document.getElementById('token-container').classList.remove('hidden');
      fetchTokens();
    } else {
      gameData.user = false;
      gameData.enemy = false;

      document.getElementById('difficulty-container').classList.add('hidden');
      document.getElementById('board-container').classList.remove('hidden');

      const buttonContainer2 = document.getElementById('button-container2');

      if(!buttonContainer2) {
        const buttonContainer2 = document.createElement('div');
        buttonContainer2.id = 'button-container2';
        buttonContainer2.classList.add('button-container');
        buttonContainer2.classList.add('hidden');
        document.getElementById('board-container').appendChild(buttonContainer2);
        const div = document.createElement('div');
        const button = document.createElement('button');
        button.value = 'rock2';
        button.classList.add('game-button');
        const img = document.createElement('img');
        img.src = '/svg/rock.svg';
        img.alt = 'Rock';
        const text = document.createElement('h2');
        text.textContent = 'Rock';
        const div2 = document.createElement('div');
        const button2 = document.createElement('button');
        button2.value = 'paper2';
        button2.classList.add('game-button');
        const img2 = document.createElement('img');
        img2.src = '/svg/paper.svg';
        img2.alt = 'Paper';
        const text2 = document.createElement('h2');
        text2.textContent = 'Paper';
        const div3 = document.createElement('div');
        const button3 = document.createElement('button');
        button3.value = 'scissors2';
        button3.classList.add('game-button');
        const img3 = document.createElement('img');
        img3.src = '/svg/scissors.svg';
        img3.alt = 'Scissors';
        const text3 = document.createElement('h2');
        text3.textContent = 'Scissors';
        const div4 = document.createElement('div');
        const button4 = document.createElement('button');
        button4.value = 'lizard2';
        button4.classList.add('game-button');
        const img4 = document.createElement('img');
        img4.src = '/svg/lizard.svg';
        img4.alt = 'Lizard';
        const text4 = document.createElement('h2');
        text4.textContent = 'Lizard';
        const div5 = document.createElement('div');
        const button5 = document.createElement('button');
        button5.value = 'spock2';
        button5.classList.add('game-button');
        const img5 = document.createElement('img');
        img5.src = '/svg/spock.svg';
        img5.alt = 'Spock';
        const text5 = document.createElement('h2');
        text5.textContent = 'Spock';

        button.appendChild(img);
        button2.appendChild(img2);
        button3.appendChild(img3);
        button4.appendChild(img4);
        button5.appendChild(img5);

        div.appendChild(button);
        div.appendChild(text);
        div2.appendChild(button2);
        div2.appendChild(text2);
        div3.appendChild(button3);
        div3.appendChild(text3);
        div4.appendChild(button4);
        div4.appendChild(text4);
        div5.appendChild(button5);
        div5.appendChild(text5);
        
        buttonContainer2.appendChild(div);
        buttonContainer2.appendChild(div2);
        buttonContainer2.appendChild(div3);
        buttonContainer2.appendChild(div4);
        buttonContainer2.appendChild(div5);

        button.addEventListener('click', () => makeMove(button.value));
        button2.addEventListener('click', () => makeMove(button2.value));
        button3.addEventListener('click', () => makeMove(button3.value));
        button4.addEventListener('click', () => makeMove(button4.value));
        button5.addEventListener('click', () => makeMove(button5.value));
      };

      win = false;
    };
  };
  addMediaQueryRule();
};

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

function fetchGame(start = true, url) {
  if (start) {
    if(!fetchInterval) {
      fetchInterval = setInterval(() => {
        if(privateToken) {
          if(!url) url = `${link}/api/rpsls/multiplayer/${privateToken}`;
          axios.get(url).then(response => {
            gameData = response.data;
            let isUser;
            if(privateToken === gameData.u) {
              isUser = true;
            } else if(privateToken === gameData.e) {
              isUser = false;
            } else return;

            const boardContainer = document.getElementById('board-container');
            const buttonContainer = document.getElementById('button-container');
            let userMove = document.getElementById('user-move');
            let enemyMove = document.getElementById('enemy-move');
            if(!userMove) {
              userMove = document.createElement('h2');
              userMove.id = 'user-move';
              boardContainer.insertBefore(userMove, buttonContainer);
            };

            if(!enemyMove) {
              enemyMove = document.createElement('h2');
              enemyMove.id = 'enemy-move';
              boardContainer.insertBefore(enemyMove, buttonContainer);
            };

            userMove.textContent = isUser ? `Waiting for you...`: `Waiting for the enemy...`;
            enemyMove.textContent = isUser ? `Waiting for the enemy...`: `Waiting for you...`;

            if(gameData.user) {
              userMove.textContent = isUser ? `You chose ${gameData.user}` : `The enemy chose`;
            };
            if(gameData.enemy) {
              enemyMove.textContent = isUser ? `The enemy chose` : `You chose ${gameData.enemy}`;
            };

            if(gameData.winner) {
              userMove.textContent = isUser ? `You chose ${gameData.user}` : `The enemy chose ${gameData.user}`;
              enemyMove.textContent = isUser ? `The enemy chose ${gameData.enemy}` : `You chose ${gameData.enemy}`;
            };

            userMove.classList.remove('hidden');
            enemyMove.classList.remove('hidden');

            checkGameStatus(gameData);
            if(first) {
              document.getElementById('end-game-container').classList.add('hidden');
              document.getElementById('go-home-button').classList.add('hidden');

              document.getElementById('difficulty-container').classList.add('hidden');
              document.getElementById('token-container').classList.add('hidden');
              document.getElementById('invitation-container').classList.add('hidden');
              document.getElementById('board-container').classList.remove('hidden');

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

  url = gameUrl ? gameUrl : `${link}/api/rpsls/multiplayer/${privateToken}`;
  axios.post(url, data).then(response => {
    gameData = response.data;

    let isUser;
    if(privateToken === gameData.u) {
      isUser = true;
    } else if(privateToken === gameData.e) {
      isUser = false;
    } else return;
    
    const boardContainer = document.getElementById('board-container');
    const buttonContainer = document.getElementById('button-container');
    let userMove = document.getElementById('user-move');
    let enemyMove = document.getElementById('enemy-move');
    if(!userMove) {
      userMove = document.createElement('h2');
      userMove.id = 'user-move';
      boardContainer.insertBefore(userMove, buttonContainer);
    };

    if(!enemyMove) {
      enemyMove = document.createElement('h2');
      enemyMove.id = 'enemy-move';
      boardContainer.insertBefore(enemyMove, buttonContainer);
    };

    userMove.textContent = isUser ? `Waiting for you...` : `Waiting for the enemy...`;
    enemyMove.textContent = isUser ? `Waiting for the enemy...` : `Waiting for you...`;

    if(gameData.user) {
      userMove.textContent = isUser ? `You chose ${gameData.user}` : `The enemy chose`;
    };
    if(gameData.enemy) {
      enemyMove.textContent = isUser ? `The enemy chose` : `You chose ${gameData.enemy}`;
    };

    if(gameData.winner) {
      userMove.textContent = isUser ? `You chose ${gameData.user}` : `The enemy chose ${gameData.user}`;
      enemyMove.textContent = isUser ? `The enemy chose ${gameData.enemy}` : `You chose ${gameData.enemy}`;
    };

    userMove.classList.remove('hidden');
    enemyMove.classList.remove('hidden');
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

function startMultiplayerGame() {
  document.getElementById('difficulty-container').classList.add('hidden');
  document.getElementById('token-container').classList.add('hidden');
  document.getElementById('invitation-container').classList.add('hidden');
  document.getElementById('board-container').classList.remove('hidden');
  document.getElementById('button-container').classList.remove('hidden');
  document.getElementById('go-home-button').classList.add('hidden');

  const boardContainer = document.getElementById('board-container');
  const buttonContainer = document.getElementById('button-container');
  let userMove = document.getElementById('user-move');
  let enemyMove = document.getElementById('enemy-move');
  if(!userMove) {
    userMove = document.createElement('h2');
    userMove.id = 'user-move';
    userMove.classList.add('hidden');
    boardContainer.insertBefore(userMove, buttonContainer);
  };

  if(!enemyMove) {
    enemyMove = document.createElement('h2');
    enemyMove.id = 'enemy-move';
    enemyMove.classList.add('hidden');
    boardContainer.insertBefore(enemyMove, buttonContainer);
  };

  userMove.textContent = privateToken === gameData.u ? `Waiting for you...`: `Waiting for the enemy...`;
  enemyMove.textContent = privateToken === gameData.e ? `Waiting for the enemy...`: `Waiting for you...`;

  userMove.classList.remove('hidden');
  enemyMove.classList.remove('hidden');

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

  initGame();
};

function handleModeChange() {
  fetchGame(false);
  const mode = document.getElementById('mode').value;
  document.getElementById('token-container').classList.add('hidden');

  if (mode === "0") {
    document.getElementById('multiplayer').classList.add('hidden');
  } else {
    document.getElementById('multiplayer').classList.remove('hidden');
  };
};

function clearToken() {
  fetchGame(false);
  document.getElementById('token-container').classList.add('hidden');
};

function initBoard() {
  const buttons = document.querySelectorAll('.game-button');
  buttons.forEach(button => {
    button.addEventListener('click', () => makeMove(button.value));
  });
  document.getElementById('start-game').addEventListener('click', startNewGame);
  document.getElementById('restart-game').addEventListener('click', restartGame);
  document.getElementById('mode').addEventListener('change', handleModeChange);
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

function addMediaQueryRule() {
  const styleSheet = document.styleSheets[1];
  const mediaQuery = '@media (max-height: 800px) { .container { justify-content: flex-start; } }';
  
  if (styleSheet.insertRule) {
    styleSheet.insertRule(mediaQuery, styleSheet.cssRules.length);
  }
};

function removeMediaQueryRule() {
  const styleSheet = document.styleSheets[1];
  const rules = styleSheet.cssRules || styleSheet.rules;
  
  for (let i = 0; i < rules.length; i++) {
    if (rules[i] instanceof CSSMediaRule && rules[i].conditionText === '(max-height: 800px)') {
      const mediaRules = rules[i].cssRules;
      for (let j = 0; j < mediaRules.length; j++) {
        if (mediaRules[j].selectorText === '.container' && mediaRules[j].style.justifyContent === 'flex-start') {
          rules[i].deleteRule(j);
          break;
        }
      }

      if (rules[i].cssRules.length === 0) {
        styleSheet.deleteRule(i);
      }
      break;
    }
  }
};

initBoard();
initGame();