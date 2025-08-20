// Cannon.js

// classes/Cannon.js
/*
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import gsap from "gsap";
import Ball from "../physics/ball.js";
import vector from "../physics/vector.js";
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
    loader.load("/static/models/cannon.glb", (gltf) => {
      this.group = gltf.scene;
      this.group.rotation.y = -Math.PI /2;  // توجيه المدفع نحو -Z
      this.group.scale.set(0.6, 0.6, 0.6);
      this.group.position.set(0, 0, 400);


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
*/
/*
import * as THREE from "three";
import gsap from "gsap";

class Cannon {
    constructor(gltf, scene) {
        this.scene = scene;
        this.isReady = false;

        this.group = gltf.scene;
        this.mesh = this.group.getObjectByName("Cannon_Cannon_0");
        this.ballMesh = null;
        this.speed = 0.5;
        this.keys = {};

        if (!this.mesh) {
            console.error("Cannon barrel mesh not found in the GLTF model.");
            return;
        }

        this.group.rotation.y = Math.PI;
        this.group.scale.set(1.5, 1.5, 1.5);
        this.group.position.set(-300, 10, 0);

        this.group.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        this.createPlaceholderBall();
        this.setupKeyboardControls();

        // إضافة سهم توجيه مرئي لمساعدة التصحيح
        // هذا السهم يوضح الاتجاه الذي تطلق فيه الفوهة
        const dir = new THREE.Vector3(0, 0, -1);
        const origin = new THREE.Vector3(0, 0, 0);
        const length = 50;
        const hex = 0xffff00;
        this.arrowHelper = new THREE.ArrowHelper(dir, origin, length, hex);
        this.mesh.add(this.arrowHelper);

        this.scene.add(this.group);
        this.isReady = true;
    }

    createPlaceholderBall() {
        if (this.ballMesh) {
            this.mesh.remove(this.ballMesh);
            this.ballMesh.geometry.dispose();
            this.ballMesh.material.dispose();
        }
        
        this.ballMesh = new THREE.Mesh(
            new THREE.SphereGeometry(5.5, 32, 32),
            new THREE.MeshStandardMaterial({
                color: 0x999999,
            })
        );
        this.ballMesh.castShadow = true;
        this.mesh.add(this.ballMesh);
        // تم تعديل هذا السطر لوضع الطابة عند فوهة المدفع
        this.ballMesh.position.set(0, 0, 30);
    }

    rotateWithMouse(mouseY, mouseX) {
        if (!this.mesh) return;
        this.mesh.rotation.y = -THREE.MathUtils.lerp(-Math.PI / 4, Math.PI / 4, (mouseX + 1) / 2);
        this.mesh.rotation.x = -THREE.MathUtils.lerp(Math.PI / 8, Math.PI / 2, (mouseY + 1) / 2);
    }

    getDirection() {
        if (!this.mesh) return new THREE.Vector3(0, 0, 1);
        const direction = new THREE.Vector3();
        this.mesh.getWorldDirection(direction);
        return direction;
    }

    getBallPosition() {
        if (!this.ballMesh) return new THREE.Vector3();
        const worldPosition = new THREE.Vector3();
        this.ballMesh.getWorldPosition(worldPosition);
        return worldPosition;
    }

    recoil() {
        if (!this.group) return;
        const zPosition = this.group.position.z;
        gsap.to(this.group.position, {
            duration: 0.15,
            z: zPosition + 15,
            yoyo: true,
            repeat: 1
        });
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

        const direction = new THREE.Vector3();
        this.group.getWorldDirection(direction);
        direction.y = 0; // للحفاظ على الحركة على سطح السفينة

        // Forward and backward movement (W, S)
        if (this.keys["w"]) {
            this.group.position.addScaledVector(direction, this.speed);
        }
        if (this.keys["s"]) {
            this.group.position.addScaledVector(direction, -this.speed);
        }

        // Left and right movement (A, D)
        const leftDirection = new THREE.Vector3(-direction.z, 0, direction.x);
        if (this.keys["a"]) {
            this.group.position.addScaledVector(leftDirection, this.speed);
        }
        if (this.keys["d"]) {
            this.group.position.addScaledVector(leftDirection, -this.speed);
        }
    }
}

export default Cannon;
*/
/*
    rotateWithMouse(mouseX, mouseY) {
        if (!this.mesh) return;

        // تعديل الدوران على المحور Y لتقييده بين -pi/4 و pi/4
        const yawRotation = THREE.MathUtils.lerp(-Math.PI / 4, Math.PI / 4, (mouseX + 1) / 2);
        
        // تعديل الدوران على المحور X لتقييده بين pi/8 و pi/2
        const pitchRotation = -THREE.MathUtils.lerp(Math.PI / 8, Math.PI / 2, (mouseY + 1) / 2);

        this.mesh.rotation.y = yawRotation;
        this.mesh.rotation.x = pitchRotation;
    }
*/
// ثهاد الصح ////////////////////////
/*
import * as THREE from "three";
import gsap from "gsap";

class Cannon {
    constructor(gltf, scene) {
        this.scene = scene;
        this.isReady = false;

        this.group = gltf.scene;
        // قم بتعديل هذا السطر ليتوافق مع اسم mesh الصحيح في نموذجك
        this.mesh = this.group.getObjectByName("Cannon_Cannon_0");
        this.ballMesh = null;
        this.speed = 0.5;
        this.rotationSpeed = 0.005; // سرعة دوران الفوهة
        this.keys = {};

        if (!this.mesh) {
            console.error("Cannon barrel mesh not found in the GLTF model.");
            return;
        }
this.group.rotation.y = -Math.PI /2;  // توجيه المدفع نحو -Z
        // ضبط موضع ودوران المدفع الأولي لجعله مستقيماً
        // يتم تدوير المجموعة الكاملة لضمان وقوف المدفع بشكل مستقيم
       // this.group.rotation.set(-Math.PI, 0 , Math.PI);
        this.group.scale.set(0.7, 0.7, 0.7);
        this.group.position.set(0, 0, 300);
this.mouse = { x: 0, y: 0 };
this.maxPitch = Math.PI / 6; // أقصى ارتفاع للفوهة للأعلى/لأسفل
this.maxYaw = Math.PI / 3;   // أقصى دوران يمين/يسار

        this.group.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        this.createPlaceholderBall();
        this.setupKeyboardControls();

        // إضافة سهم توجيه مرئي لمساعدة التصحيح
        const dir = new THREE.Vector3(0, 0, -1);
        const origin = new THREE.Vector3(0, 0, 0);
        const length = 50;
        const hex = 0xffff00;
        this.arrowHelper = new THREE.ArrowHelper(dir, origin, length, hex);
        this.mesh.add(this.arrowHelper);

        this.scene.add(this.group);
        this.isReady = true;
    }

    createPlaceholderBall() {
        if (this.ballMesh) {
            this.mesh.remove(this.ballMesh);
            this.ballMesh.geometry.dispose();
            this.ballMesh.material.dispose();
        }
        
        this.ballMesh = new THREE.Mesh(
            new THREE.SphereGeometry(5.5, 32, 32),
            new THREE.MeshStandardMaterial({
                color: 0x999999,
            })
        );
        this.ballMesh.castShadow = true;
        this.mesh.add(this.ballMesh);
        // تم تعديل هذا السطر لوضع الطابة عند فوهة المدفع
        this.ballMesh.position.set(0, 0, 30);
    }

    getDirection() {
        if (!this.mesh) return new THREE.Vector3(0, 0, 1);
        const direction = new THREE.Vector3();
        this.mesh.getWorldDirection(direction);
        return direction;
    }

    getBallPosition() {
        if (!this.ballMesh) return new THREE.Vector3();
        const worldPosition = new THREE.Vector3();
        this.ballMesh.getWorldPosition(worldPosition);
        return worldPosition;
    }

    recoil() {
        if (!this.group) return;
        const zPosition = this.group.position.z;
        gsap.to(this.group.position, {
            duration: 0.15,
            z: zPosition + 15,
            yoyo: true,
            repeat: 1
        });
    }

    setupKeyboardControls() {
        document.addEventListener("keydown", (e) => {
            this.keys[e.key] = true;
        });
        document.addEventListener("keyup", (e) => {
            this.keys[e.key] = false;
        });
    }

    update() {
        if (!this.isReady) return;

        // منطق دوران الفوهة باستخدام أزرار الأسهم
        if (this.keys["ArrowUp"]) {
            this.mesh.rotation.y += this.rotationSpeed;
        }
        if (this.keys["ArrowDown"]) {
            this.mesh.rotation.y -= this.rotationSpeed;
        }
        if (this.keys["ArrowLeft"]) {
            this.mesh.rotation.x += this.rotationSpeed;
        }
        if (this.keys["ArrowRight"]) {
            this.mesh.rotation.x -= this.rotationSpeed;
        }

        const direction = new THREE.Vector3();
        this.group.getWorldDirection(direction);
        direction.y = 0; // للحفاظ على الحركة على سطح السفينة

        // Forward and backward movement (W, S)
        // تم عكس الاتجاه ليتوافق مع الدوران الأولي للمدفع
        if (this.keys["a"]) {
            this.group.position.addScaledVector(direction, -this.speed);
        }
        if (this.keys["d"]) {
            this.group.position.addScaledVector(direction, this.speed);
        }

        // Left and right movement (A, D)
        // تم تصحيح طريقة حساب المتجه الأيسر
        const leftDirection = new THREE.Vector3(-direction.z, 0, direction.x);
        if (this.keys["w"]) {
            this.group.position.addScaledVector(leftDirection, this.speed);
        }
        if (this.keys["s"]) {
            this.group.position.addScaledVector(leftDirection, -this.speed);
        }
    }
}

export default Cannon;
*/
/*
import * as THREE from "three";
import gsap from "gsap";

class Cannon {
    constructor(gltf, scene) {
        this.scene = scene;
        this.isReady = false;

        // Model
        this.group = gltf.scene;
        this.mesh = this.group.getObjectByName("Cannon_Cannon_0");
        if (!this.mesh) {
            console.error("Cannon barrel mesh not found in the GLTF model.");
            return;
        }

        this.group.rotation.y = -Math.PI / 2; // الاتجاه الأولي للمدفع
        this.group.scale.set(0.7, 0.7, 0.7);
        this.group.position.set(0, 0, 400);

        this.mesh.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        // Placeholder ball
        this.ballMesh = null;
        this.createPlaceholderBall();
        // Movement
        this.speed = 0.5;
        this.rotationSpeed = 0.005;
        this.keys = {};
        // Mouse tracking
        this.mouse = { x: 0, y: 0 };
        this.maxPitch = Math.PI / 6; // أقصى ارتفاع
        this.maxYaw = Math.PI / 3;   // أقصى دوران يمين/يسار
        this.setupKeyboardControls();
        this.setupMouseControls();
        // Arrow helper للتوجيه
        const dir = new THREE.Vector3(0, 0, 1);
        const origin = new THREE.Vector3(0, 0, 0);
        const length = 50;
        const hex = 0xffff00;
        this.arrowHelper = new THREE.ArrowHelper(dir, origin, length, hex);
        this.mesh.add(this.arrowHelper);
        this.scene.add(this.group);
        this.isReady = true;
    }

    createPlaceholderBall() {
        if (this.ballMesh) {
            this.mesh.remove(this.ballMesh);
            this.ballMesh.geometry.dispose();
            this.ballMesh.material.dispose();
        }

        this.ballMesh = new THREE.Mesh(
            new THREE.SphereGeometry(6, 32, 32),
            new THREE.MeshStandardMaterial({ color: 0x999999 })
        );
        this.ballMesh.castShadow = true;
        this.mesh.add(this.ballMesh);
        this.ballMesh.position.set(-88, 0, 50); // عند الفوهة
    }

    getDirection() {
        //if (!this.mesh) return new THREE.Vector3(0, 0, 1);
        const direction = new THREE.Vector3();
        this.mesh.getWorldDirection(direction);
        return direction.normalize();
    }
    
    // في ملف Cannon.js
getDirection() {
    const direction = new THREE.Vector3();
    
    // تحديث مصفوفة التحويل للكائن الأب أولاً
    if (this.group) {
        this.group.updateMatrixWorld(true);
    }
    // ثم الحصول على اتجاه الكائن الابن
    this.mesh.getWorldDirection(direction);
    
    return direction.normalize();
}

    getBallPosition() {
        if (!this.ballMesh) return new THREE.Vector3();
        const worldPosition = new THREE.Vector3();
        this.ballMesh.getWorldPosition(worldPosition);
        return worldPosition;
    }

    recoil() {
        if (!this.group) return;
        const zPosition = this.group.position.z;
        gsap.to(this.group.position, {
            duration: 0.15,
            z: zPosition + 15,
            yoyo: true,
            repeat: 1
        });
    }

    setupKeyboardControls() {
        document.addEventListener("keydown", (e) => this.keys[e.key] = true);
        document.addEventListener("keyup", (e) => this.keys[e.key] = false);
    }

    setupMouseControls() {
        window.addEventListener("mousemove", (event) => {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        });
    }

    update() {
         // تدوير الفوهة حسب الماوس
    // تأكد من أن قيمة mouse.y موجبة عندما تتحرك الفوهة للأعلى
    // و سالبة عندما تتحرك للأسفل. قد تحتاج إلى عكس الإشارة هنا.
    const pitch = -this.mouse.y * this.maxPitch; 
    
    // قيمة yaw المقلوبة (يمين = يسار)
    // عكس الإشارة هنا سيحل المشكلة
    const yaw = -this.mouse.x * this.maxYaw; 

    // تطبيق الدوران
    // المحور Y للمجموعة (الحركة الأفقية)
    this.group.rotation.y = -Math.PI / 2 + yaw;
    // المحور X للفوهة (الحركة العمودية)
    this.mesh.rotation.x = pitch; 
        if (!this.isReady) return;

      
        // حركة على سطح السفينة
        const forward = new THREE.Vector3();
        this.group.getWorldDirection(forward);
        forward.y = 0;
        forward.normalize();

        const left = new THREE.Vector3(-forward.z, 0, forward.x);

        if (this.keys["w"]) this.group.position.addScaledVector(left, this.speed);
        if (this.keys["s"]) this.group.position.addScaledVector(left, -this.speed);
        if (this.keys["a"]) this.group.position.addScaledVector(forward, -this.speed);
        if (this.keys["d"]) this.group.position.addScaledVector(forward, this.speed);
    }
}

export default Cannon;
*/
/*
// في ملف Cannon.js
import * as THREE from "three";
import gsap from "gsap";

class Cannon {
    constructor(gltf, scene) {
        this.scene = scene;
        this.isReady = false;

        // Model
        this.group = gltf.scene;
        this.mesh = this.group.getObjectByName("Cannon_Cannon_0");
        if (!this.mesh) {
            console.error("Cannon barrel mesh not found in the GLTF model.");
            return;
        }

        this.group.rotation.y = -Math.PI / 2;
        this.group.scale.set(0.7, 0.7, 0.7);
        this.group.position.set(0, 0, 400);

        this.mesh.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
// طول المحاور اللي بدك تشوفها
const axisLength = 200; 
// إنشاء axes helper
const axesHelper = new THREE.AxesHelper(axisLength);
// إضافته للموديل
this.mesh.add(axesHelper);
axesHelper.position.copy(this.mesh.getWorldPosition(new THREE.Vector3()));
scene.add(axesHelper);

        // Placeholder ball
        this.ballMesh = null;
        this.createPlaceholderBall();
        // Movement
        this.speed = 0.5;
        this.rotationSpeed = 0.005;
        this.keys = {};
        this.setupKeyboardControls();
        // Arrow helper للتوجيه
        const dir = new THREE.Vector3(0, 0, -1);
        const origin = new THREE.Vector3(0, 0, 0);
        const length = 500;
        const hex = 0xffff00;
        this.arrowHelper = new THREE.ArrowHelper(dir, origin, length, hex);
        this.mesh.add(this.arrowHelper);
        this.scene.add(this.group);
        this.isReady = true;

    }

    createPlaceholderBall() {
        if (this.ballMesh) {
            this.mesh.remove(this.ballMesh);
            this.ballMesh.geometry.dispose();
            this.ballMesh.material.dispose();
        }

        this.ballMesh = new THREE.Mesh(
            new THREE.SphereGeometry(6, 32, 32),
            new THREE.MeshStandardMaterial({ color: 0x999999 })
        );
        this.ballMesh.castShadow = true;
        this.mesh.add(this.ballMesh);
        this.ballMesh.position.set(-88, 0, 50); // عند الفوهة
    }

getDirection() {
  
     const localForward = new THREE.Vector3(0, 0, -1);  // اتجاه "أمام" في الفراغ المحلي
    this.mesh.updateMatrixWorld(true);                 // تحديث المصفوفة العالمية
    const worldDirection = localForward.clone().transformDirection(this.mesh.matrixWorld);
    return worldDirection.normalize();
}
    
    /*
    // 1. تحديد متجه "الأمام" في الفراغ المحلي للمدفع.
    const localForward = new THREE.Vector3(0, 0, 1);
    // 2. الحصول على مصفوفة التحويل العالمية (world matrix) للمدفع.
    // هذه المصفوفة تأخذ في الاعتبار جميع الدورانات والمواقع للأباء.
    this.mesh.updateMatrixWorld(true);
    // 3. تحويل متجه "الأمام" المحلي إلى متجه اتجاه عالمي.
    const worldDirection = localForward.clone().transformDirection(this.mesh.matrixWorld);
    
    return worldDirection.normalize();
    */
   /*


    getBallPosition() {
        if (!this.ballMesh) return new THREE.Vector3();
        const worldPosition = new THREE.Vector3();
        this.ballMesh.getWorldPosition(worldPosition);
        return worldPosition;
    }

    recoil() {
        if (!this.group) return;
        const zPosition = this.group.position.z;
        gsap.to(this.group.position, {
            duration: 0.15,
            z: zPosition + 15,
            yoyo: true,
            repeat: 1
        });
    }

    setupKeyboardControls() {
        document.addEventListener("keydown", (e) => this.keys[e.key] = true);
        document.addEventListener("keyup", (e) => this.keys[e.key] = false);
    }


    update() {
        if (!this.isReady) return;

        // حركة على سطح السفينة (التحكم بالكيبورد)
        const forward = new THREE.Vector3();
        this.group.getWorldDirection(forward);
        forward.y = 0;
        forward.normalize();

        const left = new THREE.Vector3(-forward.z, 0, forward.x);

        if (this.keys["w"]) this.group.position.addScaledVector(left, this.speed);
        if (this.keys["s"]) this.group.position.addScaledVector(left, -this.speed);
        if (this.keys["d"]) this.group.position.addScaledVector(forward, -this.speed);
        if (this.keys["a"]) this.group.position.addScaledVector(forward, this.speed);
    }
}

 update() {
         // تدوير الفوهة حسب الماوس
    // تأكد من أن قيمة mouse.y موجبة عندما تتحرك الفوهة للأعلى
    // و سالبة عندما تتحرك للأسفل. قد تحتاج إلى عكس الإشارة هنا.
    const pitch = -this.mouse.y * this.maxPitch; 
    
    // قيمة yaw المقلوبة (يمين = يسار)
    // عكس الإشارة هنا سيحل المشكلة
    const yaw = -this.mouse.x * this.maxYaw; 

    // تطبيق الدوران
    // المحور Y للمجموعة (الحركة الأفقية)
    this.group.rotation.y = -Math.PI / 2 + yaw;
    // المحور X للفوهة (الحركة العمودية)
    this.mesh.rotation.x = pitch; 
        if (!this.isReady) return;

      
        // حركة على سطح السفينة
        const forward = new THREE.Vector3();
        this.group.getWorldDirection(forward);
        forward.y = 0;
        forward.normalize();

        const left = new THREE.Vector3(-forward.z, 0, forward.x);

        if (this.keys["w"]) this.group.position.addScaledVector(left, this.speed);
        if (this.keys["s"]) this.group.position.addScaledVector(left, -this.speed);
        if (this.keys["a"]) this.group.position.addScaledVector(forward, -this.speed);
        if (this.keys["d"]) this.group.position.addScaledVector(forward, this.speed);
    }

}
export default Cannon;
*/
import * as THREE from "three";
import gsap from "gsap";

