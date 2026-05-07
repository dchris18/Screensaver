import * as THREE from "three";

const scene = new THREE.Scene();
scene.background = new THREE.Color("#d8d8d5");
scene.fog = new THREE.Fog("#d8d8d5", 18, 42);

const camera = new THREE.PerspectiveCamera(
  30,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

camera.position.set(6.8, 4.2, 16);
camera.lookAt(0, 1.1, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.5));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
document.body.appendChild(renderer.domElement);

const C = {
  floor: "#cfcfca",
  white: "#f2f0e9",
  white2: "#dedbd2",
  gray: "#777a78",
  dark: "#202322",
  belt: "#222524",
  yellow: "#d9a514",
  yellow2: "#f1c232",
  glass: "#15191a"
};

const mat = {
  floor: new THREE.MeshStandardMaterial({ color: C.floor, roughness: 0.65 }),
  white: new THREE.MeshStandardMaterial({ color: C.white, roughness: 0.38, metalness: 0.08 }),
  white2: new THREE.MeshStandardMaterial({ color: C.white2, roughness: 0.45, metalness: 0.08 }),
  gray: new THREE.MeshStandardMaterial({ color: C.gray, roughness: 0.42, metalness: 0.22 }),
  dark: new THREE.MeshStandardMaterial({ color: C.dark, roughness: 0.55, metalness: 0.35 }),
  belt: new THREE.MeshStandardMaterial({ color: C.belt, roughness: 0.48, metalness: 0.25 }),
  yellow: new THREE.MeshStandardMaterial({ color: C.yellow, roughness: 0.35, metalness: 0.18 }),
  yellow2: new THREE.MeshStandardMaterial({ color: C.yellow2, roughness: 0.32, metalness: 0.16 }),
  glass: new THREE.MeshStandardMaterial({
    color: C.glass,
    roughness: 0.18,
    metalness: 0.15,
    transparent: true,
    opacity: 0.75
  })
};

function box(w, h, d, material, x = 0, y = 0, z = 0) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function cyl(r, h, material, x = 0, y = 0, z = 0, rotX = 0, rotZ = 0) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 32), material);
  mesh.position.set(x, y, z);
  mesh.rotation.x = rotX;
  mesh.rotation.z = rotZ;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

// lighting
scene.add(new THREE.HemisphereLight("#ffffff", "#b6b6b2", 1.8));

const sun = new THREE.DirectionalLight("#ffffff", 2.6);
sun.position.set(6, 9, 8);
sun.castShadow = true;
sun.shadow.mapSize.width = 2048;
sun.shadow.mapSize.height = 2048;
sun.shadow.camera.left = -14;
sun.shadow.camera.right = 14;
sun.shadow.camera.top = 10;
sun.shadow.camera.bottom = -8;
scene.add(sun);

// floor
scene.add(box(28, 0.25, 11, mat.floor, 0, -0.15, 0));

// subtle floor grid
for (let i = 0; i < 15; i++) {
  scene.add(box(0.025, 0.01, 11, mat.white2, -13 + i * 2, 0.01, 0));
}

for (let i = 0; i < 8; i++) {
  scene.add(box(28, 0.01, 0.025, mat.white2, 0, 0.015, -5 + i * 1.5));
}

// conveyor helper
const rollers = [];

function createConveyor(x, y, z, length, direction = 1) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  scene.add(g);

  g.add(box(length, 0.28, 1.15, mat.gray, 0, 0, 0));
  g.add(box(length - 0.2, 0.08, 0.95, mat.belt, 0, 0.22, 0));

  for (let i = 0; i < Math.floor(length / 0.7); i++) {
    const r = cyl(
      0.09,
      1.05,
      mat.dark,
      -length / 2 + 0.35 + i * 0.7,
      0.27,
      0,
      Math.PI / 2
    );

    r.userData.direction = direction;
    rollers.push(r);
    g.add(r);
  }

  for (let i = 0; i < 4; i++) {
    const px = -length / 2 + 0.6 + i * ((length - 1.2) / 3);
    g.add(box(0.12, 0.8, 0.12, mat.gray, px, -0.45, -0.45));
    g.add(box(0.12, 0.8, 0.12, mat.gray, px, -0.45, 0.45));
  }

  return g;
}

