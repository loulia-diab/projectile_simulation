import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"; //اداة لتدوير وتحريك الكااميرا بالماوس
import Cannon from './classes/Cannon';
import loadWoodTextures from "./src/config/WoodTextures";
import loadWaterTextures from "./src/config/WaterTextures";
import { loadBallTextures } from "./src/config/BallTextures";

import { loadModels } from "./src/config/Models.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
/*
import flagVertexShader from "./src/shaders/FlagSheders/vertex.glsl";
import flagFragmentShader from "./src/shaders/FlagSheders/fragment.glsl";
*/
import World from "./src/physics/world.js";
import Ball from "./src/physics/ball.js";
import vector from "./src/physics/vector.js";
import * as dat from "dat.gui";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Variables

const gui = new dat.GUI();
gui.close();
const worldfolder = gui.addFolder("world");
const ballFolder = gui.addFolder("ball");
const coefficientsFolder = ballFolder.addFolder("coefficients");
coefficientsFolder.open();
coefficientsFolder.hide();
worldfolder.open();
ballFolder.open();
const GRAVITY = 9.8;
const HEIGHT = 0,
  TEMPERETURE = 15; // celsius
const WIND_SPEED = 10,
  WIND_ANGLE = Math.PI / 2;
const mouse = { x: 0, y: 0 }; ////////////////////

let isClicked = false;
let isFinished = false;
let isObjectLoaded = false;

const SHOOT_DELAY = 2000;//////تأخير بين إطلاقات الكرات (2 ثانية).
let lastShotingTime = 0;//////: آخر وقت أُطلقت فيه كرة.
let numberOfBalls = 20;
let numberOfTargets = 7;
let score = 0;

const intersectObjects = [];
const movingTargets = []; // نخزن فيه الأهداف المتحركة

