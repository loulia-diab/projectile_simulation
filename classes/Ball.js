// Ball.js
import * as THREE from "three";

class Ball {
  constructor(x, y, z, radius = 1, color = 0xff0000) {
    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.set(x, y, z);
    this.axesHelper = new THREE.AxesHelper(100);
 
  }
  
}

export default Ball;