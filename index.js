'use strict';
	
Physijs.scripts.worker = '/lib/js/physijs_worker.js';
Physijs.scripts.ammo = '/lib/js/ammo.js';

var initScene, render, objloader, texloader, renderer, player, raycaster;

let scene, camera, raycasts;

initScene = function() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	document.getElementById( 'viewport' ).appendChild( renderer.domElement );
	objloader = new THREE.GLTFLoader();
    texloader = new THREE.TextureLoader();
    raycaster = new THREE.Raycaster();
	
	scene = new Physijs.Scene();
	populateScene();
	
	requestAnimationFrame( render );

    listenTo(document);
    addKeyToListen("KeyW");
    addKeyToListen("KeyA");
    addKeyToListen("KeyS");
    addKeyToListen("KeyD");
    addMouseButtonToListen(0);

    renderer.domElement.requestPointerLock();
    player = new Player(camera);
    scene.add(player.getObject());

    document.addEventListener('click', function(){
        player.activate();
    },false);
    document.addEventListener('escape', function(){
        player.deactivate();
    },false);
    
    requestAnimationFrame( render );
};

render = function() {
    raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
    raycasts = scene.children[3] == null ? [] : raycaster.intersectObjects(scene.children[3].children);
    scene.simulate(); // run physics
    update();
    renderer.render(scene, camera); // render the scene
    refreshInput();
    requestAnimationFrame(render);
};

// game logic
function update(){
    for (let obj of interactables) {
        if (Math.abs(obj.state) > 1) {
            if (obj.state < 0) { // CLOSING
                obj.object.rotation.x -= obj.closed[0] - obj.opened[0] * interactSpeed / 18000 * Math.PI;
                obj.object.rotation.y -= obj.closed[1] - obj.opened[1] * interactSpeed / 18000 * Math.PI;
                obj.object.rotation.z -= obj.closed[2] - obj.opened[2] * interactSpeed / 18000 * Math.PI;
                obj.state--;
                if (obj.state < -101 / interactSpeed) obj.state = 1;
            } else {
                obj.object.rotation.x += obj.closed[0] - obj.opened[0] * interactSpeed / 18000 * Math.PI;
                obj.object.rotation.y += obj.closed[1] - obj.opened[1] * interactSpeed / 18000 * Math.PI;
                obj.object.rotation.z += obj.closed[2] - obj.opened[2] * interactSpeed / 18000 * Math.PI;
                obj.state++;
                if (obj.state > 101 / interactSpeed) obj.state = -1;
            }
        } else {
            if (obj.state == -1) {
                obj.object.rotation.x = obj.closed[0] / 180 * Math.PI;
                obj.object.rotation.y = obj.closed[1] / 180 * Math.PI;
                obj.object.rotation.z = obj.closed[2] / 180 * Math.PI;
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