window.addEventListener("mousemove", (e) => {
  // تحويل الإحداثيات من -1 إلى 1
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

/*
    Paramters
*/
const paramters = {
  windSpeed: 10,
  windAngle: Math.PI / 2,
  angular_speedX: 1,
  angular_speedY: 0,
  angular_speedZ: 1,
  axesHelper: false,
  radius: 3,
  gravity: 9.8,
  dragCoeff: 0.47,
  height: 0,
  tempereture: 15,
  resistanseCoeff: 0.8,
  frictionCoeff: 0.8,
  mass: 1000,
  speed: 20,
  type: 0,
  types: {
    default() {
      paramters.type = 0;
      paramters.ballTextures = ballTextures[0];
      coefficientsFolder.show();
      massController.domElement.hidden = false;
    },
    wood() {
      paramters.type = 1;
      paramters.ballTextures = ballTextures[1];
      coefficientsFolder.hide();
      massController.domElement.hidden = true;
    },
    steal() {
      paramters.type = 2;
      paramters.ballTextures = ballTextures[0];
      coefficientsFolder.hide();
      massController.domElement.hidden = true;
    },
    rubber() {
      paramters.type = 3;
      paramters.ballTextures = ballTextures[2];
      coefficientsFolder.hide();
      massController.domElement.hidden = true;
    },
  },
};

// Physics World
// ================================

const world = new World(GRAVITY, HEIGHT, TEMPERETURE, WIND_SPEED, WIND_ANGLE);
worldfolder
  .add(paramters, "gravity", -10, 100, 0.1)
  .name("gravity")
  .onChange(() => {
    world.gravity = paramters.gravity;
  });

worldfolder
  .add(paramters, "windSpeed", 0, 100, 0.01)
  .name("Wind Speed")
  .onChange(() => {
    world.wind_speed = paramters.windSpeed;
  });
worldfolder
  .add(paramters, "windAngle", 0, 6.2831853072, 0.2)
  .name("Wind Angle")
  .onChange(() => {
    world.wind_angle = paramters.windAngle;
    rotateAboutPoint(
      flag,
      flagBase.position,
      new THREE.Vector3(0, 1, 0),
      paramters.windAngle
    );
  });
worldfolder
  .add(paramters, "height", -100, 1000, 10)
  .name("Height")
  .onChange(() => {
    world.height = paramters.height;
  });

worldfolder
  .add(paramters, "tempereture", -100, 100, 1)
  .name("Tempereture")
  .onChange(() => {
    world.tempereture = paramters.tempereture;
  });

/* 
    Tweak gui values
*/
ballFolder.add(paramters, "axesHelper");
ballFolder.add(paramters, "radius", 0, 1, 0.01).name("ball radius");
let massController = ballFolder
  .add(paramters, "mass", 1, 5000, 0.5)
  .name("ball mass");
ballFolder.add(paramters, "speed", 10, 35, 0.1).name("ball speed");
ballFolder
  .add(paramters, "angular_speedX", -10, 10, 0.1)
  .name("Angular speed X");
ballFolder
  .add(paramters, "angular_speedY", -10, 10, 0.1)
  .name("Angular speed Y");
ballFolder
  .add(paramters, "angular_speedZ", -10, 10, 0.1)
  .name("Angular speed Z");
const subFolder = ballFolder.addFolder("types");
subFolder.add(paramters.types, "default");
subFolder.add(paramters.types, "wood");
subFolder.add(paramters.types, "steal");
subFolder.add(paramters.types, "rubber");
subFolder.open();

coefficientsFolder.add(paramters, "dragCoeff", 0, 1, 0.001).name("dragCoeff");
coefficientsFolder
  .add(paramters, "resistanseCoeff", 0, 1, 0.001)
  .name("resistanseCoeff");
coefficientsFolder
  .add(paramters, "frictionCoeff", 0, 1, 0.001)
  .name("frictionCoeff");


// Textures
const textureLoader = new THREE.TextureLoader();
const woodTextures = loadWoodTextures(textureLoader);
const waterTextures = loadWaterTextures(textureLoader);
const ballTextures = loadBallTextures(textureLoader);
paramters.ballTextures = ballTextures;
paramters.types.default();

// Scene
const scene = new THREE.Scene();

// سطح السفينة الخشبي
const deck = new THREE.Mesh(
  new THREE.PlaneGeometry(600, 1000, 10, 10),
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
  new THREE.PlaneGeometry(4000, 4000, 10, 10),
  new THREE.MeshStandardMaterial({
    map: waterTextures.waterColorTexture,
    normalMap: waterTextures.waterNormalTexture,
    transparent: true,
    opacity: 0.9,
 
  })
);
water.rotation.x = -Math.PI / 2;
water.position.y = -1; // تحت سطح السفينة قليلاً
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
  new THREE.BoxGeometry(600, wallHeight, wallThickness),
  wallMaterial
);
frontWall.position.set(0, wallHeight / 2, -500);
scene.add(frontWall);

const backWall = frontWall.clone();
backWall.position.set(0, wallHeight / 2, 500);
scene.add(backWall);

const leftWall = new THREE.Mesh(
  new THREE.BoxGeometry(wallThickness, wallHeight, 1000),
  wallMaterial
);
leftWall.position.set(-300, wallHeight / 2, 0);
scene.add(leftWall);

const rightWall = leftWall.clone();
rightWall.position.set(300, wallHeight / 2, 0);
scene.add(rightWall);

// Models
const gltfLoader = new GLTFLoader();
loadModels(scene, gltfLoader, intersectObjects, movingTargets);

///////////////////////////////////////////////

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
  4000
);
camera.position.x = 0;
camera.position.y = 100;
camera.position.z = 530;
scene.add(camera);

// sounds
const listener = new THREE.AudioListener();
camera.add(listener);

const backgroundSound = new THREE.Audio(listener);
const audioLoader = new THREE.AudioLoader();

audioLoader.load('static/sounds/Captain-Jack-Sparrow-theme-music.m4a', function(buffer) {
    backgroundSound.setBuffer(buffer);
    backgroundSound.setLoop(true);      // تكرار الصوت
    backgroundSound.setVolume(0.5);     // مستوى الصوت (0 = صامت، 1 = أقصى)
    backgroundSound.play();             // تشغيل الصوت
});
audioLoader.load("static/sounds/CANNON-SOUND-EFFECT-HD-FOR-VIDEOS-and-GAMES.m4a", (audioBuffer) => {
  shootingSoundEffect.setBuffer(audioBuffer);

});
const shootingSoundEffect = new THREE.Audio(listener);
shootingSoundEffect.setVolume(1);
scene.add(shootingSoundEffect);


/*
    Game Screen

const numberofBallsWidget = document.querySelector(".cannonBallsNumber");
numberofBallsWidget.innerHTML = numberOfBalls;

const scoreWidget = document.querySelector(".ScoreNumber");
scoreWidget.innerHTML = score;

const targetWidget = document.querySelector(".targetNumbers");
targetWidget.innerHTML = numberOfTargets;

const gameFinshed = document.querySelector(".gameFinshedLayout");

const playAgain = document.querySelector(".playAgain");
*/

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
  //document.addEventListener("keydown", onDocumentKeyDown, false);
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

// في المركز اظهار المحاورs
var axesHelper = new THREE.AxesHelper(500);
//scene.add(axesHelper);
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
}
// =============================================================
// Cannon & Ball 
// =============================================================
//

