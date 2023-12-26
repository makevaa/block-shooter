const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const log = console.log;

const settings = {
    player: {
        size: 40,
        color:'green'
    },
    fps: { limit:60 },
}

const lines = [];
const projectiles = [];
const entities = [];

let collisionMap;


class CollisionTile {
    constructor(startX, startY, endX, endY) {
        this.start = {};
        this.end = {}
        this.start.x = startX;
        this.start.y = startY;
        this.end.x = endX;
        this.end.y = endY;

        this.entities = [];
    }

}

const createCollisionMap = () => {
    let map = []
    const tSize = 40; //tile size

    let tilesH =  canvas.width/tSize // tile amount, hori
    let tilesV = canvas.height/tSize//vertical

    tilesH = Math.ceil(tilesH); 
    tilesV = Math.ceil(tilesV); 

    for (let y=0; y<tilesV; y++) {

        let row = []

        for(let x=0; x<tilesH; x++) {

            //constructor(startX, startY, endX, endY) 
            let startX = x*tSize;
            let startY = y*tSize;
            let endX = startX + tSize;
            let endY = startY + tSize;
            
            let tile = new CollisionTile(startX, startY, endX, endY);

            row.push(tile);
        }

        map[y] = row;

    }

    return map;
}

const updateCollisionMap = () => {
    clearCollisionMap();
    let tSize = 40;

    for (let y=0; y<collisionMap.length; y++) {
        let row = collisionMap[y];

        for(let x=0; x<row.length; x++) {
            let tile = collisionMap[y][x];

            for (const ent of entities) {
                // Calculate rectangle area for entity
                const entRect = { start:{x,y}, end:{x,y}};
                entRect.start.x = ent.x-ent.w/2;
                entRect.end.x = ent.x+ent.w/2;
                entRect.start.y = ent.y-ent.h/2;
                entRect.end.y = ent.y+ent.h/2;

                if ( intersects(tile, entRect) ) {
                    //entity is partially inside this tile
                    tile.entities.push(ent);
                }

            }

        }
    }
}

const clearCollisionMap = () => {
    for(let y=0; y<collisionMap.length; y++) {
        let row = collisionMap[y];

        for(let x=0; x<row.length; x++) {
            let tile = collisionMap[y][x];
            tile.entities = [];

        }
    }
}


const getEntityBoundingBox = ent => {
    const entRect = { 
        start: {
            x:-1, y:-1
        }, 
        end: {
            x:-1 ,y:-1
        }
    };
    entRect.start.x = ent.x-ent.w/2;
    entRect.end.x = ent.x+ent.w/2;
    entRect.start.y = ent.y-ent.h/2;
    entRect.end.y = ent.y+ent.h/2;
    return entRect;
}


// Need to keep track of which entity pairs have
// already had a collision, to prevent doubles

const checkCollision = () => { 
    const pairsChecked = new Map();
    // key : value
    // id1|id2 : true
    // id2|id1 : true

 
    for (let i=0; i<collisionMap.length; i++) {
        const row = collisionMap[i];

        for (let j=0; j<row.length; j++) {
            const tile = collisionMap[i][j];

            // Loop each entitiy in tile
            for (const ent of tile.entities) {
                //let id = ``;
                        
             

                // Loop entities again to check for collisions
                for (const entToCheck of tile.entities) {

                    //need to be sure not to check against the entity itself
                    
                    if (ent.id === entToCheck.id) {
                        break;
                    } 

                    if ( pairsChecked.get(`${ent.id}|${entToCheck.id}`) ||
                         pairsChecked.get(`${entToCheck.id}|${ent.id}`) ) {
                        // Pair has already been checked, ignore
                        //log('pairs checked already')
                        continue;
                    } else {
                        //set the pair as checked, both ways
                        pairsChecked.set(`${ent.id}|${entToCheck.id}`, true);
                        pairsChecked.set(`${entToCheck.id}|${ent.id}`, true);
                    }



                    const entBox1 = getEntityBoundingBox(ent);
                    const entBox2 = getEntityBoundingBox(entToCheck);


                    if ( intersects(entBox1, entBox2) ) {


                        // Ignore friendly fire
                        if (ent instanceof Player && 
                            entToCheck instanceof Projectile && 
                            entToCheck.friendly ||
                            entToCheck instanceof Player && 
                            ent instanceof Projectile && 
                            ent.friendly ) {
                            log('Friendly fire.');
                            continue;
                        }

                        // Check for a more accurate collision here
                        log('intersect found (boundingboxes only).');

                        log(`${ent.id}|${entToCheck.id}`);

                        if (entToCheck instanceof Projectile) {
                            //entToCheck.warp();
                            //entToCheck.dead = true;
                        }

                    }
                }

            }
           

         

        }
    }



}


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
        this.id = String (Date.now())+Math.floor(Math.random()*10000 )
        this.dead = false;
    }

    remove = () => {
        //this.remove();
    }
}


