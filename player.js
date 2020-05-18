
function Player (_camera){

    let control = new THREE.PointerLockControls(_camera, document.body);
    let speed = 0.05;
    let isActive = false;

    this.activate = function(){
        if(!isActive){
            control.lock();
            isActive = false;
        }
    }
    this.deactivate = function(){
        if(isActive){
            control.unlock();
            isActive = false;
        }
    }
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