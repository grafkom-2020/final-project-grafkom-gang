
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
	updateInventory();

    let beepAudio = new Audio("/assets/audio/beep-07.wav");
    let walkAudio = new Audio("/assets/audio/FOOTSTEPS (A) Walking Loop 01 Shorter.wav");
    let doorOpenAudio = new Audio("/assets/audio/open_door.wav");
    walkAudio.volume = 0.2;

    let isCrouched = false;
    let crouchAmount = 0.5;
    this.crouchAmount = crouchAmount;

	this.update = function(){
        if(!control.isLocked) return;
        let playWalk = false;
		deltaForward = 0;
        deltaRight = 0;

		if(isKey("KeyW")){
            deltaForward += speed;
            playWalk = true;
		}
		
		if(isKey("KeyA")){
            deltaRight -= speed;
            playWalk = true;
		}
	
		if(isKey("KeyS")){
            deltaForward -= speed;
            playWalk = true;
		}
	
		if(isKey("KeyD")){
            deltaRight += speed;
            playWalk = true;
        }
        if(playWalk){
            walkAudio.play()
        }

        if(isKeyDown("ControlLeft")){
            if(!isCrouched){
                _camera.position.y -= crouchAmount;
                isCrouched = true;
            }else{
                _camera.position.y += crouchAmount;
                isCrouched = false;
            }
        }

		if (isButtonDown(0)) {
            onMouse1Click();
        }

		checkCollision();

		control.moveForward(deltaForward);
		control.moveRight(deltaRight);
	}

	this.getObject = function(){
		return control.getObject();
	}

	function updateInventory() {
		let d = document.getElementById('contents');
		d.innerHTML = '';
		for (let i of items) {
			d.innerHTML += '<li>' + i + '</li>';
		}
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
    
    function onMouse1Click(){
		win();
        if (raycasts[0] != null && raycasts[0].distance <= 2.5) {
            if (raycasts[0].object == scene.children[4].getObjectByName('Kabel_2') && player.items.includes('CableItem')) {
				player.items.splice(player.items.indexOf('CableItem'), 1);
				updateInventory();
                scene.children[4].getObjectByName('Kabel_2').material.transparent = 1;
                scene.children[4].getObjectByName('Kabel_2').material.opacity = 1 - scene.children[4].getObjectByName('Kabel_2').material.opacity;
                cable = !cable;
                if (cable && power) {
					scene.getObjectByName('PointLight').power = 12;
					scene.children[4].getObjectByName('Lamp_Emission').material.emissive = new THREE.Color(0xFFFFFF);
                    scene.children[4].getObjectByName('Panel_Screen').material.color = new THREE.Color(0x008800);
                } else {
					scene.getObjectByName('PointLight').power = 0;
					scene.children[4].getObjectByName('Lamp_Emission').material.emissive = new THREE.Color(0x000000);
                    scene.children[4].getObjectByName('Panel_Screen').material.color = new THREE.Color(0x222222);
                    passcode = '';
                }
            }

            for (let o of interactables) {
				if (o.object.name === 'VaultDoor' && padlocked) continue;
				if (o.object == raycasts[0].object) {
					o.state *= 2;
					if (o.object == scene.children[4].getObjectByName('Electrical_Lever') && cable) {
						power = !power;
						if (power && cable) {
							scene.getObjectByName('PointLight').power = 12;
							scene.children[4].getObjectByName('Lamp_Emission').material.emissive = new THREE.Color(0xFFFFFF);
							scene.children[4].getObjectByName('Panel_Screen').material.color = new THREE.Color(0x008800);
						} else {
							scene.getObjectByName('PointLight').power = 0;
							scene.children[4].getObjectByName('Lamp_Emission').material.emissive = new THREE.Color(0x000000);
							scene.children[4].getObjectByName('Panel_Screen').material.color = new THREE.Color(0x222222);
							passcode = '';
						}
					}
				}
			}
			for (let o of takeable){
				if (o == raycasts[0].object){
					items.push(o.name);
					updateInventory();
					o.parent.remove(o);
				}
			}
			if (player.items.includes('Key')
						&& raycasts[0].object == scene.children[4].getObjectByName('Padlock_handle')
						|| raycasts[0].object == scene.children[4].getObjectByName('Padlock_steel')) {
				scene.children[4].remove(scene.children[4].getObjectByName('Padlock_handle'));
				scene.children[4].remove(scene.children[4].getObjectByName('Padlock_steel'));
				padlocked = false;
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
					if (keypad.includes(raycasts[0].object)){
						beepAudio.play();
					} 
				}
				if (raycasts[0].object == keypad[10]) passcode = passcode.substring(0, passcode.length - 1);
				if (raycasts[0].object == keypad[11]) {
					console.log('check win');
					if (passcode === '6980') {
						win();
					}
					passcode = '';
				}
			}
			scene.children[3].geometry = new THREE.TextGeometry(passcode, {font: font, size: 0.025, height: .051});
        }
	}
	
	function win(){
		console.log('win');
		control.unlock();
		instructions.style.display = 'none';
		winpanel.style.display = 'inline';
	}
}