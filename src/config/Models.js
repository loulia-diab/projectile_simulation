/*
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
      { x: -150, y: 0, z: -400 },
      { x: 0,   y: 0, z: -200 },
      { x: 100,  y: 0, z: 0 },
      { x: 50,  y: 0, z: 200 }
    ];

    positions.forEach(pos => {
      const target = gltfModel.scene.clone();
      target.position.set(pos.x, pos.y, pos.z);

      // نحفظ بيانات الحركة
      target.userData.startX = pos.x;
      target.userData.direction = 1; // 1 = يمين، -1 = يسار
      target.userData.range = 90;
      target.userData.speed = 0.7;
// 🔴 علّم إنه "هدف"
  target.userData.isTarget = true;
  
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
      
  // 🔴 علّم إنه "برميل"
  barrelClone.userData.isBarrel = true;
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
      { x: -400, y: -5, z: -1100 },
      { x: -2000, y: -5, z: -2500 }
    ];

    positions.forEach((pos) => {
      const shipClone = gltfModel.scene.clone();
      shipClone.position.set(pos.x, pos.y, pos.z);
      shipClone.rotation.y = Math.PI/4 ;
        // 🔴 علّم إنه "سفينة"
  shipClone.userData.isShip = true;
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
      island.userData.isIsland = true;
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
     // scene.add(flag);
    });

};
*/
import * as THREE from "three";

// Modified loadModels: pushes MESHes (not groups) into intersectObjects,
// creates userData.box for each mesh and marks type flags.
// For moving targets we still keep the group in movingTargets (so you can move the whole group),
// but push each child mesh into intersectObjects with its own box.

export const loadModels = (scene, gltfLoader, intersectObjects, movingTargets) => {

  // ---------- Targets (moving) ----------
  gltfLoader.load("/models/target/scene.gltf", (gltfModel) => {
    // ensure base model meshes have correct shadow settings
    gltfModel.scene.traverse(function (node) {
      if (node instanceof THREE.Mesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });

    gltfModel.scene.scale.set(50, 50, 50);

    const positions = [
      { x: -150, y: 0, z: -400 },
      { x: 0,   y: 0, z: -200 },
      { x: 100,  y: 0, z: 0 },
      { x: 50,  y: 0, z: 200 }
    ];

    positions.forEach(pos => {
      const targetGroup = gltfModel.scene.clone();
      targetGroup.position.set(pos.x, pos.y, pos.z);

      // movement info on the group (we will update position.x for the whole group)
      targetGroup.userData.startX = pos.x;
      targetGroup.userData.direction = 1;
      targetGroup.userData.range = 90;
      targetGroup.userData.speed = 0.7;

      // add group to scene and to movingTargets so tick() moves it
      scene.add(targetGroup);
      movingTargets.push(targetGroup);

      // For collision: traverse each mesh inside this cloned group and push the mesh
      // to intersectObjects. Create a Box3 for each mesh (updated here once). If the
      // mesh will move (because its parent group moves) you'll need to update the
      // box each frame in tick() (see instructions).
      targetGroup.traverse(node => {
        if (node.isMesh) {
          node.userData.isTarget = true;
          node.castShadow = true;
          node.receiveShadow = true;

          // ensure world matrices are up to date for bbox calculation
          node.updateMatrixWorld(true);

          // store bounding box on the mesh itself
          node.userData.box = new THREE.Box3().setFromObject(node);

          // push the mesh (not the group) so collisions are precise
          intersectObjects.push(node);
        }
      });
    });
  });

  // ---------- Barrels (static) ----------
  gltfLoader.load("/models/barrel/scene.gltf", (gltfModel) => {
    gltfModel.scene.traverse(function (node) {
      if (node instanceof THREE.Mesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });

    gltfModel.scene.scale.set(14, 14, 14);

    const positions = [
      { x: -190, y: 0, z: 300 },
      { x: 240, y: 0, z: 80 },
      { x: -190, y: 0, z: -300 }
    ];

    positions.forEach((pos) => {
      const barrelGroup = gltfModel.scene.clone();
      barrelGroup.position.set(pos.x, pos.y, pos.z);
      scene.add(barrelGroup);

      // traverse meshes and mark them as barrels and compute a Box3
      barrelGroup.traverse(node => {
        if (node.isMesh) {
          node.userData.isBarrel = true;
          node.castShadow = true;
          node.receiveShadow = true;
          node.updateMatrixWorld(true);
          node.userData.box = new THREE.Box3().setFromObject(node);
          intersectObjects.push(node);
        }
      });
    });
  });

  // ---------- Ship (could be large) ----------
  // Option A: create box per mesh for finer collisions (recommended)
  // Option B: you can create one box for the whole ship group.
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
      const shipGroup = gltfModel.scene.clone();
      shipGroup.position.set(pos.x, pos.y, pos.z);
      shipGroup.rotation.y = Math.PI/4;
      shipGroup.userData.isShip = true; // mark group if you want
      scene.add(shipGroup);

      // push each mesh inside ship into intersectObjects with its own Box3
      shipGroup.traverse(node => {
        if (node.isMesh) {
          node.userData.isShip = true;
          node.castShadow = true;
          node.receiveShadow = true;
          node.updateMatrixWorld(true);
          node.userData.box = new THREE.Box3().setFromObject(node);
          intersectObjects.push(node);
        }
      });
    });
  });

  // ---------- Island (static large) ----------
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
    island.rotation.y = Math.PI;
    island.userData.isIsland = true;

    scene.add(island);

    // use mesh-level boxes for better collision
    island.traverse(node => {
      if (node.isMesh) {
        node.userData.isIsland = true;
        node.updateMatrixWorld(true);
        node.userData.box = new THREE.Box3().setFromObject(node);
        intersectObjects.push(node);
      }
    });
  });

  // ---------- Flag (visual only) ----------
  gltfLoader.load("static/models/flag/scene.gltf", (gltfModel) => {
    const flag = gltfModel.scene;
    flag.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });
    flag.scale.set(0.6, 0.6, 0.06);
    flag.position.set(220, 0, -370);
    //scene.add(flag);
    // not adding flag meshes to intersectObjects (unless you want them to collide)
  });

};
