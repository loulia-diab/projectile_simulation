/*import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Cannon from './classes/Cannon';
import World from './physics/world';
import Ball from './physics/ball';

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Textures
const textureLoader = new THREE.TextureLoader();

// floor
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

// Scene
const scene = new THREE.Scene();
const geometry = new THREE.CircleGeometry(20000, 20000);


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

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.x = 15;
camera.position.y = 10;
camera.position.z = 70;
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


renderer.setClearColor("#4682B4"); // steel blue


////////////////////////////////////  Model   ////////////////////////////////////////////////////////
//اظهار المحاورs
var axesHelper = new THREE.AxesHelper(500);
scene.add(axesHelper);
// ===================================================================
// 7. منطق اللعبة (مدمج بدلاً من فئات منفصلة)
// ===================================================================


// Physics & Cannon
const world = new World();
const cannon = new Cannon(scene); // ✅ تمرير المشهد فقط كما في الكود الأصلي

// Animation loop
const clock = new THREE.Clock();
let mixers = [];
let oldElapsedTime = 0;

const animate = () => {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - oldElapsedTime;
    oldElapsedTime = elapsedTime;

    if (cannon.isReady) {
        cannon.update();
    }

    world.update(deltaTime);
    mixers.forEach((mixer) => mixer.update(deltaTime));

    controls.update();
    renderer.render(scene, camera);
};

// Events
window.addEventListener("resize", () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.onload = () => {
    animate();
};






/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 

*/
// main.js - ملف رئيسي نظيف ومنظم
// main.js - ملف رئيسي نظيف ومنظم
//import "./styles.css";
import * as THREE from "three";
import gsap from "gsap";

import GameManager from "./classes/GameManager.js";
import SceneManager from "./classes/SceneManager.js";
import GUIController from "./classes/GUIController.js";
import World from "./physics/world.js";
import Cannon from "./classes/Cannon.js";
// ===================================================================
// 1. تعريف متغيرات التطبيق الرئيسية
// ===================================================================
let isObjectLoaded = false;
const clock = new THREE.Clock();
const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const mouse = new THREE.Vector2();

// Game Screen widgets
const numberofBallsWidget = document.querySelector(".cannonBallsNumber");
const scoreWidget = document.querySelector(".ScoreNumber");
const targetWidget = document.querySelector(".targetNumbers");
const gameFinshedLayout = document.querySelector(".gameFinshedLayout");
const playAgain = document.querySelector(".playAgain");
const loadingLayout = document.querySelector(".loadingLayout");
const loadingBar = document.querySelector(".loadingBar");
const screenInfo = document.querySelector(".screenInfo");

let world, cannon, gameManager, sceneManager, guiController;
let chasingCamera, camera;

// ===================================================================
// 2. دوال مساعدة
// ===================================================================
const updateCannon = () => {
  if (cannon) {
    cannon.updateAim(mouse);
  }
};

const startGame = () => {
  // تهيئة عالم الفيزياء والمدفع ومدير اللعبة
  world = new World(9.8, 0, 15, 10, Math.PI / 2);
  cannon = new Cannon(sceneManager.scene, world);
  const widgets = { numberofBallsWidget, scoreWidget, targetWidget, gameFinshedLayout };
  gameManager = new GameManager(sceneManager.scene, cannon, world, widgets);
  guiController = new GUIController(world, cannon, gameManager);
  
  // تحديث GUI
  guiController.updateBallParams(cannon.ball);
  
  // بدء حلقة الرسوم
  tick();
};

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const delteTime = elapsedTime - clock.oldElapsedTime;
  clock.oldElapsedTime = elapsedTime;

  if (cannon && cannon.isReady) {
    updateCannon();
    cannon.update(delteTime);
  }
  
  world.update(delteTime);
  
  // تحديث كاميرا التعقب إذا كانت مفعلة
  if (cannon && cannon.isCameraChasing && cannon.objectsToUpdate.length > 0) {
    const ball = cannon.objectsToUpdate[0].cannonBall;
    sceneManager.chasingCamera.position.copy(
      ball.position.clone().add(new THREE.Vector3(0, 0, 50))
    );
    sceneManager.chasingCamera.lookAt(ball.position);
    sceneManager.renderer.render(sceneManager.scene, sceneManager.chasingCamera);
  } else {
    sceneManager.renderer.render(sceneManager.scene, sceneManager.camera);
  }

  requestAnimationFrame(tick);
};

// ===================================================================
// 3. التحميل والتهيئة
// ===================================================================
const loadingManger = new THREE.LoadingManager(
  () => {
    gsap.delayedCall(0.5, () => {
      gsap.to(sceneManager.overlay.material.uniforms.uAlpha, { duration: 3, value: 0 });
      loadingBar.classList.add("ended");
      loadingBar.style.transform = "";
      screenInfo.classList.remove("hide");
    });
    isObjectLoaded = true;
    startGame();
  },
  (itemUrl, itemsLoaded, itemsTotal) => {
    loadingBar.style.transform = `scaleX(${itemsLoaded / itemsTotal})`;
  }
);

sceneManager = new SceneManager(size, mouse, loadingManger);

// Events
window.addEventListener("click", () => {
  if (isObjectLoaded && cannon) {
    gameManager.handleShoot();
  }
});

playAgain.addEventListener("mousedown", () => {
  if (gameManager) {
    gameManager.resetGame();
  }
});

window.addEventListener("mousemove", (event) => {
  mouse.x = event.pageX / size.width;
  mouse.y = event.pageY / size.height;
});

window.addEventListener("keydown", (event) => {
  if (cannon) {
    if (event.code === "Digit2") {
      cannon.isCameraChasing = true;
    } else if (event.code === "Digit1") {
      cannon.isCameraChasing = false;
    }
  }
});

window.addEventListener("resize", () => {
  size.width = window.innerWidth;
  size.height = window.innerHeight;
  if (sceneManager) {
    sceneManager.onResize(size);
  }
});
