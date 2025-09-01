import * as THREE from "three";

export const loadModels = (scene, gltfLoader, intersectObjects, movingTargets) => {

  gltfLoader.load("/models/target/scene.gltf", (gltfModel) => {
    gltfModel.scene.traverse(function (node) {
      if (node instanceof THREE.Mesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });

    gltfModel.scene.scale.set(50, 50, 50); // حجم الهدف
    const positions = [
      { x: -150, y: 5, z: -400 },
      { x: 0,   y: 5, z: -200 },
      { x: 100,  y: 5, z: 0 },
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
    
    gltfLoader.load("/models/barrel/scene.gltf", (gltfModel) => {
         gltfModel.scene.traverse(function (node) {
      if (node instanceof THREE.Mesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });
    gltfModel.scene.scale.set(14, 14, 14);
    
    const positions = [
      { x: -190, y: 0, z: 220 },
      { x: 240, y: 0, z: 80 },
      { x: -190, y: 0, z: -400 }
    ];

    positions.forEach((pos) => {
      const barrelClone = gltfModel.scene.clone();
      barrelClone.position.set(pos.x, pos.y, pos.z);
      scene.add(barrelClone);
      intersectObjects.push(barrelClone);
    });

    });

   gltfLoader.load("static/models/ship/scene.gltf", (gltfModel) => {
         gltfModel.scene.traverse(function (node) {
      if (node instanceof THREE.Mesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });
    gltfModel.scene.scale.set(10, 10, 10);
    
    const positions = [
      { x: -400, y: 0, z: -1100 },
      { x: -2000, y: 0, z: -2500 }
    ];

    positions.forEach((pos) => {
      const shipClone = gltfModel.scene.clone();
      shipClone.position.set(pos.x, pos.y, pos.z);
      shipClone.rotation.y = Math.PI/4 ;
      scene.add(shipClone);
       intersectObjects.push(shipClone);
    });
        
    });
   gltfLoader.load("static/models/island/scene.gltf", (gltfModel) => {
        const island = gltfModel.scene;
  island.traverse((node) => {
    if (node.isMesh) {
      node.castShadow = true;
      node.receiveShadow = true;
    }
  });
      island.scale.set(30, 30, 30);
      island.position.set(-900, 10, -130);
      island.rotation.y = Math.PI ;
     scene.add(island);
     intersectObjects.push(island);
   });
  /*
  gltfLoader.load("static/models/pirate/scene.gltf", (gltfModel) => {
        const pirate = gltfModel.scene;
  pirate.traverse((node) => {
    if (node.isMesh) {
      node.castShadow = true;
      node.receiveShadow = true;
    }
  });
      pirate.scale.set(0.07, 0.07,0.07);
      pirate.position.set(200, 0, 370);
      pirate.rotation.y = -Math.PI/4 ;
      scene.add(pirate);
  });
*/
    gltfLoader.load("static/models/flag/scene.gltf", (gltfModel) => {
        const flag = gltfModel.scene;
  flag.traverse((node) => {
    if (node.isMesh) {
      node.castShadow = true;
      node.receiveShadow = true;
    }
  });
      flag.scale.set(0.6, 0.6,0.06);
      flag.position.set(220, 0, -370);
     // flag.rotation.y = -Math.PI/4 ;
      scene.add(flag);
    });

};