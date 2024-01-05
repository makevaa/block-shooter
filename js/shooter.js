/*** shooter.js ***/
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let player;

const log = console.log;

const settings = {
    player: {
        size: 40,
        color:'green',
        speed: 5,

 
    },
    fps: { limit: 60 },

    map: {
        w:3000, h: 2000,
        offset: {
            //px from top-left of canvas to top-left of ctx
            x:0, y:0
        }
    },

    draw: {
        camera:true,
        collisionMap:false,
        debugData:true,
    }
}

const images = {
    path:'./img/',

    //props 'left' and 'right' will be created when setting the imgs for npcs
    //eg: game.images.skeleton.left //img object

    enemy: {
        treant: {
            files: { left: "treant.png", right: 'treant_right.png' },
            run: {
                left: {
                    sheet: 'treant_run.png', anim:-1,
                }, 
                right: {
                    sheet: 'treant_run_right.png',anim:-1,
                }
            },
        },
        lich: {
            files: { left: "lich.png", right: 'lich_right.png' }
        },
    },

    player: {
        idle: {
            left: {
                sheet: 'hero_idle.png', anim:-1,
            }, 
            right: {
                sheet: 'hero_idle_right.png' ,anim:-1,
            }
        },
        run: {
            left: {
                sheet: 'hero_run.png', anim:-1,
            }, 
            right: {
                sheet: 'hero_run_right.png',anim:-1,
            }
        },
        attack: {
            left: {
                sheet: 'hero_attack.png', anim:-1,
            }, 
            right: {
                sheet: 'hero_attack_right.png',anim:-1,
            }
        }


    }
}

class sheetAnim {
    constructor(sheet, frames, frameW, frameH, frameMs) {
        this.sheet = sheet;
        this.frames = frames,
        //log(sheet)
        this.frame = {
            current:0,
            dur: frameMs, //ms
            w: frameW, 
            h: frameH,
            last: window.performance.now(),
        }

        
    }

    step = () => {
        const now = window.performance.now();
        const elapsed = now - this.frame.last;

        if (elapsed > this.frame.dur) {
            this.frame.last = now;
            this.frame.current++;
            if (this.frame.current >= this.frames) {
                this.frame.current = 0;
            }
        }

       


    }



}

const stats = {
    kills:0,
}

const lines = [];


const entities = [];

