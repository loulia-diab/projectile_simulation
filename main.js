import "./style.css";
import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"; //اداة لتدوير وتحريك الكااميرا بالماوس
import Cannon from './classes/Cannon';
import loadWoodTextures from "./src/config/WoodTextures";
import loadWaterTextures from "./src/config/WaterTextures";
import { loadBallTextures } from "./src/config/BallTextures";

import { loadModels } from "./src/config/Models.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import World from "./src/physics/world.js";
import Ball from "./src/physics/ball.js";
import vector from "./src/physics/vector.js";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Variables

const gui = new dat.GUI();
gui.close();
let argument = window.matchMedia("(max-width: 425px)");
let fun = (argument) => {
  if (argument.matches) {
    gui.width = 200;
  } else {
    gui.width = 250;
  }
};
fun(argument);
argument.addListener(fun);
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
const mouse = { x: 0,
   y: 0 }; ////////////////////
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

  windSpeed: 1,

  windAngle: Math.PI / 2,
  angular_speedX: 1,
  angular_speedY: 0,
  angular_speedZ: 1,
  axesHelper: false,
  radius: 0.8,
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
    world.wind_angle = paramters.windAngle
    /*
    rotateAboutPoint(
      flag,
      flagBase.position,
      new THREE.Vector3(0, 1, 0),
      paramters.windAngle
    );
    */
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
deck.position.y = -5;
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
water.position.y = -6; // تحت سطح السفينة قليلاً
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
frontWall.position.set(0, wallHeight / 2 - 5, -500);
scene.add(frontWall);

const backWall = frontWall.clone();
backWall.position.set(0, wallHeight / 2 -5 , 500);
scene.add(backWall);

const leftWall = new THREE.Mesh(
  new THREE.BoxGeometry(wallThickness, wallHeight, 1000),
  wallMaterial
);
leftWall.position.set(-300, wallHeight / 2 -5 , 0);
scene.add(leftWall);

const rightWall = leftWall.clone();
rightWall.position.set(300, wallHeight / 2 -5 , 0);
scene.add(rightWall);
// === init walls with Box3 (do once) and push meshes to intersectObjects ===
[frontWall, backWall, leftWall, rightWall].forEach(w => {
  w.userData.isWall = true;
  w.updateMatrixWorld(true);
  w.userData.box = new THREE.Box3().setFromObject(w);
  // expand قليلاً ليغطي أي سماكة صغرى أو تحريكات طفيفة:
  w.userData.box.expandByScalar(0.05);
  intersectObjects.push(w);
});

// بوصلة
// مجموعة السهم
const compassScene = new THREE.Scene();
const compassCamera = new THREE.OrthographicCamera(-50, 50, 50, -50, 1, 1000);
compassCamera.position.set(0, 0, 100);
compassCamera.lookAt(0, 0, 0);

const compassLight = new THREE.AmbientLight(0xffffff, 1); // ضوء ناعم
compassScene.add(compassLight);


const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 50, 50);
compassScene.add(directionalLight);

const compassBackground = new THREE.Mesh(
  new THREE.CircleGeometry(50, 64),
  new THREE.MeshBasicMaterial({ color: 0x222222, transparent: true, opacity: 0.5 })
);
compassBackground.position.set(0, 0, -1); // ضعها خلف السهم
compassScene.add(compassBackground);

const compassArrow = new THREE.Group();

// جسم السهم (العمود)
const shaftGeometry = new THREE.CylinderGeometry(2, 2, 30, 16);
const shaftMaterial = new THREE.MeshStandardMaterial({
  color: 0xff0000,
  metalness: 0.7,
  roughness: 0.3,
});
const shaft = new THREE.Mesh(shaftGeometry, shaftMaterial);
shaft.castShadow = true;
shaft.position.y = 15; // منتصف السهم
compassArrow.add(shaft);

