
const drawBgColor = () => {
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

const drawEntity = ent => {
    ctx.fillStyle = ent.color;

    const x = ent.x;
    const y = ent.y;
    const w = ent.w;
    const h = ent.h;

    //ctx.fillRect(x, y, w, h)
    //ctx.fillRect(x-w/2, y-h/2, w, h);

    ctx.beginPath();
    //ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    ctx.arc(x, y, w/2, 0, 2 * Math.PI, false);
    //ctx.arc(x-w/2, y-h/2, 5, 0, Math.PI * 2);

    ctx.closePath();
    ctx.fill();
}

const drawPlayer = () => {
    drawEntity(player);
}



const drawLine = (line) => {
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

        if (ent instanceof Projectile) {
            drawProjectile(ent);
        }

        if (ent instanceof Enemy) {
            drawEntity(ent);
        }

        if (ent instanceof Player) {
            drawPlayer(ent);
        }

        // Draw box around entitites
        if (true) {
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


