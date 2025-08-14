// config/WaterTextures.js
import * as THREE from "three";

const loadWaterTextures = (textureLoader) => {
  const waterTextures = {};
  const waterColorTexture = textureLoader.load("static/textures/textures/water/Water_002_COLOR.jpg");
  const waterNormalTexture = textureLoader.load("static/textures/textures/water/Water_002_NORM.jpg");
  const waterAmbientOcclusionTexture = textureLoader.load("static/textures/textures/water/Water_002_OCC.jpg");
  const waterRoughnessTexture = textureLoader.load("static/textures/textures/water/Water_002_ROUGH.jpg");
  const waterHeightTexture = textureLoader.load("static/textures/textures/water/Water_002_DISP.png");


  // تكرار
  const repeatCount = 55;
    [
      waterColorTexture,
      waterNormalTexture,
      waterAmbientOcclusionTexture,
      waterRoughnessTexture,
      waterHeightTexture
    ].forEach(tex => {
      tex.repeat.set(repeatCount, 30);
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    });
  /*
  waterColorTexture.repeat.set(20, 20);
  waterNormalTexture.repeat.set(20, 20);
  waterColorTexture.wrapS = waterColorTexture.wrapT = THREE.RepeatWrapping;
  waterNormalTexture.wrapS = waterNormalTexture.wrapT = THREE.RepeatWrapping;
*/
  waterTextures.waterColorTexture = waterColorTexture;
  waterTextures.waterNormalTexture = waterNormalTexture;
  waterTextures.waterAmbientOcclusionTexture = waterAmbientOcclusionTexture;
  waterTextures.waterRoughnessTexture = waterRoughnessTexture;
  waterTextures.waterHeightTexture = waterHeightTexture;

  return waterTextures;
};

export default loadWaterTextures;
