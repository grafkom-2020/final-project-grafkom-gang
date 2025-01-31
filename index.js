var initScene, render, objloader, texloader, fontloader, renderer, player, raycaster;

let scene, camera, raycasts;

var blocker = document.getElementById( 'blocker' );
var instructions = document.getElementById( 'instructions' );
var winpanel = document.getElementById('winpanel');
var overlay = document.getElementById('overlay');

var player_lock_func = function (){
	instructions.style.display = 'none';
	blocker.style.display = 'none';
	overlay.style.display = '';
}; // HOTFIX

var pointer_lock_func = function(){
	player.control.lock();
}; // HOTFIX

var player_unlock_func = function(){
	blocker.style.display = 'block';
	instructions.style.display = '';
	overlay.style.display = 'none';
}; // HOTFIX

initScene = function() {
	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	document.getElementById( 'viewport' ).appendChild( renderer.domElement );

	objloader = new THREE.GLTFLoader();
	texloader = new THREE.TextureLoader();
	fontloader = new THREE.FontLoader();
	raycaster = new THREE.Raycaster();
	
	scene = new THREE.Scene();
	populateScene();
	
	requestAnimationFrame( render );

	listenTo(document);
	addKeyToListen("KeyW");
	addKeyToListen("KeyA");
	addKeyToListen("KeyS");
    addKeyToListen("KeyD");
    addKeyToListen("ControlLeft");
	addMouseButtonToListen(0);

	renderer.domElement.requestPointerLock();
	player = new Player(camera,scene);
	scene.add(player.getObject());
	overlay.style.display = 'none';

	winpanel.style.display = 'none';

	instructions.addEventListener('click', pointer_lock_func, false); // HOTFIX

	winpanel.addEventListener('click', function(){
		window.location.reload();
	});

	player.control.addEventListener( 'lock', player_lock_func ); // HOTFIX

	player.control.addEventListener( 'unlock', player_unlock_func); // HOTFIX

	player.control.unlock(); // HOTFIX
	
	requestAnimationFrame( render );
};

render = function() {
	raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
	raycasts = scene.children[4] == null ? [] : raycaster.intersectObjects(scene.children[4].children);
	let ada = false;
	if (raycasts[0] != null && raycasts[0].distance <= 2.5) {
		if (actionobjects.includes(raycasts[0].object)) {
			scene.children[2].children[0].material.opacity = 1;
			scene.children[2].children[0].scale.set(1, 1, 1);
		} else {
			scene.children[2].children[0].material.opacity = 0.3;
			scene.children[2].children[0].scale.set(0.8, 0.8, 0.8);
		}
	}

	update();
	renderer.render(scene, camera);
	refreshInput();
	requestAnimationFrame(render);
};

// game logic
function update(){
	for (let obj of interactables) {
		if (Math.abs(obj.state) > 1) {
			if (obj.state < 0) { // CLOSING
				obj.object.rotation.x += obj.opened[0] * interactSpeed / 18000 * Math.PI;
				obj.object.rotation.y += obj.opened[1] * interactSpeed / 18000 * Math.PI;
				obj.object.rotation.z += obj.opened[2] * interactSpeed / 18000 * Math.PI;
				obj.state--;
				if (obj.state < -101 / interactSpeed) obj.state = 1;
			} else {
				obj.object.rotation.x -= obj.opened[0] * interactSpeed / 18000 * Math.PI;
				obj.object.rotation.y -= obj.opened[1] * interactSpeed / 18000 * Math.PI;
				obj.object.rotation.z -= obj.opened[2] * interactSpeed / 18000 * Math.PI;
				obj.state++;
				if (obj.state > 101 / interactSpeed) obj.state = -1;
			}
		} else {
			if (obj.state == -1) {
				obj.object.rotation.x = 0;
				obj.object.rotation.y = 0;
				obj.object.rotation.z = 0;
			} else {
				obj.object.rotation.x = obj.opened[0] / 180 * Math.PI;
				obj.object.rotation.y = obj.opened[1] / 180 * Math.PI;
				obj.object.rotation.z = obj.opened[2] / 180 * Math.PI;
			}
		}
	}
	player.update();
}

window.onresize = function() {
	camera.aspect = (window.innerWidth / window.innerHeight);
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}
window.onload = initScene();
