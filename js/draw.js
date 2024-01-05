/*** draw.js ***/







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


const drawSheetFrame = (anim, x, y, w, h) => {

    let sheet = anim.sheet;
    //let frames = anim.frames;
    let curFrame = anim.frame.current;
    let frameW = anim.frame.w;
    let frameH = anim.frame.h;

    let frameX = curFrame * frameW;

    // Center image on entity
    let imgX = x - frameW/2
    let imgY = y - frameH/2

    //ctx.scale(-1,1);
    //ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    ctx.drawImage(sheet, frameX, 0, frameW, frameH, imgX, imgY, frameW, frameH);
    //ctx.setTransform(1,0,0,1,0,0);
}

const drawPlayerImage = ent => {
    let side = 'left';
    if (!ent.facingLeft) { side = 'right' }

    let anim;

    if (player.moving) {
    
        anim = images.player.run[side].anim;

    } else if (player.attacking) {
        anim = images.player.attack[side].anim;
        
    } else { 
        anim = images.player.idle[side].anim;
    }

    let x = ent.x;
    let y = ent.y;


    let w = ent.w;
    let h = ent.h;
    let imgX = x - w/2
    let imgY = y - h/2

    drawSheetFrame(anim, x, y, w, h);
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
        drawEntityImage(ent);
        return true;
    }

    if (ent instanceof Player) {
        drawPlayerImage(ent);
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
            ctx.strokeStyle = "#29bfff";
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

// Draw cross hair on mouse position
const drawCrosshair = () => {
    const lineW = 3; // Crosshair line width
    const rad = 20; // Crosshair circle radius
    const blockLen = 20; // Length of crosshair lines


    let color = `rgba(${255}, ${0}, ${0}, ${0.5})`; // Crosshair color
    if (mouse.isDown) {
        //color = `rgba(${0}, ${255}, ${0}, ${0.99})`; 
    }

    const x = mouse.x 
    const y = mouse.y 

    //ctx.setLineDash([0, 0]);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = lineW;

    ctx.beginPath();
    ctx.arc(x, y, rad, 0, Math.PI * 2);
    ctx.stroke();
    ctx.closePath();

    function draw_rectangle(x, y, w, h, deg){
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(degreesToRadians(deg+90));
        ctx.fillRect(-1*(w/2), -1*(h/2), w, h);
        ctx.restore();
    }

    for (let i=0; i<4; i++){
      var x2 = x + (rad)*Math.cos( degreesToRadians(i*90) );
      var y2 = y + (rad)*Math.sin( degreesToRadians(i*90) );
      //ctx.fillStyle = 'red';
      draw_rectangle(x2, y2, lineW, blockLen, i*90);
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