const express = require('express');
const app = express();
const path = require("path");
const { link, port } = require('./config.json');
const { time } = require('console');
const e = require('express');
const { url } = require('inspector');

let tokens = [];
let multiplayer = {
    tictcatoe: [],
    rpsls: []
};

setInterval(cleanOldTokens, 20 * 60 * 1000);

setInterval(cleanOldGames, 24 * 60 * 60 * 1000);

app.use(express.static('public'))
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', './');

app.options('/api/tictactoe', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Max-Age', '86400');
    res.status(204).end();
});

function cleanOldTokens() {
    const currentTime = Date.now();
    const oneHourAgo = currentTime - (60 * 20 * 1000);

    tokens = tokens.filter(token => token.time > oneHourAgo);
};

function cleanOldGames() {
    const currentTime = Date.now();
    const oneDayAgo = currentTime - (24 * 60 * 60 * 1000);

    multiplayer.tictcatoe = multiplayer.tictcatoe.filter(game => game.time > oneDayAgo);
    multiplayer.rpsls = multiplayer.rpsls.filter(game => game.time > oneDayAgo);
};

function getRandomBase64Character() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return characters.charAt(Math.floor(Math.random() * characters.length));
};

let tokenCounter = 0;

function generateToken() {
    let timestamp = Buffer.from(Date.now().toString()).toString('base64');

    timestamp = timestamp.replace(/\+/g, getRandomBase64Character()).replace(/\//g, getRandomBase64Character());

    if(timestamp.endsWith('==')) {
        timestamp = timestamp.slice(0, -2) + getRandomBase64Character() + getRandomBase64Character();
    } else if(timestamp.endsWith("=")) {
        timestamp = timestamp.slice(0, -2) + getRandomBase64Character();
    };

    let counterBase64 = Buffer.from((tokenCounter++).toString()).toString('base64');

    counterBase64 = counterBase64.replace(/\+/g, getRandomBase64Character()).replace(/\//g, getRandomBase64Character());

    if(counterBase64.endsWith('==')) {
        counterBase64 = counterBase64.slice(0, -2) + getRandomBase64Character() + getRandomBase64Character();
    } else if(counterBase64.endsWith("=")) {
        counterBase64 = counterBase64.slice(0, -2) + getRandomBase64Character();
    };

    let bigToken = `${timestamp}${counterBase64}`;

    if (bigToken.length < 24) {
        while (bigToken.length < 24) {
            bigToken += getRandomBase64Character();
        };
    };

    let newCounterBase64 = Buffer.from((tokenCounter++).toString()).toString('base64');

    newCounterBase64 = newCounterBase64.replace(/\+/g, getRandomBase64Character()).replace(/\//g, getRandomBase64Character());

    if(newCounterBase64.endsWith('==')) {
        newCounterBase64 = newCounterBase64.slice(0, -2) + getRandomBase64Character() + getRandomBase64Character();
    } else if(newCounterBase64.endsWith("=")) {
        newCounterBase64 = newCounterBase64.slice(0, -2) + getRandomBase64Character();
    };

    let token
    if(newCounterBase64.length < 6) {
        token = newCounterBase64;
        while (token.length < 6) {
            token += getRandomBase64Character();
        };
    } else if(newCounterBase64.length > 6) {
        token = newCounterBase64.slice(0, 6);
    } else {
        token = newCounterBase64;
    };
    
    return { bigToken: bigToken, token: token };
};

function checkAllCellsFilled(board) {
    for (let cell in board) {
        if (board.hasOwnProperty(cell) && board[cell] === false) {
            return false;
        };
    };
    return true;
};

function checkWinner(board) {
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

    if (checkAllCellsFilled(board)) {
        return "Tie";
    };

    return false;
};

function minimax(board, depth, isMaximizing) {
    const scores = {
        X: -10,
        O: 10,
        Tie: 0
    };

    const winner = checkWinner(board);
    if (winner !== false) {
        return scores[winner];
    };

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (const cell in board) {
            if (board.hasOwnProperty(cell) && board[cell] === false) {
                board[cell] = "O";
                const score = minimax(board, depth + 1, false);
                board[cell] = false;
                bestScore = Math.max(bestScore, score);
            };
        };
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (const cell in board) {
            if (board.hasOwnProperty(cell) && board[cell] === false) {
                board[cell] = "X";
                const score = minimax(board, depth + 1, true);
                board[cell] = false;
                bestScore = Math.min(bestScore, score);
            };
        };
        return bestScore;
    };
};

function evaluateBoard(board) {
    const winPatterns = [
        ["c1", "c2", "c3"],
        ["c4", "c5", "c6"],
        ["c7", "c8", "c9"],
        ["c1", "c4", "c7"],
        ["c2", "c5", "c8"],
        ["c3", "c6", "c9"],
        ["c1", "c5", "c9"],
        ["c3", "c5", "c7"]
    ];

    let computerScore = false;
    let playerScore = false;
    let win = false;

    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if ((board[a] === "O" && board[b] === "O" && board[c] === false) || (board[a] === "O" && board[b] === false && board[c] === "O") || (board[a] === false && board[b] === "O" && board[c] === "O")) {
            computerScore = true;
        };

        if ((board[a] === "X" && board[b] === "X" && board[c] === false) || (board[a] === "X" && board[b] === false && board[c] === "X") || (board[a] === false && board[b] === "X" && board[c] === "X")) {
            playerScore = true;
        };
        
        if (board[a] === "O" && board[b] === "O" && board[c] === "O") {
            win = true;
        };
    };
    if(win) { return 4 } else if(computerScore && !playerScore) { return 3 } else if(!playerScore) { return 2 } else { return 0 };
};

function makeComputerMove(board, difficultyLevel) {
    let move;
    
    if (difficultyLevel === 2) {
        let bestScore = -Infinity;
        let bestMove;
        let bestMoves = [];

        for (const cell in board) {
            if (board.hasOwnProperty(cell) && board[cell] === false) {
                board[cell] = "O";
                const score = minimax(board, 0, false);
                board[cell] = false;
                
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = cell;
                    bestMoves.push({ cell, score });
                } else if (score === bestScore) {
                    bestMoves.push({ cell, score });
                };
            };
        };

        if (bestMoves.length > 0) {
            const moves = bestMoves.filter(m => m.score === bestScore);

            if (moves.length > 0) {
                const randomIndex = Math.floor(Math.random() * moves.length);
                const move2 = moves[randomIndex];
                bestMove = move2.cell;
            };
        };

        move = bestMove;
        board[bestMove] = "O";
    }

    if (difficultyLevel === 1) {
        let bestScore = -Infinity;
        let bestMove;
        let bestMoves = [];

        for (const cell in board) {
            if (board.hasOwnProperty(cell) && board[cell] === false) {
                board[cell] = "O";
                const score = evaluateBoard(board);
                board[cell] = false;

                if (score > bestScore) {
                    bestScore = score;
                    bestMove = cell;
                    bestMoves.push({ cell, score });
                } else if (score === bestScore) {
                    bestMoves.push({ cell, score });
                };
            };
        };

        if (bestMoves.length > 0) {
            const moves = bestMoves.filter(m => m.score === bestScore);
            if (moves.length > 0) {
                const randomIndex = Math.floor(Math.random() * moves.length);
                const move2 = moves[randomIndex];
                bestMove = move2.cell;
            };
        };

        move = bestMove;
        board[bestMove] = "O";
    };

    if (difficultyLevel === 0) {
        const emptyCells = [];

        for (const cell in board) {
            if (board.hasOwnProperty(cell) && board[cell] === false) {
                emptyCells.push(cell);
            };
        };

        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const randomCell = emptyCells[randomIndex];

        move = randomCell;
        board[randomCell] = "O";
    };

    return {newBoard: board, move: move};
};