// رأس السهم (المؤشر)
const headGeometry = new THREE.ConeGeometry(5, 15, 32);
const headMaterial = new THREE.MeshStandardMaterial({
  color: 0xff0000,
  metalness: 0.7,
  roughness: 0.3,
});
const head = new THREE.Mesh(headGeometry, headMaterial);
head.castShadow = true;
head.position.y = 37.5; // أعلى العمود
compassArrow.add(head);

// قاعدة صغيرة للسهم لإحساس بالعمق
const baseGeometry = new THREE.CylinderGeometry(3, 3, 5, 16);
const baseMaterial = new THREE.MeshStandardMaterial({
  color: 0x333333,
  metalness: 0.5,
  roughness: 0.6,
});
const base = new THREE.Mesh(baseGeometry, baseMaterial);
base.position.y = 2.5; 
compassArrow.add(base);

// ضع السهم داخل مشهد البوصلة
compassArrow.position.y = 0;
compassScene.add(compassArrow);

// تحديث السهم مع الرياح 
const updateCompassArrow = () => {
  const targetRotation = -world.wind_angle;
  // حركة سلسة نحو زاوية الرياح
  compassArrow.rotation.z += (targetRotation - compassArrow.rotation.z) * 0.1;
};

// Models
const gltfLoader = new GLTFLoader();
loadModels(scene, gltfLoader, intersectObjects, movingTargets);

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
    backgroundSound.setLoop(true);      
    backgroundSound.setVolume(0.5);  
    backgroundSound.play();            
});
audioLoader.load("static/sounds/CANNON-SOUND-EFFECT-HD-FOR-VIDEOS-and-GAMES.m4a", (audioBuffer) => {
 shootingSoundEffect.setBuffer(audioBuffer);

});
const shootingSoundEffect = new THREE.Audio(listener);
shootingSoundEffect.setVolume(1);
scene.add(shootingSoundEffect);

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

// Cannon & Ball 


let cannon;
gltfLoader.load("static/models/cannon.glb", (gltf) => {
  cannon = new Cannon(gltf, scene);
}, undefined, (err) => console.error("Failed to load cannon:", err));
let lastShootingTime = 0; 

let objectsToUpdate = [];

window.addEventListener("keydown", (e) => {
  if(e.key === " " && cannon && cannon.isReady && performance.now() - lastShootingTime > 2000){
    createCannonBall();
    cannon.recoil();
    lastShootingTime = performance.now();
    shootingSoundEffect.play();
  }
});

