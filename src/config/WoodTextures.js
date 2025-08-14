// config/WoodTextures.js
import * as THREE from "three";

const loadWoodTextures = (textureLoader) => {
  const woodTextures = {};
  const woodColorTexture = textureLoader.load("static/textures/textures/woodFloor/WoodFloor043_1K-JPG_Color.jpg");
  const woodAmbientOcclusionTexture = textureLoader.load("static/textures/textures/woodFloor/WoodFloor043_1K-JPG_AmbientOcclusion.jpg");
  const woodNormalTexture = textureLoader.load("static/textures/textures/woodFloor/WoodFloor043_1K-JPG_NormalGL.jpg");
  const woodRoughnessTexture = textureLoader.load("static/textures/textures/woodFloor/WoodFloor043_1K-JPG_Roughness.jpg");
  const woodHeightTexture = textureLoader.load("static/textures/textures/woodFloor/WoodFloor043_1K-JPG_Displacement.jpg");

  // تكرار الخامة
  const repeatCount = 8;
  [
    woodColorTexture,
    woodAmbientOcclusionTexture,
    woodNormalTexture,
    woodRoughnessTexture,
    woodHeightTexture
  ].forEach(tex => {
    tex.repeat.set(repeatCount, repeatCount);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  });

  woodTextures.woodColorTexture = woodColorTexture;
  woodTextures.woodAmbientOcclusionTexture = woodAmbientOcclusionTexture;
  woodTextures.woodNormalTexture = woodNormalTexture;
  woodTextures.woodRoughnessTexture = woodRoughnessTexture;
  woodTextures.woodHeightTexture = woodHeightTexture;

  return woodTextures;
};

export default loadWoodTextures;
