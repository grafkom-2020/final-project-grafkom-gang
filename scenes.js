function populateScenes() {
    for (let i = 0; i < scenes.length; i++) {
        cameras[i] = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
        cameras[i].position.set(0, 1.7, 6);
		scenes[i].add(cameras[i]);
    }

    // SCENE #0

	let ambient = new THREE.AmbientLight(0xFFFFFF, 0.1);
	scenes[0].add(ambient);
	let light = new THREE.PointLight(0xFFFFFF, 1, 20, 2);
	light.position.set(0, 2.1, 0);
	light.castShadow = true;
	scenes[0].add(light);

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
		let concrete_material = new THREE.MeshStandardMaterial({map: concrete_texture, normalMap: concrete_normal});
		let light_material = new THREE.MeshStandardMaterial({color: 0xFFFFFF, emissive: 0xFFFFFF});
		let metal_material = new THREE.MeshStandardMaterial({map: metal_texture, normalMap: metal_normal, metalnessMap: metal_metal});
		gltf.scene.children[0].material = concrete_material;
		gltf.scene.children[1].material = concrete_material;
		gltf.scene.children[2].material = light_material;
		gltf.scene.children[3].material = metal_material;
		gltf.scene.children[4].material = metal_material;
		gltf.scene.children[5].material = metal_material;
		gltf.scene.children[6].material = metal_material;
		gltf.scene.children[7].material = metal_material;
		gltf.scene.children[8].material = metal_material;

		gltf.scene.children[1].castShadow = true;
		gltf.scene.children[3].castShadow = true;
		gltf.scene.children[5].castShadow = true;
		gltf.scene.children[6].castShadow = true;
		gltf.scene.children[7].castShadow = true;
		gltf.scene.children[8].castShadow = true;
		for (let i = 0; i < gltf.scene.children.length; i++) gltf.scene.children[i].receiveShadow = true;
		scenes[0].add(gltf.scene);
    });
    
    // SCENE #1
	let sphere = new THREE.Mesh(new THREE.SphereGeometry(0.1));
	sphere.position.set(0, 2.55, 0);
	scenes[1].add(sphere);
}
