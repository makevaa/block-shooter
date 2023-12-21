const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const log = console.log;

const settings = {
    player: {
        size: 20,
        color:'green'
    },
    fps: { limit:60 },


}

const data = {
 
}

const lines = [];
const projectiles = [];


class Line {
    constructor(startX, startY, endX, endY) {
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;

    }
}

class Entity {
    constructor(x, y, w, h, color) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = color;

        this.shoot = () => {

            let direction = Math.atan2(mouse.y - this.y, mouse.x - this.x);
            // could add bullet spread here
            projectiles.push( new Projectile(this.x, this.y, direction) );



            lines.push(new Line (this.x, this.y, mouse.x, mouse.y) )
            
            if (lines.length > 20) {
                lines.shift();
            }

        }
    }
}

const player = new Entity(50, 50, settings.player.size, settings.player.size, settings.player.color);



class Projectile {
    constructor(x, y, dir) {
        this.x = x;
        this.y = y;
        this.dir = dir;
        this.w = 5;
        this.h = 5;
        this.color = 'red';
    }

    // Move projectile
    move() {
        const speed = 100
        const multi = speed / 10;
        const dist = 10; //length of bullet tracer line

        const deltaX = Math.cos(this.dir); 
        const deltaY = Math.sin(this.dir);

        const pointX = deltaX * multi;
        const pointY = deltaY * multi;

        /*
        this.tracer.x1 +=  pointX;
        this.tracer.y1 +=  pointY;
        this.tracer.x2 =  this.tracer.x1 - dist*deltaX;
        this.tracer.y2 =  this.tracer.y1 - dist*deltaY
        */

        this.x = this.x + pointX;
        this.y = this.y + pointY;
    }
}

class Tracer extends Projectile {
    constructor(x, y) {
        this.x = x;
        this.y = y;


  

       
        this.tracer = { 
            x1:this.x, y1:this.y, x2:this.x, y2:this.y
          }
    }

    
}





const moveEntity = (ent, axis, val) => {
    ent[axis] = ent[axis]+val;
}


const processProjectiles = () => {
    for (const projectile of projectiles) {
        projectile.move();

        log(projectile.x)
    }
} 

const objectIsOutsideCanvas = (obj) => {
    let isOutside = false;

    if (obj.x < 0 || obj.x > canvas.width ||
        obj.y < 0 || obj.y > canvas.height) {
        isOutside = true;
    }


    return isOutside;
}

const objectLimiter = () => {
    
    for (let i=0; i<projectiles.length; i++) {
        const proj = projectiles[i];
        // Remove from index, 
        if (objectIsOutsideCanvas(proj)) {
            projectiles.splice(i, 1);
            i--;
        }
    }



}













