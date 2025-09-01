export const loadBallTextures = (textureLoader) => {
  const stealColor = textureLoader.load("static/textures/textures/ball/steal/IMG_20250818_154945_191.jpg");
  const stealNormal = textureLoader.load("static/textures/textures/ball/steal/normal.jpg");
  const stealAmbientOcclusionTexture = textureLoader.load(
    "static/textures/textures/ball/steal/ambientOcclusion.jpg"
  );
  const stealRoughnessTexture = textureLoader.load(
    "static/textures/textures/ball/steal/roughness.jpg"
  );
  const stealMetalnessTexture = textureLoader.load(
    "static/textures/textures/ball/steal/metalness.jpg"
  );

  const woodColor = textureLoader.load("static/textures/textures/ball/wood/IMG_20250818_161012_614.jpg");
  const woodNormal = textureLoader.load("static/textures/textures/ball/wood/normal.jpg");
  const woodAmbientOcclusionTexture = textureLoader.load(
    "static/textures/textures/ball/wood/ambientOcclusion.jpg"
  );
  const woodRoughnessTexture = textureLoader.load(
    "static/textures/textures/ball/wood/roughness.jpg"
  );

  const rubberColor = textureLoader.load("static/textures/textures/ball/rubber/IMG_20250818_161009_887.jpg");
  const rubberNormal = textureLoader.load("static/textures/textures/ball/rubber/normal.jpg");
  const rubberAmbientOcclusionTexture = textureLoader.load(
    "static/textures/textures/ball/rubber/ambientOcclusion.jpg"
  );
  const rubberRoughnessTexture = textureLoader.load(
    "static/textures/textures/ball/rubber/roughness.jpg"
  );

  return [
    {
      color: stealColor,
      normal: stealNormal,
      ao: stealAmbientOcclusionTexture,
      roughness: stealRoughnessTexture,
      metalness: stealMetalnessTexture,
    },
    {
      color: woodColor,
      normal: woodNormal,
      ao: woodAmbientOcclusionTexture,
      roughness: woodRoughnessTexture,
    },
    {
      color: rubberColor,
      normal: rubberNormal,
      ao: rubberAmbientOcclusionTexture,
      roughness: rubberRoughnessTexture,
    },
  ];

};

