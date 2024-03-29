/*** draw.js ***/






// Unmoving entity sprite, old style
const drawEntityImage = ent => {
    let img;

    ent.facingLeft ? img=ent.img.left : img=ent.img.right;
    let x = ent.x;
    let y = ent.y;


    let w = ent.w;
    let h = ent.h;
    let imgX = x - w/2
    let imgY = y - h/2
    //ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

    ctx.drawImage(img, 0, 0, img.width, img.height, imgX, imgY, w, h);

}

// Draw animation frame from spritesheet
const drawSheetFrame = (anim, ent) => {
    let x = ent.x;
    let y = ent.y;
    let w = ent.w;
    let h = ent.h;

    let scale = 1;
    if (ent instanceof Enemy) {
        scale = 1.5;
    }

    let sheet = anim.sheet;
    //let frames = anim.frames;
    let curFrame = anim.frame.current;
    
    let frameW = anim.frame.w;
    let frameH = anim.frame.h;

    let frameX = curFrame * frameW;
    let frameY = 0;

    // Center image on entity
    let imgX = x - (frameW*scale)/2
    let imgY = y - (frameH*scale)/2

    //ctx.scale(-1,1);
    //ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

    if (ent.flashing) {
        ctx.filter = "brightness(300%)";
        //ctx.filter = "contrast(0%)";
    }
    ctx.drawImage(sheet, frameX, frameY, frameW, frameH, imgX, imgY, frameW*scale, frameH*scale);
    ctx.filter = "brightness(100%)";
    //ctx.filter = "contrast(100%)";
   
    //ctx.strokeStyle = 'lime';
    //ctx.strokeRect(imgX, imgY, frameW, frameH)
    //ctx.setTransform(1,0,0,1,0,0);
    anim.step();
}

const drawEntityAnim = ent => {
    let side = 'left';
    if (!ent.facingLeft) { side = 'right' }

    let anim;
    let animBase;

    if (ent instanceof Player) 
        //animBase = images.player;
    
    if (ent instanceof Treant) {
        //animBase = images.enemy.treant;
    }



    if (ent.moving) {
        anim = ent.anim.run[side];
    } else if (ent.attacking) {
        anim = ent.anim.attack[side];
    } else { 
        if (ent.anim.idle !== undefined) {
            anim = ent.anim.idle[side];
        }
    }

    // Projectiles have only "left" and "right" side anims
    if (ent instanceof Projectile) {
        anim = ent.anim[side];
    }

    drawSheetFrame(anim, ent);
}




const drawEntity = ent => {
    ctx.fillStyle = ent.color;

    const x = ent.x;
    const y = ent.y;
    const w = ent.w;
    const h = ent.h;

    //ctx.fillRect(x, y, w, h)
    //ctx.fillRect(x-w/2, y-h/2, w, h);

    if (ent instanceof Enemy) {
        drawEntityAnim(ent);
        return true;
    }

    if (ent instanceof Player) {
        drawEntityAnim(ent);
        return true;
    }



    if (ent instanceof Sting) {
        drawEntityAnim(ent);
        return true;
    }



    //drawProjectile

    ctx.beginPath();
    ctx.arc(x, y, w/2, 0, 2*Math.PI, false);
    ctx.closePath();
    ctx.strokeStyle = "#29bfff";

    //ctx.fill();
    ctx.stroke();

}

const drawPlayer = () => {
    drawEntity(player);
}



const drawLine = line => {
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#29bfff";

    ctx.beginPath();
    ctx.moveTo(line.startX, line.startY);
    ctx.lineTo(line.endX, line.endY);
    ctx.closePath();
    ctx.stroke();
  
}

// Draw all lines
const drawLines = () => {
    for (const line of lines) {
        drawLine(line);
    }
}

