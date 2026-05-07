import * as THREE from "three";

const scene = new THREE.Scene();
scene.background = new THREE.Color("#d8ddd9");
scene.fog = new THREE.Fog("#d8ddd9", 18, 45);

const camera = new THREE.PerspectiveCamera(
  32,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

camera.position.set(8, 5.2, 15);
camera.lookAt(0, 0.8, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.5));

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.18;

document.body.appendChild(renderer.domElement);

const C = {
  floor: "#cfd6d3",
  tileA: "#dce1de",
  tileB: "#c5cbc8",

  white: "#eeeeea",
  white2: "#d8d8d2",

  gray: "#8b8e8b",
  darkGray: "#555957",

  dark: "#202423",
  belt: "#252928",

  yellow: "#d7b418",
  yellow2: "#f1ca2f",

  blueLine: "#586d8f",
  red: "#b94b3d"
};

const mat = {
  floor: new THREE.MeshStandardMaterial({
    color: C.floor,
    roughness: 0.7
  }),

  tileA: new THREE.MeshStandardMaterial({
    color: C.tileA,
    roughness: 0.72
  }),

  tileB: new THREE.MeshStandardMaterial({
    color: C.tileB,
    roughness: 0.72
  }),

  white: new THREE.MeshStandardMaterial({
    color: C.white,
    roughness: 0.42,
    metalness: 0.06
  }),

  white2: new THREE.MeshStandardMaterial({
    color: C.white2,
    roughness: 0.48,
    metalness: 0.08
  }),

  gray: new THREE.MeshStandardMaterial({
    color: C.gray,
    roughness: 0.5,
    metalness: 0.18
  }),

  darkGray: new THREE.MeshStandardMaterial({
    color: C.darkGray,
    roughness: 0.48,
    metalness: 0.22
  }),

  dark: new THREE.MeshStandardMaterial({
    color: C.dark,
    roughness: 0.5,
    metalness: 0.28
  }),

  belt: new THREE.MeshStandardMaterial({
    color: C.belt,
    roughness: 0.55,
    metalness: 0.18
  }),

  yellow: new THREE.MeshStandardMaterial({
    color: C.yellow,
    roughness: 0.35,
    metalness: 0.1
  }),

  yellow2: new THREE.MeshStandardMaterial({
    color: C.yellow2,
    roughness: 0.32,
    metalness: 0.1
  }),

  blueLine: new THREE.MeshStandardMaterial({
    color: C.blueLine,
    roughness: 0.45
  }),

  red: new THREE.MeshStandardMaterial({
    color: C.red,
    roughness: 0.4
  }),

  black: new THREE.MeshBasicMaterial({
    color: "#050505"
  })
};

function box(w, h, d, material, x = 0, y = 0, z = 0) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, d),
    material
  );

  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  return mesh;
}

function cyl(r, h, material, x = 0, y = 0, z = 0, rotX = 0, rotZ = 0) {
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(r, r, h, 32),
    material
  );

  mesh.position.set(x, y, z);

  mesh.rotation.x = rotX;
  mesh.rotation.z = rotZ;

  mesh.castShadow = true;
  mesh.receiveShadow = true;

  return mesh;
}

// LIGHTS
scene.add(
  new THREE.HemisphereLight("#ffffff", "#aeb7b4", 1.9)
);

const sun = new THREE.DirectionalLight("#ffffff", 2.8);

sun.position.set(6, 10, 8);
sun.castShadow = true;

sun.shadow.mapSize.width = 2048;
sun.shadow.mapSize.height = 2048;

sun.shadow.camera.left = -18;
sun.shadow.camera.right = 18;
sun.shadow.camera.top = 14;
sun.shadow.camera.bottom = -12;

scene.add(sun);

// FLOOR
scene.add(
  box(32, 0.18, 20, mat.floor, 0, -0.1, 0)
);

for (let x = -16; x <= 16; x += 2) {
  for (let z = -10; z <= 10; z += 2) {
    const tile = box(
      1.95,
      0.012,
      1.95,
      (x + z) % 4 === 0 ? mat.tileA : mat.tileB,
      x,
      0.01,
      z
    );

    scene.add(tile);
  }
}

