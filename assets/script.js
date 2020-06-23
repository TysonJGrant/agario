var background = get_image("images/gamebg.png")
var images = get_all_cell_images();
console.log(images);
console.log(background);
document.addEventListener("DOMContentLoaded", start);

function start(){
  var socket;
  socket = io();

  //const name = prompt('What is your name?')
  socket.emit('new-user',  Math.floor(Math.random()*25));

  var c = document.getElementById("myCanvas");
  var ctx = c.getContext("2d");
  c.width = window.innerWidth;
  c.height = window.innerHeight;

  var mousex;
  var mousey;
  var csize = 0;
  var cradius = 0;
  var xpos = 0;
  var ypos = 0;
  var xspeed = 0;
  var yspeed = 0;
  var xoffset = 0;
  var yoffset = 0;
  var xcentre = window.innerWidth/2;
  var ycentre = window.innerHeight/2;
  var scale = 1;
  var scale_inc = 1;
  var won = false;

  socket.on('update_game', data => {
    socket.emit('update_cell', {xpos: xspeed, ypos: yspeed})
    if(data.users != null)
      redraw_game(data);

    rise = xcentre - mousex;
    run = ycentre - mousey;
    //rise = xpos - mousex;           //calculate travel velocity
    //run = ypos - mousey;
    angle = Math.atan2(rise, run) * (180 / Math.PI) + 90;
    if (angle < 0) angle = 360 + angle;   //range now 0-360
    xspeed = Math.cos(angle / (180 / Math.PI));
    yspeed = Math.sin(angle / (180 / Math.PI));
    //appendMessage(`${data.name}: ${data.message}`);
  })

  socket.on('get_cell_data', data => {
    xpos = data.xpos;
    ypos = data.ypos;
    csize = data.size;
    cradius = data.radius;
    xoffset = xcentre - xpos*scale_inc;
    yoffset = ycentre - ypos*scale_inc;
  })

  function redraw_game(data){
    if(csize > 10000){ won = true; }   //win when big enough. do cool implode thing

    ctx.clearRect(0, 0, c.width, c.height);
    ctx.save();
    ctx.translate(xoffset, yoffset);      //Draw with player in centre of screen
    ctx.scale(scale_inc, scale_inc);
    food = data.food;
    users = data.users;
    users = Object.keys(users).map(key => users[key]).sort(compare_size);  //Convert to sorted array

    draw_background();

    ctx.strokeStyle = "#555555";
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.rect(0, 0, 4000, 4000); //draw border
    ctx.stroke();

    food.forEach(function(item,i){              //Draw food
      //draw_circle(item[0], item[1], 5, '#33ccff');
      draw_circle(item[0], item[1], 5, '#fccd12');
    });

    users.forEach(function(player,i){   //Draw players
      //put in order of size
      cel = images[player.image];
      ctx.drawImage(cel, 0, 0, cel.width, cel.height, player.xpos-(player.radius*2/2), player.ypos-(player.radius*2/2), player.radius*2, player.radius*2);
      //draw_circle(player.xpos, player.ypos, 10, player.col);
    });
    ctx.restore();        //reset the transform

    //document.getElementById("score").innerHTML = ("SIZE: &nbsp&nbsp" + csize + "  scale: " + scale + "  scale_inc: " + scale_inc + "<br>GOAL: 10000");
    document.getElementById("score").innerHTML = ("SIZE: &nbsp&nbsp" + csize + "<br>GOAL: 10000");
    document.getElementById("pos").innerHTML = ("XPOS: " + parseInt(xpos) + "<br>YPOS: " + parseInt(ypos));
    if(won){
      scale = -1; //displaye win or lose and do invert explode thing. add start again button
    }
    else {
      scale = 40/cradius;//something about size
      scale_inc = scale;
    }
    if(Math.abs(scale_inc - scale) < 0.01)         //smooth out size changes
      scale_inc = scale;
    else if(scale_inc > scale){
      scale_inc-=0.01;
    }
    else{
      scale_inc+=0.01;
    }
  }

  function draw_circle(x, y, size, c){
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, 2 * Math.PI, false);
    ctx.fill();
  }

  function compare_size(a, b) {
    if (a.size > b.size) {
      return 1;
    } else{
      return -1;
    }
  }

  function draw_background(){
    for(i = 0; i < 3; i++){                 //make sure background image doesn't go beyond canvas border
      for(j = 0; j < 5; j++){
        sy = (j == 0) ? (5*i) : 0;         //define positional arguments for drawimage to fill canvas
        swidth = (4000 - i*1661 < 1661) ? (4000-i*1661) : 1661;
        yy = (970*j - i*5 < 0) ? 0 : (970*j-i*5);
        sheight = (yy + 970 > 4000) ? (4000-yy) : (970-sy);
        ctx.drawImage(background, 0, sy, swidth, sheight, 1661*i, yy, swidth, sheight);    //draw game bg to fill canvas
        //console.log("ctx.drawImage(background, 0, " + sy + ", " + swidth + ", " + sheight + ", " + (1661*i) + ", " + yy + ", " + swidth + ", " + sheight + "); "); //to generate manually
      }
    }
  }

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
      mousex = event.pageX;
      mousey = event.pageY;
  }
}

function get_all_cell_images(){
  temp = [];
  for(i = 0; i < 25; i++){
    temp[i] = get_image("cells/cell_" + i + ".png");
  }
  return temp;
}

function get_image(location)
{
  base_image = new Image();
  base_image.src = location;
  return base_image;
}
