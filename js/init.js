
const initCanvas = () => {
    window.devicePixelRatio=1; 

    const viewportW = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const viewportH = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
  
    const canvasW = viewportW;
    const canvasH = viewportH;
  
    const scale = window.devicePixelRatio;  


    canvas.width = Math.floor(canvasW * scale); 
    canvas.height = Math.floor(canvasH * scale); 

    //ctx.width = canvas.width;
    ctx.scale(scale, scale); 

    // Prevent right-click from opening context menu
    canvas.addEventListener('contextmenu', e => e.preventDefault())
}

const setFps = () => {
    settings.fps.interval = 1000 / settings.fps.limit;
    settings.fps.then = window.performance.now();

}



const init = () => {
    //init stuff
    //setDefaultCursor();
    entities.push(player);
    changeWeapon(1);

    setFps();
    initCanvas();
    collisionMap = createCollisionMap();

    testEnemy();

    setKeyboardControlListeners();
    setMouseListeners();

    
    moveEntity(player, 'x', canvas.width/2);
    moveEntity(player, 'y', canvas.height/2);
    //movePlayer(, canvas.height/2)
    

    window.requestAnimationFrame(gameLoop);
}

const gameLoop = timestamp => {
    //log(timestamp)

    // Keep requesting new frames
    window.requestAnimationFrame(gameLoop);


    const now = window.performance.now();
    const elapsed = now - settings.fps.then;




    if (elapsed > settings.fps.interval) {
        settings.fps.then = now - (elapsed % settings.fps.interval);
        
        //draw and process stuff
  
     

        objectLimiter();
        processControls();

        //processProjectiles();
        updateEntites();
  

        drawBgColor();

    
        updateCollisionMap();
        drawCollisionMap();
        checkCollision();

        drawPlayer();
        drawCrosshair();

        drawMouseLine();
        //drawLines();

        drawEntities();
    }
  



}


init();