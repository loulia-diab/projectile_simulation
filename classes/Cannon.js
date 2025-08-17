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

        // ⚡️ إنشاء dummy object للفوهة
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