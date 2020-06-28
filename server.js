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

//only one segment eating food

//splitting still goes in identical directions at first

//zoom in out too fast. change multiplier

//make splitting cells and pellets start further away from cell so doesnt eat instantly

var w = 4000;
var h = 4000;

var Player = require('./Player.js');
var Pellet = require('./Pellet.js');
var Mine = require('./Mine.js');

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
const total_mines = 10;
var users = {};
var bots = {};
var food = create_food();
var pellets = [];
var mines = create_mines();

setInterval(function(){
  update_food();
  update_players();
  update_pellets();
  update_mines();
  io.sockets.emit('update_game', {users: users, pellets: pellets, mines: mines});
}, 50);

io.on('connection', (socket) => {
  socket.on('new-user', cel => {
    socket.emit('get_game_data', food);
    //users[socket.id] = new Player(w, h);
    users[socket.id] = new Player(w, h, cel);
  })

  socket.on('update_cell', mouse_pos => {
    if(users[socket.id] != null){
      users[socket.id].update_position(mouse_pos);
      socket.emit('get_self_data', users[socket.id])
    }
  })

  socket.on('split_cells', mouse_pos => {
    if(users[socket.id] != null){
      users[socket.id].split_cells(mouse_pos);
    }
  })

  socket.on('shoot_pellet', mouse_pos => {
    if(users[socket.id] != null){
      pellets = pellets.concat(users[socket.id].shoot_pellets(mouse_pos));
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
      if(player.food_eaten(food[j], 1)){
        food[j] = [(Math.random()*w).toFixed(2), (Math.random()*h).toFixed(2)]; //move food position
        changed_food.push([j, food[j]]);    //only send food info when changed ([index, new xpos, new ypos])
      }
    }
  });
  io.sockets.emit('update_food', changed_food);
}

function update_mines(){
  Object.keys(users).forEach(function(key1) {
    player = users[key1];
    for(j = mines.length-1; j >=0; j--){
      mines[j].update_position();
      mine_pos = [mines[j].xpos, mines[j].ypos];
      if(player.mine_eaten(mine_pos)){
        mines[j] = new Mine(w, h);
      }
    }
  });
}

function update_pellets(){
  Object.keys(users).forEach(function(key1) {
    player = users[key1];
    for(j = pellets.length-1; j >=0; j--){
      pellets[j].update_position();
      pellet_pos = [pellets[j].xpos, pellets[j].ypos];
      if(player.food_eaten(pellet_pos, 10)){
        pellets.splice(j, 1);     //Remove pellet if eaten
      }
    }
  });
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

function create_mines(){
  temp = [];
  for(i = 0; i < total_mines; i++){
    temp[i] = new Mine(w, h);
  }
  return temp;
}