class Cannon {
    constructor(gltf, scene) {
        this.scene = scene;
        this.isReady = false;

        this.group = gltf.scene;
        this.mesh = this.group.getObjectByName("Cannon_Cannon_0");
        if (!this.mesh) {
            console.error("Cannon barrel mesh not found in the GLTF model.");
            return;
        }

        this.group.rotation.y = -Math.PI / 2;
        this.group.scale.set(0.7, 0.7, 0.7);
        this.group.position.set(0, 0, 400);

        this.mesh.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        // ⚡ إنشاء dummy object للفوهة
        this.muzzle = new THREE.Object3D();
        this.muzzle.position.set(-88, 0, 50); // مكان الفوهة داخل الموديل
        this.mesh.add(this.muzzle);

        // Placeholder ball
        this.ballMesh = null;
        this.createPlaceholderBall();

        // Arrow helper
        this.arrowHelper = new THREE.ArrowHelper(
            new THREE.Vector3(-1, 0, 0),
            this.muzzle.position,
            200,
            0xffff00
        );
        this.scene.add(this.arrowHelper);

        this.speed = 0.5;
        this.keys = {};
        this.setupKeyboardControls();

        this.scene.add(this.group);
        this.isReady = true;
    }

    createPlaceholderBall() {
        if (this.ballMesh) {
            this.mesh.remove(this.ballMesh);
            this.ballMesh.geometry.dispose();
            this.ballMesh.material.dispose();
        }

        this.ballMesh = new THREE.Mesh(
            new THREE.SphereGeometry(6, 32, 32),
            new THREE.MeshStandardMaterial({ color: 0x999999 })
        );
        this.ballMesh.castShadow = true;
        this.muzzle.add(this.ballMesh);
        this.ballMesh.position.set(0, 0, 0); // مباشرة عند الفوهة
    }