// HELPERS
const rollers = [];

function conveyor(x, y, z, length, rotationY = 0) {
  const g = new THREE.Group();

  g.position.set(x, y, z);
  g.rotation.y = rotationY;

  scene.add(g);

  g.add(
    box(length, 0.34, 1.3, mat.white2, 0, 0, 0)
  );

  g.add(
    box(length - 0.25, 0.08, 1.05, mat.belt, 0, 0.25, 0)
  );

  g.add(
    box(length, 0.06, 0.08, mat.yellow, 0, 0.36, -0.62)
  );

  g.add(
    box(length, 0.06, 0.08, mat.yellow, 0, 0.36, 0.62)
  );

  for (let i = 0; i < Math.floor(length / 0.65); i++) {
    const r = cyl(
      0.08,
      1.12,
      mat.dark,
      -length / 2 + 0.35 + i * 0.65,
      0.32,
      0,
      Math.PI / 2
    );

    rollers.push(r);
    g.add(r);
  }

  for (let i = 0; i < 5; i++) {
    const px =
      -length / 2 + 0.7 + i * ((length - 1.4) / 4);

    g.add(
      box(0.12, 0.72, 0.12, mat.gray, px, -0.42, -0.5)
    );

    g.add(
      box(0.12, 0.72, 0.12, mat.gray, px, -0.42, 0.5)
    );
  }

  return g;
}

function rail(g, width, x, y, z) {
  g.add(
    box(width, 0.05, 0.05, mat.gray, x, y, z)
  );

  g.add(
    box(width, 0.05, 0.05, mat.gray, x, y + 0.35, z)
  );

  for (let i = 0; i < 6; i++) {
    g.add(
      box(
        0.04,
        0.4,
        0.04,
        mat.gray,
        x - width / 2 + i * (width / 5),
        y + 0.18,
        z
      )
    );
  }
}

function vents(g, x, y, z) {
  for (let i = 0; i < 5; i++) {
    g.add(
      box(0.06, 0.42, 0.035, mat.dark, x + i * 0.18, y, z)
    );
  }
}

function controlPanel(g, x, y, z) {
  g.add(
    box(0.55, 0.52, 0.08, mat.white2, x, y, z)
  );

  g.add(
    box(0.38, 0.2, 0.04, mat.dark, x, y + 0.1, z + 0.05)
  );

  g.add(
    box(0.08, 0.08, 0.04, mat.red, x - 0.15, y - 0.13, z + 0.05)
  );

  g.add(
    box(0.08, 0.08, 0.04, mat.yellow, x, y - 0.13, z + 0.05)
  );
}

function aperturePerson(x, z, scale = 1) {
  const g = new THREE.Group();

  g.position.set(x, 0, z);

  scene.add(g);

  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.22 * scale, 24, 24),
    mat.black
  );

  head.position.set(0, 1.25 * scale, 0);

  g.add(head);

  g.add(
    box(0.38 * scale, 0.78 * scale, 0.08 * scale, mat.black, 0, 0.72 * scale, 0)
  );

  g.add(
    box(0.12 * scale, 0.55 * scale, 0.08 * scale, mat.black, -0.12 * scale, 0.12 * scale, 0)
  );

  g.add(
    box(0.12 * scale, 0.55 * scale, 0.08 * scale, mat.black, 0.12 * scale, 0.12 * scale, 0)
  );

  g.add(
    box(0.1 * scale, 0.5 * scale, 0.08 * scale, mat.black, -0.32 * scale, 0.75 * scale, 0)
  );

  g.add(
    box(0.1 * scale, 0.5 * scale, 0.08 * scale, mat.black, 0.32 * scale, 0.75 * scale, 0)
  );

  return g;
}

// MAIN LAYOUT
conveyor(-5.8, 0.52, 0, 8.5, 0);
conveyor(2.7, 0.52, 0, 8.5, 0);
conveyor(7.3, 0.82, -2.4, 4.8, -0.5);
conveyor(-7.5, 0.45, -3.5, 4.2, 0.25);

