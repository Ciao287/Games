# Games (Tic Tac Toe and Rock Paper Scissors Lizard Spock)

Demo: [https://games.is-a.dev](https://games.is-a.dev)

I have always liked these games ever since I first discovered them, especially Rock Paper Scissors Lizard Spock. Every time I play them, they bring me happiness. I hope they can bring it to you too!

Games is a project made for High Seas - Hack Club, it allows you to play:
- Tic Tac Toe in single player against the bot, with 3 modes (Easy, Medium and Hard) and in multiplayer, with 2 modes (Classic => you play with 2 devices, Pass and Play => you play from the same device).
- Rock Paper Scissors Lizard Spock in single player against the bot and in multiplayer, with 2 modes (Classic => you play with 2 devices, Pass and Play => you play from the same device).
- Battleship in single player against the bot and in multiplayer (Classic => you play with 2 devices).

The games are designed to be used everywhere, on websites, in apps, and even in Discord bots, thanks to its API.

The [demo site](https://games.is-a.dev) was created to give you an idea of ​​what can be done with this api, you can easily customize it by modifying the [index.ejs](https://github.com/Ciao287/Games/blob/main/index.ejs), [tictactoe.ejs](https://github.com/Ciao287/Games/blob/main/tictactoe.ejs), [rpsls.ejs](https://github.com/Ciao287/Games/blob/main/rpsls.ejs) and [battleship.ejs](https://github.com/Ciao287/Games/blob/main/battleship.ejs) files, all the files in the [public](https://github.com/Ciao287/Games/tree/main/public) folder and, in case you want to add new links, [index.js](https://github.com/Ciao287/Games/blob/main/index.js).

## How to Install

1) If you don't have them already, install [Node.js](https://nodejs.org/en/download/package-manager/current) and [Git](https://git-scm.com/downloads);
2) Open terminal in the folder where you want to install Games and run `git clone https://github.com/Ciao287/Games`;
3) Open the [config.json](https://github.com/Ciao287/Games/blob/main/config.json) file, change the `link` value, inserting the complete link that the site will have and the `port` value, inserting the site port;
4) Type `npm install` in the terminal;
5) Type `node .` in the terminal to start the site.

## SVG Attribution

This project uses SVG icons under various licenses.

For detailed attribution information (including sources, licenses, and any modifications), please visit the [`public/svg`](https://github.com/Ciao287/Games/tree/main/public/svg) folder. Each SVG file includes comments specifying its source, license, and any changes made.

## How the API Works
### General requests
Below are the requests that can be used for both Tic Tac Toe and Rock Paper Scissors Llizard Spock:

1) Via POST request `/api/generatetoken?tictactoe`, `/api/generatetoken?rpsls` or `/api/generatetoken?battleship` you will receive public and private tokens, needed for Classic Multiplayer games of Tic Tac Toe, Rock Paper Scissors Llizard Spock and Battleship:
```js
{
  publicToken: 'MQKqQS', //6 character token
  privateToken: 'MTczNTA5MTc5MDg3NQ6DMAKd' //24 character token
}
```
2) Via POST request `/api/verifycode`, sending as body:
```js
{
  code: 'MQKqQS', //Public token of the person you want to play with
  privateToken: 'MTczNTA5MTc5MDg3NQ6DMAKd' //Your private token
}
```
This will return the URL to request to update game parameters:
```js
{
  success: true,
  url: `${link}/api/${game}/multiplayer/${user.privateToken}` //`link` is taken from config.json => (https://github.com/Ciao287/Games/blob/main/config.json), while `user.privateToken` is the private token of the user you want to play with. The `game` can be either 'tictactoe', 'rpsls' or 'battleship' depending on the tokens used
}
```

### Tic Tac Toe
Below are the requests specific to Tic Tac Toe:

1) Via POST request `/api/tictactoe`, sending as body:
```js
{
  difficulty: 2, //A number from 1 to 3
  board: {
    c1: 'X', c2: 'O, c3: 'X',
    c4: false, c5: 'O', c6: false,
    c7: false, c8: false, c9: 'X'
  } //Values ​​can be false, 'X' or 'O'
}
```
It will return the bot's move, based on the difficulty:
```js
{
  success: true,
  difficulty: 2, //A number from 1 to 3
  board: {
    c1: 'X', c2: 'O', c3: 'X',
    c4: false, c5: 'O', c6: false,
    c7: false, c8: 'O', c9: 'X'
  }, //Values ​​can be false, 'X' or 'O'
  move: 'c8', //Values ​​can be from 'c1' to 'c9'
  winner: 'O' //Values ​​can be false, 'X', 'O' or 'Tie'
}
```
2) Via GET request `/api/tictactoe/multiplayer/PRIVATE_TOKEN` you will receive the data of that match:
```js
{
  time: Date.now(), //Timestamp in ms of when the game started
  x: 'MTczNTA5MTc5MDg3NQ6DMAKd', //User X's private token
  o: 'MTczNTA5Mjg1OTcxOA6CMAvR', //User O's private token
  board: {
    c1: 'X', c2: 'O', c3: 'X',
    c4: false, c5: 'O', c6: false,
    c7: false, c8: false, c9: 'X'
  }, //Values ​​can be false, 'X' or 'O'
  currentPlayer: 'O', //Values ​​can be 'X' or 'O'
  move: 'c9', //Values ​​can be from 'c1' to 'c9'
  winner: false //Values ​​can be false, 'X', 'O' or 'Tie'
}
```
3) Via POST request `/api/tictactoe/multiplayer/PRIVATE_TOKEN`, sending as body:
```js
{
  time: 1735124400000, //Timestamp in ms of when the game started (obtained from GET request on `/api/tictactoe/multiplayer/PRIVATE_TOKEN`)
  x: 'MTczNTA5MTc5MDg3NQ6DMAKd', //User X's private token
  o: 'MTczNTA5Mjg1OTcxOA6CMAvR', //User O's private token
  board: {
    c1: 'X', c2: 'O', c3: 'X',
    c4: false, c5: 'O', c6: false,
    c7: false, c8: false, c9: 'X'
  }, //Values ​​can be false, 'X' or 'O'
  currentPlayer: 'O', //Values ​​can be 'X' or 'O'
  move: 'c9', //Values ​​can be from 'c1' to 'c9'
  winner: false //Values ​​can be false, 'X', 'O' or 'Tie'
}
```
The response will be the same as the body sent, except that `currentPlayer` will change and in case of victory `winner` will become `'X'`, `'O'` or `'Tie'`.