createConveyor(-5.5, 0.55, 0, 7.4, 1);
createConveyor(1.9, 0.55, 0, 7.2, 1);
createConveyor(7.1, 0.95, -1.15, 4.4, 1);

// transfer ramp
const ramp = box(3.0, 0.12, 1.0, mat.belt, 4.7, 0.86, -0.55);
ramp.rotation.z = -0.18;
scene.add(ramp);

// packages
const packages = [];

for (let i = 0; i < 8; i++) {
  const p = new THREE.Group();

  p.add(box(0.45, 0.32, 0.45, mat.yellow));
  p.add(box(0.3, 0.04, 0.3, mat.yellow2, 0, 0.18, 0));

  p.position.set(-8.8 + i * 2.1, 1.02, 0);
  p.userData.speed = 0.022 + Math.random() * 0.004;

  packages.push(p);
  scene.add(p);
}

// machine detail helpers
function addYellowRails(g, w, y, z) {
  g.add(box(w, 0.07, 0.08, mat.yellow, 0, y, z));
  g.add(box(0.07, 0.5, 0.08, mat.yellow, -w / 2, y - 0.2, z));
  g.add(box(0.07, 0.5, 0.08, mat.yellow, w / 2, y - 0.2, z));
}

function addVents(g, x, y, z) {
  for (let i = 0; i < 4; i++) {
    g.add(box(0.08, 0.42, 0.05, mat.dark, x + i * 0.22, y, z));
  }
}

function addSafetyRail(g, width, x = 0, y = 1.2, z = 0.75) {
  g.add(box(width, 0.05, 0.05, mat.gray, x, y, z));
  g.add(box(width, 0.05, 0.05, mat.gray, x, y + 0.35, z));

  for (let i = 0; i < 5; i++) {
    g.add(box(0.045, 0.42, 0.045, mat.gray, x - width / 2 + i * (width / 4), y + 0.18, z));
  }
}

// background machinery for depth
const bg = new THREE.Group();
bg.position.set(0, 0, -3.2);
scene.add(bg);

for (let i = 0; i < 5; i++) {
  const x = -10 + i * 5;

  bg.add(box(2.1, 1.7, 1.1, mat.white2, x, 1.05, 0));
  bg.add(box(1.4, 0.14, 1.15, mat.yellow, x, 2.0, 0));
  bg.add(box(0.35, 0.55, 0.35, mat.gray, x + 0.65, 2.35, 0));
  bg.add(box(0.7, 0.7, 0.05, mat.glass, x - 0.3, 1.15, 0.58));

  createConveyor(x, 0.45, -3.2, 3.4, -1);
}

// machines
function createInputTunnel() {
  const g = new THREE.Group();
  g.position.set(-8.2, 0, 0);
  scene.add(g);

  g.add(box(3.3, 2.1, 1.45, mat.white, 0, 1.35, 0));
  g.add(box(3.45, 0.18, 1.55, mat.white2, 0, 2.5, 0));
  g.add(box(2.5, 1.1, 0.08, mat.glass, 0, 1.3, 0.77));

  addYellowRails(g, 2.4, 2.55, 0.82);
  addVents(g, -1.1, 1.35, 0.82);

  return g;
}

function createRollerPress() {
  const g = new THREE.Group();
  g.position.set(-3.8, 0, 0);
  scene.add(g);

  g.add(box(2.4, 2.25, 1.4, mat.white, 0, 1.25, 0));
  g.add(box(2.55, 0.18, 1.5, mat.yellow, 0, 2.48, 0));
  g.add(box(1.55, 0.12, 1.1, mat.gray, 0, 1.7, 0.1));
  g.add(box(1.55, 0.12, 1.1, mat.gray, 0, 1.15, 0.1));

  const rollerA = cyl(0.18, 1.2, mat.dark, 0, 1.68, 0.17, Math.PI / 2);
  const rollerB = cyl(0.18, 1.2, mat.dark, 0, 1.15, 0.17, Math.PI / 2);

  g.add(rollerA, rollerB);

  addSafetyRail(g, 2.2, 0, 2.7, 0.7);

  return { g, rollerA, rollerB };
}

