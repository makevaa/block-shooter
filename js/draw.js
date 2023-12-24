
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
    ctx.arc(x, y, w, 0, 2 * Math.PI, false);
    //ctx.arc(x-w/2, y-h/2, 5, 0, Math.PI * 2);

    ctx.closePath();
    ctx.fill();
}

const drawPlayer = () => {
    drawEntity(player)
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


// Draw all projectiles
const drawProjectiles = () => {
    for (const projectile of projectiles) {
        drawProjectile(projectile);
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