/*** controls.js ***/

const keyDown = {
    w:false, a:false, s:false, d:false
}

const processControls = () => {
    const moveAmount = 5;
    const val = moveAmount;

    if (keyDown.w) { moveEntity(player, 'y', -val); }
    if (keyDown.a) { moveEntity(player, 'x', -val); }
    if (keyDown.s) { moveEntity(player, 'y', val); }
    if (keyDown.d) { moveEntity(player, 'x', val); }

    if (mouse.isDown) { player.shoot(); }


    //to-do: fix "null-movement"; if oppposing keys are pressed player is halted
    //should be moving to the last pressed cardinal direction
}

const setKeyboardControlListeners = () => {
    const moveAmount = 5;
    const val = moveAmount;

    document.addEventListener('keydown', function(e) {
        
        switch (e.key) {
            case 'w': keyDown.w=true; break;  // W
            case 'a': keyDown.a=true; break;  // A
            case 's': keyDown.s=true; break;  // S
            case 'd': keyDown.d=true; break;  // D
        }

        /*if(e.shiftKey) { }
        if(e.key === 'z' || e.key === 'Z' ) { }*/
        //log(e)
    });


    document.addEventListener('keyup', function(e) {
        switch (e.key) {
            case 'w': keyDown.w=false; break;  // W
            case 'a': keyDown.a=false; break;  // A
            case 's': keyDown.s=false; break;  // S
            case 'd': keyDown.d=false; break;  // D
        }

        /*if(e.key === "Shift") {} 
        if(e.key === 'z' || e.key === 'Z' ) {}*/
        //log(e)
    });
}


