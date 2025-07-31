// Cannon.js
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import Ball from "./Ball";

class Cannon {
  constructor(scene) {
    this.scene = scene;
    this.group = null;         // مجموعة المدفع (الكل)
    this.mesh = null;          // فوهة المدفع (البرميل)
    this.ball = null;          // الكرة المرتبطة
    this.speed = 0.1;          // سرعة الحركة
    this.keys = {};
    this.isReady = false;

    this.setupKeyboardControls();
    this.loadModel();
  }

  loadModel() {
    const loader = new GLTFLoader();
    loader.load("/models/cannon.glb", (gltf) => {
      this.group = gltf.scene;
      this.group.rotation.y = Math.PI;  // توجيه المدفع نحو -Z
      this.group.scale.set(0.5, 0.5, 0.5);
      this.group.position.set(0, 0, 0);


      this.printChildrenRecursive(this.group);
      this.scene.add(this.group);
      this.group.add(new THREE.AxesHelper(200)); // محاور كبيرة لمجموعة المدفع

      this.modelBall = this.group.getObjectByName("Cannonball_Cannon_0");

if (this.modelBall) {
  // إخفاء الكرة الجاهزة (لأننا سنستخدم كرة مخصصة)
  this.modelBall.visible = false;
}
      this.mesh = this.group.getObjectByName("Cannon_Cannon_0");
      if (!this.mesh) {
        console.warn("لم يتم العثور على فوهة المدفع (barrel)");
        return;
      }
      console.log(" تم تعيين البرميل:", this.mesh.name);
// إضاءة خاصة للمدفع
  const cannonLight = new THREE.SpotLight("#bda9a9ff", 1.8);
  cannonLight.position.set(0, 2, 2);      // فوق المدفع
  cannonLight.target = this.group;       // موجهة للمدفع
  cannonLight.castShadow = true;
  this.group.add(cannonLight);

  // تفعيل الظلال على أجزاء المدفع
  this.group.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
      });
      this.isReady = true;


      // إنشاء كرة جديدة
      const ball = new Ball(0, 0, 0, 5, 0xff0000);
      this.attachBall(ball);

      // طباعة موقع الكرة العالمي للتأكد
      const ballWorldPos = new THREE.Vector3();
      ball.mesh.getWorldPosition(ballWorldPos);
      console.log("World position of ball:", ballWorldPos);
    });
  }

  printChildrenRecursive(object, depth = 0) {
    const indent = "  ".repeat(depth);
    console.log(`${indent}- ${object.name || "(no name)"} [${object.type}]`);
    if (object.children) {
      object.children.forEach(child => this.printChildrenRecursive(child, depth + 1));
    }
  }

  attachBall(ball) {
    if (!this.mesh) return;
    this.ball = ball;

    // نضيف الكرة كطفل للفوهة (barrel)
    this.mesh.add(ball.mesh);

    // نحدد موقع الكرة داخل الفوهة بدقة، نحتاج تحديد المسافة حسب موديلك
    ball.mesh.position.set(0, 0, 30); // عدل 2 حسب طول الفوهة في موديلك

    // المحاور Helper تكون مستقلة في المشهد، تساعدنا نشوف اتجاه الكرة
    this.scene.add(ball.axesHelper);

    // حدث موقع المحاور مباشرة
    ball.axesHelper.position.copy(ball.mesh.getWorldPosition(new THREE.Vector3()));
  }

  getDirection() {
    if (!this.mesh) return new THREE.Vector3(0, 0, 1);
    // اتجاه المحور الأزرق (Z) بالنسبة للفوهة
    const localDir = new THREE.Vector3(0, 0, 1);
    return localDir.applyQuaternion(this.mesh.quaternion).normalize();
  }

  move(forwardAmount, strafeAmount) {
    if (!this.group) return;
    const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(this.group.quaternion);
    const strafe = new THREE.Vector3(1, 0, 0).applyQuaternion(this.group.quaternion);
    const moveVector = forward.multiplyScalar(forwardAmount).add(strafe.multiplyScalar(strafeAmount));
    this.group.position.add(moveVector);
  }

  rotateX(angle) {
    if (!this.mesh) return;
    this.mesh.rotation.x += angle;
  }

  rotateBarrel(angle) {
    if (!this.mesh) return;
    this.mesh.rotation.y += angle;
  }

  setupKeyboardControls() {
    document.addEventListener("keydown", (e) => {
      this.keys[e.key.toLowerCase()] = true;
    });
    document.addEventListener("keyup", (e) => {
      this.keys[e.key.toLowerCase()] = false;
    });
  }

  update() {
    if (!this.isReady) return;

    // تحريك المدفع
    if (this.keys["d"]) this.move(this.speed, 0);
    if (this.keys["a"]) this.move(-this.speed, 0);
    if (this.keys["s"]) this.move(0, -this.speed);
    if (this.keys["w"]) this.move(0, this.speed);

    // تدوير الفوهة
    if (this.keys["arrowleft"]) this.rotateX(-0.03);
    if (this.keys["arrowright"]) this.rotateX(0.03);
    if (this.keys["arrowup"]) this.rotateBarrel(0.02);
    if (this.keys["arrowdown"]) this.rotateBarrel(-0.02);

    // تحديث موقع محاور الكرة ليتبعها دائماً
    if (this.ball) {
      this.ball.axesHelper.position.copy(this.ball.mesh.getWorldPosition(new THREE.Vector3()));
    }
  }
}

export default Cannon;
