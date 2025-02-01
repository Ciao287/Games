const express = require('express');
const app = express();
const path = require("path");
const { link, port } = require('./config.json');
const { time } = require('console');
const e = require('express');
const { url } = require('inspector');
const { subscribe } = require('diagnostics_channel');

let tokens = [];
let multiplayer = {
    tictcatoe: [],
    rpsls: [],
    battleship: []
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
};

function checkWinnerBattleship(u, e) {
    if(e.ships.carrier.destroyed && e.ships.battleship.destroyed && e.ships.destroyer.destroyed && e.ships.submarine.destroyed && e.ships.patrolBoat.destroyed) {
        return 'Win';
    } else if(u.ships.carrier.destroyed && u.ships.battleship.destroyed && u.ships.destroyer.destroyed && u.ships.submarine.destroyed && u.ships.patrolBoat.destroyed) {
        return 'Lose';
    } else {
        return false;
    };
};

function validateShips(ships) {
    const positions = new Set();
  
    function getRow(cell) {
        return Math.floor((parseInt(cell.slice(1)) - 1) / 10);
    }
  
    function getColumn(cell) {
        return (parseInt(cell.slice(1)) - 1) % 10;
    }
  
    for (const shipType in ships) {
        if (ships.hasOwnProperty(shipType) && shipType !== 'isSet') {
            const ship = ships[shipType];
            const shipPositions = [];
    
            for (const part in ship) {
                if (ship.hasOwnProperty(part) && part.startsWith('n')) {
                    const cell = ship[part].cell;
                    if (!cell) {
                    return false;
                    }
                    shipPositions.push(cell);
                    if (positions.has(cell)) {
                    return false;
                    }
                    positions.add(cell);
                }
            }

            const rows = new Set(shipPositions.map(getRow));
            const cols = new Set(shipPositions.map(getColumn));
    
            if (rows.size !== 1 && cols.size !== 1) {
                return false;
            }

            if (rows.size === 1) {
            const sortedCols = shipPositions.map(getColumn).sort((a, b) => a - b);
            for (let i = 1; i < sortedCols.length; i++) {
                if (sortedCols[i] !== sortedCols[i - 1] + 1) {
                    return false;
                }
            }
            } else if (cols.size === 1) {
            const sortedRows = shipPositions.map(getRow).sort((a, b) => a - b);
            for (let i = 1; i < sortedRows.length; i++) {
                if (sortedRows[i] !== sortedRows[i - 1] + 1) {
                    return false;
                }
            }
            }
        }
    }
  
    return true;
};

function placeComputerShips() {
    const ships = {
        carrier: { size: 5, positions: [] },
        battleship: { size: 4, positions: [] },
        destroyer: { size: 3, positions: [] },
        submarine: { size: 3, positions: [] },
        patrolBoat: { size: 2, positions: [] }
    };

    let usedCells = [];

    function canPlaceShip(ship, startPos, direction) {
        const { size } = ship;
        const positions = [];

        for (let i = 0; i < size; i++) {
        const row = direction === 'horizontal' ? startPos.row : startPos.row + i;
        const col = direction === 'horizontal' ? startPos.col + i : startPos.col;

        if (row >= 10 || col >= 10 || usedCells.includes(`c${row * 10 + col + 1}`)) {
            return false;
        }

        positions.push(`c${row * 10 + col + 1}`);
        }
    
        return positions;
    }

    function placeShip(ship) {
        let placed = false;
        let attempts = 0;

        while (!placed && attempts < 10) {
        const direction = Math.random() < 0.5 ? 'horizontal' : 'vertical';
        const maxRow = direction === 'horizontal' ? 9 : 10 - ship.size;
        const maxCol = direction === 'horizontal' ? 10 - ship.size : 9;
        const startPos = {
            row: Math.floor(Math.random() * (maxRow + 1)),
            col: Math.floor(Math.random() * (maxCol + 1))
        };
        const positions = canPlaceShip(ship, startPos, direction);

        if (positions) {
            positions.forEach(pos => {
            usedCells.push(pos);
            });
            ship.positions = positions;
            placed = true;
        } else {
            attempts++;
        }
        }
    
        return placed;
    };

    let allShipsPlaced = false;
    while (!allShipsPlaced) {
        usedCells = [];
        allShipsPlaced = Object.values(ships).every(ship => placeShip(ship));
    };

    return ships;
};

