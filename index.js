'use strict';
	
Physijs.scripts.worker = '/lib/js/physijs_worker.js';
Physijs.scripts.ammo = '/lib/js/ammo.js';

var initScene, render, objloader, texloader, renderer, scene, camera

function populateScene(scene) {
	camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
	camera.position.set(0, 1.7, 6);
	// camera.lookAt(new THREE.Vector3(0, 0, 0));
	scene.add( camera );
	
	let box = new Physijs.BoxMesh(new THREE.CubeGeometry( 5, 5, 5 ), new THREE.MeshBasicMaterial({ color: 0x888888 }));
	let plane = new Physijs.BoxMesh(new THREE.CubeGeometry(50,1,50), new THREE.MeshBasicMaterial({color: 0x880000 }), 0);
	plane.position.set(0,-10,0);
	plane.addEventListener( 'collision', function( other_object, relative_velocity, relative_rotation, contact_normal ) {
		other_object.setAngularFactor(new THREE.Vector3(0,0,0));
		other_object.setLinearFactor(new THREE.Vector3(0,0,0));
	});
	// scene.add( box );
	// scene.add( plane );

	let ambient = new THREE.AmbientLight(0xFFFFFF, 0.1);
	scene.add(ambient);
	let light = new THREE.PointLight(0xFFFFFF, 1, 20, 2);
	light.position.set(0, 2.1, 0);
	light.castShadow = true;
	scene.add(light);

	// let sphere = new THREE.Mesh(new THREE.SphereGeometry(0.1));
	// sphere.position.set(0, 2.55, 0);
	// scene.add(sphere);

	objloader.load('/assets/models/scene.glb', (gltf) => {
		let concrete_texture = texloader.load('/assets/textures/Plaster003_2K_Color.jpg');
		concrete_texture.wrapS = THREE.RepeatWrapping;
		concrete_texture.wrapT = THREE.RepeatWrapping;
		concrete_texture.repeat.set(4, 4);
		let concrete_normal = texloader.load('/assets/textures/Plaster003_2K_Normal.jpg');
		concrete_normal.wrapS = THREE.RepeatWrapping;
		concrete_normal.wrapT = THREE.RepeatWrapping;
		concrete_normal.repeat.set(4, 4);
		let metal_texture = texloader.load('/assets/textures/Metal009_2K_Color.jpg');
		metal_texture.wrapS = THREE.RepeatWrapping;
		metal_texture.wrapT = THREE.RepeatWrapping;
		metal_texture.repeat.set(4, 4);
		let metal_normal = texloader.load('/assets/textures/Metal009_2K_Normal.jpg');
		metal_normal.wrapS = THREE.RepeatWrapping;
		metal_normal.wrapT = THREE.RepeatWrapping;
		metal_normal.repeat.set(4, 4);
		let metal_metal = texloader.load('/assets/textures/Metal009_2K_Metalness.jpg');
		metal_metal.wrapS = THREE.RepeatWrapping;
		metal_metal.wrapT = THREE.RepeatWrapping;
		metal_metal.repeat.set(4, 4);
		gltf.scene.children[0].material = new THREE.MeshStandardMaterial({map: concrete_texture, normalMap: concrete_normal});
		gltf.scene.children[1].material = new THREE.MeshStandardMaterial({map: concrete_texture, normalMap: concrete_normal});
		gltf.scene.children[2].material = new THREE.MeshStandardMaterial({color: 0xFFFFFF, emissive: 0xFFFFFF});
		gltf.scene.children[3].material = new THREE.MeshStandardMaterial({map: metal_texture, normalMap: metal_normal, metalnessMap: metal_metal});
		gltf.scene.children[4].material = new THREE.MeshStandardMaterial({map: metal_texture, normalMap: metal_normal, metalnessMap: metal_metal});
		gltf.scene.children[5].material = new THREE.MeshStandardMaterial({map: metal_texture, normalMap: metal_normal, metalnessMap: metal_metal});
		gltf.scene.children[6].material = new THREE.MeshStandardMaterial({map: metal_texture, normalMap: metal_normal, metalnessMap: metal_metal});
		gltf.scene.children[7].material = new THREE.MeshStandardMaterial({map: metal_texture, normalMap: metal_normal, metalnessMap: metal_metal});
		gltf.scene.children[8].material = new THREE.MeshStandardMaterial({map: metal_texture, normalMap: metal_normal, metalnessMap: metal_metal});

		gltf.scene.children[1].castShadow = true;
		gltf.scene.children[3].castShadow = true;
		gltf.scene.children[5].castShadow = true;
		gltf.scene.children[6].castShadow = true;
		gltf.scene.children[7].castShadow = true;
		gltf.scene.children[8].castShadow = true;
		for (let i = 0; i < gltf.scene.children.length; i++) gltf.scene.children[i].receiveShadow = true;
		scene.add(gltf.scene);
	});
}

initScene = function() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	document.getElementById( 'viewport' ).appendChild( renderer.domElement );

	objloader = new THREE.GLTFLoader();
	texloader = new THREE.TextureLoader();
	
	scene = new Physijs.Scene;
	populateScene(scene);
	
	requestAnimationFrame( render );

    listenTo(document);
    addKeyToListen("KeyW");
    addKeyToListen("KeyA");
    addKeyToListen("KeyS");
    addKeyToListen("KeyD");
    
    requestAnimationFrame( render );
};

render = function() {

    scene.simulate(); // run physics
    renderer.render( scene, camera); // render the scene
    if(isKey("KeyA")){
        console.log("A is held");
    }
    
    if(isKeyDown("KeyD")){
        console.log("D is pressed");
    }

    if(isKeyUp("KeyS")){
        console.log("S is released");
    }

    refreshInput();
    requestAnimationFrame( render );
};

window.onresize = function() {
	this.camera.aspect = window.innerWidth / window.innerHeight;
	this.camera.updateProjectionMatrix();
	this.renderer.setSize(window.innerWidth, window.innerHeight);
}
window.onload = initScene();
