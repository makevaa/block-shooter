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
    //setTexture('treant');
    //setTexture('lich');

    //setPlayerTextures();
    /*
    for (const npc of game.npcTypes) {
        setNpcTexture(game.images.npc[npc]);
    }
    */
}


const getSheetAnim = (sheet, frames, frameW, frameH, frameMs) => {
    const img = new Image();
    img.src = `${images.path}${sheet}`;

    const anim = new sheetAnim(img, frames, frameW, frameH, frameMs);
    return anim;
    //target.anim = new sheetAnim(img, frames, frameW, frameH, frameMs);
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
	//ctx.translate(.5,.5); 
    saveBg();
}


const init = () => {

    //setDefaultCursor();
    createCrosshair();
    initBg();
  

    setTextures();
    //setSheetAnimations();

    player = new Player(0, 0, settings.player.size, settings.player.size, settings.player.color);
    
    entities.push(player);
    changeWeapon(1);
    player.speed = settings.player.speed;


   

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

// Update game logic
const update = (frameDur) => {
    processControls();
    enemySpawner();
    objectLimiter();
    updateEntites();
    updateCollisionMap();
    checkCollision();
}

// Draw everything
const render = () => {

    drawBgImage();
        
    drawEntities();

    drawHits();
    drawMuzzleFire();

    drawMouseLine();
    drawCrosshair();

    drawPlayerHealthBar();

    drawStats();

    if (settings.draw.debugData) { 
        drawCamera();
        drawMouseData(); 
        drawPlayerData();
        //drawCollisionMap();
    }
}

// Timestamp ("now") is same as performance.now();
const gameLoop = now => {

    // Keep requesting new frames
    window.requestAnimationFrame(gameLoop);

    //const now = window.performance.now();
    //const now = timestamp;

    const elapsed = now - perf.prevTime;
    perf.prevTime = now;

    perf.accumulatedFrameTime += elapsed;

    let numberOfUpdates = 0;

    while (perf.accumulatedFrameTime >= perf.frameDuration) {
        update(perf.frameDuration);
        perf.accumulatedFrameTime -= perf.frameDuration;
        numberOfUpdates++; 

            // do a sanity check
    if (numberOfUpdates++ >= 200) {
        perf.accumulatedFrameTime = 0;
        //restoreTheGameState();
        log('broke away with sanity check')
        break;
      }
    }

    // this is a percentage of time
    const interpolate = perf.accumulatedFrameTime / perf.frameDuration;
    render(interpolate);

    //if (elapsed > perf.frameDuration) {
        //perf.prevTime = now - (elapsed % perf.frameDuration);
        //render(interpolate);
      
    //}


}


init();