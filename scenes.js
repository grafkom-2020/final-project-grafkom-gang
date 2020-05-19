// STATE: negative -> opening/closed, 1 -> final, 2-(101/speed) -> animation
let interactSpeed = 3;
let font;

// Special Objects
let actionobjects = [];
let interactables = [];
let takeable = [];
let keypad = [];
let vaultdoor;

// GAME STATES;
let passcode = '';
let cable = false;
let power = false;
let padlocked = true;

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
	let light = new THREE.PointLight(0xFFFFFF, 0, 20, 2);
	light.name = 'PointLight';
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
		let wood = new PBRMaterial('Wood_09_2K', 'png', true, false, false, false, true);
		let mesh = new PBRMaterial('2K-metal_mesh_1', 'jpg', true, false, true, false, false);
		let blackmetal = new PBRMaterial('2k-black_metal_1', 'jpg', true, false, true, false, false);
		let marble = new PBRMaterial('Marble004_2K', 'jpg', true, false, false, false, true);
		let cable = new PBRMaterial('Leather024_2K', 'jpg', true, false, false, false, true);
		let cable2 = new PBRMaterial('Leather024_2K', 'jpg', true, false, false, false, true);
		let light = new THREE.MeshStandardMaterial({color: 0xFFFFFF, emissive: 0x000000});
		let glass = new THREE.MeshStandardMaterial({color: 0xFFFFFF, transparent: true, opacity: 0.5});
		let spiritus = new THREE.MeshStandardMaterial({color: 0x2200AA});
		
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
		gltf.scene.children[14].material = blackmetal.material;
		gltf.scene.children[15].material = metal.material;
		gltf.scene.children[16].material = mesh.material;

		for (let i = 17; i < 32; i++) {
			gltf.scene.children[i].material = glass;
			gltf.scene.children[i].receiveShadow = false;
		}
		for (let i = 53; i < 72; i += 2) {
			gltf.scene.children[i].material = wood.material;
		}
		for (let i = 54; i < 73; i += 2) {
			gltf.scene.children[i].material = glass;
			gltf.scene.children[i].receiveShadow = false;
		}
		for (let i = 73; i < 81; i++) {
			gltf.scene.children[i].material = glass;
			gltf.scene.children[i].receiveShadow = false;
		}
		for (let i = 81; i < 84; i++) {
			gltf.scene.children[i].material = wood.material;
		}
		for (let i = 84; i < 86; i++) {
			gltf.scene.children[i].material = glass;
			gltf.scene.children[i].receiveShadow = false;
		}

		gltf.scene.children[32].material = new THREE.MeshPhongMaterial({map: new texloader.load('/assets/textures/0.png')});
		gltf.scene.children[33].material = new THREE.MeshPhongMaterial({map: new texloader.load('/assets/textures/1.png')});
		gltf.scene.children[34].material = new THREE.MeshPhongMaterial({map: new texloader.load('/assets/textures/2.png')});
		gltf.scene.children[35].material = new THREE.MeshPhongMaterial({map: new texloader.load('/assets/textures/3.png')});
		gltf.scene.children[36].material = new THREE.MeshPhongMaterial({map: new texloader.load('/assets/textures/4.png')});
		gltf.scene.children[37].material = new THREE.MeshPhongMaterial({map: new texloader.load('/assets/textures/5.png')});
		gltf.scene.children[38].material = new THREE.MeshPhongMaterial({map: new texloader.load('/assets/textures/6.png')});
		gltf.scene.children[39].material = new THREE.MeshPhongMaterial({map: new texloader.load('/assets/textures/7.png')});
		gltf.scene.children[40].material = new THREE.MeshPhongMaterial({map: new texloader.load('/assets/textures/8.png')});
		gltf.scene.children[41].material = new THREE.MeshPhongMaterial({map: new texloader.load('/assets/textures/9.png')});
		gltf.scene.children[42].material = new THREE.MeshPhongMaterial({map: new texloader.load('/assets/textures/delete.png')});
		gltf.scene.children[43].material = new THREE.MeshPhongMaterial({map: new texloader.load('/assets/textures/ok.png')});

		gltf.scene.children[44].material = blackmetal.material;
		gltf.scene.children[45].material = new THREE.MeshPhongMaterial({color: 0x222222});
		gltf.scene.children[46].material = blackmetal.material;

		gltf.scene.children[48].material = new THREE.MeshPhongMaterial({color: 0x444444});
		gltf.scene.children[49].material = cable2.material;
		gltf.scene.children[49].material.transparent = 1;
		gltf.scene.children[49].material.opacity = 0;
		gltf.scene.children[50].material = cable.material;

		gltf.scene.children[51].material = blackmetal.material;
		gltf.scene.children[52].material = cable.material;

		for (let i = 86; i < 103; i++) {
			gltf.scene.children[i].material = glass;
			gltf.scene.children[i].receiveShadow = false;
		}
		for (let i = 103; i < 107; i++) {
			gltf.scene.children[i].material = marble.material;
		}
		for (let i = 107; i < 120; i += 3) {
			gltf.scene.children[i].material = glass;
			gltf.scene.children[i].receiveShadow = false;
		}
		for (let i = 108; i < 121; i += 3) {
			gltf.scene.children[i].material = blackmetal;
		}
		for (let i = 109; i < 122; i += 3) {
			gltf.scene.children[i].material = spiritus;
			gltf.scene.children[i].receiveShadow = false;
		}
		gltf.scene.children[122].material = metal.material;
		gltf.scene.children[125].material = metal.material;

		for (let i = 127; i < 138; i++) {
			gltf.scene.children[i].material = glass;
			gltf.scene.children[i].receiveShadow = false;
			gltf.scene.children[i].castShadow = false;
		}

		gltf.scene.children[138].material = wood.material;
		gltf.scene.children[139].material = wood.material;
		gltf.scene.children[140].material = wood.material;
		gltf.scene.children[141].material = cable.material;

		gltf.scene.children[142].material = new THREE.MeshPhongMaterial({map: texloader.load('/assets/textures/keycode.png')});

		gltf.scene.children[143].material = metal.material;
		gltf.scene.children[144].material = blackmetal.material;
		gltf.scene.children[145].material = metal.material;

		scene.add(gltf.scene);
		console.log(gltf.scene.children);

		interactables.push({object: gltf.scene.children[5], state: -1, opened: [0, -110, 0]});
		interactables.push({object: gltf.scene.children[6], state: -1, opened: [0, 110, 0]});
		interactables.push({object: gltf.scene.children[9], state: -1, opened: [80, 0, 0]});
		interactables.push({object: gltf.scene.children[10], state: -1, opened: [80, 0, 0]});
		interactables.push({object: gltf.scene.children[47], state: -1, opened: [-120, 0, 0]});
		interactables.push({object: gltf.scene.children[51], state: -1, opened: [0, 100, 0]});
		interactables.push({object: gltf.scene.children[122], state: -1, opened: [0, 120, 0]});
		interactables.push({object: gltf.scene.children[139], state: -1, opened: [-60, 0, 0]});
		interactables.push({object: gltf.scene.children[140], state: -1, opened: [220, 0, 0]});

		for (let i = 32; i < 44; i++) keypad.push(gltf.scene.children[i]);

		takeable.push(scene.children[4].getObjectByName('Key'));
		takeable.push(scene.children[4].getObjectByName('CableItem'));

		for (let obj of interactables) actionobjects.push(obj.object);
		actionobjects.push(...takeable);
		actionobjects.push(...keypad);
		actionobjects.push(scene.children[4].getObjectByName('Padlock_steel'));
		actionobjects.push(scene.children[4].getObjectByName('Padlock_handle'));
		actionobjects.push(scene.children[4].getObjectByName('Kabel_2'));
	});
}