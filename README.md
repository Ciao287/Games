# TicTacToe

Demo: [https://tictactoe.is-a.dev](https://tictactoe.is-a.dev)

TicTacToe è un progetto fatto per High Seas - Hack Club, ti permette di giocare a TicTacToe in single player contro il bot, con 3 modalità (Easy, Medium ed Hard) ed in multiplayer, con 2 modalità (Classic => si gioca con 2 dispositivi, Pass and Play => si gioca dallo stesso dispositivo).

TicTacToe è pensato per essere utilizzato dappertutto, su siti web, su app, anche su bot Discord, grazie alla sua api.

Il [sito demo](https://tictactoe.is-a.dev) è stato creato per darvi un'idea di cosa si può fare con questa api, potete facilmente customizzarlo modificando i file [index.ejs](https://github.com/Ciao287/TicTacToe/blob/main/index.ejs), tutti i file nella cartella [public](https://github.com/Ciao287/TicTacToe/tree/main/public) e, in caso si vogliano aggiungere nuovi link [index.js](https://github.com/Ciao287/TicTacToe/blob/main/index.js).

## Come Installare

1) Installare [node.js](https://nodejs.org/en/download/package-manager/current);
2) aprire il terminale nella cartella in cui si desidera installare TicTacToe ed eseguire `git clone https://github.com/Ciao287/TicTacToe`;
3) Aprire il file [config.json](https://github.com/Ciao287/TicTacToe/blob/main/config.json), modificare i valori `link`, inserendo il link completo che il sito avrà e `port`, inserendo la porta del sito;
4) Digitare nel terminale `npm install`;
5) Digitare nel terminale `node .` per avviare il sito.

## Come Funziona L'Api

1) Tramite richiesta POST `/api/tictactoe`, inviando come body:
```js
{
  difficulty: 2, //Un numero da 1 a 3
  board: {
    c1: 'X', c2: 'O, c3: 'X',
    c4: false, c5: 'O', c6: false,
    c7: false, c8: false, c9: 'X'
  } //I valori possono essere false, 'X' o 'O'
}
```
Restituirà la mossa del bot, in base alla difficoltà:
```js
{
  success: true,
  difficulty: 2, //Un numero da 1 a 3,
  board: {
    c1: 'X', c2: 'O', c3: 'X',
    c4: false, c5: 'O', c6: false,
    c7: false, c8: 'O', c9: 'X'
  }, //I valori possono essere false, 'X' o 'O'
  move: 'c8', //I valori possono essere da 'c1' a 'c9'
  winner: 'O' //I valori posono essere false, 'X' o 'O'
}
```
2) Tramite richiesta POST `/api/generatetoken` riceverai i token pubblici e privati, necessari per le partite Multiplayer Classiche:
```js
{
  publicToken: 'MQKqQS', //Token di 6 caratteri
  privateToken: 'MTczNTA5MTc5MDg3NQ6DMAKd' //Token di 24 caratteri
}
```
3) Tramite richiesta POST `/api/verifycode`, inviando come body:
```js
{
  code: 'MQKqQS', //Token pubblico dello sfidante
  privateToken: 'MTczNTA5MTc5MDg3NQ6DMAKd' //Il tuo token privato
}
```
Restituirà l'url a cui fare richiesta per aggiornare i parametri di gioco:
```js
{
  success: true,
  url: `${link}/api/tictactoe/multiplayer/${user.privateToken}` //`link` viene preso da [config.json](https://github.com/Ciao287/TicTacToe/blob/main/config.json), mentre `user.privateToken` è il token privato dell'utente con cui vuoi giocare
}
```
4) Tramite richiesta GET `/api/tictactoe/multiplayer/PRIVATE_TOKEN` riceverai i dati di quella partita:
```js
{
  time: 1735124400000, //Timestamp in ms ottenuto dalla richiesta GET su `/api/tictactoe/multiplayer/PRIVATE_TOKEN`
  x: 'MTczNTA5MTc5MDg3NQ6DMAKd', //Token privato dell'utente X
  o: 'MTczNTA5Mjg1OTcxOA6CMAvR', //Token privato dell'utente O
  board: {
    c1: 'X', c2: 'O', c3: 'X',
    c4: false, c5: 'O', c6: false,
    c7: false, c8: false, c9: 'X'
  }, //I valori possono essere false, 'X' o 'O'
  currentPlayer: 'O', //I valori possono essere 'X' o 'O'
  move: 'c9', //I valori possono essere da 'c1' a 'c9'
  winner: false //I valori posono essere false, 'X' o 'O'
}
```
5) Tramite richiesta POST `/api/tictactoe/multiplayer/PRIVATE_TOKEN`, inviando come body:
```js
{
  time: 1735124400000, //Timestamp in ms ottenuto dalla richiesta GET su `/api/tictactoe/multiplayer/PRIVATE_TOKEN`
  x: 'MTczNTA5MTc5MDg3NQ6DMAKd', //Token privato dell'utente X
  o: 'MTczNTA5Mjg1OTcxOA6CMAvR', //Token privato dell'utente O
  board: {
    c1: 'X', c2: 'O', c3: 'X',
    c4: false, c5: 'O', c6: false,
    c7: false, c8: false, c9: 'X'
  }, //I valori possono essere false, 'X' o 'O'
  currentPlayer: 'O', //I valori possono essere 'X' o 'O'
  move: 'c9', //I valori possono essere da 'c1' a 'c9'
  winner: false //I valori posono essere false, 'X' o 'O'
}
```
La risposta sarà uguale al body inviato, tranne che cambierà `currentPlayer` ed in caso di vittoria `winner` diventerà `'X'` o `'O'`
