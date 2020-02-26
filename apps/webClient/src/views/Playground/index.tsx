import React, { useEffect, useRef, ReactElement } from 'react'
import { makeStyles } from '@material-ui/styles'
import * as THREE from 'three'
import { FBXLoader } from './FBXLoader'
import { loadModelWithTexture, buildBlock } from './util'

require('./inflate.min.js')

interface Props {}

const useStyles = makeStyles(() => ({
  root: {
    position: 'fixed',
    width: '100vw',
    height: '100vh'
  }
}))

let camera
let renderer

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)
}

const stickItUpYourYeah = async (threeJsElement: ReactElement) => {
  let thing
  const loader = new FBXLoader()

  camera = new THREE.PerspectiveCamera(
    115,
    window.innerWidth / window.innerHeight,
    1,
    2000
  )
  camera.position.set(130, 70, 50)

  camera.rotation.y = 0.0
  camera.rotation.x = -0.7
  camera.rotation.z = 0.0

  const scene = new THREE.Scene()
  //scene.background = new THREE.Color(0xa0a0a0);
  //scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000);

  const light = new THREE.HemisphereLight(0xffffff, 0x444444)
  light.position.set(0, 200, 0)
  scene.add(light)

  /*
  const lightTwo = new THREE.DirectionalLight(0xffffff);
  lightTwo.position.set(0, 200, 100);
  lightTwo.castShadow = true;
  lightTwo.shadow.camera.top = 180;
  lightTwo.shadow.camera.bottom = -100;
  lightTwo.shadow.camera.left = -120;
  lightTwo.shadow.camera.right = 120;
  scene.add(lightTwo);
  */

  var mesh = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(2000, 2000),
    new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false })
  )
  mesh.rotation.x = -Math.PI / 2
  mesh.receiveShadow = true
  scene.add(mesh)

  var grid = new THREE.GridHelper(400, 40, 0x000000, 0x000000)
  grid.material.opacity = 0.2
  grid.material.transparent = true
  scene.add(grid)

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.shadowMap.enabled = true
  renderer.setSize(window.innerWidth, window.innerHeight)

  window.addEventListener('resize', onWindowResize, false)

  threeJsElement.appendChild(renderer.domElement)

  /*
  const stadium = await loadModelWithTexture(
    "Models/Buildings/Building_Stadium.fbx",
    "Textures/Building_Stadium.png"
  );

  stadium.position.y = 5;
  stadium.position.x = 5;
  stadium.position.z = 5;
  scene.add(stadium);
  */

  const roadFiles = [
    ['Road Concrete Tile Small.fbx', 'Road Concrete Tile.png'],
    ['Road Concrete Tile.fbx', 'Road Concrete Tile.png'],
    ['Road Corner_01.fbx'],
    ['Road Corner_02.fbx'],
    ['Road Intersection_01.fbx'],
    ['Road Intersection_02.fbx'],
    ['Road Lane Bus Stop.fbx'],
    ['Road Lane Half.fbx'],
    ['Road Lane_01.fbx'],
    ['Road Lane_02.fbx'],
    ['Road Lane_03.fbx'],
    ['Road Lane_04.fbx'],
    ['Road Split Line.fbx'],
    ['Road T_Intersection_01.fbx'],
    ['Road T_Intersection_02.fbx'],
    ['Road Tile Small.fbx'],
    ['Road Tile.fbx']
  ]

  // pass down the X and Z offset for each new tile
  await buildBlock(scene, 1, 0)
  await buildBlock(scene, 2, 0)
  await buildBlock(scene, 1, 1)
  await buildBlock(scene, 2, 1)

  const natureFiles = [
    'Natures_Big Tree.fbx',
    'Natures_Bush_01.fbx',
    'Natures_Bush_02.fbx',
    'Natures_Bush_03.fbx',
    'Natures_Cube Tree.fbx',
    'Natures_Fir Tree.fbx',
    'Natures_Grass Bar.fbx',
    'Natures_Grass Fence.fbx',
    'Natures_Grass Tile Small.fbx',
    'Natures_Grass Tile.fbx',
    'Natures_House Floor.fbx',
    'Natures_Pot Bush_big.fbx',
    'Natures_Pot Bush_small.fbx',
    'Natures_Rock_Big.fbx',
    'Natures_Rock_small.fbx'
  ]

  const buildingFiles = [
    ['Building Sky_big_color01.fbx', 'Building Sky_big_color01.png'],
    ['Building Sky_small_color01.fbx', 'Building Sky_small_color01.png'],
    ['Building_Auto Service.fbx', 'Building_Auto Service.png'],
    ['Building_Bakery.fbx', 'Building_Bakery.png'],
    ['Building_Bar.fbx', 'Building_Bar.png'],
    ['Building_Books Shop.fbx', 'Building_Books Shop.png'],
    ['Building_Chicken Shop.fbx', 'Building_Chicken Shop.png'],
    ['Building_Clothing.fbx', 'Building_Clothing.png'],
    ['Building_Coffee Shop.fbx', 'Building_Coffee Shop.png'],
    ['Building_Drug Store.fbx', 'Building_Drug Store.png'],
    ['Building_Factory.fbx', 'Building_Factory.png'],
    ['Building_Fast Food.fbx', 'Building_Fast Food.png'],
    ['Building_Fruits  Shop.fbx', 'Building_Fruits  Shop.png'],
    ['Building_Gas Station.fbx', 'Building_Gas Station.png'],
    ['Building_Gift Shop.fbx', 'Building_Gift Shop.png'],
    ['Building_House_01_color01.fbx', 'Building_House_01_color01.png']
  ]
  /*[    "Building_House_02_color01.fbx",]
[    "Building_House_03_color01.fbx",]
[    "Building_House_04_color01.fbx",]
[    "Building_Music Store.fbx",]
[    "Building_Pizza.fbx",]
[    "Building_Residential_color01.fbx",]
[    "Building_Restaurant.fbx",]
[    "Building_Shoes Shop.fbx",]
[    "Building_Stadium.fbx",]
[    "Building_Super Market.fbx"]
  ];]
  */

  const offsets = { x: 5, y: 5, z: 5 }

  /*
  await Promise.all(
    roadFiles.map(async ([modelFile, textureFile], index) => {
      const object = await loadModelWithTexture(
        "Models/Road/" + modelFile,
        "Textures/" + (textureFile || "Road.png")
      );

      offsets.x = offsets.x + 5;
      offsets.y = offsets.y + 1;
      offsets.z = offsets.z + 1;
      if (index === 2) {
        offsets.x = -20;
      }
      object.position.x = offsets.x;
      object.position.y = offsets.y;
      object.position.z = offsets.z;
      console.log("adding object");
      scene.add(object);
    })
  );
  */

  /*
  offsets.x = -10;
  offsets.z = offsets.z - 5;
  await Promise.all(
    natureFiles.map(async (modelFile, index) => {
      const object = await loadModelWithTexture(
        "Models/Natures/" + modelFile,
        "Textures/Natures.png"
      );

      offsets.x = offsets.x + 2;
      offsets.y = offsets.y + 1;
      offsets.z = offsets.z + 1;
      object.position.x = offsets.x;
      object.position.y = offsets.y;
      object.position.z = offsets.z;
      console.log("adding object");
      scene.add(object);
    })
  );*/

  /*
  offsets.x = -40;
  offsets.z = 15;
  await Promise.all(
    buildingFiles.map(async ([modelFile, textureFile], index) => {
      const object = await loadModelWithTexture(
        "Models/Buildings/" + modelFile,
        "Textures/" + textureFile
      );

      offsets.x = offsets.x + 5;
      offsets.y = offsets.y + 1;
      offsets.z = offsets.z + 1;
      object.position.x = offsets.x;
      object.position.y = offsets.y;
      object.position.z = offsets.z;
      console.log("adding object");
      scene.add(object);
    })
  );
  */

  renderer.render(scene, camera)

  animate()
}
function animate() {
  requestAnimationFrame(animate)

  //if (thing) {
  //thing.rotation.x += 0.01;
  //thing.rotation.y += 0.02;
  //}
}

const Playground: React.FC<Props> = ({}) => {
  const classes = useStyles()
  const threeJsEl = useRef(null)

  useEffect(() => {
    if (threeJsEl && threeJsEl.current) {
      try {
        stickItUpYourYeah(threeJsEl.current as any)
      } catch (e) {
        console.log('You suck son')
        console.log(e.stack || e)
      }
    }
  }, [threeJsEl, threeJsEl.current])

  return <div ref={threeJsEl} className={classes.root} />
}

export default Playground
