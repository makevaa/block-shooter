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
