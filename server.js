//Add leadervoard
//add food
//add bots

var Player = require('./Player.js');
var local = true;
var io;

if(local){  //Manage when running locally
  io = require('socket.io')(3000)  //for local
}
else{
  const express = require('express');
  const socketIO = require('socket.io');
  const PORT = process.env.PORT || 3000;
  const INDEX = './index.html';

  const server = express()
    .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
    .listen(PORT, () => console.log(`Listening on ${PORT}`));
  io = socketIO(server);
}

const w = 1000;
const h = 500;
const users = {};
const bots = {};
const food = create_food();

setInterval(function(){
  update_food();
  update_players();
  io.sockets.emit('update_game', {users: users, food: food})
}, 50);

io.on('connection', (socket) => {
  socket.on('new-user', name => {
    socket.broadcast.emit('user-connected', name);
    users[socket.id] = new Player(w, h);
  })

  socket.on('update_cell', data => {
    if(users[socket.id] != null){
      users[socket.id].update_position(data);
      socket.emit('get_cell_data', users[socket.id])
    }
  })

  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id])
    delete users[socket.id]
  })
})

function update_food(){
  Object.keys(users).forEach(function(key) {
    player = users[key];
    for(j = 0; j < food.length; j++){
      xdist = Math.abs(player.xpos - food[j][0]);
      ydist = Math.abs(player.ypos - food[j][1]);
      dist = Math.sqrt( xdist * xdist + ydist * ydist );
      if(dist < player.size){ //if touching food
        food[j] = [Math.random()*w, Math.random()*h]; //move food position
        player.change_size(1);                        //increase player size
      }
    }
  });
}

function update_players(){
  Object.keys(users).forEach(function(key1) {
    player1 = users[key1];
    Object.keys(users).forEach(function(key2) {
      player2 = users[key2];
      if(player1.size > player2.size){  //eat other player if big and close enough
        xdist = Math.abs(player1.xpos - player2.xpos);
        ydist = Math.abs(player1.ypos - player2.ypos);
        if(xdist < player1.size && ydist < player1.size){
          player1.change_size(player2.size);
          player2.reset();
        }
      }
    });
  });
}

function create_food(){
  temp = [];
  for(i = 0; i < 200; i++){
    temp[i] = [Math.random()*w, Math.random()*h];
  }
  return temp;
}
