/*** camera.js  ***/

class Camera {
    constructor (x, y) {
      // x and y are top-left coordinates of the camera rectangle relative to the map.
      // This rectangle is exctaly cvs.width px wide and cvs.height px tall.
      this.x = x || 0
      this.y = y || 0
    }
    
    focus (cvs, map, player) {
      // Account for half of player w/h to make their rectangle centered
      this.x = this.clamp(player.x - cvs.width/2 + player.w/2, 0, map.w - cvs.width)
      this.y = this.clamp(player.y - cvs.height/2 + player.h/2, 0, map.h - cvs.height)

      //test to disable clamping:
      //this.x = player.x - cvs.width / 2 + player.w / 2, 0, map.w - cvs.width;
      //this.y = player.y - cvs.height / 2 + player.h / 2, 0, map.h - cvs.height;
    }
    
    clamp (coord, min, max) {
      if (coord < min) {
        return min
      } else if (coord > max) {
        return max
      } else {
        return coord
      }
    }
  }
  

const camera = new Camera();
  

const centerMap = () => {

    //camera.focus(cvs, map, player)
    //let canvas = document.getElementById('canvas');
    //let ctx = canvas.getContext('2d')

    let playerObj = {};
    playerObj.x = player.x;
    playerObj.y = player.y;
    playerObj.w = player.w;
    playerObj.h = player.h;

    let mapObj = {};
    mapObj.w = settings.map.w;
    mapObj.h = settings.map.h;

    ctx.setTransform(1, 0, 0, 1, 0, 0)
    //ctx.clearRect(0, 0, canvas.width, canvas.height)
    camera.focus(canvas, mapObj, playerObj)
    ctx.translate(-camera.x, -camera.y)
}


  
  