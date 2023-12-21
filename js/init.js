
const initCanvas = () => {
    window.devicePixelRatio=1; 
  
    const viewportW = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const viewportH = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
    //settings.viewport.w = viewportW;
    //settings.viewport.h = viewportH;

    const canvasW = viewportW;
    const canvasH = viewportH;
  
    const scale = window.devicePixelRatio;  


    canvas.width = Math.floor(canvasW * scale); 
    canvas.height = Math.floor(canvasH * scale); 
    ctx.scale(scale, scale); 
}

const init = () => {
   //init stuff
   initCanvas();
   setKeyboardControlListeners();
   setMouseListeners();

    window.requestAnimationFrame(gameLoop);
}

const gameLoop = timestamp => {
    //draw and process stuff

    drawBgColor();
    processControls();
    processProjectiles();
    drawPlayer();
    drawLines();
    drawProjectiles();


    // Keep requesting new frames
    window.requestAnimationFrame(gameLoop);
}


init();