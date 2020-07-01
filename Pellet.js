class Pellet {
  constructor(w, h, xpos, ypos, accel) {
    this.w = w;
    this.h = h;
    this.xpos = xpos
    this.ypos = ypos
    this.size = 10;
    this.accel = accel;       //acceleration multiplier, xspeed and yspeed
    this.radius = Math.sqrt(this.size*10/Math.PI);
  }

  update_position(){
    let vel = ((10 - Math.log(this.size*5))*2);
    if(this.accel[0] > 0){
      this.xpos += this.accel[1]*vel*this.accel[0];
      this.ypos -= this.accel[2]*vel*this.accel[0];
      this.accel[0] -= 0.1;
      let tolerance = this.radius*5;
      if(this.xpos >= this.w - tolerance){
        this.accel[1] = this.accel[1]*-1;
        this.xpos += this.accel[1]*vel*this.accel[0];
      }
      if(this.xpos <= tolerance){
        this.accel[1] = this.accel[1]*-1;
        this.xpos += this.accel[1]*vel*this.accel[0];
      }
      if(this.ypos >= this.h - tolerance){
        this.accel[2] = this.accel[2]*-1;
        this.ypos -= this.accel[2]*vel*this.accel[0];
      }
      if(this.ypos <= tolerance){
        this.accel[2] = this.accel[2]*-1;
        this.ypos -= this.accel[2]*vel*this.accel[0];
      }
    }
  }

  hit_mine(mine){
    let xdist = Math.abs(this.xpos - mine.xpos);
    let ydist = Math.abs(this.ypos - mine.ypos);
    let dist = Math.sqrt( xdist * xdist + ydist * ydist );
    if(dist < 30){ //if touching mine
      mine.redirect(this.accel);       //push mine away
      return true;
    }
    return false;
  }
}

module.exports = Pellet;
