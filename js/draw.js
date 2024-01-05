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
}

const drawEntityAnim = ent => {
    let side = 'left';
    if (!ent.facingLeft) { side = 'right' }

    let anim;
    let animBase;

    if (ent instanceof Player) 
        animBase = images.player;
    
    if (ent instanceof Treant) {
        animBase = images.enemy.treant;
    }
        
    

    if (ent.moving) {
        anim = animBase.run[side].anim;
    } else if (ent.attacking) {
        anim = animBase.attack[side].anim;
    } else { 
        anim = animBase.idle[side].anim;
    }

    let x = ent.x;
    let y = ent.y;
    let w = ent.w;
    let h = ent.h;

    //let imgX = x - w/2
    //let imgY = y - h/2

    drawSheetFrame(anim, ent);
    anim.step();
    //ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    //ctx.drawImage(img, 0, 0, img.width, img.height, imgX, imgY, w, h);
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
    ctx.stroke();
    ctx.closePath();
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

        if(ent.dead) { continue; }

        // Don't draw entites outside of view
        if (isOutsideCamera(ent)) {
            //log('outside camera');
            continue;
        }

        if (ent instanceof Projectile) {
            drawProjectile(ent);
        }

        if (ent instanceof Enemy) {
            drawEntity(ent);
        }

        if (ent instanceof Player) {
            drawEntityShadow(ent);
            drawPlayer(ent);
            
        }

        // Draw box around entitites
        if (false) {
            ctx.lineWidth = 1;
            ctx.strokeStyle = "red";
            ctx.strokeRect(ent.x-ent.w/2, ent.y-ent.h/2, ent.w, ent.h);
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
    ctx.font = "30px monospace";

    let x = camera.x+5;
    let y = camera.y+80;


    str = `  Kills: ${stats.kills}`;
    ctx.fillText(str, x, y);

    str = `Enemies: ${waves.current.kills}/${waves.current.enemies}`;
    ctx.fillText(str, x, y+40);

    str = `   Wave: ${waves.current.num}`;
    ctx.fillText(str, x, y+80);

}

const drawCamera = () => {
    ctx.beginPath();
    ctx.arc(camera.x, camera.y, 30, 0, 2 * Math.PI, false);
    ctx.closePath();
    ctx.fillStyle = 'blue';
    ctx.fill();

    let str = `camera ${camera.x}, ${camera.y}`
    const color = '#0362fc';
    ctx.fillStyle = color;
    ctx.font = "30px monospace";
    ctx.fillText(str, camera.x+5, camera.y+30);
}

const drawMouseData = () => {
    let str = `mouse ${mouse.x}, ${mouse.y}`
    const color = 'green';
    ctx.fillStyle = color;
    ctx.font = "30px monospace";
    ctx.fillText(str, camera.x+5, camera.y+200);

    str = `player ${player.x}, ${player.y}`
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