
const drawBgColor = () => {
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

const drawEntity = ent => {
    ctx.fillStyle = ent.color;

    //ctx.fillRect(x, y, w, h)
    ctx.fillRect(ent.x, ent.y, ent.w, ent.h);

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


// Draw all projectiles
const drawProjectiles = () => {
    for (const projectile of projectiles) {
        drawEntity(projectile);
    }
}

// Draw line from player to mouse
const drawMouseLine = () => {
    ctx.lineWidth = 1;
    ctx.strokeStyle = mouse.lineColor;

    ctx.beginPath();
    ctx.moveTo(player.x, player.y);
    ctx.setLineDash([10, 10]);
    ctx.lineTo(mouse.x, mouse.y);
    ctx.stroke();
    //ctx.stroke();
    
    return true
    // Solid line
    ctx.beginPath();
    ctx.setLineDash([]);
    ctx.moveTo(0, 100);
    ctx.lineTo(300, 100);
    ctx.stroke();
}

// Draw cross hair on mouse position
const drawCrosshair = () => {
    const lineW = 3; // Crosshair line width
    const rad = 20; // Crosshair circle radius
    const blockLen = 20; // Length of crosshair lines
    const color = `rgba(${255}, ${0}, ${0}, ${0.3})`; // Crosshair color

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