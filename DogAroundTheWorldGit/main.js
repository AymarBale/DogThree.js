import { spinner } from "./healthbar.js";
let inside = false;
const radius = 4;
const segments = 50;
const geometry = new THREE.CircleGeometry(radius, segments);
const MyObject = new THREE.Group();
const mat = new THREE.MeshBasicMaterial({
	color: "yellow",
});
const mySun = new THREE.Mesh(geometry, mat);
mySun.position.z -= 10;
mySun.position.x += 9.25;
mySun.position.y += 14.75;
mySun.rotation.set(-0.2, -0.5, 0);
//const meshUrl = new URL('../../3dModels/rover/scene.gltf', import.meta.url);
const meshUrl = new URL('./3dModels/rover/doggy.glb', import.meta.url);
const planetUrl = new URL('./3dModels/rover/myEarth.glb', import.meta.url);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setClearColor("#ff9500", 0);

const scene = new THREE.Scene();
scene.add(mySun);

const camera = new THREE.PerspectiveCamera(
	45,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);

const orbit = new THREE.OrbitControls(camera, renderer.domElement);
const axesHelper = new THREE.AxesHelper(50);
scene.add(axesHelper);

// Camera positioning
camera.position.set(8.638047976628341, 17.985795396606946, 27.460812425086093);

camera.updateProjectionMatrix()
orbit.update();

window.addEventListener("keydown", function (event) {
	if (event.defaultPrevented) {
		return; // Do nothing if the event was already processed
	}

	switch (event.key) {
		case "ArrowDown":
			console.log(camera.position);
			break;
		default:
			return; // Quit when this doesn't handle the key event.
	}

	// Cancel the default action to avoid it being handled twice
	event.preventDefault();
}, true);/**/

let hlight = new THREE.AmbientLight(0x404040, 5);

scene.add(hlight);
let directionalLight = new THREE.DirectionalLight(0xffffff, 5);
directionalLight.position.set(1, 1, -1);
directionalLight.castShadow = true;
scene.add(directionalLight);
let PlanetModel;
let dogModel;
const assetLoader = new THREE.GLTFLoader();
let mixer;

assetLoader.load(meshUrl.href, function (gltf) {
	const dogModel = gltf.scene;
	dogModel.rotation.set(-45.5, 0.3, 0)
	dogModel.position.x = 0.45;
	dogModel.position.z = -0.5;
	dogModel.position.y = 9.25;//11.25
	MyObject.add(dogModel);

	mixer = new THREE.AnimationMixer(dogModel);
	const clips = gltf.animations;
	const clip = THREE.AnimationClip.findByName(clips, "Walking");
	const action = mixer.clipAction(clip);
	action.play();
	inside = true;
}, undefined, function (error) {
	console.error(error);
});

let y = 0;

function TimeToSpin() {

	assetLoader.load(planetUrl.href, function (gltf) {
		PlanetModel = gltf.scene;
		PlanetModel.rotation.set(-0.1, -y, 0)
		PlanetModel.position.x = 0.45;
		PlanetModel.position.z = -0.5;
		PlanetModel.position.y = 3.5;  //5.5
		animatione();
		MyObject.add(PlanetModel);

	}, undefined, function (error) {
		console.error(error);
	});

}

function animatione() {
	if (spinner) {
		requestAnimationFrame(animatione)
		PlanetModel.rotation.x += 0.0205;
		renderer.render(scene, camera);
	}
}

function movingDog() {
	mixer = new THREE.AnimationMixer(model);
	const clips = gltf.animations;
	const clip = THREE.AnimationClip.findByName(clips, "Walking");
	const action = mixer.clipAction(clip);
	action.play();
}

scene.add(MyObject);
TimeToSpin();
const clock = new THREE.Clock();
function animate() {
	update();
	y += 1;
	renderer.render(scene, camera);
}
function update() {

	if (inside) {
		mixer.update(clock.getDelta());
	}
}
renderer.setAnimationLoop(animate);

window.addEventListener('resize', function () {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
});

export { TimeToSpin };
export { animatione }