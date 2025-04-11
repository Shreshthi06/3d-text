import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';

import GUI from "lil-gui";
import gsap from "gsap";
let userName = prompt("Enter your name:");

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

/**
 * Object
 */
const fontLoader = new FontLoader();
fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
  const textGeometry = new TextGeometry(userName, {
    font: font,
    size: 1,
    height: 0.3,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5
  });
  const textMaterial = new THREE.MeshNormalMaterial();
  const textMesh = new THREE.Mesh(textGeometry, textMaterial);
  scene.add(textMesh);
  textGeometry.center();
});

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
/**
 * Lights
 */

// Ambient lheight
const ambientLight = new THREE.AmbientLight("white", 0.5);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight("white", 1);
directionalLight.position.set(0, 1, 10);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048; // High-quality shadow
directionalLight.shadow.mapSize.height = 2048; // High-quality shadow
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 50;
directionalLight.shadow.camera.left = -10;
directionalLight.shadow.camera.right = 10;
directionalLight.shadow.camera.top = 10;
directionalLight.shadow.camera.bottom = -10;
scene.add(directionalLight);


// Studio light (back light)
const studioLight = new THREE.PointLight("white", 1, 50);
studioLight.position.set(0, 5, -10);
studioLight.castShadow = true;
studioLight.shadow.mapSize.width = 2048; // High-quality shadow
studioLight.shadow.mapSize.height = 2048; // High-quality shadow
scene.add(studioLight);
// Directional light at the back
const backDirectionalLight = new THREE.DirectionalLight("white", 1);
backDirectionalLight.position.set(0, 0, -10);
backDirectionalLight.castShadow = true;
backDirectionalLight.shadow.mapSize.width = 2048; // High-quality shadow
backDirectionalLight.shadow.mapSize.height = 2048; // High-quality shadow
backDirectionalLight.shadow.camera.near = 1;
backDirectionalLight.shadow.camera.far = 50;
backDirectionalLight.shadow.camera.left = -10;
backDirectionalLight.shadow.camera.right = 10;
backDirectionalLight.shadow.camera.top = 10;
backDirectionalLight.shadow.camera.bottom = -10;
scene.add(backDirectionalLight);
// Increase the intensity of ambient light
ambientLight.intensity = 1;

// Increase the intensity of directional light
directionalLight.intensity = 2;

// Increase the intensity of studio light
studioLight.intensity = 1.5;

//Heart Object
const heartX = -25;
const heartY = -25;
const heartShape = new THREE.Shape();
heartShape.moveTo(25 + heartX, 25 + heartY);
heartShape.bezierCurveTo(25 + heartX, 25 + heartY, 20 + heartX, 0 + heartY, 0 + heartX, 0 + heartY);
heartShape.bezierCurveTo(-30 + heartX, 0 + heartY, -30 + heartX, 35 + heartY, -30 + heartX, 35 + heartY);
heartShape.bezierCurveTo(-30 + heartX, 55 + heartY, -10 + heartX, 77 + heartY, 25 + heartX, 95 + heartY);
heartShape.bezierCurveTo(60 + heartX, 77 + heartY, 80 + heartX, 55 + heartY, 80 + heartX, 35 + heartY);
heartShape.bezierCurveTo(80 + heartX, 35 + heartY, 80 + heartX, 0 + heartY, 50 + heartX, 0 + heartY);
heartShape.bezierCurveTo(35 + heartX, 0 + heartY, 25 + heartX, 25 + heartY, 25 + heartX, 25 + heartY);

const extrudeSettings = {
  depth: 8,
  bevelEnabled: true,
  bevelSegments: 2,
  steps: 2,
  bevelSize: 1,
  bevelThickness: 1,
};

// const materialRedPinkWhite = new THREE.MeshStandardMaterial({
//   color: new THREE.Color("red"),
//   metalness: 0.5,
//   roughness: 0.3,
//   emissive: new THREE.Color("pink"),
// });


for (let i = 0; i < 100; i++) {

  // const geometryHeart = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
  // const meshHeart = new THREE.Mesh(geometryHeart, materialRedPinkWhite);
  const geometryHeart = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);

  // Create Gradient Colors
  const colors = [];
  const topColor = new THREE.Color("pink"); // Red
  const bottomColor = new THREE.Color("red"); // White

  // Assign Gradient Colors to Vertices
  for (let j = 0; j < geometryHeart.attributes.position.count; j++) {
    let y = geometryHeart.attributes.position.getY(j);
    let lerpFactor = (y + 2) / 80; // Normalize between 0 and 1
    const mixedColor = topColor.clone().lerp(bottomColor, lerpFactor);
    colors.push(mixedColor.r, mixedColor.g, mixedColor.b);
  }

  // Set Color Attribute
  geometryHeart.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));

  const materialHeart = new THREE.MeshStandardMaterial({
    vertexColors: true,
    metalness: 0.5,
    roughness: 0.3
  });

  const meshHeart = new THREE.Mesh(geometryHeart, materialHeart);

  meshHeart.scale.set(0.01, 0.01, 0.01);
  gsap.to(meshHeart.scale, {
    duration: 1,
    x: 0.008,
    y: 0.008,
    z: 0.008,
    repeat: -1
  });
  meshHeart.rotation.x = Math.PI;
  meshHeart.position.x = (Math.random() - 0.5) * 15;
  meshHeart.position.y = (Math.random() - 0.4) * 10;
  meshHeart.position.z = (Math.random() - 0.5) * 10;
  scene.add(meshHeart);
}

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
