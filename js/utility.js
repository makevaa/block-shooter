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

