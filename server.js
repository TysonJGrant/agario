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

//food position isnt updating. size is though

//fix zoom based on number of pieces

//add button to remove background if running slow

var w = 4000;
var h = 4000;

var Player = require('./Player.js');

const express = require('express');
const socketIO = require('socket.io');
const PORT = process.env.PORT || 3000;
const INDEX = './index.html';
const SCRIPT = './script.js';

const app = express();
app.use(express.static('assets'));    //location of images, scripts etc
app.get('/', function(req, res) {     //main index page
  res.sendFile(__dirname + '/index.html');
});
const server = app.listen(PORT, () => console.log(`Listening on ${PORT}`));
var io = socketIO(server);

const food_pieces = 2000;
const users = {};
const bots = {};
const food = create_food();

setInterval(function(){
  update_food();
  update_players();
  io.sockets.emit('update_game', {users: users});
}, 50);

io.on('connection', (socket) => {
  socket.on('new-user', cel => {
    socket.emit('get_game_data', food);
    //users[socket.id] = new Player(w, h);
    users[socket.id] = new Player(w, h, cel);
  })

  socket.on('update_cell', data => {
    if(users[socket.id] != null){
      users[socket.id].update_position(data);
      socket.emit('get_self_data', users[socket.id])
    }
  })

  socket.on('split_cells', data => {
    if(users[socket.id] != null){
      users[socket.id].split_cells(data);
    }
  })

  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id])
    delete users[socket.id]
  })
})

function update_food(){
  changed_food = [];
  Object.keys(users).forEach(function(key) {
    player = users[key];
    for(j = 0; j < food.length; j++){
      if(player.food_eaten(food[j])){
        food[j] = [(Math.random()*w).toFixed(2), (Math.random()*h).toFixed(2)]; //move food position
        changed_food.push([j, food[j]]);    //only send food info when changed ([index, new xpos, new ypos])
      }
    }
  });
  io.sockets.emit('update_food', changed_food);
}

function update_players(){
  Object.keys(users).forEach(function(key1) {
    player1 = users[key1];
    Object.keys(users).forEach(function(key2) {
      player2 = users[key2];
      player1.eat_player(player2);
    });
  });
}

function create_food(){
  temp = [];
  for(i = 0; i < food_pieces; i++){
    temp[i] = [(Math.random()*w).toFixed(2), (Math.random()*h).toFixed(2)];
  }
  return temp;
}
