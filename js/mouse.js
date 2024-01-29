//mouse.js
const mouse = {
    x:-1, y:-1, isDown:false,
    lineColor:'#4d4d4d',
    playerOffset: {
        x:-1, y:-1
    }
}

const crosshairTrailSettings = {
    interval: 30, //ms, save trail interval
    last: window.performance.now(),
}

const updateMouse = (x, y) => {
    mouse.x = x;
    mouse.y = y;
    
    // Offset actualyl from camera (not player)
    // to keep mouse in right position while player moves
    const deltas = deltaBetween(mouse.x, mouse.y, camera.x, camera.y);
    mouse.playerOffset.x = deltas[0];
    mouse.playerOffset.y = deltas[1];



    if (mouse.x < player.x) {
        player.facingLeft = true;
    } else {
        player.facingLeft = false;
    }

      // interval to save crosshair trail
      const now = window.performance.now();
      const elapsed = now - crosshairTrailSettings.last;

      if (elapsed > crosshairTrailSettings.interval) {
          crosshairTrailSettings.last = now;
          //crosshairTrails.push( new CrosshairTrail(x, y))
      }
    
}



const setMouseListeners = () => {


    canvas.addEventListener('mousemove', e => {
        //log(e);
        //where mouse is on the canvas
        let x = e.offsetX + camera.x;
        let y = e.offsetY + camera.y;

        

        //x =+ player.x;
        //y =+ player.y;
        updateMouse(x, y);
    });


 
    document.getElementById('xp-bar-container').addEventListener('mousemove', e => {
        let x = e.offsetX + camera.x;
        let y = e.offsetY + camera.y;
        updateMouse(x, y);
    });

    /*
    document.getElementById('left').addEventListener('mousemove', e => {
        let x = e.offsetX + camera.x;
        let y = e.offsetY + camera.y;
        updateMouse(x, y);
    });
    */

    document.body.addEventListener('mousemove', e => {
        let x = e.offsetX + camera.x;
        let y = e.offsetY + camera.y;
        //updateMouse(x, y);
    });

    canvas.addEventListener('mousedown', e => {
        mouse.isDown = true;

    });

    canvas.addEventListener('mouseup', e => {
        mouse.isDown = false;
    });






    
}



