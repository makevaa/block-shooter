
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
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.moveTo(line.startX, line.startY);
    ctx.lineTo(line.endX, line.endY);

    ctx.strokeStyle = "red";
    ctx.stroke();
    ctx.closePath();
}


const drawLines = () => {
    for (const line of lines) {
        drawLine(line);
    }
}




const drawProjectiles = () => {
    for (const projectile of projectiles) {
        drawEntity(projectile);
    }
}