function createScanner() {
  const g = new THREE.Group();
  g.position.set(1.2, 0, 0);
  scene.add(g);

  g.add(box(2.4, 2.5, 1.35, mat.white, 0, 1.35, 0));
  g.add(box(2.55, 0.18, 1.45, mat.yellow, 0, 2.72, 0));
  g.add(box(1.45, 1.1, 0.08, mat.glass, 0, 1.45, 0.72));

  const scanBar = box(1.35, 0.08, 1.05, mat.yellow2, 0, 1.05, 0.1);
  const scanSide = box(0.08, 1.05, 1.05, mat.yellow2, -0.65, 1.45, 0.1);

  g.add(scanBar, scanSide);
  addVents(g, 0.6, 2.0, 0.76);

  return { g, scanBar, scanSide };
}

function createOutputMachine() {
  const g = new THREE.Group();
  g.position.set(6.6, 0, -0.8);
  scene.add(g);

  g.add(box(3.5, 2.4, 1.55, mat.white, 0, 1.45, 0));
  g.add(box(3.65, 0.2, 1.65, mat.white2, 0, 2.75, 0));

  g.add(box(1.6, 1.05, 0.08, mat.glass, -0.3, 1.45, 0.82));

  const flap = box(1.45, 0.13, 1.05, mat.belt, -0.35, 0.92, 0.25);
  flap.rotation.z = -0.1;
  g.add(flap);

  const arm = box(0.16, 1.1, 0.16, mat.gray, 1.05, 2.1, 0.55);
  arm.rotation.z = -0.25;

  const head = box(0.55, 0.28, 0.55, mat.yellow, 0.9, 1.55, 0.55);

  g.add(arm, head);

  addSafetyRail(g, 3.2, 0, 2.95, 0.88);

  return { g, flap, arm, head };
}

const inputTunnel = createInputTunnel();
const press = createRollerPress();
const scanner = createScanner();
const output = createOutputMachine();

// pipes / industrial overhead
for (let i = 0; i < 3; i++) {
  scene.add(cyl(0.05, 17, mat.gray, -1 + i * 1.1, 3.25, -1.8, 0, Math.PI / 2));
}

for (let i = 0; i < 4; i++) {
  scene.add(box(0.08, 1.0, 0.08, mat.gray, -6 + i * 3.5, 2.75, -1.8));
}

// animation
let time = 0;

function animate() {
  requestAnimationFrame(animate);
  time += 0.016;

  rollers.forEach((r) => {
    r.rotation.z -= 0.08 * (r.userData.direction || 1);
  });

  packages.forEach((p) => {
    p.position.x += p.userData.speed;

    if (p.position.x > 9.2) {
      p.position.x = -9.2;
      p.position.z = 0;
    }

    if (p.position.x > 4.1) {
      p.position.z = -0.45;
      p.position.y = 1.1;
    } else {
      p.position.z = 0;
      p.position.y = 1.02;
    }

    p.rotation.y += 0.004;
  });

  press.rollerA.rotation.z += 0.12;
  press.rollerB.rotation.z -= 0.12;

  scanner.scanBar.position.y = 1.05 + Math.sin(time * 2.4) * 0.35;
  scanner.scanSide.position.x = -0.65 + Math.sin(time * 1.9) * 1.15;

  output.flap.rotation.z = -0.1 + Math.sin(time * 1.4) * 0.08;
  output.arm.rotation.z = -0.25 + Math.sin(time * 1.7) * 0.12;
  output.head.position.y = 1.55 + Math.sin(time * 1.7) * 0.08;

  bg.rotation.y = Math.sin(time * 0.12) * 0.015;

  camera.position.x = 6.8 + Math.sin(time * 0.08) * 0.25;
  camera.position.y = 4.2 + Math.sin(time * 0.1) * 0.08;
  camera.position.z = 16;
  camera.lookAt(0, 1.1, 0);

  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});