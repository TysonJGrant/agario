const socket = io('http://localhost:3000'); //run locally
//var socket = io();
const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')

const name = prompt('What is your name?')
appendMessage('You joined')
socket.emit('new-user', name)

var xspeed = 0;
var yspeed = 0;
var xcentre = window.innerWidth/2;
var ycentre = window.innerHeight/2;

var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var col = 'rgb(' + Math.random()*255 + ',' + Math.random()*255 + ',' + Math.random()*255 + ')';
ctx.fillStyle = col;

socket.on('update_game', users => {
  size = Math.random()*6 - 3;
  socket.emit('update_cell', {xpos: xspeed, ypos: yspeed, size: size})

  redraw_game(users);
  console.log(1);

  //console.log(all(data.all));
  //appendMessage(`${data.name}: ${data.message}`);
})

document.onmousemove = handleMouseMove;   //tracking mouse position and movement direction
function handleMouseMove(event) {
    var eventDoc, doc, body;
    event = event || window.event;
    if (event.pageX == null && event.clientX != null) {
        eventDoc = (event.target && event.target.ownerDocument) || document;
        doc = eventDoc.documentElement;
        body = eventDoc.body;

        event.pageX = event.clientX +
          (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
          (doc && doc.clientLeft || body && body.clientLeft || 0);
        event.pageY = event.clientY +
          (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
          (doc && doc.clientTop  || body && body.clientTop  || 0 );
    }
    rise = xcentre - event.pageX;
    run = ycentre - event.pageY;
    angle = Math.atan2(rise, run) * (180 / Math.PI) + 90;
    if (angle < 0) angle = 360 + angle;   //range now 0-360
    xspeed = Math.cos(angle / (180 / Math.PI));
    yspeed = Math.sin(angle / (180 / Math.PI));
    //console.log(angle);
    //console.log("x: " + xspeed);
    //console.log("y: " + yspeed);
}


function redraw_game(users){
  ctx.clearRect(0, 0, c.width, c.height);

  Object.keys(users).forEach(function(key) {
    var player = users[key];
    ctx.beginPath();
    ctx.arc(player.xpos, player.ypos, player.size, 0, 2 * Math.PI, false);
    ctx.fill();
  });
}

socket.on('user-connected', name => {
  appendMessage(`${name} connected`)
})

socket.on('user-disconnected', name => {
  appendMessage(`${name} disconnected`)
})

messageForm.addEventListener('submit', e => {
  e.preventDefault()
  const message = messageInput.value
  appendMessage(`You: ${message}`)
  socket.emit('send-chat-message', message)
  messageInput.value = ''
})

function appendMessage(message) {
  const messageElement = document.createElement('div')
  messageElement.innerText = message
  messageContainer.append(messageElement)
}
