'use strict';
	
Physijs.scripts.worker = '/lib/js/physijs_worker.js';
Physijs.scripts.ammo = '/lib/js/ammo.js';

var initScene, render, objloader, texloader, renderer, player;

let scene, camera;

initScene = function() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	document.getElementById( 'viewport' ).appendChild( renderer.domElement );
	objloader = new THREE.GLTFLoader();
	texloader = new THREE.TextureLoader();
	
	scene = new Physijs.Scene();
	populateScene();
	
	requestAnimationFrame( render );

    listenTo(document);
    addKeyToListen("KeyW");
    addKeyToListen("KeyA");
    addKeyToListen("KeyS");
    addKeyToListen("KeyD");

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
                obj.object.geometry.rotateX(obj.closed[0] - obj.opened[0] / 100 / 180 * Math.PI);
                obj.object.geometry.rotateY(obj.closed[1] - obj.opened[1] / 100 / 180 * Math.PI);
                obj.object.geometry.rotateZ(obj.closed[2] - obj.opened[2] / 100 / 180 * Math.PI);
                obj.state--;
                if (obj.state < -101) obj.state = 1;
            } else {
                obj.object.geometry.rotateX(obj.opened[0] - obj.closed[0] / 100 / 180 * Math.PI);
                obj.object.geometry.rotateY(obj.opened[1] - obj.closed[1] / 100 / 180 * Math.PI);
                obj.object.geometry.rotateZ(obj.opened[2] - obj.closed[2] / 100 / 180 * Math.PI);
                obj.state++;
                if (obj.state > 101) obj.state = -1;
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
