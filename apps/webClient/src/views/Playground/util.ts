import * as THREE from "three";
import { FBXLoader } from "./FBXLoader";

function promisifyLoader(method) {
  return url =>
    new Promise((resolve, reject) => {
      method(url, resolve, undefined, reject);
    });
}

export async function loadModelWithTexture(modelPath, texturePath) {
  const fbxLoader = new FBXLoader();
  const textureLoader = new THREE.TextureLoader();

  const loadFbx = promisifyLoader(fbxLoader.load.bind(fbxLoader));
  const loadTexture = promisifyLoader(textureLoader.load.bind(textureLoader));

  const [modelObject, texture] = await Promise.all([
    loadFbx(modelPath),
    loadTexture(texturePath)
  ]);

  modelObject.traverse(function(child) {
    if (child.isMesh) {
      //child.castShadow = true;
      //child.receiveShadow = true;
      child.material.map = texture;
      child.material.needsUpdate = true;
    }
  });

  modelObject.scale.y = 0.35;
  modelObject.scale.x = 0.35;
  modelObject.scale.z = 0.35;

  return modelObject;
}
