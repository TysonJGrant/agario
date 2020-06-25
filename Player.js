var Segment = require('./Segment.js');

class Player {
  constructor(w, h, cel) {
    this.w = w;
    this.h = h;
    this.image = cel;
    this.segments = [new Segment(w, h, Math.random()*(w-100)+50, Math.random()*(h-100)+50, 10, [1, 1, 1], cel)];
  }

  update_position(mouse_pos){
    for(this.i = 0; this.i < this.segments.length; this.i++){
      this.segments[this.i].update_position(mouse_pos);
    }
  }

  food_eaten(food_pos){
    for(this.i = 0; this.i < this.segments.length; this.i++){
      let current = this.segments[this.i];
      let xdist = Math.abs(current.xpos - food_pos[0]);
      let ydist = Math.abs(current.ypos - food_pos[1]);
      let dist = Math.sqrt( xdist * xdist + ydist * ydist );
      if(dist < current.radius*5){ //if touching food
        current.change_size(1);               //increase player size
        return true;
      }
    }
    return false;
  }

  split_cells(mouse_pos){
    for(this.i = this.segments.length-1; this.i >= 0; this.i--){
      let current = this.segments[this.i];
      if(current.size >= 50){
        console.log(mouse_pos);
        let vel = -((10 - Math.log(current.size*5))/5);
        let rise = mouse_pos[0] - current.xpos;
        let run = mouse_pos[1] - current.ypos;
        let angle = Math.atan2(rise, run) * (180 / Math.PI) + 90;
        if (angle < 0) angle = 360 + angle;   //range now 0-360
        let xspeed = -Math.cos(angle / (180 / Math.PI));
        let yspeed = -Math.sin(angle / (180 / Math.PI));
        this.segments.push(new Segment(this.w, this.h, current.xpos, current.ypos, Math.floor(current.size/2), [(4 + current.size/200), xspeed, yspeed], this.image))
        current.change_size(-Math.ceil(current.size/2));
      }
    }
  }

  eat_player(other_player){
    for(this.i = 0; this.i < this.segments.length; this.i++){
      let current = this.segments[this.i];
      for(this.j = 0; this.j < other_player.segments.length; this.j++){
        let other = other_player.segments[this.j];
        if(current.size > other.size){  //eat other player cell if big and close enough
          let xdist = Math.abs(current.xpos - other.xpos);
          let ydist = Math.abs(current.ypos - other.ypos);
          let dist = Math.sqrt( xdist * xdist + ydist * ydist )/5;
          if(dist < (current.radius - other.radius*(3/4))){ //eat player when very close
            current.change_size(other.size);
            other_player.eaten(this.j);
          }
        }
      }
    }
  }

  eaten(index){
    this.segments.splice(index, 1);     //Remove one element at index
    if(this.segments.length == 0)       //reset
      this.segments = [new Segment(this.w, this.h, Math.random()*(this.w-100)+50, Math.random()*(this.h-100)+50, 10, [1, 1, 1], this.image)];
  }
}

module.exports = Player;
