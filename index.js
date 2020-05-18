'use strict';
	
Physijs.scripts.worker = '/lib/js/physijs_worker.js';
Physijs.scripts.ammo = '/lib/js/ammo.min.js';

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

    var capsule = new Physijs.BoxMesh(
        new THREE.CubeGeometry(0.3,2,0.3),
        new THREE.MeshBasicMaterial({ color: 0x888888 }),
    );
    // capsule.__dirtyPosition = true;
    capsule.name = "Player Mesh";
    capsule.position.y += 2;
    scene.add(capsule);

    player = new Player(camera,capsule);
    scene.add(player.getObject());

    document.addEventListener('click', function(){
        player.activate();
    },false);
    document.addEventListener('escape', function(){
        player.deactivate();
    },false);
    
    var floor = new Physijs.BoxMesh(
        new THREE.CubeGeometry(9,0.1,11),
        new THREE.MeshBasicMaterial({ color: 0x888888 }),
        0
    );
    floor.position.set(0,-0.04,0);
    floor.addEventListener('collision', function(other_object, relative_vel, relative_rot, contact_normal){
        other_object.setLinearVelocity(new THREE.Vector3(0,0,0));
        other_object.setAngularVelocity(new THREE.Vector3(0,0,0));
    });
    // box.__dirtyPosition = true;
    scene.add(floor);
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
