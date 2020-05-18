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

    var capsule = new Physijs.CylinderMesh(
        new THREE.CylinderGeometry(0.3,0.3,2,32), 
        new THREE.MeshBasicMaterial({ color: 0x888888 }),
    );
    capsule.name = "Player Mesh";
    capsule.position.y += 4;
    scene.add(capsule);

    player = new Player(camera);
    scene.add(player.getObject());

    document.addEventListener('click', function(){
        player.activate();
    },false);
    document.addEventListener('escape', function(){
        player.deactivate();
    },false);
    
    var box = new Physijs.BoxMesh(
        new THREE.CubeGeometry(4,4,4),
        new THREE.MeshBasicMaterial({ color: 0x888888 }),
        0
    );
    box.position.set(0,-1.5,0);
    scene.add(box);
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
    player.update();
}

window.onresize = function() {
	camera.aspect = (window.innerWidth / window.innerHeight);
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}
window.onload = initScene();
