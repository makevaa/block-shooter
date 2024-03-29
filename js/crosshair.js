


// Create crosshair image
const createCrosshair = (color) => {
    window.devicePixelRatio=1; 
    let canvasW = 200;
    let canvasH = 200;

    const scale = window.devicePixelRatio;  
    canvas.width = Math.floor(canvasW * scale); 
    canvas.height = Math.floor(canvasH * scale); 

    ctx.scale(scale, scale); 


    const lineW = 3; // Crosshair line width
    const rad = 40; // Crosshair circle radius
    const blockLen = 40; // Length of crosshair lines


    const x = canvasW/2;
    const y = canvasH/2;

    //ctx.setLineDash([0, 0]);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = lineW;
     

    
    // Save just the crosshair center image to separate image
    // Bug: trail is black, because the shadow is drawn later
    //than the red crosshair, and the black image is saved:
    ctx.font = '50px monospace';
    ctx.textAlign = 'center';
    let str = `☠`;
    //ctx.fillStyle = `rgba(255, 0, 0, 0.7)`;//hard-coded hack 
   
    //ctx.fillStyle = color;

    //if (crosshairCenter === undefined) {
        //let trailColor = 'lime';
        //ctx.fillStyle = trailColor;
        ctx.fillText(str, x+0.5, y+18, 50);
        ctx.fillStyle = color;

        const centerImage = new Image();
        centerImage.src = canvas.toDataURL();
        crosshairCenter = centerImage;
        
    //} else {
        //ctx.fillText(str, x+0.5, y+18, 50);
    //}
       

  

    //ctx.beginPath();
    //ctx.arc(x, y, rad, 0, Math.PI * 2);
    //ctx.stroke();
    //ctx.closePath();

    function draw_rectangle(x, y, w, h, deg){
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(degreesToRadians(deg+90));
        ctx.fillRect(-(w/2), -(h/2), w, h);
        ctx.restore();
    }

    // Draw 4 crosshair spikes
    for (let i=0; i<4; i++){
        let x2 = x + (rad)*Math.cos( degreesToRadians(i*90) );
        let y2 = y + (rad)*Math.sin( degreesToRadians(i*90) );

        let len = blockLen;

        // Make corssohait bottom spike longer and 
        if (i === 1) { 
            len += 40;
            y2 = y+20 + (rad)*Math.sin( degreesToRadians(i*90) );
        }
        draw_rectangle(x2, y2, lineW, len, i*90);
    }



    const img = new Image();
    img.src = canvas.toDataURL();
    return img;
}

let crosshairCenter;
const crosshair = createCrosshair(`rgba(255, 0, 0, 0.7)`);
const crosshairShadow = createCrosshair(`rgba(0, 0, 0, 0.7)`);