    getBallPosition() {
        const worldPos = new THREE.Vector3();
        this.muzzle.getWorldPosition(worldPos);
        return worldPos;
    }
    
/*
    getDirection() {
        const localForward = new THREE.Vector3(1, 0, 0); // Z للأمام
        this.muzzle.updateMatrixWorld(true);
        const worldDir = localForward.clone().transformDirection(this.muzzle.matrixWorld);
       // return worldDir.normalize();
       // ✅ عكس المحاور حسب الحاجة
    const correctedDir = new THREE.Vector3(-worldDir.x, worldDir.y, worldDir.z);

    return correctedDir; // هاد اللي رح تستخدمه للإطلاق والسهم
}
    */
   getDirection() {
    const localForward = new THREE.Vector3(1, 0, 0); // جرب المحاور واحد واحد
    this.muzzle.updateMatrixWorld(true);
    const worldDir = localForward.clone().transformDirection(this.muzzle.matrixWorld);
   return worldDir.negate().normalize();

}


    recoil() {
        if (!this.group) return;
        const zPosition = this.group.position.z;
        gsap.to(this.group.position, {
            duration: 0.15,
            z: zPosition + 15,
            yoyo: true,
            repeat: 1
        });
    }

    setupKeyboardControls() {
        document.addEventListener("keydown", (e) => (this.keys[e.key] = true));
        document.addEventListener("keyup", (e) => (this.keys[e.key] = false));
    }

    update(mouse) {
        if (!this.isReady) return;
        const normalizedX = (mouse.x / window.innerWidth) * 2 - 1; // -1 أقصى يسار، 1 أقصى يمين
const normalizedY = -((mouse.y / window.innerHeight) * 2 - 1); // -1 أعلى، 1 أسفل

this.mesh.rotation.z = -mouse.x * Math.PI / 6;
this.mesh.rotation.y = mouse.y * Math.PI / 6;


        // تحديث الاتجاه للـ ArrowHelper
        const dir = this.getDirection();
        this.arrowHelper.setDirection(dir);
        this.arrowHelper.position.copy(this.getBallPosition());

        // Debug: اطبع الإحداثيات
        console.log("مدفع:", this.mesh.getWorldPosition(new THREE.Vector3()));
        console.log("فوهة:", this.getBallPosition());
        console.log("اتجاه:", dir);
    }
}

export default Cannon;
