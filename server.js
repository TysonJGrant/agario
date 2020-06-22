//Add leadervoard
//add food
//add bots to pop cells. give some defence like shooting
//    lose half size if hit. able to shoot back.
//  move in straight line, pause and rotate, move in straight line.
//  with different duration and speed and length
//planets as cells
//add resume page with embedded cv and add reference under
//make rules for this game a dropdown and maybe with video showing play

//zoom doesnt work properly. need to draw size based on cell size, not just hard coded

var w = 4000;
var h = 4000;

var Player = require('./Player.js');
var local = false;
var io;

if(local){  //Manage when running locally
  io = require('socket.io')(3000)  //for local
}
else{
  const express = require('express');
  const socketIO = require('socket.io');
  const PORT = process.env.PORT || 3000;
  const INDEX = './index.html';
  const IMAGES = './images';
  const CELLS = './cells';

  const server = express()
    .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
    .use((req, res) => res.sendFile(IMAGES, { root: __dirname }))
    .use((req, res) => res.sendFile(CELLS, { root: __dirname }))
    .listen(PORT, () => console.log(`Listening on ${PORT}`));
  io = socketIO(server);
}

const food_pieces = 2000;
const users = {};
const bots = {};
const food = create_food();

setInterval(function(){
  update_food();
  update_players();
  io.sockets.emit('update_game', {users: users, food: food})
}, 50);

io.on('connection', (socket) => {
  socket.on('new-user', cel => {
    socket.broadcast.emit('user-connected', cel);
    //users[socket.id] = new Player(w, h);
    users[socket.id] = new Player(w, h, cel);
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
      if(dist < player.radius){ //if touching food
        food[j] = [Math.random()*w, Math.random()*h]; //move food position
        player.change_size(5);                        //increase player size
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
        dist = Math.sqrt( xdist * xdist + ydist * ydist );
        if(dist < (player1.radius - player2.radius*9/10)){ //eat player when very close
          player1.change_size(player2.size);
          player2.reset();
        }
      }
    });
  });
}

function create_food(){
  temp = [];
  for(i = 0; i < food_pieces; i++){
    temp[i] = [Math.random()*w, Math.random()*h];
  }
  return temp;
}
