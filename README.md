# TicTacToe

Demo: [https://tictactoe.is-a.dev](https://tictactoe.is-a.dev)

TicTacToe is a project made for High Seas - Hack Club, it allows you to play TicTacToe in single player against the bot, with 3 modes (Easy, Medium and Hard) and in multiplayer, with 2 modes (Classic => you play with 2 devices, Pass and Play => you play from the same device).

TicTacToe is designed to be used everywhere, on websites, in apps, even in Discord bots, thanks to its API.

The [demo site](https://tictactoe.is-a.dev) was created to give you an idea of ​​what can be done with this api, you can easily customize it by modifying the [index.ejs](https://github.com/Ciao287/TicTacToe/blob/main/index.ejs) file, all the files in the [public](https://github.com/Ciao287/TicTacToe/tree/main/public) folder and, in case you want to add new links, [index.js](https://github.com/Ciao287/TicTacToe/blob/main/index.js).

## How to Install

1) If you don't have them already, install [Node.js](https://nodejs.org/en/download/package-manager/current) and [Git](https://git-scm.com/downloads);
2) Open terminal in the folder where you want to install TicTacToe and run `git clone https://github.com/Ciao287/TicTacToe`;
3) Open the [config.json](https://github.com/Ciao287/TicTacToe/blob/main/config.json) file, change the `link` value, inserting the complete link that the site will have and the `port` value, inserting the site port;
4) Type `npm install` in the terminal;
5) Type `node .` in the terminal to start the site.

## How the API Works

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
  winner: 'O' //Values ​​can be false, 'X' or 'O'
}
```
2) Via POST request `/api/generatetoken` you will receive public and private tokens, needed for Classic Multiplayer games:
```js
{
  publicToken: 'MQKqQS', //6 character token
  privateToken: 'MTczNTA5MTc5MDg3NQ6DMAKd' //24 character token
}
```
3) Via POST request `/api/verifycode`, sending as body:
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
  url: `${link}/api/tictactoe/multiplayer/${user.privateToken}` //`link` is taken from [config.json](https://github.com/Ciao287/TicTacToe/blob/main/config.json), while `user.privateToken` is the private token of the user you want to play with
}
```
4) Via GET request `/api/tictactoe/multiplayer/PRIVATE_TOKEN` you will receive the data of that match:
```js
{
  time: Date.now(), //Timestamp in ms
  x: 'MTczNTA5MTc5MDg3NQ6DMAKd', //User X's private token
  o: 'MTczNTA5Mjg1OTcxOA6CMAvR', //User O's private token
  board: {
    c1: 'X', c2: 'O', c3: 'X',
    c4: false, c5: 'O', c6: false,
    c7: false, c8: false, c9: 'X'
  }, //Values ​​can be false, 'X' or 'O'
  currentPlayer: 'O', //Values ​​can be 'X' or 'O'
  move: 'c9', //Values ​​can be from 'c1' to 'c9'
  winner: false //Values ​​can be false, 'X' or 'O'
}
```
5) Via POST request `/api/tictactoe/multiplayer/PRIVATE_TOKEN`, sending as body:
```js
{
  time: 1735124400000, //Timestamp in ms obtained from GET request on `/api/tictactoe/multiplayer/PRIVATE_TOKEN`
  x: 'MTczNTA5MTc5MDg3NQ6DMAKd', //User X's private token
  o: 'MTczNTA5Mjg1OTcxOA6CMAvR', //User O's private token
  board: {
    c1: 'X', c2: 'O', c3: 'X',
    c4: false, c5: 'O', c6: false,
    c7: false, c8: false, c9: 'X'
  }, //Values ​​can be false, 'X' or 'O'
  currentPlayer: 'O', //Values ​​can be 'X' or 'O'
  move: 'c9', //Values ​​can be from 'c1' to 'c9'
  winner: false //Values ​​can be false, 'X' or 'O'
}
```
The response will be the same as the body sent, except that `currentPlayer` will change and in case of victory `winner` will become `'X'` or `'O'`.
