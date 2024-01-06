const bgSettings = {
    bg: {
        w: settings.map.w,
        h: settings.map.h,
        tileSize:1,
        color:'red',

        mist: { 
            ////both named color and hex with a # work
            //colors: ['dodgerblue','firebrick','DarkSlateBlue'], 
            colors: ['#2b420c','#302f1b', 'darkred', 'green'], 
            multiColor:true, 
            amount: 9000,
            radMin: 10, radMax: 250,
            opacity: 0.002,
        },
        layerCircles: { //random layered circles
            amount:2,
            layersMin:2,
            layersMax:4,
            radMin:30, radMax:150,
            opacity:0.2,
            lineWidth:1,
            colors :['red', 'orange', 'cyan'],
        },
        vignette: {
            draw:true,
            amount:300,
            radMin:10,
            radMax:150,
            color:'rgba(0, 0, 0, 0.05)',
            margin:0
        },
        dotStar: {
            amount:2000,
            color:'slategrey'
        },
        craters: {
            amount: { min: 100, max: 300},
            rad: { min: 50, max: 300},
            layers: { min: 10, max: 20},

            opa: 0.05,

        }
        
    }

}



const drawBgColor = () => {
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, settings.map.w, settings.map.h);
}

const xdrawBgColor = () => {
    let color = bgSettings.bg.color;
    let tSize = bgSettings.bg.tileSize;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, bgSettings.bg.w*tSize, bgSettings.bg.h*tSize);
}




const drawDotStars = () => {
    const size = bgSettings.bg.tileSize;
    let sizeMultiplier = 1;
    let color = bgSettings.bg.dotStar.color;
    let r = 255, g = 255, b = 255

    for (let i = 0; i < bgSettings.bg.dotStar.amount; i++) {
        let x = ranNum(0,bgSettings.bg.w);
        let y = ranNum(0,bgSettings.bg.h);
        let opa = Math.random();
        if (opa < 0.2) { opa = 0.2}
   
        //if (chance(1)) {  r = ranNum(100,255) }
        //if (chance(1)) {  g = ranNum(100,255) }
        //if (chance(1)) {  b = ranNum(100,255) }
        if (chance(0)) {  sizeMultiplier = 1.5 }

        color = `rgba(${r},${g},${b},${opa})`
        ctx.fillStyle = color;
        ctx.fillRect(x*size, y*size, size*sizeMultiplier, size*sizeMultiplier);
    }  
}



const drawCircles = () => {
    let amount = bgSettings.bg.circles.amount;
    let sizeMin = bgSettings.bg.circles.sizeMin;
    let sizeMax = bgSettings.bg.circles.sizeMax;
    let opa = bgSettings.bg.circles.opacity;
    let tSize = bgSettings.bg.tileSize;
    let lineWidth = bgSettings.bg.circles.lineWidth + tSize - 1;

    //const colors = ['red','lime','blue','orange']
    const colors = bgSettings.bg.circles.colors;
  
    for (let i = 0; i < amount; i++) {
        let rad = ranNum(sizeMin ,sizeMax)
        let x = ranNum(0-rad*0.4, bgSettings.bg.w+rad*0.4) * tSize;
        let y = ranNum(0, bgSettings.bg.h) * tSize;

        let color = selectFrom(colors);  
        color = colorNameToHex(color);
        color = hexToRgbaStr(color, opa);
        let fill = false;
        fill = (chance(0))
        circle(ctx, x, y, rad, color, fill, lineWidth);
    }
}

const drawLayerCircles = () => {
    const amount = bgSettings.bg.layerCircles.amount;
    const layerAmountMin = bgSettings.bg.layerCircles.layersMin;
    const layerAmountMax = bgSettings.bg.layerCircles.layersMax;
    const radMin = bgSettings.bg.layerCircles.radMin;
    const radMax = bgSettings.bg.layerCircles.radMax;
    const opa = bgSettings.bg.layerCircles.opacity;
    const lineWidth = bgSettings.bg.layerCircles.lineWidth;
    const colors = bgSettings.bg.layerCircles.colors;

    const tSize = bgSettings.bg.tileSize;

    for (let i = 0; i < amount; i++) {
        const rad = ranNum(radMin, radMax); 
        const origX = ranNum(rad, bgSettings.bg.w-rad) * tSize;
        const origY = ranNum(rad, bgSettings.bg.h-rad) * tSize;

        let color = selectFrom(colors);  
        color = colorNameToHex(color);
        color = hexToRgbaStr(color, opa);
        let fill = false;
        //fill = chance(50)
        const layerAmount = ranNum(layerAmountMin, layerAmountMax); 

        for (let j = 0; j < layerAmount; j++) {
            let x = origX, y = origY
            const layerRad =  rad - ( (rad/layerAmount) * j )

            if (j > 0) {
                const rem = (rad-layerRad)/2 
                x = ranNum( origX-rem, origX+rem ) ;
                y = ranNum( origY-rem, origY+rem );
            }
            circle(ctx, x, y, layerRad, color, fill, lineWidth);
        }  
    }
}

