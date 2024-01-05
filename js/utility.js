const changeCursor = cursor => {
    document.body.style.cursor = `url('${cursor}'),auto`;
  
}  

const setDefaultCursor = () => {
    const cursorObj = new Image();
    const cursorImage = 'img/crosshair.svg'; 
    cursorObj.src = cursorImage;
    changeCursor(cursorImage);
}

const degreesToRadians = degrees => { return degrees * Math.PI / 180; }
const radiansToDegrees = radians => { return radians * 180 / Math.PI; }


const ranNum = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const selectFrom = arr => {
    return arr[ranNum(0, arr.length-1)];
}

const chance = percent => {
   return ( ranNum(1,100) <= percent );
}




// Overlap function by simhumileco: https://stackoverflow.com/a/54323789
const intersects = (rect1, rect2) => {

    const top1 = rect1.end.y;
    const bottom1 = rect1.start.y;
    const left1 = rect1.start.x;
    const right1 = rect1.end.x;

    const top2 = rect2.end.y;
    const bottom2 = rect2.start.y;
    const left2 = rect2.start.x;
    const right2 = rect2.end.x;


    return !(top1 < bottom2 || top2 < bottom1 || right1 < left2 || right2 < left1);

}

// Distance between 2 points;
const distBetween = (x1, y1, x2, y2) => {
    const a = x1 - x2;
    const b = y1 - y2;
    const c = Math.sqrt( a*a + b*b );
    return c;
}

const distBetweenEntities = (ent1, ent2) => {
    return distBetween(ent1.x, ent1.y, ent2.x, ent2.y)
}

const deltaBetween = (x1, y1, x2, y2) => {
    const a = x1 - x2;
    const b = y1 - y2;
    //const c = Math.sqrt( a*a + b*b );
    return [a, b];
}


const circle = function(context, x, y, r, color, fill, lineWidth, globalAlpha = 1) {
    context.globalAlpha = globalAlpha;
    context.fillStyle = color;
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI * 2);
    fill ? context.fill() :  context.stroke();
    context.globalAlpha = 1;
    context.closePath();
  }