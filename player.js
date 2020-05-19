
function Player (_camera, _scene){

	let control = new THREE.PointerLockControls(_camera, document.body);
    this.control = control;
    let speed = 0.03;
    this.speed = speed;
    let deltaForward = 0;
    let deltaRight = 0;
    let bodySize = 0.3;
    this.bodySize = bodySize;

    let items = [];
    this.items = items;

	this.update = function(){
        if(!control.isLocked) return;
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
				if (raycasts[0].object == scene.children[4].children[49]) {
					scene.children[4].children[49].material.transparent = 1;
					scene.children[4].children[49].material.opacity = 1 - scene.children[4].children[49].material.opacity;
					cable = !cable;
					if (cable && power) {
						scene.children[4].children[45].material.color = new THREE.Color(0x008800);
					} else {
						scene.children[4].children[45].material.color = new THREE.Color(0x222222);
						passcode = '';
					}
				}

				for (let o of interactables) {
					if (o.object == raycasts[0].object) {
						o.state *= 2;
						if (o.object == scene.children[4].children[47] && cable) {
							power = !power;
							if (power && cable) {
								scene.children[4].children[45].material.color = new THREE.Color(0x008800);
							} else {
								scene.children[4].children[45].material.color = new THREE.Color(0x222222);
								passcode = '';
							}
						}
					}
                }
                for (let o of takeable){
                    if (o.object == raycasts[0].object){
                        items.push(o.object.name);
                        _scene.remove(o);
                        // need to add code to remove item from scene
                    }
				}
				if (power && cable) {
					if (passcode.length < 4) {
						if (raycasts[0].object == keypad[0]) passcode += '0';
						if (raycasts[0].object == keypad[1]) passcode += '1';
						if (raycasts[0].object == keypad[2]) passcode += '2';
						if (raycasts[0].object == keypad[3]) passcode += '3';
						if (raycasts[0].object == keypad[4]) passcode += '4';
						if (raycasts[0].object == keypad[5]) passcode += '5';
						if (raycasts[0].object == keypad[6]) passcode += '6';
						if (raycasts[0].object == keypad[7]) passcode += '7';
						if (raycasts[0].object == keypad[8]) passcode += '8';
						if (raycasts[0].object == keypad[9]) passcode += '9';
					}
					if (raycasts[0].object == keypad[10]) passcode = passcode.substring(0, passcode.length - 1);
					if (raycasts[0].object == keypad[11]) {
						if (passcode === '8888') {
							// WIN
						}
						passcode = '';
					}
				}
				scene.children[3].geometry = new THREE.TextGeometry(passcode, {font: font, size: 0.025, height: .051});
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
			raycastColArr = _scene.children[4] == null ? [] : raycastCol.intersectObjects(_scene.children[4].children);
			if (Array.isArray(raycastColArr) && raycastColArr.length && raycastColArr[0].distance <= 2){
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
			raycastColArr = _scene.children[4] == null ? [] : raycastCol.intersectObjects(_scene.children[4].children);
			if (Array.isArray(raycastColArr) && raycastColArr.length && raycastColArr[0].distance <= 2){
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
			raycastColArr = _scene.children[4] == null ? [] : raycastCol.intersectObjects(_scene.children[4].children);
			if (Array.isArray(raycastColArr) && raycastColArr.length && raycastColArr[0].distance <= 2){
				if(deltaForward < 0)
				deltaForward = 0;
			}
			pos.y -= offset;
		}

		pos.copy(_camera.position);
		dir.applyEuler(new THREE.Euler(0,1.5708,0));
		for(i=0;i < accuracy; i++){
			raycastCol.set(pos,dir);
			raycastColArr = _scene.children[4] == null ? [] : raycastCol.intersectObjects(_scene.children[4].children);
			if (Array.isArray(raycastColArr) && raycastColArr.length && raycastColArr[0].distance <= 2){
				if(deltaRight > 0)
				deltaRight = 0;
			}
			pos.y -= offset;
		}
	}
}