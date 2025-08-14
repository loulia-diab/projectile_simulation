import * as THREE from "three";

export const loadModels = (scene, gltfLoader, intersectObjects, movingTargets) => {

  gltfLoader.load("static/models/target/scene.gltf", (gltfModel) => {
    gltfModel.scene.traverse(function (node) {
      if (node instanceof THREE.Mesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });

    gltfModel.scene.scale.set(50, 50, 50); // حجم الهدف
    const positions = [
      { x: -150, y: 5, z: -100 },
      { x: 0,   y: 5, z: 0 },
      { x: 100,  y: 5, z: 100 },
      { x: 50,  y: 5, z: 200 }
    ];

    positions.forEach(pos => {
      const target = gltfModel.scene.clone();
      target.position.set(pos.x, pos.y, pos.z);

      // نحفظ بيانات الحركة
      target.userData.startX = pos.x;
      target.userData.direction = 1; // 1 = يمين، -1 = يسار
      target.userData.range = 90;
      target.userData.speed = 0.7;

      scene.add(target);
      intersectObjects.push(target);
      movingTargets.push(target); // نخزنها لتحديث الحركة لاحقاً
    });
  });
    
    gltfLoader.load("static/models/barrel/scene.gltf", (gltfModel) => {
         gltfModel.scene.traverse(function (node) {
      if (node instanceof THREE.Mesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });
    gltfModel.scene.scale.set(14, 14, 14);
    
    const positions = [
      { x: -190, y: 0, z: 270 },
      { x: 240, y: 0, z: 80 },
      { x: -150, y: 0, z: -200 }
    ];

    positions.forEach((pos) => {
      const barrelClone = gltfModel.scene.clone();
      barrelClone.position.set(pos.x, pos.y, pos.z);
      scene.add(barrelClone);
      intersectObjects.push(barrelClone);
    });
        
  });
  // باقي تحميل الموديلات الأخرى...
};

