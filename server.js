let Player = require('./Player.js');

const io = require('socket.io')

const users = {}
const w = 1000;
const h = 500;

setInterval(function(){
  io.sockets.emit('update_game', users)
}, 50);

io.on('connection', socket => {
  socket.on('new-user', name => {
    socket.broadcast.emit('user-connected', name);
    users[socket.id] = new Player(w, h);
  })

  socket.on('update_cell', data => {
    if(users[socket.id] != null)
      users[socket.id].update_position(data);
  })








  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id])
    delete users[socket.id]
  })
})
