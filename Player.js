class Player {
  constructor(w, h) {
    this.xpos = Math.random()*w;
    this.ypos = Math.random()*h;
    this.size = 20;
  }

  update_position(data){
    this.xpos += data.xpos*((20 - Math.log(this.size))/10);
    this.ypos -= data.ypos*((20 - Math.log(this.size))/10);
    //this.size += data.size;
    if(this.size < 5)
      this.size = 5;
  }
}

module.exports = Player;