let cannon;
gltfLoader.load("static/models/cannon.glb", (gltf) => {
  cannon = new Cannon(gltf, scene);
}, undefined, (err) => console.error("Failed to load cannon:", err));
let lastShootingTime = 0; 

let objectsToUpdate = [];
let shotedTaregt = [];

window.addEventListener("keydown", (e) => {
  if(e.key === " " && cannon && cannon.isReady && performance.now() - lastShootingTime > 2000){
    createCannonBall();
    cannon.recoil();
    lastShootingTime = performance.now();
    shootingSoundEffect.play();
  }
});

const createCannonBall = () => {
//  removeBallsGreaterThanOne();
  
  // الشكل المرئي للطابة
  let cannonBall = new THREE.Mesh(
    new THREE.SphereGeometry(paramters.radius * 5, 32, 32),
     new THREE.MeshStandardMaterial({
      map: paramters.ballTextures.color,
      aoMap: paramters.ballTextures.ao,
      roughnessMap: paramters.ballTextures.roughness,
      normalMap: paramters.ballTextures.normal,
      metalnessMap: paramters.ballTextures.metalness,
    })
  );
  cannonBall.castShadow = true;
  cannonBall.position.copy(cannon.getBallPosition());
  /*
  const ballAxes = new THREE.AxesHelper(50);
cannonBall.add(ballAxes);
*/
  scene.add(cannonBall);

  // axes helper
  
  if (axesHelper) scene.remove(axesHelper);
  axesHelper = new THREE.AxesHelper(500);
  scene.add(axesHelper);
  
  // فيزياء الطابة
  const angular_speed = vector.create(
    paramters.angular_speedX,
    paramters.angular_speedY,
    paramters.angular_speedZ
  );
  // خذ موقع فوهة الطابة العالمي
 
    const ballDirection = cannon.getDirection();
    const ballStartPos = cannon.getBallPosition();
    ballDirection.z *= -1; 
   const angleXY = Math.asin(ballDirection.y);
   const angleXZ = Math.atan2(ballDirection.z, ballDirection.x);


let physicsBall = new Ball(
    ballStartPos,                // موقع الطابة
    paramters.speed, // السرعة الابتدائية
        angleXY,
        angleXZ,
    paramters.radius,
    paramters.type,
    paramters.mass,
    paramters.dragCoeff,
    angular_speed,
    paramters.resistanseCoeff,
    paramters.frictionCoeff
);

  world.add(physicsBall);

  objectsToUpdate.push({ cannonBall, physicsBall });
  intersectObjects.push(cannonBall);
};


const removeBallsGreaterThanOne = () => {
  if (objectsToUpdate.length >= 1) {
    objectsToUpdate.forEach((e) => {
      scene.remove(e.cannonBall);
      e.cannonBall.material.dispose();
      e.cannonBall.geometry.dispose();
      intersectObjects = intersectObjects.filter((i) => i !== e.cannonBall);
      world.remove(e.physicsBall);
    });
    objectsToUpdate = [];
  }
};



const clock = new THREE.Clock();
let mixers = [];

let oldElapsedTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - oldElapsedTime;
  oldElapsedTime = elapsedTime;

  // تحديث الفيزياء
  world.update(deltaTime);

  // تحريك الأهداف المتحركة
  movingTargets.forEach(target => {
    target.position.x += target.userData.direction * target.userData.speed;
    if (target.position.x > 150) target.userData.direction = -1;
    else if (target.position.x < -150) target.userData.direction = 1;
  });

  // مزامنة الطابات مع الفيزياء
  objectsToUpdate.forEach((object, index) => {
    const { cannonBall, physicsBall } = object;

    // تحديث موقع الطابة
    cannonBall.position.copy(physicsBall.position);
    cannonBall.quaternion.copy(physicsBall.quaternion);
    
    if (axesHelper) {
      axesHelper.position.copy(cannonBall.position);
      axesHelper.quaternion.copy(cannonBall.quaternion);
      axesHelper.visible = paramters.axesHelper;
    }
    
    if (
      Math.abs(cannonBall.position.x) > 900 ||
      Math.abs(cannonBall.position.z) > 900
    ) {
      setTimeout(() => {
        scene.remove(cannonBall);
        cannonBall.geometry.dispose();
        cannonBall.material.dispose();
        world.remove(physicsBall);
        objectsToUpdate.splice(index, 1);
      }, 1000);
    }
  });

    if (cannon?.isReady) {
        cannon.update(mouse);
    }
        renderer.render(scene, camera);
  
    requestAnimationFrame(tick);
};

tick();