// MACHINE 1
function feedChamber() {
  const g = new THREE.Group();

  g.position.set(-9.2, 0, 0);

  scene.add(g);

  g.add(
    box(3.3, 2.4, 1.55, mat.white, 0, 1.35, 0)
  );

  g.add(
    box(3.5, 0.18, 1.65, mat.white2, 0, 2.65, 0)
  );

  g.add(
    box(2.55, 0.95, 0.08, mat.dark, 0, 1.45, 0.82)
  );

  g.add(
    box(2.5, 0.04, 0.08, mat.blueLine, 0, 0.52, 0.84)
  );

  const rollersLocal = [];

  for (let i = 0; i < 4; i++) {
    const r = cyl(
      0.15,
      1.18,
      mat.dark,
      0,
      1.0 + i * 0.28,
      0.48,
      Math.PI / 2
    );

    rollersLocal.push(r);

    g.add(r);
  }

  rail(g, 3.4, 0, 2.85, 0.85);

  vents(g, -1.28, 1.45, 0.86);

  return {
    g,
    rollersLocal
  };
}

// MACHINE 2
function compressionPress() {
  const g = new THREE.Group();

  g.position.set(-3.5, 0, 0);

  scene.add(g);

  g.add(
    box(3.4, 2.05, 1.45, mat.white, 0, 1.25, 0)
  );

  g.add(
    box(3.7, 0.18, 1.55, mat.yellow, 0, 2.4, 0)
  );

  g.add(
    box(2.4, 1.0, 0.08, mat.belt, 0, 1.2, 0.82)
  );

  const gantry = new THREE.Group();

  gantry.add(
    box(2.8, 0.12, 0.16, mat.yellow, 0, 0, 0)
  );

  gantry.add(
    box(0.12, 0.9, 0.16, mat.yellow, -1.15, -0.38, 0)
  );

  gantry.add(
    box(0.12, 0.9, 0.16, mat.yellow, 1.15, -0.38, 0)
  );

  gantry.position.set(0, 2.15, 0.68);

  g.add(gantry);

  const plate = box(1.7, 0.12, 1.05, mat.gray, 0, 1.62, 0.18);

  g.add(plate);

  controlPanel(g, 1.45, 1.15, 0.82);

  rail(g, 3.3, 0, 2.65, 0.85);

  return {
    g,
    gantry,
    plate
  };
}

// MACHINE 3
function scannerTable() {
  const g = new THREE.Group();

  g.position.set(2.0, 0, 0);

  scene.add(g);

  g.add(
    box(3.2, 1.8, 1.35, mat.white, 0, 1.08, 0)
  );

  g.add(
    box(3.35, 0.18, 1.45, mat.white2, 0, 2.1, 0)
  );

  g.add(
    box(2.35, 0.85, 0.08, mat.dark, 0, 1.22, 0.77)
  );

  g.add(
    box(2.35, 0.05, 0.09, mat.yellow, 0, 1.78, 0.82)
  );

  const scanner = new THREE.Group();

  scanner.add(
    box(1.2, 0.08, 1.05, mat.yellow2, 0, 0, 0)
  );

  scanner.add(
    box(0.08, 0.8, 1.05, mat.yellow2, -0.58, -0.35, 0)
  );

  scanner.position.set(0, 1.76, 0.25);

  g.add(scanner);

  controlPanel(g, -1.3, 1.1, 0.8);

  vents(g, 0.8, 1.15, 0.82);

  return {
    g,
    scanner
  };
}

