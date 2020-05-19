
function Player (_camera, _scene){

    let control = new THREE.PointerLockControls(_camera, document.body);
    let speed = 0.03;
    let isActive = false;
    let deltaForward = 0;
    let deltaRight = 0;
    let bodySize = 0.3;
    this.activate = function(){
        if(!isActive){
            control.lock();
            isActive = true;
        }
    }
    this.deactivate = function(){
        if(isActive){
            control.unlock();
            isActive = false;
        }
    }
    this.update = function(){
        if(!isActive) return;
        deltaForward = 0;
        deltaRight = 0;
        if(isKey("KeyW")){
            deltaForward += speed;
        }
        
        if(isKey("KeyA")){
            deltaRight -= speed;
        }
    
        if(isKey("KeyS")){
            deltaForward -= speed;
        }
    
        if(isKey("KeyD")){
            deltaRight += speed;
        }

        if (isButtonDown(0)) {
            if (raycasts[0] != null && raycasts[0].distance <= 2.5) {
                for (let o of interactables) {
                    if (o.object == raycasts[0].object) {
                        o.state *= 2;
                    }
                }
            }
        }

        checkCollision();

        control.moveForward(deltaForward);
        control.moveRight(deltaRight);
    }

    this.getObject = function(){
        return control.getObject();
    }

    function checkCollision(){
        let dir = new THREE.Vector3();
        control.getDirection(dir);

        let pos = new THREE.Vector3();
        pos.copy(_camera.position);

        let raycastCol = new THREE.Raycaster(pos, dir, 0, bodySize);
        let raycastColArr = [];

        let accuracy = 3;
        
        let offset = _camera.position.y / accuracy;

        raycastCol.set(pos,dir);
        for(i=0;i < accuracy; i++){
            raycastColArr = _scene.children[3] == null ? [] : raycastCol.intersectObjects(_scene.children[3].children);
            if (Array.isArray(raycastColArr) && raycastColArr.length){
                if(deltaForward > 0){
                    deltaForward = 0;
                }
            }
            pos.y -= offset;
        }

        pos.copy(_camera.position);
        dir.applyEuler(new THREE.Euler(0,1.5708,0));
        raycastCol.set(pos,dir);
        for(i=0;i < accuracy; i++){
            raycastColArr = _scene.children[3] == null ? [] : raycastCol.intersectObjects(_scene.children[3].children);
            if (Array.isArray(raycastColArr) && raycastColArr.length){
                if(deltaRight < 0){
                    deltaRight = 0;
                }
            }
            pos.y -= offset;
        }

        pos.copy(_camera.position);
        dir.applyEuler(new THREE.Euler(0,1.5708,0));
        for(i=0;i < accuracy; i++){
            raycastCol.set(pos,dir);
            raycastColArr = _scene.children[3] == null ? [] : raycastCol.intersectObjects(_scene.children[3].children);
            if (Array.isArray(raycastColArr) && raycastColArr.length){
                if(deltaForward < 0)
                deltaForward = 0;
            }
            pos.y -= offset;
        }

        pos.copy(_camera.position);
        dir.applyEuler(new THREE.Euler(0,1.5708,0));
        for(i=0;i < accuracy; i++){
            raycastCol.set(pos,dir);
            raycastColArr = _scene.children[3] == null ? [] : raycastCol.intersectObjects(_scene.children[3].children);
            if (Array.isArray(raycastColArr) && raycastColArr.length){
                if(deltaRight > 0)
                deltaRight = 0;
            }
            pos.y -= offset;
        }
    }
}