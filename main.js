
import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"; //اداة لتدوير وتحريك الكااميرا بالماوس
import Cannon from './classes/Cannon';
import loadWoodTextures from "./src/config/WoodTextures";
import loadWaterTextures from "./src/config/WaterTextures";
import gsap from "gsap";
import World from "./physics/world.js";
import Ball from "./physics/ball.js";
import vector from "./physics/vector.js";

import { loadModels } from "./src/config/Models.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";



// =============================================================
// Variables and Physics World
// =============================================================
const canvas = document.querySelector("canvas.webgl");
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};
const mouse = new THREE.Vector2();
const scene = new THREE.Scene();
const cannonDirection = new THREE.Vector3();
const objectsToUpdate = [];
let numberOfBalls = 20;
let lastShotingTime = 0;
let cannon;
let isFinished = false;

// Physics World
const GRAVITY = 9.8;
const HEIGHT = 100;
const TEMPERETURE = 300;
const WIND_SPEED = 20;
const WIND_ANGLE = 90;
const world = new World(GRAVITY, HEIGHT, TEMPERETURE, WIND_SPEED, WIND_ANGLE);



// Variables
const intersectObjects = [];
const movingTargets = []; // نخزن فيه الأهداف المتحركة


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

// end light


//////////////////////////////////////////camera and resize  ////////////////////////////////////////////
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
camera.position.x = 0;
camera.position.y = 30;
camera.position.z = 480;
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
/*
 const cannon = new Cannon(scene);
if (cannon && cannon.isReady) {
  console.log("Cannon position:", cannon.group.position);
  if (cannon.ball) {
    const ballWorldPos = new THREE.Vector3();
    cannon.ball.mesh.getWorldPosition(ballWorldPos);
    console.log("Ball world position:", ballWorldPos);
  }
}
  // =============================================================
// Main Game Logic inside window.onload
// =============================================================
window.onload = () => {
    // Update sizes, camera, and renderer
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Loader and Loading Manager (moved here as per your request)
    */
    const loadingManger = new THREE.LoadingManager(
        () => {
            gsap.delayedCall(0.5, () => {
                // قم بإضافة عناصر شريط التحميل في HTML إذا لزم الأمر
            });
            startGame();
        }
    );
    const gltfLoader = new GLTFLoader(loadingManger);

    // Load the cannon model
    gltfLoader.load(
        "static/models/cannon.glb",
        (gltf) => {
            cannon = new Cannon(gltf, scene);
        },
        undefined,
        (error) => {
            console.log("Failed to load cannon model:", error);
        }
    );
    
    // Event Listeners (moved here)
    window.addEventListener("keydown", (e) => {
        if (e.key === " ") {
            const SHOOT_DELAY = 2000;
            if (
                cannon && cannon.isReady &&
                window.performance.now() - lastShotingTime > SHOOT_DELAY
            ) {
                createCannonBall();
                cannon.recoil();
                lastShotingTime = window.performance.now();
            }
        }
    });

    window.addEventListener('mousemove', (event) => {
        mouse.x = (event.clientX / sizes.width) * 2 - 1;
        mouse.y = -(event.clientY / sizes.height) * 2 + 1;
    });


    // Shooting and Control Functions (moved here)
    const createCannonBall = () => {
        if (!cannon.isReady || numberOfBalls <= 0) return;
        
        const ballRadius = 2.5;
        const ballMass = 10;
        const ballSpeed = 100;
        
        let cannonBallMesh = new THREE.Mesh(
            new THREE.SphereGeometry(ballRadius, 32, 32),
            new THREE.MeshStandardMaterial({ color: 0xcccccc })
        );
        cannonBallMesh.castShadow = true;
        
        const initialPosition = cannon.getBallPosition();
        cannonBallMesh.position.copy(initialPosition);
        scene.add(cannonBallMesh);
        
        const angleXY = Math.atan2(cannonDirection.y, cannonDirection.x);
        const angleXZ = Math.atan2(cannonDirection.z, Math.sqrt(cannonDirection.x * cannonDirection.x + cannonDirection.y * cannonDirection.y));

  // تحريك الأهداف
  movingTargets.forEach(target => {
    target.position.x += target.userData.direction * target.userData.speed;
/*
    if (target.position.x > target.userData.startX + target.userData.range) {
      target.userData.direction = -1;
    } else if (target.position.x < target.userData.startX - target.userData.range) {
      target.userData.direction = 1;
    }*/
     if (target.position.x > 150) {
      target.userData.direction = -1;
    } else if (target.position.x < -150) {
      target.userData.direction = 1;
    }
  });

  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - oldElapsedTime;
  oldElapsedTime = elapsedTime;


        const physicsBall = new Ball(
            new THREE.Vector3().copy(initialPosition), 
            ballSpeed,
            angleXY,
            angleXZ,
            ballRadius,
            0, 
            ballMass,
            0.5, 
            vector.create(0,0,0), 
            0.4,
            0.2
        );
        world.add(physicsBall); 

        objectsToUpdate.push({ cannonBall: cannonBallMesh, physicsBall });
        cannon.createPlaceholderBall();
        numberOfBalls--;
        // update a UI element here if you have one
    };

    // Game Loop (moved here)
    const clock = new THREE.Clock();
    let oldElapsedTime = 0;

    const tick = () => {
        const elapsedTime = clock.getElapsedTime();
        const deltaTime = elapsedTime - oldElapsedTime;
        oldElapsedTime = elapsedTime;

        world.update(deltaTime);

        for (const object of objectsToUpdate) {
            object.cannonBall.position.copy(object.physicsBall.position);
        }
        
        if (cannon && cannon.isReady) {
          //  cannon.rotateWithMouse(mouse.y, mouse.x);
            cannonDirection.copy(cannon.getDirection());
            cannon.update();
        }

        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(tick);
    };

    // Start the game loop after all assets are loaded (moved here)
    const startGame = () => {
        tick();
    };
};