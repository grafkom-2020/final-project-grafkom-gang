
function Player (_camera){

    let control = new THREE.PointerLockControls(_camera, document.body);
    let speed = 0.1;
    // control.lock(); need fix
    control.isLocked = true; //hotfix

    
    this.update = function(){
        let deltaFordward = 0;
        let deltaRight = 0;
        if(isKey("KeyW")){
            deltaFordward += speed;
        }
        
        if(isKey("KeyA")){
            deltaRight -= speed;
        }
    
        if(isKey("KeyS")){
            deltaFordward -= speed;
        }
    
        if(isKey("KeyD")){
            deltaRight += speed;
        }

        control.moveForward(deltaFordward);
        control.moveRight(deltaRight);
    }

    this.getObject = function(){
        return control.getObject();
    }
}