function makeComputerShot(user/*, difficultyLevel*/) {
    let move;
    let { board, ships } = user;
    // if(difficultyLevel === 0) {
        const availableCells = Object.keys(board).filter(cell => board[cell] !== true);

        const randomIndex = Math.floor(Math.random() * availableCells.length);
        move = availableCells[randomIndex];
        board[move] = true;
    // }

    return { newBoard: board, move }
};

app.get('/', async (req, res) => {
    res.render('index.ejs');
});

app.get('/tictactoe', async (req, res) => {
    res.render('tictactoe.ejs', {link});
});

app.get('/rpsls', async (req, res) => {
    res.render('rpsls.ejs', {link});
});

app.get('/battleship', async (req, res) => {
    res.render('battleship.ejs', {link});
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
    } else if('battleship' in req.query) {
        tokenData.type = 'battleship';
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

    if (user && enemy) {
        if (user.type !== enemy.type) {
            return res.status(400).json({
                success: false,
                errorCode: 6,
                error: "The user you are trying to play with is playing a different game."
            });
        };
        
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
            } else if(user.type === 'rpsls') {
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
            } else {
                multiplayer.battleship.push({
                    time: Date.now(),
                    u: user.privateToken,
                    e: enemy.privateToken,
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
                    lastShot: false,
                    hit: false,
                    winner: false
                });

                res.status(200).json({
                    success: true,
                    url: `${link}/api/battleship/multiplayer/${user.privateToken}`
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
        const { time, u, e, user, enemy, winner } = req.body;
        const validChoices = ['rock', 'paper', 'scissors', 'lizard', 'spock'];

        if(winner) {
            return res.status(200).json(req.body);
        };

        if(game.winner) {
            return res.status(200).json(game);
        };

        let updated = false;

        if (user) {
            if (!validChoices.includes(user.toLowerCase())) {
                return res.status(400).json({
                    success: false,
                    error: 'The user must be a string and must be one of the following: rock, paper, scissors, lizard, spock.'
                });
            } else {
                game.user = user.toLowerCase();
                updated = true;
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
                updated = true;
            };
        };

        if(updated) {
            const newGame = multiplayer.rpsls.find(obj => obj.u === userPrivateToken);
            if(newGame.user && newGame.enemy) {
                const { winner: newWinner, message: newMessage } = checkWinnerRPSLS(newGame.user.toLowerCase(), newGame.enemy.toLowerCase());
                newGame.winner = newWinner;
                newGame.message = newMessage;
                return res.status(200).json({
                    time: time,
                    u: u,
                    e: e,
                    user: newGame.user,
                    enemy: newGame.enemy,
                    winner: newWinner,
                    message: newMessage
                });
            };

            return res.status(200).json({
                time: time,
                u: u,
                e: e,
                user: newGame.user,
                enemy: newGame.enemy,
                winner: false,
                message: false
            });
        } else {
            return res.status(200).json({
                time: time,
                u: u,
                e: e,
                user: game.user,
                enemy: game.enemy,
                winner: false,
                message: false
            });
        }
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

app.post('/api/battleship', async (req, res) => {
    if ('generateShips' in req.query) {
        const ships = placeComputerShips();

        return res.status(200).json({
            success: true,
            ships: {
                isSet: true,
                carrier: {
                    destroyed: false,
                    n1: { cell: ships.carrier.positions[0], destroyed: false },
                    n2: { cell: ships.carrier.positions[1], destroyed: false },
                    n3: { cell: ships.carrier.positions[2], destroyed: false },
                    n4: { cell: ships.carrier.positions[3], destroyed: false },
                    n5: { cell: ships.carrier.positions[4], destroyed: false }
                },
                battleship: {
                    destroyed: false,
                    n1: { cell: ships.battleship.positions[0], destroyed: false },
                    n2: { cell: ships.battleship.positions[1], destroyed: false },
                    n3: { cell: ships.battleship.positions[2], destroyed: false },
                    n4: { cell: ships.battleship.positions[3], destroyed: false }
                },
                destroyer: {
                    destroyed: false,
                    n1: { cell: ships.destroyer.positions[0], destroyed: false },
                    n2: { cell: ships.destroyer.positions[1], destroyed: false },
                    n3: { cell: ships.destroyer.positions[2], destroyed: false }
                },
                submarine: {
                    destroyed: false,
                    n1: { cell: ships.submarine.positions[0], destroyed: false },
                    n2: { cell: ships.submarine.positions[1], destroyed: false },
                    n3: { cell: ships.submarine.positions[2], destroyed: false }
                },
                patrolBoat: {
                    destroyed: false,
                    n1: { cell: ships.patrolBoat.positions[0], destroyed: false },
                    n2: { cell: ships.patrolBoat.positions[1], destroyed: false }
                }
            }
        });
    } else if ('validateShips' in req.query) {
        const { ships } = req.body;
        const isValid = validateShips(ships);

        return res.status(200).json({
            success: true,
            isValid: isValid
        });
    };

    let { difficulty, currentPlayer, user, enemy, lastShot, hit, winner } = req.body;

    if (winner) {
        return res.status(200).json(req.body);
    };

    if(currentPlayer !== 'e') {
        return res.status(400).json({
            success: false,
            error: 'It is not my turn.'
        });
    }

    // if (typeof difficulty !== 'number' || difficulty < 0 || difficulty > 1) {
    //     return res.status(400).json({
    //         success: false,
    //         error: 'The difficulty must be a number between 0 and 2.'
    //     });
    // };

    if (typeof user.board !== 'object' || user.board === null || Array.isArray(user.board)) {
        return res.status(400).json({
            success: false,
            error: 'The board must be an object with properties c1 through c100.'
        });
    };

    const expectedKeys = [
        'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'c10',
        'c11', 'c12', 'c13', 'c14', 'c15', 'c16', 'c17', 'c18', 'c19', 'c20',
        'c21', 'c22', 'c23', 'c24', 'c25', 'c26', 'c27', 'c28', 'c29', 'c30',
        'c31', 'c32', 'c33', 'c34', 'c35', 'c36', 'c37', 'c38', 'c39', 'c40',
        'c41', 'c42', 'c43', 'c44', 'c45', 'c46', 'c47', 'c48', 'c49', 'c50',
        'c51', 'c52', 'c53', 'c54', 'c55', 'c56', 'c57', 'c58', 'c59', 'c60',
        'c61', 'c62', 'c63', 'c64', 'c65', 'c66', 'c67', 'c68', 'c69', 'c70',
        'c71', 'c72', 'c73', 'c74', 'c75', 'c76', 'c77', 'c78', 'c79', 'c80',
        'c81', 'c82', 'c83', 'c84', 'c85', 'c86', 'c87', 'c88', 'c89', 'c90',
        'c91', 'c92', 'c93', 'c94', 'c95', 'c96', 'c97', 'c98', 'c99', 'c100'
    ];

    if (lastShot.startsWith('e')) {
        lastShot = lastShot.slice(1);
    };

    if (!expectedKeys.includes(lastShot.toLowerCase())) {
        return res.status(400).json({
            success: false,
            error: 'The lastShot must be a string and must be one of the following: c1 through c100.'
        });
    };

    const boardKeys = Object.keys(user.board);

    if (boardKeys.length !== expectedKeys.length || !expectedKeys.every(key => boardKeys.includes(key))) {
        return res.status(400).json({
            success: false,
            error: 'The board must have exactly the keys: c1 through c100.'
        });
    };

    const validValues = [false, true];
    const invalidEntries = Object.entries(user.board).filter(([key, value]) => !validValues.includes(value));

    if (invalidEntries.length > 0) {
        const invalidValues = invalidEntries.map(([key, value]) => ({ key, value }));
        return res.status(400).json({
            success: false,
            error: 'The board can only contain the values: false and true.',
            invalidValues: invalidValues
        });
    };

    const shot = enemy.board[lastShot];
    if (!shot) {
        enemy.board[lastShot] = true;
        hit = false;
        const userShips = enemy.ships;
        for (const shipType in userShips) {
            if (userShips.hasOwnProperty(shipType)) {
                const ship = userShips[shipType];
                for (const part in ship) {
                    if (ship.hasOwnProperty(part) && part.startsWith('n')) {
                        if (ship[part].cell === lastShot) {
                            ship[part].destroyed = true;
                            hit = true;
                        };
                    };
                };
            };
        };
        user.shotsFired.push(lastShot);
    } else {
        return res.status(200).json({
            success: false,
            error: 'You have already hit this cell!'
        });
    };

    if (!enemy.ships.carrier.destroyed) {
        if (enemy.ships.carrier.n1.destroyed && enemy.ships.carrier.n2.destroyed && enemy.ships.carrier.n3.destroyed && enemy.ships.carrier.n4.destroyed && enemy.ships.carrier.n5.destroyed) {
            enemy.ships.carrier.destroyed = true;
        };
    };

    if (!enemy.ships.battleship.destroyed) {
        if (enemy.ships.battleship.n1.destroyed && enemy.ships.battleship.n2.destroyed && enemy.ships.battleship.n3.destroyed && enemy.ships.battleship.n4.destroyed) {
            enemy.ships.battleship.destroyed = true;
        };
    };

    if (!enemy.ships.destroyer.destroyed) {
        if (enemy.ships.destroyer.n1.destroyed && enemy.ships.destroyer.n2.destroyed && enemy.ships.destroyer.n3.destroyed) {
            enemy.ships.destroyer.destroyed = true;
        };
    };

    if (!enemy.ships.submarine.destroyed) {
        if (enemy.ships.submarine.n1.destroyed && enemy.ships.submarine.n2.destroyed && enemy.ships.submarine.n3.destroyed) {
            enemy.ships.submarine.destroyed = true;
        };
    };

    if (!enemy.ships.patrolBoat.destroyed) {
        if (enemy.ships.patrolBoat.n1.destroyed && enemy.ships.patrolBoat.n2.destroyed) {
            enemy.ships.patrolBoat.destroyed = true;
        };
    };

    if(checkWinnerBattleship(user, enemy) === 'Win') {
        return res.status(200).json({
            success: true,
            difficulty: difficulty,
            currentPlayer: currentPlayer,
            user: user,
            enemy: enemy,
            lastShot: lastShot,
            hit: hit,
            winner: 'Win'
        });
    };

    const { newBoard, move } = makeComputerShot(user, difficulty);

    if (!user.ships.carrier.destroyed) {
        if (user.ships.carrier.n1.destroyed && user.ships.carrier.n2.destroyed && user.ships.carrier.n3.destroyed && user.ships.carrier.n4.destroyed && user.ships.carrier.n5.destroyed) {
            user.ships.carrier.destroyed = true;
        };
    };

    if (!user.ships.battleship.destroyed) {
        if (user.ships.battleship.n1.destroyed && user.ships.battleship.n2.destroyed && user.ships.battleship.n3.destroyed && user.ships.battleship.n4.destroyed) {
            user.ships.battleship.destroyed = true;
        };
    };

    if (!user.ships.destroyer.destroyed) {
        if (user.ships.destroyer.n1.destroyed && user.ships.destroyer.n2.destroyed && user.ships.destroyer.n3.destroyed) {
            user.ships.destroyer.destroyed = true;
        };
    };

    if (!user.ships.submarine.destroyed) {
        if (user.ships.submarine.n1.destroyed && user.ships.submarine.n2.destroyed && user.ships.submarine.n3.destroyed) {
            user.ships.submarine.destroyed = true;
        };
    };

    if (!user.ships.patrolBoat.destroyed) {
        if (user.ships.patrolBoat.n1.destroyed && user.ships.patrolBoat.n2.destroyed) {
            user.ships.patrolBoat.destroyed = true;
        };
    };

    currentPlayer = 'u';

    user.board = newBoard;
    hit = false;
    const enemyShips = user.ships;
    for (const shipType in enemyShips) {
        if (enemyShips.hasOwnProperty(shipType)) {
            const ship = enemyShips[shipType];
            for (const part in ship) {
                if (ship.hasOwnProperty(part) && part.startsWith('n')) {
                    if (ship[part].cell === move) {
                        ship[part].destroyed = true;
                        hit = true;
                    };
                };
            };
        };
    };
    enemy.shotsFired.push(move);

    return res.status(200).json({
        success: true,
        currentPlayer: currentPlayer,
        user: user,
        enemy: enemy,
        lastShot: lastShot,
        hit: hit,
        winner: checkWinnerBattleship(user, enemy)
    });
});

app.post('/api/battleship/multiplayer/:param', async (req, res) => {
    const userPrivateToken = req.params.param;
    const game = multiplayer.battleship.find(obj => obj.u === userPrivateToken);

    if(game) {
        const { time, u, e, currentPlayer, user, enemy, lastShot, winner } = req.body;

        if(game.currentPlayer !== currentPlayer) {
            return res.status(400).json({
                success: false,
                error: 'It is not your turn.'
            });
        };

        if(!game.user.ships.isSet) {
            if(user.ships.isSet) {
                const isValid = validateShips(user.ships);
                if(isValid) {
                    game.user.ships = user.ships;
                    game.user.ships.isSet = true;
                    return res.status(200).json(game);
                } else {
                    return res.status(400).json({
                        success: false,
                        error: 'The user ships are not set correctly.'
                    });
                };
            };
        };

        if(!game.enemy.ships.isSet) {
            if(enemy.ships.isSet) {
                const isValid = validateShips(enemy.ships);
                if(isValid) {
                    game.enemy.ships = enemy.ships;
                    game.enemy.ships.isSet = true;
                    return res.status(200).json(game);
                } else {
                    return res.status(400).json({
                        success: false,
                        error: 'The enemy ships are not set correctly.'
                    });
                };
            };
        };

        if(!game.user.ships.isSet || !game.enemy.ships.isSet) {
            let errorMessage;
            if(!game.user.ships.isSet && game.enemy.ships.isSet) {
                errorMessage = 'The user must set his ships before you can play the game.'
            } else if(game.user.ships.isSet && !game.enemy.ships.isSet) {
                errorMessage = 'The enemy must set his ships before you can play the game.'
            } else {
                errorMessage = 'Both players must set their ships before you can play the game.'
            }

            return res.status(400).json({
                success: false,
                error: errorMessage
            });
        }

        const validChoices = [
            'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'c10',
            'c11', 'c12', 'c13', 'c14', 'c15', 'c16', 'c17', 'c18', 'c19', 'c20',
            'c21', 'c22', 'c23', 'c24', 'c25', 'c26', 'c27', 'c28', 'c29', 'c30',
            'c31', 'c32', 'c33', 'c34', 'c35', 'c36', 'c37', 'c38', 'c39', 'c40',
            'c41', 'c42', 'c43', 'c44', 'c45', 'c46', 'c47', 'c48', 'c49', 'c50',
            'c51', 'c52', 'c53', 'c54', 'c55', 'c56', 'c57', 'c58', 'c59', 'c60',
            'c61', 'c62', 'c63', 'c64', 'c65', 'c66', 'c67', 'c68', 'c69', 'c70',
            'c71', 'c72', 'c73', 'c74', 'c75', 'c76', 'c77', 'c78', 'c79', 'c80',
            'c81', 'c82', 'c83', 'c84', 'c85', 'c86', 'c87', 'c88', 'c89', 'c90',
            'c91', 'c92', 'c93', 'c94', 'c95', 'c96', 'c97', 'c98', 'c99', 'c100'
        ];

        if(winner) {
            return res.status(200).json(req.body);
        };

        if(game.winner) {
            return res.status(200).json(game);
        };

        if (!validChoices.includes(lastShot.toLowerCase())) {
            return res.status(400).json({
                success: false,
                error: 'The lastShot must be a string and must be one of the following: c1 through c100.'
            });
        };

        if(currentPlayer === 'u') {
            const shot = game.enemy.board[lastShot];
            if(!shot) {
                game.enemy.board[lastShot] = true;
                game.hit = false;
                const ships = game.enemy.ships;
                for (const shipType in ships) {
                    if (ships.hasOwnProperty(shipType)) {
                        const ship = ships[shipType];
                        for (const part in ship) {
                            if (ship.hasOwnProperty(part) && part.startsWith('n')) {
                                if (ship[part].cell === lastShot) {
                                    ship[part].destroyed = true;
                                    game.hit = true;
                                };
                            };
                        };
                    };
                };
                game.user.shotsFired.push(lastShot);
            } else {
                return res.status(200).json({
                    success: false,
                    error: 'You have already hit this cell!'
                });
            };
        } else {
            const shot = game.user.board[lastShot];
            if(!shot) {
                game.user.board[lastShot] = true;
                game.hit = false;
                const ships = game.user.ships;
                for (const shipType in ships) {
                    if (ships.hasOwnProperty(shipType)) {
                        const ship = ships[shipType];
                        for (const part in ship) {
                            if (ship.hasOwnProperty(part) && part.startsWith('n')) {
                                if (ship[part].cell === lastShot) {
                                    ship[part].destroyed = true;
                                    game.hit = true;
                                };
                            };
                        };
                    };
                };
                game.enemy.shotsFired.push(lastShot);
            } else {
                return res.status(400).json({
                    success: false,
                    error: 'You have already hit this cell!'
                });
            };
        };

        if(!game.user.ships.carrier.destroyed) {
            if(game.user.ships.carrier.n1.destroyed && game.user.ships.carrier.n2.destroyed && game.user.ships.carrier.n3.destroyed && game.user.ships.carrier.n4.destroyed && game.user.ships.carrier.n5.destroyed) {
                game.user.ships.carrier.destroyed = true;
            };
        };

        if(!game.user.ships.battleship.destroyed) {
            if(game.user.ships.battleship.n1.destroyed && game.user.ships.battleship.n2.destroyed && game.user.ships.battleship.n3.destroyed && game.user.ships.battleship.n4.destroyed) {
                game.user.ships.battleship.destroyed = true;
            };
        };

        if(!game.user.ships.destroyer.destroyed) {
            if(game.user.ships.destroyer.n1.destroyed && game.user.ships.destroyer.n2.destroyed && game.user.ships.destroyer.n3.destroyed) {
                game.user.ships.destroyer.destroyed = true;
            };
        };

        if(!game.user.ships.submarine.destroyed) {
            if(game.user.ships.submarine.n1.destroyed && game.user.ships.submarine.n2.destroyed && game.user.ships.submarine.n3.destroyed) {
                game.user.ships.submarine.destroyed = true;
            };
        };

        if(!game.user.ships.patrolBoat.destroyed) {
            if(game.user.ships.patrolBoat.n1.destroyed && game.user.ships.patrolBoat.n2.destroyed) {
                game.user.ships.patrolBoat.destroyed = true;
            };
        };

        if(!game.enemy.ships.carrier.destroyed) {
            if(game.enemy.ships.carrier.n1.destroyed && game.enemy.ships.carrier.n2.destroyed && game.enemy.ships.carrier.n3.destroyed && game.enemy.ships.carrier.n4.destroyed && game.enemy.ships.carrier.n5.destroyed) {
                game.enemy.ships.carrier.destroyed = true;
            };
        };

        if(!game.enemy.ships.battleship.destroyed) {
            if(game.enemy.ships.battleship.n1.destroyed && game.enemy.ships.battleship.n2.destroyed && game.enemy.ships.battleship.n3.destroyed && game.enemy.ships.battleship.n4.destroyed) {
                game.enemy.ships.battleship.destroyed = true;
            };
        };

        if(!game.enemy.ships.destroyer.destroyed) {
            if(game.enemy.ships.destroyer.n1.destroyed && game.enemy.ships.destroyer.n2.destroyed && game.enemy.ships.destroyer.n3.destroyed) {
                game.enemy.ships.destroyer.destroyed = true;
            };
        };

        if(!game.enemy.ships.submarine.destroyed) {
            if(game.enemy.ships.submarine.n1.destroyed && game.enemy.ships.submarine.n2.destroyed && game.enemy.ships.submarine.n3.destroyed) {
                game.enemy.ships.submarine.destroyed = true;
            };
        };

        if(!game.enemy.ships.patrolBoat.destroyed) {
            if(game.enemy.ships.patrolBoat.n1.destroyed && game.enemy.ships.patrolBoat.n2.destroyed) {
                game.enemy.ships.patrolBoat.destroyed = true;
            };
        };

        let newCurrentPlayer = currentPlayer === 'u' ? 'e' : 'u';
        
        game.lastShot = lastShot;
        game.currentPlayer = newCurrentPlayer;
        game.winner = checkWinnerBattleship(game.user, game.enemy);

        return res.status(200).json({
            time: time,
            u: u,
            e: e,
            currentPlayer: newCurrentPlayer,
            user: game.user,
            enemy: game.enemy,
            lastShot: game.lastShot,
            hit: game.hit,
            winner: game.winner
        });
    } else {
        return res.status(400).json({
            success: false,
            error: 'The game does not exist.'
        });
    };
});

app.get('/api/battleship/multiplayer/:param', async (req, res) => {
    const userPrivateToken = req.params.param;
    const game = multiplayer.battleship.find(obj => obj.u === userPrivateToken);

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