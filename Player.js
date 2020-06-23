class Player {
  constructor(w, h, cel) {
    this.w = w;
    this.h = h;
    this.xpos = Math.random()*(w-100)+50;
    this.ypos = Math.random()*(h-100)+50;
    this.size = 10;
    this.radius = Math.sqrt(this.size*10/Math.PI);
    this.col = 'rgb(' + Math.random()*255 + ',' + Math.random()*255 + ',' + Math.random()*255 + ')';
    this.image = cel;
  }

  update_position(data){
    let tolerance = this.radius*5;
    this.xpos += data.xpos*((10 - Math.log(this.size*5))*2);
    this.ypos -= data.ypos*((10 - Math.log(this.size*5))*2);
    if(this.xpos >= this.w - tolerance) this.xpos = this.w - tolerance;
    if(this.xpos <= tolerance) this.xpos = tolerance;
    if(this.ypos >= this.h - tolerance) this.ypos = this.h - tolerance;
    if(this.ypos <= tolerance) this.ypos = tolerance;
  }

  change_size(x){
    this.size += x;
    this.radius = Math.sqrt(this.size*10/Math.PI);
  }

  reset(){
    this.xpos = Math.random()*this.w;
    this.ypos = Math.random()*this.h;
    this.size = 10;
    this.radius = Math.sqrt(this.size*10/Math.PI);
  }
}

module.exports = Player;
