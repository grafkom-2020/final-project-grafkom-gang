'use strict';
	
Physijs.scripts.worker = '/lib/js/physijs_worker.js';
Physijs.scripts.ammo = '/lib/js/ammo.js';

var initScene, render, objloader, texloader, fontloader, renderer, player, raycaster;

let scene, camera, raycasts;

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
    player = new Player(camera,scene);
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
    raycasts = scene.children[4] == null ? [] : raycaster.intersectObjects(scene.children[4].children);
    let ada = false;
    if (raycasts[0] != null && raycasts[0].distance <= 2.5) {
        for (let obj of interactables) {
            if (raycasts[0].object == obj.object) {
                ada = true;
                break;
            }
        }
        for (let obj of keypad) {
            if (raycasts[0].object == obj) {
                ada = true;
                break;
            }
        }
    }
    if (ada) {
        scene.children[2].children[0].material.opacity = 1;
        scene.children[2].children[0].scale.set(1, 1, 1);
    } else {
        scene.children[2].children[0].material.opacity = 0.3;
        scene.children[2].children[0].scale.set(0.8, 0.8, 0.8);
    }

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
