import * as THREE from "three";
import { FBXLoader } from "./FBXLoader";

const getRandomFromArray = array =>
  array[Math.floor(Math.random() * array.length)];

const roadHash = {
  intersections: ["Road T_Intersection_01.fbx"],
  lanes: ["Road Lane_01.fbx"]
};

const roadFiles = [
  ["Road Concrete Tile Small.fbx", "Road Concrete Tile.png"],
  ["Road Concrete Tile.fbx", "Road Concrete Tile.png"],
  ["Road Corner_01.fbx"],
  ["Road Corner_02.fbx"],
  ["Road Intersection_01.fbx"],
  ["Road Intersection_02.fbx"],
  ["Road Lane Bus Stop.fbx"],
  ["Road Lane Half.fbx"],
  ["Road Lane_01.fbx"],
  ["Road Lane_02.fbx"],
  ["Road Lane_03.fbx"],
  ["Road Lane_04.fbx"],
  ["Road Split Line.fbx"],
  ,
  ["Road T_Intersection_02.fbx"],
  ["Road Tile Small.fbx"],
  ["Road Tile.fbx"]
];

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

  modelObject.scale.y = 1;
  modelObject.scale.x = 1;
  modelObject.scale.z = 1;

  return modelObject;
}

export async function buildBlock(scene) {
  const road = await loadModelWithTexture(
    "Models/Road/" + getRandomFromArray(roadHash.lanes),
    "Textures/" + "Road.png"
  );
  road.position.y = 0;
  road.position.x = 0;
  road.position.z = 0;
  scene.add(road);

  const roadTwo = await loadModelWithTexture(
    "Models/Road/" + getRandomFromArray(roadHash.lanes),
    "Textures/" + "Road.png"
  );

  roadTwo.position.y = 0;
  roadTwo.position.x = 0;
  roadTwo.position.z = -20;
  scene.add(roadTwo);

  const roadThree = await loadModelWithTexture(
    "Models/Road/" + getRandomFromArray(roadHash.intersections),
    "Textures/" + "Road.png"
  );
  roadThree.position.y = 0;
  roadThree.position.x = 0;
  roadThree.position.z = -40;
  scene.add(roadThree);

  const roadFour = await loadModelWithTexture(
    "Models/Road/" + getRandomFromArray(roadHash.lanes),
    "Textures/" + "Road.png"
  );

  roadFour.position.y = 0;
  roadFour.position.x = 20;
  roadFour.position.z = 0;
  roadFour.rotation.y = Math.PI / 2;
  scene.add(roadFour);
}
