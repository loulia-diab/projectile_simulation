
import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"; //اداة لتدوير وتحريك الكااميرا بالماوس
import Cannon from './classes/Cannon';
import loadWoodTextures from "./src/config/WoodTextures";
import loadWaterTextures from "./src/config/WaterTextures";

//import { loadModels } from "./src/config/Models.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Variables
let intersectObjects = [];

// Textures
const textureLoader = new THREE.TextureLoader();
const woodTextures = loadWoodTextures(textureLoader);
const waterTextures = loadWaterTextures(textureLoader);

// floor
/*
const grasscolorTexture = textureLoader.load("./textures/grass/color.jpg");
const grassambientocculsionTexture = textureLoader.load(
  "./textures/grass/ambientOcclusion.jpg"
);
const grassroughnessTexture = textureLoader.load(
  "./textures/grass/roughness.jpg"
);
const grassnormalTexture = textureLoader.load("./textures/grass/normal.jpg");
const DisplacementTexture = textureLoader.load(
  "./textures/grass/Displacement.jpg"
);
*/
// Scene
const scene = new THREE.Scene();

/*
const geometry = new THREE.CircleGeometry(2000, 2000);
const material = new THREE.MeshStandardMaterial({
  map: grasscolorTexture,
  aoMap: grassambientocculsionTexture,
  roughnessMap: grassroughnessTexture,
  normalMap: grassnormalTexture,
  displacementMap: DisplacementTexture,
});
const Meshfloor = new THREE.Mesh(geometry, material);

Meshfloor.rotation.x = -Math.PI * 0.5;
Meshfloor.position.y = 0;
scene.add(Meshfloor);
*/

// سطح السفينة الخشبي
const deck = new THREE.Mesh(
  new THREE.PlaneGeometry(1000, 600, 10, 10),
  new THREE.MeshStandardMaterial({
    map: woodTextures.woodColorTexture,
    aoMap: woodTextures.woodAmbientOcclusionTexture,
    displacementMap: woodTextures.woodHeightTexture,
    displacementScale: 0.2,
    normalMap: woodTextures.woodNormalTexture,
    roughnessMap: woodTextures.woodRoughnessTexture,
  })
);
deck.rotation.x = -Math.PI / 2;
deck.receiveShadow = true;
scene.add(deck);

// الماء حول السفينة

const water = new THREE.Mesh(
  new THREE.PlaneGeometry(3000, 3000, 10, 10),
  new THREE.MeshStandardMaterial({
    map: waterTextures.waterColorTexture,
    normalMap: waterTextures.waterNormalTexture,
    transparent: true,
    opacity: 0.9,
  })
);
water.rotation.x = -Math.PI / 2;
water.position.y = -0.3; // تحت سطح السفينة قليلاً
scene.add(water);

// سور السفينة
const wallHeight = 30;
const wallThickness = 2;
const wallMaterial = new THREE.MeshStandardMaterial({
  map: woodTextures.woodColorTexture.clone(),
  normalMap: woodTextures.woodNormalTexture.clone(),
});

wallMaterial.map.repeat.set(8, 0.5);
wallMaterial.map.wrapS = THREE.RepeatWrapping;
wallMaterial.map.wrapT = THREE.RepeatWrapping;

const frontWall = new THREE.Mesh(
  new THREE.BoxGeometry(1000, wallHeight, wallThickness),
  wallMaterial
);
frontWall.position.set(0, wallHeight / 2, -300);
scene.add(frontWall);

const backWall = frontWall.clone();
backWall.position.set(0, wallHeight / 2, 300);
scene.add(backWall);

const leftWall = new THREE.Mesh(
  new THREE.BoxGeometry(wallThickness, wallHeight, 600),
  wallMaterial
);
leftWall.position.set(-500, wallHeight / 2, 0);
scene.add(leftWall);

const rightWall = leftWall.clone();
rightWall.position.set(500, wallHeight / 2, 0);
scene.add(rightWall);


/*
grasscolorTexture.repeat.set(18000, 18000);
grassambientocculsionTexture.repeat.set(18000, 18000);
grassnormalTexture.repeat.set(18000, 18000);
grassroughnessTexture.repeat.set(18000, 18000);
DisplacementTexture.repeat.set(18000, 18000);

grasscolorTexture.wrapS = THREE.RepeatWrapping;
grassambientocculsionTexture.wrapS = THREE.RepeatWrapping;
grassnormalTexture.wrapS = THREE.RepeatWrapping;
grassroughnessTexture.wrapS = THREE.RepeatWrapping;
DisplacementTexture.wrapS = THREE.RepeatWrapping;

grasscolorTexture.wrapT = THREE.RepeatWrapping;
grassambientocculsionTexture.wrapT = THREE.RepeatWrapping;
grassnormalTexture.wrapT = THREE.RepeatWrapping;
grassroughnessTexture.wrapT = THREE.RepeatWrapping;
DisplacementTexture.wrapT = THREE.RepeatWrapping;
*/


// Lights

// Ambient light
const ambientLight = new THREE.AmbientLight("#9ca5b5ff", 0.75);
scene.add(ambientLight);

// Directional light b9d5ff
const moonLight = new THREE.DirectionalLight(0xfff5c2, 1.2); // شمس ناعمة
//const moonLight = new THREE.DirectionalLight("#ffffff", 0.5);
moonLight.position.set(4, 5, -2);
moonLight.castShadow = true;
scene.add(moonLight);

// end light


//////////////////////////////////////////camera and resize  ////////////////////////////////////////////
// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
/*
window.onload = () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
};
*/
// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.x = -470;
camera.position.y = 30;
camera.position.z = 0;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// تفعيل الظلال
renderer.shadowMap.enabled = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;

// camera

// resize
window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  document.addEventListener("keydown", onDocumentKeyDown, false);
});
// end resize

////////////////////////////////////end camera and resize  ////////////////////////////////////////////


//renderer.setClearColor("#4682B4"); // steel blue
/*
    Configure Scene
*/
//scene.fog = new THREE.Fog(0xcce0ff, 1300, 1600);
const texture = textureLoader.load("static/textures/textures/skybox/kloofendal_48d_partly_cloudy_puresky.png", () => {
  const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
  rt.fromEquirectangularTexture(renderer, texture);
  scene.background = rt.texture;
});


////////////////////////////////////  Model   ////////////////////////////////////////////////////////
//اظهار المحاورs
var axesHelper = new THREE.AxesHelper(500);
scene.add(axesHelper);
///////////////////////////////////
window.onload = () => {

   // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

 const cannon = new Cannon(scene);
if (cannon && cannon.isReady) {
  console.log("Cannon position:", cannon.group.position);
  if (cannon.ball) {
    const ballWorldPos = new THREE.Vector3();
    cannon.ball.mesh.getWorldPosition(ballWorldPos);
    console.log("Ball world position:", ballWorldPos);
  }
}

const clock = new THREE.Clock();
let mixers = [];

let oldElapsedTime = 0;

function animate() {
  requestAnimationFrame(animate);

  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - oldElapsedTime;
  oldElapsedTime = elapsedTime;

  // تحديث المدفع إذا كان جاهز
   if (cannon && cannon.isReady) {
    cannon.update();
  }

  // تحديث الأنيميشن
  mixers.forEach((mixer) => mixer.update(deltaTime));

  controls.update();
  renderer.render(scene, camera);
}

animate();
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 