### Rock Paper Scissors Lizard Spock
Below are the requests specific to RPSLS:

1) Via POST request `/api/rpsls`, sending as body:
```js
{
  user: 'spock', //Values ​​can be 'rock', 'paper', 'scissors', 'lizard' or 'spock'
  computer: false, //Values ​​can be 'rock', 'paper', 'scissors', 'lizard', 'spock' or false
  winner: false //Values ​​can be false, 'Win', 'Lose' or 'Tie'
}
```
It will return the bot's move, the winner, and the winning message:
```js
{
  success: true,
  user: 'spock', //Values ​​can be 'rock', 'paper', 'scissors', 'lizard' or 'spock'
  enemy: 'scissors', //Values ​​can be 'rock', 'paper', 'scissors', 'lizard' or 'spock'
  winner: 'Win', //Values ​​can be 'Win', 'Lose' or 'Tie'
  message: 'Spock smashes Scissors' //There are 10 different messages, to see them all visit https://github.com/Ciao287/Games/blob/main/index.js#L327-L331 (lines 327-331)
}
```
2) Via GET request `/api/rpsls/multiplayer/PRIVATE_TOKEN` you will receive the data of that match:
```js
{
  time: Date.now(), //Timestamp in ms of when the game started
  u: 'MTczNTA5MTc5MDg3NQ6DMAKd', //User's private token
  e: 'MTczNTA5Mjg1OTcxOA6CMAvR', //Enemy's private token
  user: 'spock', //Values ​​can be 'rock', 'paper', 'scissors', 'lizard' or 'spock' or false
  enemy: false, //Values ​​can be 'rock', 'paper', 'scissors', 'lizard', 'spock' or false
  winner: false, //Values ​​can be false, 'Win', 'Lose' or 'Tie'
  message: false //There are 10 different messages, to see them all visit https://github.com/Ciao287/Games/blob/main/index.js#L327-L331 (lines 327-331). In this case, it can also be false because the game has not ended yet
}
```
3) Via POST request `/api/rpsls/multiplayer/PRIVATE_TOKEN`, sending as body:
```js
{
  time: 1735124400000, //Timestamp in ms of when the game started (obtained from GET request on `/api/rpsls/multiplayer/PRIVATE_TOKEN`)
  u: 'MTczNTA5MTc5MDg3NQ6DMAKd', //User's private token
  e: 'MTczNTA5Mjg1OTcxOA6CMAvR', //Enemy's private token
  user: 'spock', //Values ​​can be 'rock', 'paper', 'scissors', 'lizard' or 'spock' or false
  enemy: 'scissors', //Values ​​can be 'rock', 'paper', 'scissors', 'lizard', 'spock' or false
  winner: false, //Values ​​can be false, 'Win', 'Lose' or 'Tie'
  message: false //There are 10 different messages, to see them all visit https://github.com/Ciao287/Games/blob/main/index.js#L327-L331 (lines 327-331). In this case, it can also be false because the game has not ended yet
}
```
The response will be the same as the body sent, except that in case of victory `winner` will become `'Win'`, `'Lose'` or `'Tie'` and `message` will become one of the messages listed in [index.js lines 327-331](https://github.com/Ciao287/Games/blob/main/index.js#L327-L331).
### Battleship
Below are the requests specific to Battleship:

#### Disclaimer:
The responses for the Battleship game can be too large to be represented every time. Therefore, only some responses will be shown at the beginning to give an idea of the format and structure.
```js
{
  time: Date.now(),
  u: user.privateToken,
  e: enemy.privateToken,
  currentPlayer: 'u', //Values can be 'u' or 'e'
  user: {
    ships: {
      isSet: false, //Values can be true or false
      carrier: {
        destroyed: false, //Values can be true or false
        n1: { cell: null, destroyed: false }, //Cell values ​​can be from 'c1' to 'c100'. Destroyed values can be true or false
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
    board: { c1: false, c2: false, c3: false, . . . c99: false, c100: false }, //Values can be true or false
    shotsFired: [] //Values ​​can be from 'c1' to 'c100'
  },
  enemy: {}, //same as user
  lastShot: false, //Values ​​can be from 'c1' to 'c100'
  hit: false, //Values can be true or false
  winner: false //Values can be 'Win', 'Lose' or false
}
```

1) Via POST request `/api/battleship?generateShips` you will receive computer's ships for singleplayer games.

2) Via POST request `/api/battleship?validateShips`, sending as body the user's ships, it will check if the ships are well placed:
```js
{
success: true,
isValid: true //Values can be true (if the ships are well placed) or false (if the ships need to be replaced)
}
```

The other possible Battleship's requests are very similar to those of Tic Tac Toe and Rock Paper Scissors Lizard Spock.
