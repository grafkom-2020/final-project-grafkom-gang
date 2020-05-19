// STATE: negative -> opening/closed, 1 -> final, 2-(101/speed) -> animation
let interactSpeed = 3;
let interactables = [];
let passcode = '';
let keypad = [];
let font;

class PBRMaterial {
	constructor(name, ext, normal, alpha, ao, metalness, roughness) {
		let texture, texture_normal, texture_alpha, texture_ao, texture_metalness, texture_roughness;
		texture = texloader.load('/assets/textures/' + name + '_Color.' + ext);
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set(4, 4);
		if (normal) {
			texture_normal = texloader.load('/assets/textures/' + name + '_Normal.' + ext);
			texture_normal.wrapS = texture_normal.wrapT = THREE.RepeatWrapping;
			texture_normal.repeat.set(4, 4);
		}
		if (alpha) {
			texture_alpha = texloader.load('/assets/textures/' + name + '_Alpha.' + ext);
			texture_alpha.wrapS = texture_alpha.wrapT = THREE.RepeatWrapping;
			texture_alpha.repeat.set(4, 4);
		}
		if (ao) {
			texture_ao = texloader.load('/assets/textures/' + name + '_AO.' + ext);
			texture_ao.wrapS = texture_ao.wrapT = THREE.RepeatWrapping;
			texture_ao.repeat.set(4, 4);
		}
		if (metalness) {
			texture_metalness = texloader.load('/assets/textures/' + name + '_Metalness.' + ext);
			texture_metalness.wrapS = texture_metalness.wrapT = THREE.RepeatWrapping;
			texture_metalness.repeat.set(4, 4);
		}
		if (roughness) {
			texture_roughness = texloader.load('/assets/textures/' + name + '_Roughness.' + ext);
			texture_roughness.wrapS = texture_roughness.wrapT = THREE.RepeatWrapping;
			texture_roughness.repeat.set(4, 4);
		}
		this.material = new THREE.MeshStandardMaterial({
			map: texture,
			normalMap: normal ? texture_normal : null,
			alphaMap: alpha ? texture_alpha : null,
			transparent: alpha ? true : false,
			aoMap: ao ? texture_ao : null,
			metalnessMap: metalness ? texture_metalness : null,
			roughnessMap: roughness ? texture_roughness : null
		});
	}
}

function populateScene() {
	camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
	camera.position.set(0, 1.7, 0);
	scene.add(camera);
	let crosshairTexture = texloader.load('/assets/textures/Crosshair.png');
	let crosshair = new THREE.Mesh(new THREE.PlaneGeometry(0.004, 0.004), new THREE.MeshBasicMaterial({color: 0xFFFFFF, map: crosshairTexture, transparent: true}));
	crosshair.position.set(0, 0, -0.1);
	camera.add(crosshair);

	fontloader.load('/assets/fonts/7seg.json', (f) => {
		font = f;
		text = new THREE.Mesh(new THREE.TextGeometry(passcode, {font: f, size: 0.025, height: .051}), new THREE.MeshBasicMaterial({color: 0xFFFFFF}));
		text.position.set(3.95, 1.7, 2.43);
		text.rotation.set(0, -Math.PI / 2, 0);
		scene.add(text);
	});

	let ambient = new THREE.AmbientLight(0xFFFFFF, 0.3);
	scene.add(ambient);
	let light = new THREE.PointLight(0xFFFFFF, 1, 20, 2);
	light.position.set(0, 2.1, 0);
	light.castShadow = true;
	scene.add(light);

	objloader.load('/assets/models/scene.glb', (gltf) => {
		for (let i = 0; i < gltf.scene.children.length; i++) {
			gltf.scene.children[i].receiveShadow = true;
			gltf.scene.children[i].castShadow = true;
		}

		let concrete = new PBRMaterial('Plaster003_2K', 'jpg', true, false, false, false, false);
		let metal = new PBRMaterial('Metal009_2K', 'jpg', true, false, false, true, false);
		let sheetmetal = new PBRMaterial('Metal_Grill_002', 'jpg', true, false, true, false, false);
		let granite = new PBRMaterial('speckled_countertop1', 'png', false, false, true, false, true);
		let light = new THREE.MeshStandardMaterial({color: 0xFFFFFF, emissive: 0xFFFFFF});
		let glass = new THREE.MeshStandardMaterial({color: 0xFFFFFF, transparent: true, opacity: 0.5});
		
		gltf.scene.children[0].material = concrete.material;
		gltf.scene.children[1].material = concrete.material;
		gltf.scene.children[2].material = light;
		gltf.scene.children[3].material = metal.material;
		gltf.scene.children[4].material = metal.material;
		gltf.scene.children[5].material = metal.material;
		gltf.scene.children[6].material = metal.material;
		gltf.scene.children[7].material = metal.material;
		gltf.scene.children[8].material = metal.material;
		gltf.scene.children[9].material = granite.material;
		gltf.scene.children[10].material = granite.material;
		gltf.scene.children[11].material = sheetmetal.material;
		gltf.scene.children[12].material = granite.material;
		gltf.scene.children[13].material = granite.material;

		for (let i = 32; i < 44; i++) keypad.push(gltf.scene.children[i]);

		for (let i = 17; i < 32; i++) {
			gltf.scene.children[i].material = glass;
			gltf.scene.children[i].receiveShadow = false;
		}

		scene.add(gltf.scene);
		console.log(gltf.scene.children);

		// interactables.push(gltf.scene.children[4]);
		interactables.push({object: gltf.scene.children[5], state: -1, opened: [0, -110, 0]});
		interactables.push({object: gltf.scene.children[6], state: -1, opened: [0, 110, 0]});
		interactables.push({object: gltf.scene.children[9], state: -1, opened: [80, 0, 0]});
		interactables.push({object: gltf.scene.children[10], state: -1, opened: [80, 0, 0]});
		interactables.push({object: gltf.scene.children[47], state: -1, opened: [-120, 0, 0]});
		interactables.push({object: gltf.scene.children[51], state: -1, opened: [0, 100, 0]});
    });
}