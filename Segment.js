class Segment {
  constructor(w, h, xpos, ypos, size, accel, cel) {
    this.w = w;
    this.h = h;
    this.xpos = xpos
    this.ypos = ypos
    this.size = size;
    this.accel = accel;       //acceleration multiplier, xspeed and yspeed
    this.radius = Math.sqrt(this.size*10/Math.PI);
    this.image = cel;
  }

  update_position(mouse_pos){
    let vel = ((10 - Math.log(this.size*5))*2);
    if(this.accel[0] > 1){
      this.xpos += this.accel[1]*vel*this.accel[0];
      this.ypos -= this.accel[2]*vel*this.accel[0];
      this.accel[0] -= 0.1;
    }
    else{
      let rise = mouse_pos[0] - this.xpos;
      let run = mouse_pos[1] - this.ypos;
      let angle = Math.atan2(rise, run) * (180 / Math.PI) + 90;
      if (angle < 0) angle = 360 + angle;   //range now 0-360
      let xspeed = Math.cos(angle / (180 / Math.PI));
      let yspeed = Math.sin(angle / (180 / Math.PI));
      this.xpos -= xspeed*vel;
      this.ypos += yspeed*vel;
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
