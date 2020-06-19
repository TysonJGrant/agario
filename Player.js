class Player {
  constructor(w, h) {
    this.w = w;
    this.h = h;
    this.xpos = Math.random()*w;
    this.ypos = Math.random()*h;
    this.size = 100;
    this.radius = Math.sqrt(this.size*10/Math.PI);
    this.col = 'rgb(' + Math.random()*255 + ',' + Math.random()*255 + ',' + Math.random()*255 + ')';
  }

  update_position(data){
    this.xpos += data.xpos*((20 - Math.log(this.size))/10);
    this.ypos -= data.ypos*((20 - Math.log(this.size))/10);
  }

  change_size(x){
    this.size += x;
    this.radius = Math.sqrt(this.size*10/Math.PI);
  }

  reset(){
    this.xpos = Math.random()*this.w;
    this.ypos = Math.random()*this.h;
    this.size = 100;
  }

}

module.exports = Player;
