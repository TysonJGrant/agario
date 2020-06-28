class Mine {
  constructor(w, h) {
    this.w = w;
    this.h = h;
    this.xpos = Math.floor(Math.random()*w);
    this.ypos = Math.floor(Math.random()*h);
    this.angle = Math.floor(Math.random()*360);
    this.move = true;
    this.timer = Math.floor(Math.random()*100 + 100);
  }

  update_position(){
    this.timer --;
    if(this.timer < 1){
      this.move = (this.move) ? false : true;
      this.timer = Math.floor(Math.random()*100 + 100);
    }
    if(this.move){
      let vel = 10;
      let xspeed = Math.cos(this.angle / (180 / Math.PI));
      let yspeed = Math.sin(this.angle / (180 / Math.PI));
      this.xpos -= xspeed*vel;
      this.ypos += yspeed*vel;
      let tolerance = 20;
      if(this.xpos >= this.w - tolerance){
        this.angle = (this.angle - (this.angle - 180)*2 + 540)%360;
        this.xpos = this.w - tolerance;
      }
      if(this.xpos <= tolerance){
        this.angle = (this.angle - this.angle*2 + 540)%360;
        this.xpos = tolerance;
      }
      if(this.ypos >= this.h - tolerance){
        this.angle = (this.angle - (this.angle - 90)*2 + 540)%360;
        this.ypos = this.h - tolerance;
      }
      if(this.ypos <= tolerance){
        this.angle = (this.angle - (this.angle - 270)*2 + 540)%360;
        this.ypos = tolerance;
      }
    }
    else{
      this.angle = (this.angle += 3)%360;
    }
  }
}

module.exports = Mine;