const hitBlasts = [];
const muzzleFire = [];

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
    const tSize = 100; //tile size

    let tilesH =  canvas.width/tSize // tile amount, hori
    let tilesV = canvas.height/tSize//vertical

    tilesH = settings.map.w/tSize
    tilesV = settings.map.h/tSize

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

    for (let y=0; y<collisionMap.length; y++) {
        let row = collisionMap[y];

        for(let x=0; x<row.length; x++) {
            let tile = collisionMap[y][x];

            if ( isOutsideCamera( {x:tile.start.x, y:tile.start.y} ) ) {
                //log('tile outside camera, skipping')
                continue;
            }

            for (const ent of entities) {
                if(ent.dead) { continue; }    
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
            
            
            if ( isOutsideCamera( {x:tile.start.x, y:tile.start.y} ) ) {
                //log('tile outside camera, skipping')
                continue;
            }



            // Loop each entitiy in tile
            for (const ent of tile.entities) {
                //let id = ``;
                if(ent.dead) { continue; }       
             

                // Loop entities again to check for collisions
                for (const entToCheck of tile.entities) {
                    if(entToCheck.dead) { continue; }    
                    if(ent.dead) { continue; }   

                    // Don't check collision against entity itself
                    if (ent.id === entToCheck.id) {
                        break;
                    } 

                
                    if ( pairsChecked.get(`${ent.id}|${entToCheck.id}`) ||
                         pairsChecked.get(`${entToCheck.id}|${ent.id}`) ) {
                        // Pair has already been checked, ignore
                        //log('pairs checked already')
                        continue;
                    } else {
                        // Set the pair as checked, both ways
                        pairsChecked.set(`${ent.id}|${entToCheck.id}`, true);
                        pairsChecked.set(`${entToCheck.id}|${ent.id}`, true);
                    }


                    const entBox1 = getEntityBoundingBox(ent);
                    const entBox2 = getEntityBoundingBox(entToCheck);


                    if ( intersects(entBox1, entBox2) ) {
                     
                        // Check for a more accurate collision here

                        //log(ent.constructor.name)
                        //log(ent1 instanceof Projectile)
                        //log(ent2 instanceof Entity)

                        const ent1 = ent;
                        const ent2 = entToCheck;
                        let proj, target;
                        

                        if (ent1 instanceof Projectile) {
                            proj = ent1;
                        } else if  (ent2 instanceof Projectile) {
                            proj = ent2;
                        }

                        if (ent1 instanceof Unit) {
                            target = ent1;
                        } else if  (ent2 instanceof Unit) {
                            target = ent2;
                        }

                        // Prevent enemies from overlapping each other
                        if (ent1 instanceof Enemy && ent2 instanceof Enemy) {
                            if ( distBetweenEntities(ent1, ent2) < 20 ) {
                                //log('enemies on top of each other')
                                // Move entity to random pos
                                // moveEntity = (ent, axis, val)

                                moveEntity(ent1, 'x', ranNum(-10, 10) );
                                moveEntity(ent1, 'y', ranNum(-10, 10) );

                                //Block entity movement for a while.
                                ent1.sleep(500);
                            }
                            
                        }

                        // If both entites are same, skip
                        if (ent1 instanceof Unit && ent2 instanceof Unit) {
                            continue
                        }

                        if (ent1 instanceof Projectile && ent2 instanceof Projectile) {
                            continue
                        }


                        // Ignore friendly fire
                        if (target instanceof Player && proj.friendly ) {
                            log('Friendly fire.');
                            continue
                        }

                        //log(`intersect found (boundingboxes): ${ent.id}|${entToCheck.id}`);

                        hitBlasts.push(new HitBlast(proj.x, proj.y, ranNum(5,10)));
                        target.takeDamage(proj.damage);
                        proj.kill();

                        if (target instanceof Enemy && target.dead) {
                            stats.kills++;
                            waves.current.kills++;
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
        this.dx = 0;
        this.dy = 0;
        this.color = color;
        this.originalColor = color;
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
        this.hp = 10;
        this.speed = 1;
        this.img = { left:-1, right:-1 }
        this.facingLeft = true;
        this.prevX = this.x;
        this.sleeping = false;
        this.moving = false;
        this.attacking = false;
       

        this.shoot = () => {
            const now = window.performance.now();
            const elapsed = now - this.weapon.lastFired;

            if (elapsed > this.weapon.fireRate) {
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

            const muzzleX = this.x + Math.cos(dir)* this.w/2; 
            const muzzleY = this.y + Math.sin(dir)* this.h/2; 

            muzzleFire.push( new MuzzleFire(muzzleX, muzzleY, ranNum(5,10), dir) );

            entities.push( new this.weapon.projectile(this.x, this.y, dir, friendly) );
    
            }
        }

        this.takeDamage = amount => { 
            this.hp = this.hp-amount;
            //this.y -= 1
            if (this.hp <= 0) {
                //kill unit
                this.kill();
            } else {
                this.flash();
            }
        }


        this.kill = () => {
            this.dead = true;
        }

        this.flash = () => {
            let color = this.originalColor;
            //log(color);
            this.color = '#d9d9d9'

            setTimeout(() => {
                this.color = color;
              }, 10);
        }

        this.sleep = sleepMs => {
            this.sleeping = true;
            this.moving = false
            setTimeout(() => {
                this.sleeping = false;
                this.moving = true
            }, sleepMs);
        }


    }

}

class Player extends Unit {
    constructor(x, y, w, h, color) {
        super(x, y, w, h, color);

    }

    update = () => {
        //increasingly adds 0.5 to the dy or dx
        
    }
}

class Enemy extends Unit {
    constructor(x, y, w, h, color) {
        super(x, y, w, h, color);
        this.moving = true;
        let img = 'lich' // lich treant
        this.img.left = images.enemy[img].left;
        this.img.right = images.enemy[img].right;
    }

    move = () => {
        const dir = Math.atan2(player.y-this.y, player.x-this.x);

        this.x = this.x + Math.cos(dir) * this.speed;
        this.y = this.y + Math.sin(dir) * this.speed;

        if (this.x > this.prevX) {
            this.facingLeft = false;
        } else {
            this.facingLeft = true;
        }
        
        this.prevX = this.x;
    }
}

class Treant extends Enemy {
    constructor(x, y, w, h, color) {
        super(x, y, w, h, color);

    }

}


class Weapon {
    constructor() {
        this.name = 'default weapon';
        this.projectile = Projectile;
        this.fireRate = 200; //ms, fire rate
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
        this.fireRate = 10; //ms, fire rate
        this.spread = 10;
      
    }
}


class Projectile extends Entity {
    constructor(x, y, dir, friendly) {
        super();
        this.x = x;
        this.y = y;
        this.dir = dir;
        this.speed = 10;
        this.damage = 5;
        this.friendly = friendly;

        this.w = 5;
        this.h = 5;
        this.color = 'red';
    }

    // Move projectile
    move() {
        //const speed = 400;
        const multi = this.speed / 1;

        const deltaX = Math.cos(this.dir); 
        const deltaY = Math.sin(this.dir);

        const pointX = deltaX * multi;
        const pointY = deltaY * multi;


        this.x = this.x + pointX;
        this.y = this.y + pointY;
    }

    kill() {
        this.dead = true;
    }

}

class Tracer extends Projectile {
    constructor(x, y, dir, friendly) {
        super(x, y, dir, friendly);

        this.speed = 30;
        this.damage = 1;
        this.w = 2;
        this.h = 2;
        this.color = 'orange';
    }
    
}


class AnimatedShape {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.opacity = 1;
        this.color = `255, 255, 255`;
        this.dead = false;

        this.frame = {
            duration: 10, //ms
            total: 10, //max frames
            current: -1,
            last: window.performance.now()
        }

        this.kill = () => {
            this.dead = true;
        }

        this.progress = () => {

            const now = window.performance.now();
            const elapsed = now - this.frame.last;

            if (elapsed > this.frame.duration) {
                this.frame.last = now;
                let newOpa = this.opacity - (1/this.frame.total);
                if (newOpa < 0) {newOpa = 0;}

                this.opacity = newOpa;
                this.frame.current++;
    
            }

            if (this.frame.current > this.frame.total) {
                this.kill();
            }

        }
        
    }

}


class HitBlast extends AnimatedShape {
    constructor(x, y, radius) {
        super(x, y, radius);
        this.color = `255, 255, 255`;
   

        this.frame = {
            duration: 10, //ms
            total: 10, //max frames
            current: -1,
            last: window.performance.now()
        }
    }
}

class MuzzleFire extends AnimatedShape {
    constructor(x, y, radius, dir) {
        super(x, y, radius);
        this.color = `255, 255, 255`;
        this.dir = dir;

        this.frame = {
            duration: 10, //ms
            total: 2, //max frames
            current: -1,
            last: window.performance.now()
        }
    }
}



const moveEntity = (ent, axis, val) => {
    axis = axis.toLowerCase();
    const newVal = ent[axis]+val;


   

    // Prevent player moving outside screen
    if (ent instanceof Player) {
    
        const w = settings.map.w;
        const h = settings.map.h;
        if (newVal < 0 || 
            axis === 'x' && newVal > w ||
            axis === 'y' && newVal > h ) {
            return false;
        }

        //mouse[axis] = mouse[axis]+val;
        ent[axis] = ent[axis]+val;  

        mouse.x = camera.x + mouse.playerOffset.x;
        mouse.y = camera.y + mouse.playerOffset.y;

        if (ent.x > ent.prevX) {
            ent.facingLeft = false;
        } else {
            ent.facingLeft = true;
        }
        ent.prevX = ent.x;


        //updateMouse(mouse.x+camera.x+val, mouse.y+camera.y+val);
       
        centerMap();

   
      

    } else {
        ent[axis] = ent[axis]+val;
    }

}


const updateEntites = () => {
    for (const ent of entities) {
        if (ent instanceof Projectile && !ent.dead) {
            ent.move();
        }

        if (ent instanceof Enemy && !ent.dead && !ent.sleeping) {
            ent.move();
        }
    }

    for (const hit of hitBlasts) {
        hit.progress();
    }

    for (const fire of muzzleFire) {
        fire.progress();
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

const objectIsOutsideMap = (obj) => {
    let isOutside = false;

    if (obj.x < 0 || obj.x > settings.map.w ||
        obj.y < 0 || obj.y > settings.map.h) {
        isOutside = true;
    }

    return isOutside;
}

const isOutsideCamera = obj => {
    let isOutside = false;
    // Offset to draw entites partially inside camera view
    const offset = 50; 

    if (obj.x < camera.x-offset || obj.x > camera.x+canvas.width+offset ||
        obj.y < camera.y-offset || obj.y > camera.y+canvas.height+offset) {
        isOutside = true;
    }

    return isOutside;
}

const objectLimiter = () => {

    for (let i=0; i<entities.length; i++) {
        const ent = entities[i];
        // Remove from index, 
        if (objectIsOutsideCanvas(ent) || ent.dead) {
            //entities.splice(i, 1);
            //i--;
        }

        if (objectIsOutsideMap(ent) || ent.dead) {
            entities.splice(i, 1);
            i--;
        }
    }

    for (let i=0; i<hitBlasts.length; i++) {
        const hit = hitBlasts[i];
        if (hit.dead) {
            hitBlasts.splice(i, 1);
            i--;
        }
    }

    for (let i=0; i<muzzleFire.length; i++) {
        const fire = muzzleFire[i];
        if (fire.dead) {
            muzzleFire.splice(i, 1);
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






const testEnemy = () => {
    for(let i=0; i<30;i++) {
        let x = canvas.width/2 + canvas.width/6;
        let y = 70 + 120*i;

        x = ranNum(0,canvas.width);
        y = ranNum(0,canvas.height);

        let enemy = new Enemy(x, y, 30, 30, '#992600');
        entities.push(enemy);
    }
}

const waves = {
    current: {
        enemies:-1,
        num:0,
        kills:0,
    },
    enemiesPerWave:100,
}

const spawnEnemies = (amount) => {
    //let amount = waves.enemiesPerWave;q

    for (let i=0; i<amount; i++) {
        let x = ranNum(0, settings.map.w);
        let y = ranNum(0, settings.map.h);

        while ( distBetween(player.x, player.y, x, y) < 500) {
            x = ranNum(0, settings.map.w);
            y = ranNum(0, settings.map.h);
            log('rolling enemy pos')
        }

        //const enemy = new Enemy(x, y, 50, 50, '#992600');
        const enemy = new Treant(x, y, 50, 50, '#992600');
        entities.push(enemy);
    }
}

const enemySpawner = () => {

    if (waves.current.kills >= waves.current.enemies) {
        
        waves.current.num++;
        waves.current.enemies = waves.enemiesPerWave + waves.current.num;
        waves.current.kills = 0;

        spawnEnemies(waves.current.enemies);
    }
    

}






