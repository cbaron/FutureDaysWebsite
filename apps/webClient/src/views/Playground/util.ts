import * as THREE from 'three'
import { FBXLoader } from './FBXLoader'

const getRandomFromArray = array =>
  array[Math.floor(Math.random() * array.length)]

const roadHash = {
  intersections: ['Road Intersection_01.fbx'],
  lanes: ['Road Lane_01.fbx']
}

const buildingFiles = [
  ['Building Sky_big_color01.fbx', 'Building Sky_big_color01.png', -12, 9],
  ['Building Sky_small_color01.fbx', 'Building Sky_small_color01.png', 10, 11],
  ['Building_Auto Service.fbx', 'Building_Auto Service.png', 0, 5],
  ['Building_Bakery.fbx', 'Building_Bakery.png', 0, 3],
  ['Building_Bar.fbx', 'Building_Bar.png', -5, 6],
  ['Building_Books Shop.fbx', 'Building_Books Shop.png', -2, 3],
  ['Building_Chicken Shop.fbx', 'Building_Chicken Shop.png', -3, 4],
  ['Building_Clothing.fbx', 'Building_Clothing.png', -2, 3],
  ['Building_Coffee Shop.fbx', 'Building_Coffee Shop.png', 0, 3],
  ['Building_Drug Store.fbx', 'Building_Drug Store.png', -3, 4],
  //['Building_Factory.fbx', 'Building_Factory.png', -1, -2],
  ['Building_Fast Food.fbx', 'Building_Fast Food.png', -3, 4],
  ['Building_Fruits  Shop.fbx', 'Building_Fruits  Shop.png', -8, 9],
  ['Building_Gas Station.fbx', 'Building_Gas Station.png', -2, -5],
  ['Building_Gift Shop.fbx', 'Building_Gift Shop.png', -3, 4],
  ['Building_House_01_color01.fbx', 'Building_House_01_color01.png', 30, 63]
]

function promisifyLoader(method) {
  return url =>
    new Promise((resolve, reject) => {
      method(url, resolve, undefined, reject)
    })
}

export async function loadModelWithTexture(modelPath, texturePath) {
  const fbxLoader = new FBXLoader()
  const textureLoader = new THREE.TextureLoader()

  const loadFbx = promisifyLoader(fbxLoader.load.bind(fbxLoader))
  const loadTexture = promisifyLoader(textureLoader.load.bind(textureLoader))

  const [modelObject, texture] = await Promise.all([
    loadFbx(modelPath),
    loadTexture(texturePath)
  ])

  modelObject.traverse(function(child) {
    if (child.isMesh) {
      //child.castShadow = true;
      //child.receiveShadow = true;
      child.material.map = texture
      child.material.needsUpdate = true
    }
  })

  modelObject.scale.y = 1
  modelObject.scale.x = 1
  modelObject.scale.z = 1

  return modelObject
}