// MACHINE 4
function cutterOutput() {
  const g = new THREE.Group();

  g.position.set(7.2, 0, -1.2);

  scene.add(g);

  g.add(
    box(3.4, 2.3, 1.55, mat.white, 0, 1.35, 0)
  );

  g.add(
    box(3.65, 0.2, 1.65, mat.white2, 0, 2.62, 0)
  );

  g.add(
    box(1.6, 1.05, 0.08, mat.dark, -0.35, 1.32, 0.85)
  );

  const arm = new THREE.Group();

  arm.add(
    box(0.16, 1.15, 0.16, mat.gray, 0, 0.45, 0)
  );

  arm.add(
    box(0.65, 0.16, 0.16, mat.yellow, -0.24, -0.1, 0)
  );

  arm.add(
    box(0.28, 0.28, 0.28, mat.yellow2, -0.55, -0.12, 0)
  );

  arm.position.set(0.85, 1.45, 0.58);
  arm.rotation.z = -0.25;

  g.add(arm);

  const flap = box(1.45, 0.12, 1.05, mat.belt, -0.3, 0.88, 0.32);

  flap.rotation.z = -0.08;

  g.add(flap);

  rail(g, 3.2, 0, 2.85, 0.92);

  vents(g, 1.0, 1.42, 0.88);

  return {
    g,
    arm,
    flap
  };
}

const machineA = feedChamber();
const machineB = compressionPress();
const machineC = scannerTable();
const machineD = cutterOutput();

// BACKGROUND MACHINES
for (let i = 0; i < 5; i++) {
  const x = -10 + i * 5;

  const g = new THREE.Group();

  g.position.set(x, 0, -5.8);

  scene.add(g);

  g.add(
    box(2.2, 1.75, 1.1, mat.white2, 0, 1.05, 0)
  );

  g.add(
    box(1.3, 0.14, 1.15, mat.yellow, 0, 2.0, 0)
  );

  g.add(
    box(0.7, 0.7, 0.05, mat.dark, -0.35, 1.1, 0.58)
  );

  g.add(
    box(0.35, 0.55, 0.35, mat.gray, 0.65, 2.35, 0)
  );
}

// CABINETS
for (let i = 0; i < 4; i++) {
  const cabinet = new THREE.Group();

  cabinet.position.set(8.8 + i * 0.65, 0, 3.6);

  scene.add(cabinet);

  cabinet.add(
    box(0.55, 1.8, 0.55, mat.white2, 0, 0.9, 0)
  );

  cabinet.add(
    box(0.35, 0.22, 0.04, mat.dark, 0, 1.35, 0.3)
  );

  cabinet.add(
    box(0.28, 0.05, 0.04, mat.red, 0, 1.62, 0.3)
  );
}

// BARRELS
for (let i = 0; i < 8; i++) {
  scene.add(
    cyl(
      0.25,
      0.45,
      mat.gray,
      -10.8 + (i % 4) * 0.55,
      0.23,
      3.2 + Math.floor(i / 4) * 0.55
    )
  );
}

// ROCKS / MATERIALS
for (let i = 0; i < 18; i++) {
  const rock = box(
    0.18 + Math.random() * 0.18,
    0.12 + Math.random() * 0.15,
    0.18 + Math.random() * 0.18,
    mat.white2,
    -6.2 + Math.random() * 1.8,
    0.08,
    3.2 + Math.random() * 1.4
  );

  rock.rotation.set(
    Math.random(),
    Math.random(),
    Math.random()
  );

  scene.add(rock);
}

// SILHOUETTES
aperturePerson(-10.5, 4.4, 0.9);
aperturePerson(-5.5, 3.6, 0.75);
aperturePerson(0.2, 2.9, 0.72);
aperturePerson(7.6, 3.5, 0.8);

// BOX BIN / HOPPER
const hopper = new THREE.Group();

hopper.position.set(-13.2, 0, 0);

scene.add(hopper);

// outer walls
hopper.add(box(2.4, 1.2, 2.1, mat.gray, 0, 0.6, 0));

hopper.add(box(2.2, 0.9, 1.9, mat.dark, 0, 0.75, 0));

// open top
hopper.add(box(2.4, 0.12, 0.12, mat.yellow, 0, 1.22, -1.0));
hopper.add(box(2.4, 0.12, 0.12, mat.yellow, 0, 1.22, 1.0));