const createCannonBall = () => {

 // removeBallsGreaterThanOne();

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

 //onst displayScale = 3;
 /*
  cannonBall.scale.set(displayScale, displayScale, displayScale);
  cannonBall.position.copy(cannon.getBallPosition());
  */
 // cannonBall.position.y += 2;
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
  
 // حساب نصف القطر المرئي للطابة (نحتاجه في اختبارات الـ Sphere)
const displayScale = 3;
cannonBall.scale.set(displayScale, displayScale, displayScale);
cannonBall.userData.visualRadius = (paramters.radius * 5) * displayScale; // paramters.radius*5 هو radius geometry

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

//
const clock = new THREE.Clock();
let oldElapsedTime = 0;

/*
    Reycaster
*/
const raycaster = new THREE.Raycaster();
raycaster.far =200;
raycaster.near =0.1;
let rayOrigin;
let rayDirection = new THREE.Vector3(0, 0, 10);
rayDirection.normalize();

const EPS = 1e-4; // small epsilon for y tweak

/**
 * Helper: adjust intersect.face.normal so Ball.fraction chooses correct axis branch.
 * Uses object's bounding box center (if available) to decide dominant axis.
 */
function adjustIntersectNormal(intersect, velocityVec) {
  // ensure intersect.face exists
  intersect.face = intersect.face || {};
  // if face.normal exists, clone it; otherwise compute naive normal
  let normal = null;
  if (intersect.face && intersect.face.normal && intersect.face.normal instanceof THREE.Vector3) {
    normal = intersect.face.normal.clone();
  } else {
    // fallback compute from object center to intersection point
    const center = new THREE.Vector3();
    intersect.object.getWorldPosition(center);
    normal = intersect.point.clone().sub(center).normalize();
  }

  // try to use box center if available
  let boxCenter = null;
  if (intersect.object.userData && intersect.object.userData.box) {
    boxCenter = intersect.object.userData.box.getCenter(new THREE.Vector3());
  } else {
    // fallback to object world position
    boxCenter = new THREE.Vector3();
    intersect.object.getWorldPosition(boxCenter);
  }

  const v = intersect.point.clone().sub(boxCenter);
  const ax = Math.abs(v.x), ay = Math.abs(v.y), az = Math.abs(v.z);

  if (ax >= az && ax >= ay) {
    // dominant X face (left/right wall or side of object)
    const signX = Math.sign(v.x) || Math.sign(normal.x) || 1;
    // set normal primarily X; set small positive Y so Ball.fraction goes to X-branch
    intersect.face.normal = new THREE.Vector3(signX, EPS, 0).normalize();
    return;
  } else if (az >= ax && az >= ay) {
    // dominant Z face (front/back)
    const signZ = Math.sign(v.z) || Math.sign(normal.z) || 1;
    // set normal primarily Z; keep Y slightly negative to follow existing Z-branch logic
    intersect.face.normal = new THREE.Vector3(0, -EPS, signZ).normalize();
    return;
  } else {
    // top/bottom collision (Y dominant) → keep computed normal but ensure reasonable Y
    if (Math.abs(normal.y) < EPS) {
      normal.y = normal.y >= 0 ? EPS : -EPS;
    }
    intersect.face.normal = normal.normalize();
    return;
  }
}
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - oldElapsedTime;
  oldElapsedTime = elapsedTime;

  // 1️⃣ تحديث الفيزياء
  world.update(deltaTime);

  // 2️⃣ تحريك الطابات + collision handling
  for (let i = objectsToUpdate.length - 1; i >= 0; i--) {
    const object = objectsToUpdate[i];
    const { cannonBall, physicsBall } = object;

    // مزامنة موضع ودوارن الطابة
    cannonBall.position.copy(physicsBall.position);
    cannonBall.quaternion.copy(physicsBall.quaternion);

    // axesHelper (اختياري)
    if (axesHelper) {
      axesHelper.position.copy(cannonBall.position);
      axesHelper.quaternion.copy(cannonBall.quaternion);
      axesHelper.visible = paramters.axesHelper;
    }

    const velocityVec = new THREE.Vector3(
      physicsBall.velocity.getX(),
      physicsBall.velocity.getY(),
      physicsBall.velocity.getZ()
    );

    const visualRadius = cannonBall.userData.visualRadius || (paramters.radius * 5 * 3);
    const sphere = new THREE.Sphere(cannonBall.position.clone(), visualRadius);

    const objectsToTest = intersectObjects.filter(o => o !== cannonBall);

    let collided = false;

    // ✅ 1) Sphere vs Box3 collision
    for (const obj of objectsToTest) {
      obj.updateMatrixWorld(true);
      if (!obj.userData.box) obj.userData.box = new THREE.Box3().setFromObject(obj);
      else obj.userData.box.setFromObject(obj);
      obj.userData.box.expandByScalar(0.02); // هامش أمان للجدران الرفيعة

      if (sphere.intersectsBox(obj.userData.box)) {
        const collisionPoint = new THREE.Vector3();
        obj.userData.box.clampPoint(cannonBall.position, collisionPoint);

        // حساب normal من نقطة الاصطدام لمركز الكرة
        const normalVec = cannonBall.position.clone().sub(collisionPoint);
        if (normalVec.lengthSq() < 1e-6) {
          if (velocityVec.lengthSq() > 1e-6) normalVec.copy(velocityVec).normalize().negate();
          else normalVec.set(0, 1, 0);
        } else normalVec.normalize();

        // تعديل y لتحديد branch الصحيح
        const absX = Math.abs(normalVec.x);
        const absY = Math.abs(normalVec.y);
        const absZ = Math.abs(normalVec.z);
        const EPS = 1e-3;
        let finalNormal = normalVec.clone();
        if (absX >= absZ && absX >= absY) finalNormal.set(Math.sign(finalNormal.x)||1, Math.abs(EPS), 0).normalize();
        else if (absZ >= absX && absZ >= absY) finalNormal.set(0, -Math.abs(EPS), Math.sign(finalNormal.z)||1).normalize();
        else if (Math.abs(finalNormal.y) < EPS) finalNormal.y = finalNormal.y >=0 ? EPS : -EPS;

        physicsBall.fraction({
          object: obj,
          point: collisionPoint,
          face: { normal: finalNormal },
          distance: cannonBall.position.distanceTo(collisionPoint)
        });

        collided = true;
        break;
      }
    }

    // ✅ 2) Raycaster fallback
    if (!collided && velocityVec.lengthSq() > 1e-6) {
      const movementDistance = velocityVec.length() * deltaTime * 10;
      const rayLength = movementDistance + visualRadius + 0.1;

      raycaster.set(cannonBall.position.clone(), velocityVec.clone().normalize());
      raycaster.far = Math.max(rayLength, 0.001);

      const rayIntersects = raycaster.intersectObjects(objectsToTest, true);

      for (const intersect of rayIntersects) {
        if (!intersect.face || !intersect.face.normal || !(intersect.face.normal instanceof THREE.Vector3)) {
          const center = new THREE.Vector3();
          intersect.object.getWorldPosition(center);
          intersect.face = { normal: intersect.point.clone().sub(center).normalize() };
        }

        // تعديل normal كما في Box3
        const normalVec = cannonBall.position.clone().sub(intersect.point);
        if (normalVec.lengthSq() < 1e-6) {
          if (velocityVec.lengthSq() > 1e-6) normalVec.copy(velocityVec).normalize().negate();
          else normalVec.set(0,1,0);
        } else normalVec.normalize();

        const absX = Math.abs(normalVec.x);
        const absY = Math.abs(normalVec.y);
        const absZ = Math.abs(normalVec.z);
        const EPS = 1e-3;
        let finalNormal = normalVec.clone();
        if (absX >= absZ && absX >= absY) finalNormal.set(Math.sign(finalNormal.x)||1, Math.abs(EPS),0).normalize();
        else if (absZ >= absX && absZ >= absY) finalNormal.set(0, -Math.abs(EPS), Math.sign(finalNormal.z)||1).normalize();
        else if (Math.abs(finalNormal.y) < EPS) finalNormal.y = finalNormal.y >=0 ? EPS : -EPS;

        intersect.face.normal = finalNormal;

        physicsBall.fraction(intersect);
        collided = true;
        break;
      }
    }

    // إزالة الكرة خارج الحدود
    if (Math.abs(cannonBall.position.x) > 1000 || Math.abs(cannonBall.position.z) > 1000 || cannonBall.position.y < -50) {
      scene.remove(cannonBall);
      objectsToUpdate.splice(i,1);
      world.remove(physicsBall);
    }
  }

  // تحريك الأهداف المتحركة
  movingTargets.forEach(target => {
    target.position.x += target.userData.direction * target.userData.speed;
    if (target.position.x > 200/*target.userData.startX + target.userData.range*/) target.userData.direction = -1;
    if (target.position.x < -200/* target.userData.startX - target.userData.range*/) target.userData.direction = 1;
  });

  // تحديث المدفع
  if (cannon?.isReady) cannon.update(mouse);

  // تحديث البوصلة
  updateCompassArrow();

  // رندر المشهد الأساسي
  renderer.setViewport(0,0,sizes.width,sizes.height);
  renderer.setScissorTest(false);
  renderer.render(scene, camera);

  // رندر البوصلة فوق المشهد
  renderer.clearDepth();
  renderer.setScissorTest(true);
  renderer.setScissor(20,20,120,120);
  renderer.setViewport(20,20,120,120);
  renderer.setClearColor(0x000000,0);
  renderer.render(compassScene, compassCamera);
  renderer.setScissorTest(false);
  renderer.setViewport(0,0,sizes.width,sizes.height);

  requestAnimationFrame(tick);
};

tick();
