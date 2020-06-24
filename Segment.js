class Segment {
  constructor(w, h, xpos, ypos, size, accel, cel) {
    this.w = w;
    this.h = h;
    this.xpos = xpos
    this.ypos = xpos
    this.size = size;
    this.accel = accel;       //acceleration multiplier, xspeed and yspeed
    this.radius = Math.sqrt(this.size*10/Math.PI);
    this.image = cel;
  }

  update_position(data){
    let vel = ((10 - Math.log(this.size*5))*2);
    if(this.accel[0] > 1){
      this.xpos += this.accel[1]*vel*this.accel[0];
      this.ypos -= this.accel[2]*vel*this.accel[0];
      this.accel[0] -= 0.1;
    }
    else{
      this.xpos += data.xspeed*vel;
      this.ypos -= data.yspeed*vel;
    }
    let tolerance = this.radius*5;
    if(this.xpos >= this.w - tolerance) this.xpos = this.w - tolerance;
    if(this.xpos <= tolerance) this.xpos = tolerance;
    if(this.ypos >= this.h - tolerance) this.ypos = this.h - tolerance;
    if(this.ypos <= tolerance) this.ypos = tolerance;
  }

  change_size(x){
    this.size += x;
    this.radius = Math.sqrt(this.size*10/Math.PI);
  }
}

module.exports = Segment;