hopper.add(box(0.12, 0.12, 2.1, mat.yellow, -1.15, 1.22, 0));
hopper.add(box(0.12, 0.12, 2.1, mat.yellow, 1.15, 1.22, 0));

// random stacked boxes inside hopper
for (let i = 0; i < 12; i++) {
  const scrap = box(
    0.4,
    0.28,
    0.4,
    Math.random() > 0.5 ? mat.yellow : mat.white2,
    (Math.random() - 0.5) * 1.2,
    0.3 + Math.random() * 0.5,
    (Math.random() - 0.5) * 1.1
  );

  scrap.rotation.y = Math.random() * Math.PI;

  hopper.add(scrap);
}

// PICKER ARM
const picker = new THREE.Group();

picker.position.set(-11.4, 0, 0);

scene.add(picker);

// base
picker.add(cyl(0.32, 0.25, mat.darkGray, 0, 0.12, 0));

// lower arm
const lowerArm = box(0.22, 1.5, 0.22, mat.yellow, 0, 0.9, 0);
lowerArm.rotation.z = -0.9;

picker.add(lowerArm);

// upper arm group
const upperGroup = new THREE.Group();
upperGroup.position.set(-0.55, 1.45, 0);

picker.add(upperGroup);

const upperArm = box(0.18, 1.2, 0.18, mat.gray, 0, 0.5, 0);
upperArm.rotation.z = 1.1;

upperGroup.add(upperArm);

// claw
const claw = new THREE.Group();

claw.position.set(0.52, 1.02, 0);

upperGroup.add(claw);

claw.add(box(0.08, 0.4, 0.08, mat.dark, -0.08, 0, 0));
claw.add(box(0.08, 0.4, 0.08, mat.dark, 0.08, 0, 0));

// save refs
picker.userData.lowerArm = lowerArm;
picker.userData.upperGroup = upperGroup;
picker.userData.claw = claw;

// FORKLIFT WITH PALLET
const draggableBoxes = [];
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let selectedBox = null;
let dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -1.02);
let dragPoint = new THREE.Vector3();

const forklift = new THREE.Group();
forklift.position.set(2.8, 0, 4.8);
forklift.scale.set(1.25, 1.25, 1.25);
forklift.rotation.y = -0.35;
scene.add(forklift);

// forklift body
forklift.add(box(1.35, 0.65, 0.9, mat.yellow, 0, 0.55, 0));
forklift.add(box(0.65, 1.05, 0.75, mat.yellow2, -0.25, 1.15, 0));
forklift.add(box(0.45, 0.55, 0.08, mat.dark, -0.25, 1.25, 0.42));

// wheels
forklift.add(cyl(0.23, 0.18, mat.dark, -0.5, 0.2, -0.48, Math.PI / 2));
forklift.add(cyl(0.23, 0.18, mat.dark, 0.55, 0.2, -0.48, Math.PI / 2));
forklift.add(cyl(0.23, 0.18, mat.dark, -0.5, 0.2, 0.48, Math.PI / 2));
forklift.add(cyl(0.23, 0.18, mat.dark, 0.55, 0.2, 0.48, Math.PI / 2));

// mast
forklift.add(box(0.1, 1.75, 0.1, mat.darkGray, 0.82, 1.0, -0.42));
forklift.add(box(0.1, 1.75, 0.1, mat.darkGray, 0.82, 1.0, 0.42));

// forks
forklift.add(box(1.45, 0.06, 0.08, mat.darkGray, 1.35, 0.42, -0.25));
forklift.add(box(1.45, 0.06, 0.08, mat.darkGray, 1.35, 0.42, 0.25));

// pallet
const pallet = new THREE.Group();
pallet.position.set(4.4, 0.45, 4.45);
pallet.scale.set(1.25, 1.25, 1.25);
scene.add(pallet);

pallet.add(box(1.5, 0.12, 1.15, mat.darkGray, 0, 0, 0));
pallet.add(box(1.45, 0.05, 0.12, mat.gray, 0, 0.12, -0.45));
pallet.add(box(1.45, 0.05, 0.12, mat.gray, 0, 0.12, 0));
pallet.add(box(1.45, 0.05, 0.12, mat.gray, 0, 0.12, 0.45));