const drawLayerStars = () => {
    let amount = 1;
    let layerAmount = 5;
    let radMin = 100;
    let radMax = 100;
    let opa = 0.002;
    let tSize = bgSettings.bg.tileSize;
    let lineWidth = tSize + 1;

    let colors = ['red','green','blue','orange']

    colors = ['dodgerblue','lightcoral','steelblue','MidnightBlue','DarkSlateBlue', 'lavender']
    //const colors = ['red']
  
    for (let i = 0; i < amount; i++) {
        let rad = ranNum(radMin, radMax); 
        let x = ranNum(0,bgSettings.bg.w)*tSize;
        let y = ranNum(0,bgSettings.bg.h)*tSize;

        let color = selectFrom(colors);  
        color = colorNameToHex(color);
        color = hexToRgbaStr(color, opa);
        let whiteColor  = colorNameToHex('white');
        whiteColor= hexToRgbaStr(whiteColor,opa);
        let fill = true;
        
        //log( `rad: ${rad}` )
        for (let j = 0; j < layerAmount; j++) {
            //let linear =  rad - ( (rad/layerAmount) * j ) //linear
            let layerRad = (rad - ( (rad/layerAmount) * j ) ) * Math.log(j)
       
     
            let debug =  (rad/layerAmount) * j + (Math.log(0.1) ) 
            debug = (Math.log(0.1)) * (j*10) 
            if ( j > layerAmount - ( Math.round(layerAmount / 4) ) ) {
                color = whiteColor;
            }
            circle(ctx, x, y, layerRad, color, fill, lineWidth, 0.5);
        }
    }
}

const drawMist = () => {
    let amount = bgSettings.bg.mist.amount;
    let radMin = bgSettings.bg.mist.radMin;
    let radMax = bgSettings.bg.mist.radMax;
    let opa = bgSettings.bg.mist.opacity;
    //let color = bgSettings.bg.mist.color;
    //color = colorNameToHex(color);
    //color = hexToRgbaStr(color, opa);
    let tSize = bgSettings.bg.tileSize;

    let processedColors = []//for multicolor
    for (let i = 0; i < bgSettings.bg.mist.colors.length; i++) {
        let tempColor = bgSettings.bg.mist.colors[i];
        //if color is a name string instead of hex value, convert to hex
        if ( !tempColor.includes('#')) { tempColor = colorNameToHex(tempColor); }
       
   
        tempColor = hexToRgbaStr(tempColor, opa);
        processedColors.push(tempColor)
    }

    const themeColor1 = selectFrom(processedColors);
    processedColors = processedColors.filter(e => e !== themeColor1); //remove picked color
    const themeColor2 = selectFrom(processedColors);
    processedColors = processedColors.filter(e => e !== themeColor2);
    const themeColor3 = selectFrom(processedColors);
    const colorTheme = [themeColor1, themeColor2, themeColor3]
    

    for (let i = 0; i < amount; i++) {
        let rad = ranNum(radMin,radMax);
        //let x = ranNum(0-radMin*0.4,bgSettings.bg.w+radMin*0.4)*tSize;
        //let y = ranNum(0-radMin*0.4,bgSettings.bg.h+radMin*0.4)*tSize;
        let x = ranNum(0-rad*0.5,bgSettings.bg.w+rad*0.5)*tSize;
        let y = ranNum(0-rad*0.5,bgSettings.bg.h+rad*0.5)*tSize;
        //let x = ranNum(0, bgSettings.bg.w) * tSize;
        //let y = ranNum(0 ,bgSettings.bg.h) * tSize;

        if (bgSettings.bg.mist.multiColor) { 
            color = colorTheme[0];
            
            if (chance(50)) { 
                color = colorTheme[ranNum(1,colorTheme.length-1)]  
            }
        };
        //log("mist color index: " + color);
        //log("mist color index: " +  colorTheme.indexOf(color));

      
        circle(ctx, x, y, rad, color, true, 1);
    }
}

