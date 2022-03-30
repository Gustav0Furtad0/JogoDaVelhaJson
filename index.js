const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const fs = require('fs');

var jogador = 'X'

var posicoes = {}

let gamereset = {
  1 : '',
  2 : '',
  3 : '',
  4 : '',
  5 : '',
  6 : '',
  7 : '',
  8 : '',
  9 : '',
  vezde: 'X'
}

gamereset = JSON.stringify(gamereset)

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html')
})

io.on('connection', (socket) => {
  socket.on('reseta jsao', (req) => {
    fs.writeFile("jogo.json", gamereset, (err) => {
      if (err)
        console.log(err);
      else {
        console.log("Reset feito com suscesso!\n");
        fs.readFile('jogo.json', function (err, map) {
          if (err) console.log(err);
          else {
            let result = JSON.parse(map)
            posicoes = result
            req({
              1: result[1],
              2: result[2],
              3: result[3],
              4: result[4],
              5: result[5],
              6: result[6],
              7: result[7],
              8: result[8],
              9: result[9],
              vezde: result.vezde
            })
          }
        })
      }
    })
  })

  socket.on('pede refresh', () => {
    io.emit('refresh please')
  })

  socket.on('jogada', (posicao, status) => {
    if (jogador == 'X') {
      jogador = 'O'
    } else {
      jogador = 'X'
    }
    let conf = posicao.replace('#', '')
    posicoes[conf] = jogador
    conf = JSON.stringify(posicoes)
    fs.writeFile("jogo.json", conf, (err) => {
      if (err)
        console.log(err)
      else
        console.log("Jogada salva com suscesso!\n");
    })
    io.emit('mudar posicao', posicao, jogador)
    socket.broadcast.emit('agora pode')
    status(false)
  });


  socket.on('tela_carregada', (req) => {
    fs.readFile('jogo.json', function (err, map) {
      if (err) console.log(err);
      else {
        let result = JSON.parse(map)
        posicoes = result
        req({
          1: result[1],
          2: result[2],
          3: result[3],
          4: result[4],
          5: result[5],
          6: result[6],
          7: result[7],
          8: result[8],
          9: result[9],
          vezde: result.vezde
        })
      }
    })
  })
});
server.listen(3000, () => {
  console.log('Jogo hospedado em: "localhost:3000"');
})