import React, { useEffect, useRef, ReactElement } from "react";
import { makeStyles } from "@material-ui/styles";
import * as THREE from "three";
import { FBXLoader } from "./FBXLoader";

require("./inflate.min.js");

interface Props {}

const useStyles = makeStyles(() => ({
  root: {
    position: "fixed",
    width: "100vw",
    height: "100vh"
  }
}));

let camera;
let renderer;

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

const stickItUpYourYeah = (threeJsElement: ReactElement) => {
  let thing;
  const loader = new FBXLoader();

  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    2000
  );
  camera.position.set(0, 40, 50);

  camera.rotation.y = 0;
  camera.rotation.x = -0.5;
  camera.rotation.z = 0;

  const scene = new THREE.Scene();
  //scene.background = new THREE.Color(0xa0a0a0);
  //scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000);

  const light = new THREE.HemisphereLight(0xffffff, 0x444444);
  light.position.set(0, 200, 0);
  scene.add(light);

  const lightTwo = new THREE.DirectionalLight(0xffffff);
  lightTwo.position.set(0, 200, 100);
  lightTwo.castShadow = true;
  lightTwo.shadow.camera.top = 180;
  lightTwo.shadow.camera.bottom = -100;
  lightTwo.shadow.camera.left = -120;
  lightTwo.shadow.camera.right = 120;
  scene.add(lightTwo);

  var mesh = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(2000, 2000),
    new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false })
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.receiveShadow = true;
  scene.add(mesh);

  var grid = new THREE.GridHelper(2000, 20, 0x000000, 0x000000);
  grid.material.opacity = 0.2;
  grid.material.transparent = true;
  scene.add(grid);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.setSize(window.innerWidth, window.innerHeight);

  window.addEventListener("resize", onWindowResize, false);

  threeJsElement.appendChild(renderer.domElement);

  const textureLoader = new THREE.TextureLoader();

  loader.load(
    "Models/Buildings/Building_Stadium.fbx",
    function(object) {
      //mixer = new THREE.AnimationMixer(object);

      textureLoader.load(
        "Textures/Building_Stadium.png",
        function(texture) {
          //var action = mixer.clipAction(object.animations[0]);
          //action.play();

          object.traverse(function(child) {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
              child.material.map = texture;
              child.material.needsUpdate = true;
            }
          });

          thing = object;
          object.position.y = 5;
          object.position.x = 5;
          object.position.z = 5;
          object.scale.y = 0.15;
          object.scale.x = 0.15;
          object.scale.z = 0.15;
          scene.add(object);
        },
        undefined,
        e => console.log(e)
      );
    },
    undefined,
    function(e) {
      console.error(e);
    }
  );

  function animate() {
    requestAnimationFrame(animate);

    if (thing) {
      //thing.rotation.x += 0.01;
      //thing.rotation.y += 0.02;
    }

    renderer.render(scene, camera);
  }

  animate();
};

const Playground: React.FC<Props> = ({}) => {
  const classes = useStyles();
  const threeJsEl = useRef(null);

  useEffect(() => {
    if (threeJsEl && threeJsEl.current) {
      stickItUpYourYeah(threeJsEl.current as any);
    }
  }, [threeJsEl, threeJsEl.current]);

  return <div ref={threeJsEl} className={classes.root} />;
};

export default Playground;