// draggable pallet boxes
for (let i = 0; i < 6; i++) {
  const bx = -0.45 + (i % 3) * 0.45;
  const by = 0.42 + Math.floor(i / 3) * 0.36;
  const bz = i < 3 ? -0.22 : 0.22;

  const crate = new THREE.Group();

  const body = box(0.36, 0.3, 0.36, mat.yellow);
  const top = box(0.26, 0.04, 0.26, mat.yellow2, 0, 0.17, 0);

  crate.add(body);
  crate.add(top);

crate.position.set(4.4 + bx, by + 0.12, 4.45 + bz);
crate.scale.set(1.25, 1.25, 1.25);
  crate.userData.draggable = true;
  crate.userData.onConveyor = false;
  crate.userData.speed = 0.022;

  scene.add(crate);
  draggableBoxes.push(crate);
}

// PACKAGES
const packages = [];

function createPackage(x, delay = 0) {
  const p = new THREE.Group();

  const body = box(0.48, 0.32, 0.48, mat.yellow);
  const top = box(0.32, 0.04, 0.32, mat.yellow2, 0, 0.18, 0);

  p.add(body);
  p.add(top);

  p.position.set(x, 1.02, 0);

  p.userData.speed = 0.02 + Math.random() * 0.004;
  p.userData.stage = 0;
  p.userData.delay = delay;
  p.userData.scanned = false;
  p.userData.assembled = false;

  scene.add(p);
  packages.push(p);

  return p;
}

for (let i = 0; i < 7; i++) {
  createPackage(-9.6 + i * 2.6, i * 0.4);
}


// ANIMATION
let time = 0;

function resetPackage(p) {
  p.position.x = -9.8;
  p.position.z = 0;
  p.position.y = 1.02;

  p.rotation.set(0, 0, 0);

  p.scale.set(1, 1, 1);

  p.userData.stage = 0;
  p.userData.scanned = false;
  p.userData.assembled = false;

  p.children[0].material = mat.yellow;
  p.children[1].material = mat.yellow2;

  while (p.children.length > 2) {
    const child = p.children[p.children.length - 1];
    p.remove(child);
  }
}

function animatePackageStages(p) {
  // MACHINE A: feed chamber
  if (p.position.x > -8.6 && p.userData.stage === 0) {
    p.userData.stage = 1;
  }

  // MACHINE B: compression press
  if (p.position.x > -4.0 && p.userData.stage === 1) {
    p.userData.stage = 2;

    p.scale.set(1.24, 0.72, 1.18);
    p.children[0].material = mat.yellow2;
    p.children[1].material = mat.yellow;
  }

  // MACHINE C: scanner table
  if (p.position.x > 1.1 && p.userData.stage === 2) {
    p.userData.stage = 3;
    p.userData.scanned = true;

    p.children[0].material = mat.white2;
    p.children[1].material = mat.yellow;
  }

  // MACHINE D: cutter/output
  if (p.position.x > 5.5 && p.userData.stage === 3) {
    p.userData.stage = 4;
    p.userData.assembled = true;

    const sidePart = box(
      0.14,
      0.18,
      0.5,
      mat.dark,
      0.27,
      0.1,
      0
    );

    const topPlate = box(
      0.36,
      0.04,
      0.36,
      mat.gray,
      0,
      0.28,
      0
    );

    p.add(sidePart);
    p.add(topPlate);

    p.scale.set(1.05, 0.85, 1.05);
  }
}