class Unit extends Entity {
    constructor(x, y, w, h, color) {
        super(x, y, w, h, color);

        this.weapon = new Weapon('test');
       

        this.shoot = () => {
            const now = window.performance.now();
            const elapsed = now - this.weapon.lastFired;

            if (elapsed > this.weapon.speed) {
                this.weapon.lastFired = now;
                let dir = Math.atan2(mouse.y - this.y, mouse.x - this.x);
            
                if (this.weapon.spread > 0) {
                    let spreadAngle = this.weapon.spread;
                    dir =  dir * 180/Math.PI; //radians to degree
                    dir = ranNum( dir-(spreadAngle/2), dir+(spreadAngle/2) );
                    dir = dir * (Math.PI/180); //degree to radians
                }
    
            let friendly = false;
            if (this instanceof Player) { 
                friendly = true; 
                //log('ammo is friendly') 
            }

            entities.push( new this.weapon.projectile(this.x, this.y, dir, friendly) );
    
            }

           
        }
    }
}

class Player extends Unit {
    constructor(x, y, w, h, color) {
        super(x, y, w, h, color);
    }
}

class Enemy extends Unit {
    constructor(x, y, w, h, color) {
        super(x, y, w, h, color);
    }
}



class Weapon {
    constructor() {
        this.name = 'default weapon';
        this.projectile = Projectile;
        this.speed = 200; //ms, fire rate
        this.lastFired = 0;
        this.spread = 0; //bullet spread radius in degrees
        
    }

    fire = () => {

    }
}

class Gatling extends Weapon {
    constructor(name) {
        super(name);
        this.name = 'Gatling'
        this.projectile = Tracer;
        this.speed = 100; //ms, fire rate
        this.spread = 10;
    }
}


class Projectile {
    constructor(x, y, dir, friendly) {
        this.x = x;
        this.y = y;
        this.dir = dir;
        this.speed = 50;
        this.friendly = friendly;

        this.w = 5;
        this.h = 5;
        this.color = 'red';
    }

    // Move projectile
    move() {
        //const speed = 400;
        const multi = this.speed / 10;

        const deltaX = Math.cos(this.dir); 
        const deltaY = Math.sin(this.dir);

        const pointX = deltaX * multi;
        const pointY = deltaY * multi;


        this.x = this.x + pointX;
        this.y = this.y + pointY;
    }

    warp() {
        this.x = 0;
        this.y = 0;
    }
}

class Tracer extends Projectile {
    constructor(x, y, dir) {
        super(x, y, dir);

        this.speed = 400;
        this.w = 2;
        this.h = 2;
        this.color = 'orange';
    }

    
}




const movePlayer = (x, y) => {
    //log(`x: ${x}, y${y}`);
    player.x = x;
    player.y = y;
}

const moveEntity = (ent, axis, val) => {
    axis = axis.toLowerCase();
    const newVal = ent[axis]+val;

    // Prevent player moving outside screen
    if (ent instanceof Player) {
        const canvasW = canvas.width;
        const canvasH = canvas.height;
        if (newVal < 0 || 
            axis === 'x' && newVal > canvasW ||
            axis === 'y' && newVal > canvasH ) {
            return false;
        }
         
    } 

    ent[axis] = ent[axis]+val;
}


const updateEntites = () => {
    for (const ent of entities) {

        if (ent instanceof Projectile) {
            ent.move();
        }
  

   
    }
}

const processProjectiles = () => {
    for (const projectile of projectiles) {
        projectile.move();

       // log(projectile.x)
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

    for (let i=0; i<entities.length; i++) {
        const ent = entities[i];
        // Remove from index, 
        if (objectIsOutsideCanvas(ent)) {
            entities.splice(i, 1);
            i--;
        }
    }
}

const changeWeapon = num => {
    let wep;
    switch (num) {
        case 1: wep = new Gatling(); break; 
        case 2: wep = new Weapon(); break; 
    }
    player.weapon = wep;
}


const player = new Player(0, 0, settings.player.size, settings.player.size, settings.player.color);



const testEnemy = () => {
    for(let i=0; i<5;i++) {
        let x = canvas.width/2 + canvas.width/4;
        let y = 70 + 120*i;

        let enemy = new Enemy(x, y, 50, 50,  '#992600');
        entities.push(enemy);
    }
}







