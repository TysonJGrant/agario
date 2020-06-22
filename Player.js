class Player {
  constructor(w, h, cel) {
    this.w = w;
    this.h = h;
    this.xpos = Math.random()*(w-100)+50;
    this.ypos = Math.random()*(h-100)+50;
    this.size = 500;
    this.radius = Math.sqrt(this.size*10/Math.PI);
    this.col = 'rgb(' + Math.random()*255 + ',' + Math.random()*255 + ',' + Math.random()*255 + ')';
    this.image = cel;
  }

  update_position(data){
    this.xpos += data.xpos*((20 - Math.log(this.size))/4);
    this.ypos -= data.ypos*((20 - Math.log(this.size))/4);
    if(this.xpos >= this.w - this.radius) this.xpos = this.w - this.radius;
    if(this.xpos <= this.radius) this.xpos = this.radius;
    if(this.ypos >= this.h - this.radius) this.ypos = this.h - this.radius;
    if(this.ypos <= this.radius) this.ypos = this.radius;
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