function checkWinnerRPSLS(u, e) {
    if (u === e) return {
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

    if (winMap[u] && winMap[u][e]) {
        return {
            winner: "Win",
            message: winMap[u][e]
        };
    } else {
        return {
            winner: "Lose",
            message: winMap[e][u]
        };
    }
}

app.get('/', async (req, res) => {
    res.render('index.ejs');
});

app.get('/tictactoe', async (req, res) => {
    res.render('tictactoe.ejs', {link});
});

app.get('/rpsls', async (req, res) => {
    res.render('rpsls.ejs', {link});
});

app.post('/api/tictactoe', async (req, res) => {
    const { difficulty, board } = req.body;

    if (typeof difficulty !== 'number' || difficulty < 0 || difficulty > 2) {
        return res.status(400).json({
            success: false,
            error: 'The difficulty must be a number between 0 and 2.'
        });
    };

    if (typeof board !== 'object' || board === null || Array.isArray(board)) {
        return res.status(400).json({
            success: false,
            error: 'The board must be an object with properties c1 through c9.'
        });
    };

    const expectedKeys = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9'];
    const boardKeys = Object.keys(board);

    if (boardKeys.length !== expectedKeys.length || !expectedKeys.every(key => boardKeys.includes(key))) {
        return res.status(400).json({
            success: false,
            error: 'The board must have exactly the keys: c1 through c9.'
        });
    };

    const validValues = [false, 'X', 'O'];
    const invalidEntries = Object.entries(board).filter(([key, value]) => !validValues.includes(value));

    if (invalidEntries.length > 0) {
        const invalidValues = invalidEntries.map(([key, value]) => ({ key, value }));
        return res.status(400).json({
            success: false,
            error: 'The board can only contain the values: false, "X", "O".',
            invalidValues: invalidValues
        });
    };


    if(checkWinner(board) === 'X') {
        return res.status(200).json({
            success: true,
            difficulty: difficulty,
            board: board,
            winner: 'X'
        });
    };

    const {newBoard, move} = makeComputerMove(board, difficulty);

    return res.status(200).json({
        success: true,
        difficulty: difficulty,
        board: newBoard,
        move: move,
        winner: checkWinner(newBoard)
    });
});

app.post('/api/generatetoken', async (req, res) => {
    const { bigToken, token } = generateToken();

    const tokenData = {
        time: Date.now(),
        publicToken: token,
        privateToken: bigToken
    }

    if('tictactoe' in req.query) {
        tokenData.type = 'tictactoe';
    } else if('rpsls' in req.query) {
        tokenData.type = 'rpsls';
    } else {
        return res.status(400).json({
            success: false,
            error: 'Invalid or missing query string. Please provide a valid query string.'
        });
    };

    tokens.push(tokenData);

    res.status(200).json({
        publicToken: token,
        privateToken: bigToken
    });
});

app.post('/api/verifycode', async (req, res) => {
    const { code, privateToken } = req.body;
    
    const user = tokens.find(obj => obj.publicToken === code);
    const enemy = tokens.find(obj => obj.privateToken === privateToken);

    if (user.type !== enemy.type) {
        return res.status(400).json({
            success: false,
            errorCode: 6,
            error: "The user you are trying to play with is playing a different game."
        });
    }

    if (user && enemy) {
        const isUserInGame = multiplayer.tictcatoe.find(obj => obj.x === user.privateToken || obj.o === user.privateToken);
        const isEnemyInGame = multiplayer.tictcatoe.find(obj => obj.x === enemy.privateToken || obj.o === enemy.privateToken);
        
        if(isUserInGame) {
            return res.status(400).json({
                success: false,
                errorCode: 4,
                error: "The user you are trying to play with is already in another game."
            });
        };

        if(isEnemyInGame) {
            return res.status(400).json({
                success: false,
                errorCode: 5,
                error: "You are already in a game."
            });
        };

        if(user !== enemy) {
            if(user.type === 'tictactoe') {
                multiplayer.tictcatoe.push({
                    time: Date.now(),
                    x: user.privateToken,
                    o: enemy.privateToken,
                    board: {
                        c1: false, c2: false, c3: false,
                        c4: false, c5: false, c6: false,
                        c7: false, c8: false, c9: false
                    },
                    move: false,
                    currentPlayer: 'X',
                    winner: false
                });

                res.status(200).json({
                    success: true,
                    url: `${link}/api/tictactoe/multiplayer/${user.privateToken}`
                });
            } else {
                multiplayer.rpsls.push({
                    time: Date.now(),
                    u: user.privateToken,
                    e: enemy.privateToken,
                    user: false,
                    enemy: false,
                    winner: false,
                    message: false
                });

                res.status(200).json({
                    success: true,
                    url: `${link}/api/rpsls/multiplayer/${user.privateToken}`
                });
            };
        } else {
            return res.status(400).json({
                success: false,
                errorCode: 3,
                error: "You can't play against yourself."
            });
        };
    } else {
        if(!enemy) {
            return res.status(400).json({
                success: false,
                errorCode: 1,
                error: 'Your private token has expired. Please regenerate it and try again.'
            });
        };

        if(!user) {
            return res.status(400).json({
                success: false,
                errorCode: 2,
                error: 'Invalid or expired invitation code. Please check the code and try again.'
            });
        };
    };
});

app.post('/api/tictactoe/multiplayer/:param', async (req, res) => {
    const userPrivateToken = req.params.param;
    const game = multiplayer.tictcatoe.find(obj => obj.x === userPrivateToken);

    if(game) {
        const { time, x, o, board, move, currentPlayer, winner } = req.body;

        if(winner) {
            return res.status(200).json(req.body);
        };

        if(game.winner) {
            return res.status(200).json(game);
        };

        let newCurrentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        
        game.board = board;
        game.move = move;
        game.currentPlayer = newCurrentPlayer;
        game.winner = checkWinner(board);

        return res.status(200).json({
            time: time,
            x: x,
            o: o,
            board: board,
            move: move,
            currentPlayer: newCurrentPlayer,
            winner: checkWinner(board)
        });
    } else {
        return res.status(400).json({
            success: false,
            error: 'The game does not exist.'
        });
    };
});

app.get('/api/tictactoe/multiplayer/:param', async (req, res) => {
    const userPrivateToken = req.params.param;
    const game = multiplayer.tictcatoe.find(obj => obj.x === userPrivateToken);

    if(game) {
        res.status(200).json(game);
    } else {
        return res.status(400).json({
            success: false,
            error: 'The game does not exist.'
        });
    };
});

app.post('/api/rpsls', async (req, res) => {
    const { user, computer, winner } = req.body;

    const validChoices = ['rock', 'paper', 'scissors', 'lizard', 'spock'];

    if (winner) {
        return res.status(200).json(req.body);
    };

    if (!user) {
        return res.status(400).json({
            success: false,
            error: 'The user must be a string and must be one of the following: rock, paper, scissors, lizard, spock.'
        });
    };

    if (!validChoices.includes(user.toLowerCase())) {
        return res.status(400).json({
            success: false,
            error: 'The user must be a string and must be one of the following: rock, paper, scissors, lizard, spock.'
        });
    }

    if(computer) {
        if (validChoices.includes(computer.toLowerCase())) {
            const { winner, message } = checkWinnerRPSLS(user.toLowerCase(), computer.toLowerCase());

            return res.status(200).json({
                success: true,
                user: user.toLowerCase(),
                enemy: computer.toLowerCase(),
                winner: winner,
                message: message
            });
        };
    };

    const randomChoice = validChoices[Math.floor(Math.random() * validChoices.length)];
    const { winner: newWinner, message } = checkWinnerRPSLS(user.toLowerCase(), randomChoice);

    res.status(200).json({
        success: true,
        user: user.toLowerCase(),
        enemy: randomChoice,
        winner: newWinner,
        message: message
    });
});

app.post('/api/rpsls/multiplayer/:param', async (req, res) => {
    const userPrivateToken = req.params.param;
    const game = multiplayer.rpsls.find(obj => obj.u === userPrivateToken);

    if(game) {
        const { time, u, e, user, enemy, winner, message } = req.body;
        const validChoices = ['rock', 'paper', 'scissors', 'lizard', 'spock'];

        if(winner) {
            return res.status(200).json(req.body);
        };

        if(game.winner) {
            return res.status(200).json(game);
        };

        if (user) {
            if (!validChoices.includes(user.toLowerCase())) {
                return res.status(400).json({
                    success: false,
                    error: 'The user must be a string and must be one of the following: rock, paper, scissors, lizard, spock.'
                });
            } else {
                game.user = user.toLowerCase();
            };
        };
        
        if (enemy) {
            if(!validChoices.includes(enemy.toLowerCase())) {
                return res.status(400).json({
                    success: false,
                    error: 'The enemy must be a string and must be one of the following: rock, paper, scissors, lizard, spock.'
                });
            } else {
                game.enemy = enemy.toLowerCase();
            };
        };

        if(user && enemy) {
            const { winner: newWinner, message: newMessage } = checkWinnerRPSLS(user.toLowerCase(), enemy.toLowerCase());
            game.winner = newWinner;
            game.message = newMessage;
            return res.status(200).json({
                time: time,
                u: u,
                e: e,
                user: game.user,
                enemy: game.enemy,
                winner: newWinner,
                message: newMessage
            });
        };

        return res.status(200).json({
            time: time,
            u: u,
            e: e,
            user: game.user,
            enemy: game.enemy,
            winner: false,
            message: false
        });
    } else {
        return res.status(400).json({
            success: false,
            error: 'The game does not exist.'
        });
    };
});

app.get('/api/rpsls/multiplayer/:param', async (req, res) => {
    const userPrivateToken = req.params.param;
    const game = multiplayer.rpsls.find(obj => obj.u === userPrivateToken);

    if(game) {
        res.status(200).json(game);
    } else {
        return res.status(400).json({
            success: false,
            error: 'The game does not exist.'
        });
    };
});

app.all('*', (req, res) => {
    res.redirect('/');
});

app.use((err, req, res, next) => {
    console.error(err);
    res.redirect('/');
});

app.listen(port, () => console.log(link));