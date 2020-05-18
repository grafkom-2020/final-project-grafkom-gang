
function Player (_camera,_mesh){

    let control = new THREE.PointerLockControls(_camera, document.body);
    let speed = 0.05;
    let isActive = false;
    let dir = new THREE.Vector3();

    _mesh.setLinearFactor(new THREE.Vector3(0,0,0));
    _mesh.setAngularFactor(new THREE.Vector3(0,0,0));
    _mesh.add(_camera);
    _camera.position.set(0,1,0);
    _mesh.addEventListener('collision', function(other_object, relative_velocity, relative_rotation, contact_normal){
        xColl = relative_velocity.x * contact_normal.x;
        zColl = relative_velocity.z * contact_normal.z;
        console.log(xColl);
        console.log(zColl);
        coll = true;
    });
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
    this.mesh = function(){
        return _mesh;
    }
    this.update = function(){
        let deltaForward = 0;
        let deltaRight = 0;
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

        control.getDirection(dir);
        dir.normalize();
        dir.x += deltaForward;
        dir.z += deltaRight
        _mesh.position.set(dir);
        control.moveForward(deltaForward);
        control.moveRight(deltaRight);

        // dir.setFromMatrixColumn( _camera.matrix, 0 );

		// dir.crossVectors( _camera.up, dir );

        // _mesh.position.addScaledVector( dir, deltaForward );
        
        // dir.setFromMatrixColumn( _camera.matrix, 0 );

        // _mesh.position.addScaledVector( dir, deltaRight );
        
        // _mesh.__dirtyPosition = true;
    }

    this.getObject = function(){
        return _mesh;
    }
}