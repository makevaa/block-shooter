//mouse.js
const mouse = {
    x:-1, y:-1, isDown:false,
}

const setMouseListeners = () => {

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    canvas.addEventListener('mousemove', function(e) {
        //log(e);
        //where mouse is on the canvas
        let x = e.layerX | 0; 
        let y = e.layerY | 0;

        x = e.layerX // + settings.grid.offset.x
        y = e.layerY // + settings.grid.offset.y


        mouse.x = x;
        mouse.y = y;
     
    });

    canvas.addEventListener('mousedown', e => {
        player.shoot();
        mouse.isDown = true;

    });

    canvas.addEventListener('mouseup', e => {
        mouse.isDown = false;
    });

    
}



