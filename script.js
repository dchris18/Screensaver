import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

import { OrbitControls }
from "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js";


// SCENE
const scene = new THREE.Scene();

scene.background = new THREE.Color("#030712");

scene.fog = new THREE.Fog(
  "#030712",
  5,
  18
);


// CAMERA
const camera = new THREE.PerspectiveCamera(
  55,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

camera.position.set(0, 2.2, 7);


// RENDERER
const renderer = new THREE.WebGLRenderer({
  antialias: true
});

renderer.setSize(
  window.innerWidth,
  window.innerHeight
);

renderer.setPixelRatio(
  Math.min(window.devicePixelRatio, 2)
);

renderer.shadowMap.enabled = true;

document.body.appendChild(renderer.domElement);


// CONTROLS
const controls = new OrbitControls(
  camera,
  renderer.domElement
);

controls.enableDamping = true;

controls.dampingFactor = 0.08;

controls.minDistance = 4;

controls.maxDistance = 10;

controls.maxPolarAngle = Math.PI / 2.05;

controls.target.set(0, 1.4, 0);


// MATERIALS
const wallMat = new THREE.MeshStandardMaterial({
  color: "#07152d",
  roughness: 0.65,
  metalness: 0.08
});

const floorMat = new THREE.MeshStandardMaterial({
  color: "#050b18",
  roughness: 0.9,
  metalness: 0.1
});

const glowMat = new THREE.MeshBasicMaterial({
  color: "#5bc7ff"
});


// ROOM SIZE
const roomWidth = 8;
const roomHeight = 4.5;
const roomDepth = 8;


// FLOOR
const floor = new THREE.Mesh(
  new THREE.BoxGeometry(
    roomWidth,
    0.12,
    roomDepth
  ),
  floorMat
);

floor.position.set(0, -0.06, 0);

floor.receiveShadow = true;

scene.add(floor);


// BACK WALL
const backWall = new THREE.Mesh(
  new THREE.BoxGeometry(
    roomWidth,
    roomHeight,
    0.12
  ),
  wallMat
);

backWall.position.set(
  0,
  roomHeight / 2,
  -roomDepth / 2
);

scene.add(backWall);


// LEFT WALL
const leftWall = new THREE.Mesh(
  new THREE.BoxGeometry(
    0.12,
    roomHeight,
    roomDepth
  ),
  wallMat
);

leftWall.position.set(
  -roomWidth / 2,
  roomHeight / 2,
  0
);

scene.add(leftWall);


// RIGHT WALL
const rightWall = new THREE.Mesh(
  new THREE.BoxGeometry(
    0.12,
    roomHeight,
    roomDepth
  ),
  wallMat
);

rightWall.position.set(
  roomWidth / 2,
  roomHeight / 2,
  0
);

scene.add(rightWall);


// CEILING
const ceiling = new THREE.Mesh(
  new THREE.BoxGeometry(
    roomWidth,
    0.12,
    roomDepth
  ),
  wallMat
);

ceiling.position.set(
  0,
  roomHeight,
  0
);

scene.add(ceiling);


// LIGHT BAR
const lightBar = new THREE.Mesh(
  new THREE.BoxGeometry(
    2.6,
    0.08,
    0.08
  ),
  glowMat
);

lightBar.position.set(
  0,
  3.3,
  -3.93
);

scene.add(lightBar);


// NEON LIGHT
const neonLight = new THREE.PointLight(
  "#5bc7ff",
  6,
  9
);

neonLight.position.set(
  0,
  3.1,
  -3.2
);

neonLight.castShadow = true;

scene.add(neonLight);


// AMBIENT LIGHT
const ambient = new THREE.AmbientLight(
  "#1f6fff",
  0.35
);

scene.add(ambient);


// PANEL
const panel = new THREE.Mesh(
  new THREE.BoxGeometry(
    2.3,
    1.2,
    0.08
  ),

  new THREE.MeshStandardMaterial({
    color: "#0b2448",

    emissive: "#123d70",

    emissiveIntensity: 0.45,

    roughness: 0.35,

    metalness: 0.3
  })
);

panel.position.set(
  0,
  1.8,
  -3.88
);

scene.add(panel);


// DESK
const desk = new THREE.Mesh(
  new THREE.BoxGeometry(
    2.6,
    0.35,
    1
  ),

  new THREE.MeshStandardMaterial({
    color: "#07101f",

    roughness: 0.5,

    metalness: 0.25
  })
);

desk.position.set(
  0,
  0.65,
  -2.6
);

desk.castShadow = true;

desk.receiveShadow = true;

scene.add(desk);


// GRID
const grid = new THREE.GridHelper(
  8,
  16,
  "#164d78",
  "#0b2745"
);

grid.position.y = 0.01;

scene.add(grid);


// PARTICLES
const particleGeo = new THREE.BufferGeometry();

const particleCount = 160;

const positions = [];

for (let i = 0; i < particleCount; i++) {

  positions.push(
    (Math.random() - 0.5) * 7,
    Math.random() * 4,
    (Math.random() - 0.5) * 7
  );
}

particleGeo.setAttribute(
  "position",

  new THREE.Float32BufferAttribute(
    positions,
    3
  )
);

const particleMat = new THREE.PointsMaterial({
  color: "#8bdcff",

  size: 0.035,

  transparent: true,

  opacity: 0.65
});

const particles = new THREE.Points(
  particleGeo,
  particleMat
);

scene.add(particles);


// ANIMATION
function animate() {

  requestAnimationFrame(animate);

  controls.update();

  particles.rotation.y += 0.0008;

  renderer.render(scene, camera);
}

animate();


// RESIZE
window.addEventListener("resize", () => {

  camera.aspect =
    window.innerWidth / window.innerHeight;

  camera.updateProjectionMatrix();

  renderer.setSize(
    window.innerWidth,
    window.innerHeight
  );
});