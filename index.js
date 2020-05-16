'use strict';
	
Physijs.scripts.worker = '/lib/js/physijs_worker.js';
Physijs.scripts.ammo = '/lib/js/ammo.js';

var initScene, render, renderer, scene, camera, box, plane;

initScene = function() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.getElementById( 'viewport' ).appendChild( renderer.domElement );
    
    scene = new Physijs.Scene;
    
    camera = new THREE.PerspectiveCamera(
        35,
        window.innerWidth / window.innerHeight,
        1,
        1000
    );
    camera.position.set( 10, 10, 60 );
    camera.lookAt( scene.position );
    scene.add( camera );
    
    // Box
    box = new Physijs.BoxMesh(
        new THREE.CubeGeometry( 5, 5, 5 ),
        new THREE.MeshBasicMaterial({ color: 0x888888 })
    );
    plane = new Physijs.BoxMesh(
        new THREE.CubeGeometry(50,1,50),
        new THREE.MeshBasicMaterial({color: 0x880000 }),
        0
    );
    
    plane.position.set(0,-10,0);
    plane.addEventListener( 'collision', function( other_object, relative_velocity, relative_rotation, contact_normal ) {
        // `this` has collided with `other_object` with an impact speed of `relative_velocity` and a rotational force of `relative_rotation` and at normal `contact_normal`
        other_object.setAngularFactor(new THREE.Vector3(0,0,0));
        other_object.setLinearFactor(new THREE.Vector3(0,0,0));
    });
    scene.add( box );
    scene.add( plane );

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