const drawVignette = () => {
    const amount = bgSettings.bg.vignette.amount;
    const radMin = bgSettings.bg.vignette.radMin;
    const radMax = bgSettings.bg.vignette.radMax;
    const color = bgSettings.bg.vignette.color;
    const margin = bgSettings.bg.vignette.margin;
    let rad, x, y;

    for (let i = 0; i < amount; i++) {
        //top
        rad = ranNum(radMin,radMax);
        x = ranNum(margin, bgSettings.bg.w-margin);
        circle(ctx, x, 0, rad, color, true, 1);

        //bottom
        rad = ranNum(radMin,radMax)
        x = ranNum(margin, bgSettings.bg.w-margin);
        //circle(ctx, x, bgSettings.bg.h, rad, color, true, 1);
    }

    for (let i = 0; i < amount / 2; i++) {
        //left
        rad = ranNum(radMin,radMax);
        y = ranNum(margin/2, bgSettings.bg.h-(margin/2));
        circle(ctx, 0, y, rad, color, true, 1);

        //right
        rad = ranNum(radMin,radMax)
        y = ranNum(margin/2, bgSettings.bg.h-(margin/2));
        circle(ctx, bgSettings.bg.w, y, rad, color, true, 1);
    }
}



const xdrawLines = () => {
    const amount = bgSettings.bg.lines.amount;
    const lenMin = bgSettings.bg.lines.lenMin;
    const lenMax = bgSettings.bg.lines.lenMax;
    const opa = bgSettings.bg.lines.opacity;
    const lineWidth = bgSettings.bg.lines.lineWidth;

    let color = bgSettings.bg.lines.color;
    color = colorNameToHex(color);
    color = hexToRgbaStr(color, opa);

    let processedColors = []
    for (let i = 0; i < bgSettings.bg.lines.colors.length; i++) {
        let tempColor = bgSettings.bg.lines.colors[i];
        tempColor = colorNameToHex(tempColor);
        tempColor = hexToRgbaStr(tempColor, opa);
        processedColors.push(tempColor)
    }

    const timer = ms => new Promise(res => setTimeout(res, ms))
    async function load() { // We need to wrap the loop into an async function for this to work
        for (let i = 0; i < amount; i++) {
            const len = ranNum(lenMin, lenMax);
            const startX = ranNum(0,bgSettings.bg.w);
            const startY = ranNum(0,bgSettings.bg.h);
            const endX = ranNum( startX-len, startX+len)
            const endY = ranNum( startY-len, startY+len)
            if (bgSettings.bg.lines.multiColor) { color = selectFrom(processedColors)};
            line(ctx, startX, startY, endX, endY, color, lineWidth);
            await timer(10); // then the created Promise can be awaited
        }
    }
    load();
}



const drawCrater = (x, y, rad, layers) => {
    
    const opa = bgSettings.bg.craters.opa;
    
 
    //ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${crater.opa})`;

    for (let i=0; i<=layers; i++) {
        ctx.beginPath();
        //ctx.arc(crater.x, crater.y, crater.radius/i, 0, Math.PI * 2);
        //ctx.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle);
        ctx.ellipse(x, y, rad/i, (rad/i)/4, 0, Math.PI*2, 0);
        ctx.closePath();
        ctx.fill();
    }
}

const drawCraters = () => {
    const amount = ranNum(bgSettings.bg.craters.amount.min, bgSettings.bg.craters.amount.max);

    ctx.fillStyle = `rgba(0, 0, 0, ${bgSettings.bg.craters.opa})`;

    for (let i=0; i<amount; i++) {
        const x = ranNum(0, settings.map.w);
        const y = ranNum(0, settings.map.h);
    
        const rad = ranNum(bgSettings.bg.craters.rad.min, bgSettings.bg.craters.rad.max);
        const layers = ranNum(bgSettings.bg.craters.layers.min, bgSettings.bg.craters.layers.max);
    
        drawCrater(x, y, rad, layers)
    }

}



const createBg = () => {
    drawBgColor();

    drawCraters();
    drawLayerStars();

    drawMist();

    //drawDotStars();

 
    //drawVignette();
}

const saveBg = () => {
    const img = new Image();
    img.src = canvas.toDataURL();
    bgImage = img;
}

const drawBgImage = () => {
	//stackoverflow.com/a/13879402
    //ctx.drawImage(bgImage,-0.5,-0.5);
    ctx.drawImage(bgImage, 0, 0);
}

let bgImage;