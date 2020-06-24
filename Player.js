var Segment = require('./Segment.js');

class Player {
  constructor(w, h, cel) {
    this.w = w;
    this.h = h;
    this.image = cel;
    this.segments = [new Segment(w, h, Math.random()*(w-100)+50, Math.random()*(h-100)+50, 10, [1, 1, 1], cel)];
  }

  update_position(data){
    for(this.i = 0; this.i < this.segments.length; this.i++){
      this.segments[this.i].update_position(data);
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
      return false;
    }
  }

  split_cells(directions){
    for(this.i = this.segments.length-1; this.i >= 0; this.i--){
      let current = this.segments[this.i];
      this.segments.push(new Segment(this.w, this.h, current.xpos, current.ypos, Math.floor(current.size/2), [2.5, directions.xspeed, directions.yspeed], this.image))
      current.change_size(-Math.ceil(current.size/2));
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
          let dist = Math.sqrt( xdist * xdist + ydist * ydist );
          if(dist < (current.radius - other.radius*3/4)*5){ //eat player when very close
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
      this.segments = [new Segment(this.w, this.h, Math.random()*(this.w-100)+50, Math.random()*(this.h-100)+50, 10, 1, this.cel)];
  }
}

module.exports = Player;
