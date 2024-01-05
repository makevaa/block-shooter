/*** init.js ***/

const initCanvas = () => {
    window.devicePixelRatio=1; 
    const viewportW = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const viewportH = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
  
    let canvasW = viewportW;
    let canvasH = viewportH;

    //canvasW = 5000;
    //canvasH = 2000;
    
    //const ctx = canvas.getContext('2d');  // testing this line
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

const setTexture = (name) => {
    const left = new Image();
    const right = new Image();

    const leftImg = `${images.path}${images.enemy[name].files.left}`;
    left.src = leftImg;

    const rightImg = `${images.path}${images.enemy[name].files.right}`;
    right.src = rightImg;

    images.enemy[name].left = left;
    images.enemy[name].right = right;

}

setPlayerTextures = () => {
    const idleLeft = new Image();
    const idleRight = new Image();

    let img;
    img = `${images.path}${images.player.idle.files.left}`;
    idleLeft.src = img;
    images.player.idle.left = idleLeft;

    img = `${images.path}${images.player.idle.files.right}`;
    idleRight.src = img;
    images.player.idle.right = idleRight;


}

const setTextures = () => {
    setTexture('treant');
    setTexture('lich');

    //setPlayerTextures();
    /*
    for (const npc of game.npcTypes) {
        setNpcTexture(game.images.npc[npc]);
    }
    */
}

const setSheetAnimations = () => {
    let img;
    //new sheetAnim(img, frames, frameW, frameH, frameMs);

    // Idle animations
    img = new Image();
    img.src = `${images.path}${images.player.idle.left.sheet}`;
    images.player.idle.left.anim = new sheetAnim(img, 4, 38, 48, 120);

    img = new Image();
    img.src = `${images.path}${images.player.idle.right.sheet}`;
    images.player.idle.right.anim = new sheetAnim(img, 4, 38, 48, 120);

 
    // Run animations
    img = new Image();
    img.src = `${images.path}${images.player.run.left.sheet}`;
    images.player.run.left.anim = new sheetAnim(img, 12, 66, 48, 70);

    img = new Image();
    img.src = `${images.path}${images.player.run.right.sheet}`;
    images.player.run.right.anim = new sheetAnim(img, 12, 66, 48, 70);
   

    // Attack animations
    img = new Image();
    img.src = `${images.path}${images.player.attack.left.sheet}`;
    images.player.attack.left.anim = new sheetAnim(img, 6, 96, 48, 70);

    img = new Image();
    img.src = `${images.path}${images.player.attack.right.sheet}`;
    images.player.attack.right.anim = new sheetAnim(img, 6, 96, 48, 70);

}


const initBg = () => {
    window.devicePixelRatio=1; 
    let canvasW = settings.map.w;
    let canvasH = settings.map.h;

    const scale = window.devicePixelRatio;  
    canvas.width = Math.floor(canvasW * scale); 
    canvas.height = Math.floor(canvasH * scale); 

    ctx.scale(scale, scale); 

    createBg();
	ctx.translate(.5,.5); 
    saveBg();
}


const init = () => {

    //setDefaultCursor();
    initBg();
    setTextures();
    setSheetAnimations();

    player = new Player(0, 0, settings.player.size, settings.player.size, settings.player.color);
    
    entities.push(player);
    changeWeapon(1);
    player.speed = settings.player.speed;

    setFps();
   

    initCanvas();



    collisionMap = createCollisionMap();

    //testEnemy();
  
    

    setKeyboardControlListeners();
    setMouseListeners();

    // Move player to middle of map on start
    moveEntity(player, 'x', settings.map.w/2);
    moveEntity(player, 'y', settings.map.h/2);
    //movePlayer(, canvas.height/2)
    centerMap();

    enemySpawner();

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
  
        processControls();

        enemySpawner();
        objectLimiter();

        updateEntites();
       
  
    
  

        drawBgColor();
        drawBgImage();

    
        updateCollisionMap();
        if (settings.draw.collisionMap) { drawCollisionMap(); }
        checkCollision();

        drawMouseLine();
     


        //drawLines();

        drawEntities();
        drawHits();
        drawMuzzleFire();

    
        drawCrosshair();

        drawStats();

        if (settings.draw.camera) { drawCamera(); }
        if (settings.draw.debugData) { drawMouseData(); }

        
       
    }
  



}


init();