function animate() {
  requestAnimationFrame(animate);

  time += 0.016;

  rollers.forEach((r) => {
    r.rotation.z -= 0.075;
  });

  machineA.rollersLocal.forEach((r, i) => {
    r.rotation.z += 0.08 + i * 0.01;
  });

  machineB.gantry.position.x =
    Math.sin(time * 1.2) * 0.35;

  machineB.plate.position.y =
    1.62 + Math.sin(time * 2.1) * 0.12;

  machineC.scanner.position.x =
    Math.sin(time * 1.6) * 0.8;

  machineC.scanner.position.y =
    1.76 + Math.sin(time * 2.5) * 0.05;

  machineD.arm.rotation.z =
    -0.25 + Math.sin(time * 1.8) * 0.18;

  machineD.flap.rotation.z =
    -0.08 + Math.sin(time * 1.4) * 0.06;

  packages.forEach((p) => {
    p.position.x += p.userData.speed;

if (p.position.x > 9.4) {
  if (draggableBoxes.includes(p)) {
    p.position.x = -9.8;
    p.position.z = 0;
    p.position.y = 1.02;
    p.userData.onConveyor = true;
  } else {
    resetPackage(p);
  }
}

    animatePackageStages(p);

    if (p.position.x > 5.0) {
      p.position.z = -0.75;
      p.position.y = 1.18;
    } else {
      p.position.z = 0;
      p.position.y = 1.02;
    }

    if (p.userData.stage === 1) {
      p.rotation.y += 0.003;
    }

    if (p.userData.stage === 2) {
      p.rotation.y += 0.005;
    }

    if (p.userData.stage === 3) {
      p.rotation.y += 0.006;
    }

    if (p.userData.stage === 4) {
      p.rotation.y += 0.004;
      p.rotation.z = Math.sin(time * 2 + p.position.x) * 0.04;
    }
  });

// PICKER ARM ANIMATION
picker.rotation.y = Math.sin(time * 0.5) * 0.08;

picker.userData.lowerArm.rotation.z =
  -0.9 + Math.sin(time * 1.4) * 0.18;

picker.userData.upperGroup.rotation.z =
  Math.sin(time * 1.8) * 0.25;

picker.userData.claw.position.y =
  1.02 + Math.sin(time * 2.2) * 0.08;

  camera.position.x =
    8 + Math.sin(time * 0.08) * 0.25;

  camera.position.y =
    5.2 + Math.sin(time * 0.1) * 0.06;

  camera.position.z = 15;

  camera.lookAt(0, 0.8, 0);

  renderer.render(scene, camera);
}
function getMouse(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

window.addEventListener("pointerdown", (event) => {
  getMouse(event);

  raycaster.setFromCamera(mouse, camera);

  const hits = raycaster.intersectObjects(draggableBoxes, true);

  if (hits.length > 0) {
    let obj = hits[0].object;

    while (obj.parent && !obj.userData.draggable) {
      obj = obj.parent;
    }

    selectedBox = obj;
    selectedBox.userData.onConveyor = false;

    document.body.style.cursor = "grabbing";
  }
});

window.addEventListener("pointermove", (event) => {
  if (!selectedBox) return;

  getMouse(event);

  raycaster.setFromCamera(mouse, camera);

  if (raycaster.ray.intersectPlane(dragPlane, dragPoint)) {
    selectedBox.position.x = dragPoint.x;
    selectedBox.position.z = dragPoint.z;
    selectedBox.position.y = 1.15;
  }
});

window.addEventListener("pointerup", () => {
  if (!selectedBox) return;

  // conveyor drop zone
  const onMainConveyor =
    selectedBox.position.x > -9.8 &&
    selectedBox.position.x < 9.4 &&
    selectedBox.position.z > -0.9 &&
    selectedBox.position.z < 0.9;

  if (onMainConveyor) {
    selectedBox.position.y = 1.02;
    selectedBox.position.z = 0;
    selectedBox.userData.onConveyor = true;
    selectedBox.userData.stage = 0;

    packages.push(selectedBox);
  } else {
    selectedBox.position.y = 1.15;
  }

  selectedBox = null;
  document.body.style.cursor = "default";
});

animate();

window.addEventListener("resize", () => {
  camera.aspect =
    window.innerWidth / window.innerHeight;

  camera.updateProjectionMatrix();

  renderer.setSize(
    window.innerWidth,
    window.innerHeight
  );
});