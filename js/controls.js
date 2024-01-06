/*** controls.js ***/

const keyDown = {
    w:false, a:false, s:false, d:false
}

const processControls = () => {
    const moveAmount = player.speed;
    let val = moveAmount;

    player.attacking = false;

    if (mouse.isDown) { 
        player.shoot(); 
        player.attacking = true;
    }

    
    
    if (keyDown.w) { moveEntity(player, 'y', -val); }
    if (keyDown.a) { moveEntity(player, 'x', -val); }
    if (keyDown.s) { moveEntity(player, 'y', val); }
    if (keyDown.d) { moveEntity(player, 'x', val); }
    
    
    player.moving = false;
    
    if (keyDown.w || keyDown.a || keyDown.s || keyDown.d) {
        player.moving = true;
    }

    /*
    val = 5
    if (keyDown.w) {player.dy -= val}; 
    if (keyDown.d) {player.dx += val};
    if (keyDown.s) {player.dy += val};
    if (keyDown.a) {player.dx -= val};
    //if dy or dx is being added to so will the x and y. If not then they are 0.

    player.x += player.dx;  
    player.y += player.dy;

    //Multiplying by a number less then 1 will prevent the object from gaining infinite speed and also cause the object to stop. Can be changed to anything below 1. This will also change how rigidly the circle comes to a stop. it can slide or absuplty stop.
    player.dx *= 0.4;
    player.dy *= 0.4;

    centerMap();
    */

}

const setKeyboardControlListeners = () => {
    const moveAmount = 5;

    document.addEventListener('keydown', e => {
        const key = e.key.toLowerCase();
        //key = key.toLowerCase();


        //to-do: fix "null-movement"; if oppposing keys are pressed player is halted
        //should be moving to the last pressed cardinal direction

        switch (key) {
            case 'w': 
                keyDown.w=true; 
                //keyDown.s=false; 
                break;

            case 'a': 
                keyDown.a=true;
                //keyDown.d=false; 
                break;

            case 's': 
                keyDown.s=true; 
                //keyDown.w=false; 
                break;

            case 'd': 
                keyDown.d=true; 
                //keyDown.a=false; 
                break;




            case '1': changeWeapon(1); break; 
            case '2': changeWeapon(2); break;
        }

        /*if(e.shiftKey) { }
        if(e.key === 'z' || e.key === 'Z' ) { }*/
        //log(e)
    });


    document.addEventListener('keyup', function(e) {
        const key = e.key.toLowerCase();


        switch (key) {
            case 'w': keyDown.w=false; break;
            case 'a': keyDown.a=false; break;
            case 's': keyDown.s=false; break;
            case 'd': keyDown.d=false; break;
        }

        /*if(e.key === "Shift") {} 
        if(e.key === 'z' || e.key === 'Z' ) {}*/
        //log(e)
    });
}


