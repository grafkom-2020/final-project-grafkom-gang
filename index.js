'use strict';
	
Physijs.scripts.worker = '/lib/js/physijs_worker.js';
Physijs.scripts.ammo = '/lib/js/ammo.js';

var initScene, render, objloader, texloader, renderer;

let scenes = [], cameras = [], activeScene;

initScene = function() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	document.getElementById( 'viewport' ).appendChild( renderer.domElement );
	objloader = new THREE.GLTFLoader();
	texloader = new THREE.TextureLoader();
	activeScene = 0;
	
	scenes.push(new Physijs.Scene());
	scenes.push(new Physijs.Scene());
	populateScenes();
	
	requestAnimationFrame( render );

    listenTo(document);
    addKeyToListen("KeyW");
    addKeyToListen("KeyA");
    addKeyToListen("KeyS");
    addKeyToListen("KeyD");
    
    requestAnimationFrame( render );
};

render = function() {

    scenes[activeScene].simulate(); // run physics
    update();
    renderer.render(scenes[activeScene], cameras[activeScene]); // render the scene
    refreshInput();
    requestAnimationFrame(render);
};

// game logic
function update(){
    if(isKey("KeyA")){
        console.log("A is held");
    }
    
    if(isKeyDown("KeyD")){
        console.log("D is pressed");
    }

    if(isKeyUp("KeyS")){
        console.log("S is released");
    }
}

window.onresize = function() {
	for (camera of cameras) {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
	}
	this.renderer.setSize(window.innerWidth, window.innerHeight);
}
window.onload = initScene();
