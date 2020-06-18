class Player {
  constructor(w, h) {
    this.w = w;
    this.h = h;
    this.xpos = Math.random()*w;
    this.ypos = Math.random()*h;
    this.size = 20;
    this.col = 'rgb(' + Math.random()*255 + ',' + Math.random()*255 + ',' + Math.random()*255 + ')';
  }

  update_position(data){
    this.xpos += data.xpos*((20 - Math.log(this.size))/10);
    this.ypos -= data.ypos*((20 - Math.log(this.size))/10);
    //this.size += data.size;
    if(this.size < 5)
      this.size = 5;
  }

  change_size(x){
    this.size += x;
  }

  reset(){
    this.xpos = Math.random()*this.w;
    this.ypos = Math.random()*this.h;
    this.size = 20;
  }

}

module.exports = Player;