export async function buildBlock(scene, numX, numY) {
  // spacing of blocks when function is called
  const spacingX = 20 * numX * 3
  const spacingZ = 20 * numY * 3

  // variable road textures
  const intersectionTexture = 'Road.png'
  const streetTexture = 'Road.png'

  // radnom building
  const bakery1 = await loadModelWithTexture(
    'Models/Buildings/' + 'Building_Bakery.fbx',
    'Textures/' + 'Building_Bakery.png'
  )
  bakery1.position.y = 0
  bakery1.position.x = 36 + spacingX
  bakery1.position.z = -30 + spacingZ
  bakery1.rotation.y = -Math.PI / 2
  scene.add(bakery1)

  const fastfood1 = await loadModelWithTexture(
    'Models/Buildings/' + 'Building_Fast Food.fbx',
    'Textures/' + 'Building_Fast Food.png'
  )
  fastfood1.position.y = 0
  fastfood1.position.x = 50 + spacingX
  fastfood1.position.z = -15 + spacingZ
  fastfood1.rotation.y = Math.PI / 1
  scene.add(fastfood1)

  const bookShop1 = await loadModelWithTexture(
    'Models/Buildings/' + buildingFiles[5][0],
    'Textures/' + buildingFiles[5][1]
  )
  bookShop1.position.y = 0
  bookShop1.position.x = 36 + spacingX
  bookShop1.position.z = -16 + spacingZ
  bookShop1.rotation.y = Math.PI / -2
  scene.add(bookShop1)

  const bar1 = await loadModelWithTexture(
    'Models/Buildings/' + 'Building_Bar.fbx',
    'Textures/' + 'Building_Bar.png'
  )
  bar1.position.y = 0
  bar1.position.x = 66 + spacingX
  bar1.position.z = -13 + spacingZ
  bar1.rotation.y = Math.PI / 1
  scene.add(bar1)

  const musicStore1 = await loadModelWithTexture(
    'Models/Buildings/' + 'Building_Music Store.fbx',
    'Textures/' + 'Building_Music Store.png'
  )
  musicStore1.position.y = 0
  musicStore1.position.x = 35 + spacingX
  musicStore1.position.z = -45 + spacingZ
  musicStore1.rotation.y = Math.PI / -2
  scene.add(musicStore1)

  const pizza1 = await loadModelWithTexture(
    'Models/Buildings/' + 'Building_Pizza.fbx',
    'Textures/' + 'Building_Pizza.png'
  )
  pizza1.position.y = 0
  pizza1.position.x = 65 + spacingX
  pizza1.position.z = -24 + spacingZ
  pizza1.rotation.y = Math.PI / 2
  scene.add(pizza1)

  const skyScraper1 = await loadModelWithTexture(
    'Models/Buildings/' + 'Building Sky_big_color01.fbx',
    'Textures/' + 'Building Sky_big_color01.png'
  )
  skyScraper1.position.y = 0
  skyScraper1.position.x = 73 + spacingX
  skyScraper1.position.z = -51 + spacingZ
  skyScraper1.rotation.y = Math.PI / 1
  scene.add(skyScraper1)

  // Tree
  // const tree = await loadModelWithTexture(
  //   'Models/Natures/' + 'Natures_Fir Tree.fbx',
  //   'Textures/' + 'grass.png'
  // )
  // tree.position.y = 0
  // tree.position.x = 45 + spacingX
  // tree.position.z = -15 + spacingZ
  // scene.add(tree)

  // Inward tiles

  const tile1 = await loadModelWithTexture(
    'Models/Road/' + 'Road Concrete Tile.fbx',
    'Textures/' + 'Road Concrete Tile.png'
  )
  tile1.position.y = 0
  tile1.position.x = 40 + spacingX
  tile1.position.z = -20 + spacingZ
  scene.add(tile1)

  const tile2 = await loadModelWithTexture(
    'Models/Road/' + 'Road Concrete Tile.fbx',
    'Textures/' + 'Road Concrete Tile.png'
  )
  tile2.position.y = 0
  tile2.position.x = 60 + spacingX
  tile2.position.z = -20 + spacingZ
  scene.add(tile2)

  const tile3 = await loadModelWithTexture(
    'Models/Road/' + 'Road Concrete Tile.fbx',
    'Textures/' + 'Road Concrete Tile.png'
  )
  tile3.position.y = 0
  tile3.position.x = 40 + spacingX
  tile3.position.z = -40 + spacingZ
  scene.add(tile3)

  const tile4 = await loadModelWithTexture(
    'Models/Road/' + 'Road Concrete Tile.fbx',
    'Textures/' + 'Road Concrete Tile.png'
  )
  tile4.position.y = 0
  tile4.position.x = 60 + spacingX
  tile4.position.z = -40 + spacingZ
  scene.add(tile4)

  // Roads Tiles

  const road = await loadModelWithTexture(
    'Models/Road/' + getRandomFromArray(roadHash.lanes),
    'Textures/' + streetTexture
  )
  road.position.y = 0
  road.position.x = 20 + spacingX
  road.position.z = -20 + spacingZ
  scene.add(road)

  const roadTwo = await loadModelWithTexture(
    'Models/Road/' + getRandomFromArray(roadHash.lanes),
    'Textures/' + streetTexture
  )

  roadTwo.position.y = 0
  roadTwo.position.x = 20 + spacingX
  roadTwo.position.z = -40 + spacingZ
  scene.add(roadTwo)

  const roadThree = await loadModelWithTexture(
    'Models/Road/' + getRandomFromArray(roadHash.intersections),
    'Textures/' + intersectionTexture
  )
  roadThree.position.y = 0
  roadThree.position.x = 20 + spacingX
  roadThree.position.z = -60 + spacingZ
  scene.add(roadThree)

  const roadFour = await loadModelWithTexture(
    'Models/Road/' + getRandomFromArray(roadHash.lanes),
    'Textures/' + streetTexture
  )

  roadFour.position.y = 0
  roadFour.position.x = 40 + spacingX
  roadFour.position.z = -60 + spacingZ
  roadFour.rotation.y = Math.PI / 2
  scene.add(roadFour)

  const roadFive = await loadModelWithTexture(
    'Models/Road/' + getRandomFromArray(roadHash.lanes),
    'Textures/' + streetTexture
  )

  roadFive.position.y = 0
  roadFive.position.x = 60 + spacingX
  roadFive.position.z = -60 + spacingZ
  roadFive.rotation.y = Math.PI / 2
  scene.add(roadFive)
}