const drawProjectile = proj => {
    ctx.fillStyle = proj.color;
    ctx.strokeStyle = proj.color;
    ctx.lineWidth = 1;

    const x = proj.x;
    const y = proj.y;
    const w = proj.w;
    const h = proj.h;



    if (proj instanceof Tracer) {
        //log('is tracer');
        const lineLen = 20;
        const deltaX = Math.cos(proj.dir); 
        const deltaY = Math.sin(proj.dir);

        //const pointX = deltaX * multi;
        //const pointY = deltaY * multi;

        const x2 =  x - lineLen*deltaX;
        const y2 =  y - lineLen*deltaY

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x2, y2)
        ctx.closePath();
        //ctx.fill() 
        ctx.stroke();

    } else {
        // Draw a default dot on projectile
        ctx.beginPath();
        ctx.arc(x-w/2, y-h/2, w, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
 
}


// Draw all entities
const drawEntities = () => {

    for (const ent of entities) {

        if (ent.dead) { continue; }

        // Don't draw entites outside of view
        if (isOutsideCamera(ent)) {
            //log('outside camera');
            continue;
        }

        if (ent instanceof Sting) {
            //drawEntity(ent);
            //drawSheetFrame(ent.anim.left, ent);
            drawEntity(ent)
       


        } else if (ent instanceof Projectile) {
            drawProjectile(ent);
        }



        if (ent instanceof Enemy) {
            drawEntity(ent);
        }

        if (ent instanceof Player) {
            drawEntityShadow(ent);
            drawEntity(ent);
        }

        // Draw box around entitites
        if (false) {
        
        }
    }
}

// Draw line from player to mouse
const drawMouseLine = () => {
    ctx.lineWidth = 1;
    ctx.strokeStyle = mouse.lineColor;

    ctx.beginPath();
    ctx.moveTo(mouse.x, mouse.y);
    //ctx.setLineDash([10, 10]);
    ctx.lineTo(player.x, player.y);
    ctx.stroke();
}



// Draw 2 crosshair images for shadow effect
const drawCrosshair = () => {
    const x = mouse.x - crosshair.width/2;
    const y = mouse.y - crosshair.height/2;

    //ctx.filter = "brightness(150%)";
    ctx.drawImage(crosshairShadow, x+2, y+2);
    ctx.drawImage(crosshair, x, y);
}

const drawCrosshairTrail = (trail) => {
    const x = trail.x - crosshair.width/2;
    const y = trail.y - crosshair.height/2;

    //ctx.filter = "brightness(150%)";
    //ctx.drawImage(crosshairShadow, x+2, y+2);
    ctx.globalAlpha = trail.opacity;
    ctx.drawImage(crosshairCenter, x, y);
    ctx.globalAlpha = 1;
}

const drawCrosshairTrails = () => {

    for (const trail of crosshairTrails) {

        drawCrosshairTrail(trail);
        trail.progress();
    }
}



const drawCollisionMap = () => {
    ctx.lineWidth = 1;
    //ctx.strokeStyle = "#262626";
    let tSize = collisionMap[0][0].end.x-collisionMap[0][0].start.x;

    for(let y=0; y<collisionMap.length; y++) {
        const row = collisionMap[y];

        for(let x=0; x<row.length; x++) {
            const tile = collisionMap[y][x];
            
            if (tile.entities.length > 0) {
                //log(`collisionTiles has entities: ${tile.entities.length}`);
            }

            if (tile.entities.length > 0) {
                ctx.strokeStyle = "#00994d";
            } else {
                ctx.strokeStyle = "#262626";
            }

            ctx.strokeRect(tile.start.x, tile.start.y, tSize, tSize);
        }
    }
}


const drawHits = () => {
    for (const blast of hitBlasts) {
        const x = blast.x;
        const y = blast.y;
        const radius = blast.radius;
    
        ctx.beginPath();
        //ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
        //ctx.arc(x-w/2, y-h/2, 5, 0, Math.PI * 2);
        ctx.closePath();

        let color = `rgba(${blast.color}, ${blast.opacity})`;
       
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.fill();
    }
}


const drawMuzzleFire = () => {
    for (const fire of muzzleFire) {
        //const x = fire.x;
        //const y = fire.y;
        const x = player.x + Math.cos(fire.dir)* player.w/2;
        const y = player.y + Math.sin(fire.dir)* player.h/2; 

  
        const radius = fire.radius;
  
    
        ctx.beginPath();
        //ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        ctx.arc(x, y, radius, 0, 2 * Math.PI, false);

        //ctx.moveTo(x, y);
        //ctx.lineTo(150, 0);
        //ctx.lineTo(75, 129.9);


        ctx.closePath();

        const color = `rgba(${fire.color}, ${fire.opacity})`;
       
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.fill();
    }
}

const drawStats = () => {
    let str;
    const color = `rgba(255, 51, 0, 0.5)`;
    ctx.fillStyle = color;
    ctx.textAlign = 'left';
    ctx.font = settings.debugFont;

    let x = camera.x+5;
    let y = camera.y+80;


    str = `  Kills: ${stats.kills}`;
    ctx.fillText( str, parseInt(x), parseInt(y) );

    str = `Enemies: ${waves.current.kills}/${waves.current.enemies}`;
    ctx.fillText(str, x, y+20);

    str = `   Wave: ${waves.current.num}`;
    ctx.fillText(str, x, y+40);

}

const drawCamera = () => {
    //ctx.beginPath();
    //ctx.arc(camera.x, camera.y, 30, 0, 2 * Math.PI, false);
    //ctx.closePath();
    //ctx.fillStyle = 'blue';
    //ctx.fill();

    let str = `camera ${camera.x}, ${camera.y}`
    const color = '#0362fc';
    ctx.fillStyle = color;
    ctx.font = settings.debugFont;
    ctx.fillText(str, camera.x+5, camera.y+50);
}

const drawMouseData = () => {
    let str = `mouse ${mouse.x}, ${mouse.y}`
    const color = 'green';
    ctx.fillStyle = color;
    ctx.font = settings.debugFont;
    ctx.fillText(str, camera.x+5, camera.y+150);

    str = `player ${player.x}, ${player.y}`
    ctx.fillText(str, camera.x+5, camera.y+170);
}

const drawPlayerData = () => {
    const color = 'green';
    ctx.fillStyle = color;
    ctx.font = settings.debugFont;
    let str;

    str = `lvl: ${player.level}`;
    ctx.fillText(str, camera.x+5, camera.y+200);

    str = `xp: ${player.xp}`
    ctx.fillText(str, camera.x+5, camera.y+220);

  

    str = `xp to lvl: ${player.xpToLevel}`;
    ctx.fillText(str, camera.x+5, camera.y+240);

}


const drawEntityShadow = ent => {
    ctx.fillStyle = 'rgba(0,0,0, 0.7)';

    const x = ent.x;
    const y = ent.y + ent.h*0.55;

    let w = ent.w * 0.4;
    const h = ent.h / 8;

    if (player.moving) {
        w = ent.w * 0.5;
    }
   

    ctx.beginPath();
    //ctx.arc(x, y, w/2, 0, 2*Math.PI, false);
    ctx.ellipse(x, y, w, h, degreesToRadians(0), 2*Math.PI, false)
    ctx.closePath();
    //ctx.strokeStyle = "#29bfff";

    ctx.fill();
    //ctx.stroke();
}


const drawFloatText = floatText => {
    //let x = explo.npc.x*tSize, y = explo.npc.y*tSize;
    //let endX = arc.endX, endY = arc.endY;
    //let frames = blast.frames;
    let content = floatText.content;
    //content = "★" // ✖ ☠ █ ▲ ★

    let opa = floatText.opacity;
    let r = 200, g = 200, b = 200;
    const color = `rgba(${r}, ${g}, ${b}, ${opa})`;
    const shadowColor =  `rgba(${0}, ${0}, ${0}, ${opa})`;

    ctx.strokeStyle = color;
    ctx.fillStyle = color;

 

    const x = floatText.x + floatText.offsetX;
    const y = floatText.y+ floatText.offsetY; 
    ctx.fillStyle = shadowColor;
    ctx.fillText(content,  x+2, y+2);
    ctx.fillStyle = color;
    ctx.fillText(content,  x, y);
}


const drawFloatTexts = () => {
    ctx.font = '800 1.1em monospace';
    ctx.textAlign = 'center'

    //let now, elapsed;

    for (const text of floatTexts) {

        drawFloatText(text);
        text.progress();
    }
}

const drawPlayerHealthBar = () => {
    const maxW = 50;
    const x = player.x - maxW/2;
    const y = player.y + 30;

    let w = maxW * player.hp/player.maxHp;
    if (w < 0) { w = 0; }

    const h = 5


    ctx.lineWidth = 1;

    ctx.strokeStyle = "black";
    ctx.strokeRect(x-1, y-1, maxW+1, h+1);

    
    ctx.fillStyle = "red";
    ctx.fillRect(x, y, w, h);
}

// xp to next level is needed

const setXpBar = () => {
    const xpToLevel = player.xpToLevel;
    const w = (player.xp/xpToLevel)*100;
    xpBarElem.style.width = `${w}%`;
}

const drawSideBars = () => {
    const w = 400;
    ctx.fillStyle = 'black';

    // Left bar
    ctx.fillRect(camera.x, camera.y, w, canvas.height);

    // Right bar
    ctx.fillRect(camera.x+canvas.width-w, camera.y, w, canvas.height);
}

const showSidebarImages = () => {
    const imgs = document.querySelectorAll('.sidebar > .image-container');
    for (const img of imgs) {
        img.style.opacity = 1;
    }
}

