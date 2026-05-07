import * as THREE from "three";

const scene = new THREE.Scene();
scene.background = new THREE.Color("#eef0eb");
scene.fog = new THREE.Fog("#eef0eb", 24, 60);

const camera = new THREE.PerspectiveCamera(
  31,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

camera.position.set(7.4, 5.05, 15.8);
camera.lookAt(-1.2, 0.8, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.5));

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.55;

document.body.appendChild(renderer.domElement);

const C = {
  floor: "#ecebe5",
  tileA: "#f7f5ef",
  tileB: "#e4e1d8",

  white: "#fffdf6",
  white2: "#ebe8dd",

  gray: "#9a9d98",
  darkGray: "#4a4f4c",

  dark: "#111615",
  belt: "#181d1c",

  yellow: "#e6bd2f",
  yellow2: "#ffd85a",
  warmOrange: "#eeb25d",
  orange2: "#f3a13d",

  blueLine: "#7894bd",
  red: "#d85b48",
  green: "#6f9f54",
  softGreen: "#8ebd6f"
};

const mat = {
  floor: new THREE.MeshStandardMaterial({
    color: C.floor,
    roughness: 0.64
  }),

  tileA: new THREE.MeshStandardMaterial({
    color: C.tileA,
    roughness: 0.7
  }),

  tileB: new THREE.MeshStandardMaterial({
    color: C.tileB,
    roughness: 0.7
  }),

  white: new THREE.MeshStandardMaterial({
    color: C.white,
    roughness: 0.34,
    metalness: 0.04
  }),

  white2: new THREE.MeshStandardMaterial({
    color: C.white2,
    roughness: 0.42,
    metalness: 0.06
  }),

  gray: new THREE.MeshStandardMaterial({
    color: C.gray,
    roughness: 0.42,
    metalness: 0.18
  }),

  darkGray: new THREE.MeshStandardMaterial({
    color: C.darkGray,
    roughness: 0.42,
    metalness: 0.22
  }),

  dark: new THREE.MeshStandardMaterial({
    color: C.dark,
    roughness: 0.46,
    metalness: 0.28
  }),

  belt: new THREE.MeshStandardMaterial({
    color: C.belt,
    roughness: 0.48,
    metalness: 0.2
  }),

  yellow: new THREE.MeshStandardMaterial({
    color: C.yellow,
    roughness: 0.26,
    metalness: 0.08
  }),

  yellow2: new THREE.MeshStandardMaterial({
    color: C.yellow2,
    roughness: 0.24,
    metalness: 0.08
  }),

  orangePerson: new THREE.MeshStandardMaterial({
    color: C.warmOrange,
    roughness: 0.31,
    metalness: 0.02
  }),

  orange2: new THREE.MeshStandardMaterial({
    color: C.orange2,
    roughness: 0.28,
    metalness: 0.08
  }),

  blueLine: new THREE.MeshStandardMaterial({
    color: C.blueLine,
    roughness: 0.38
  }),

  red: new THREE.MeshStandardMaterial({
    color: C.red,
    roughness: 0.36
  }),

  green: new THREE.MeshStandardMaterial({
    color: C.green,
    roughness: 0.55
  }),

  softGreen: new THREE.MeshStandardMaterial({
    color: C.softGreen,
    roughness: 0.55
  }),

  black: new THREE.MeshBasicMaterial({
    color: "#050505"
  }),

  face: new THREE.MeshBasicMaterial({
    color: "#2a1a10"
  }),

  warmGlow: new THREE.MeshBasicMaterial({
    color: "#ffe6a5"
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

function sphere(r, material, x = 0, y = 0, z = 0) {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(r, 32, 32),
    material
  );

  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  return mesh;
}

// LIGHTS
scene.add(
  new THREE.HemisphereLight("#ffffff", "#c6c0b3", 2.25)
);

const sun = new THREE.DirectionalLight("#fff5df", 3.2);

sun.position.set(6, 10, 8);
sun.castShadow = true;

sun.shadow.mapSize.width = 2048;
sun.shadow.mapSize.height = 2048;

sun.shadow.camera.left = -18;
sun.shadow.camera.right = 18;
sun.shadow.camera.top = 14;
sun.shadow.camera.bottom = -12;

scene.add(sun);

const glowLights = [];

for (let i = 0; i < 12; i++) {
  const light = new THREE.PointLight(
    "#ffe5a8",
    0.75,
    9
  );

  light.position.set(
    -15 + i * 2.8,
    4.5,
    -5
  );

  scene.add(light);
  glowLights.push(light);

  scene.add(
    box(
      0.65,
      0.09,
      0.18,
      mat.yellow2,
      light.position.x,
      light.position.y,
      light.position.z
    )
  );
}

// FLOOR
scene.add(
  box(34, 0.18, 21, mat.floor, 0, -0.1, 0)
);

for (let x = -17; x <= 17; x += 2) {
  for (let z = -10; z <= 10; z += 2) {
    scene.add(
      box(
        1.94,
        0.012,
        1.94,
        (x + z) % 4 === 0 ? mat.tileA : mat.tileB,
        x,
        0.01,
        z
      )
    );
  }
}

// BACK WALL / STRUCTURE
for (let i = 0; i < 18; i++) {
  scene.add(
    box(
      0.16,
      7,
      0.16,
      mat.gray,
      -18 + i * 2.2,
      3.5,
      -7.5
    )
  );
}

for (let i = 0; i < 12; i++) {
  scene.add(
    box(
      36,
      0.07,
      0.07,
      mat.darkGray,
      0,
      1.2 + i * 0.55,
      -7.5
    )
  );
}

for (let i = 0; i < 8; i++) {
  scene.add(
    box(
      3.2,
      5.2,
      0.12,
      i % 2 === 0 ? mat.white2 : mat.tileB,
      -14 + i * 4,
      2.5,
      -8.8
    )
  );
}

// WALL SIGNAGE / TOP LEFT
function makeTextPanel(text, x, y, z, w = 2.4, h = 1.2) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;

  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#f8f4ea";
  ctx.fillRect(0, 0, 512, 256);

  ctx.fillStyle = "#575a56";
  ctx.font = "bold 38px Arial";
  ctx.textAlign = "center";

  text.split("\n").forEach((line, i) => {
    ctx.fillText(line, 256, 78 + i * 48);
  });

  ctx.fillStyle = C.yellow;
  ctx.fillRect(150, 190, 210, 26);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;

  const panel = new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshStandardMaterial({
      map: tex,
      roughness: 0.35
    })
  );

  panel.position.set(x, y, z);
  scene.add(panel);

  return panel;
}

makeTextPanel(
  "QUALITY\nSAFETY\nEFFICIENCY",
  -12.4,
  3.3,
  -5.94,
  2.1,
  1.55
);

makeTextPanel(
  "APERTURE\nLABORATORIES",
  -14.35,
  2.45,
  -5.93,
  2.7,
  1.2
);

for (let i = 0; i < 3; i++) {
  const x = -15.2 + i * 1.45;

  scene.add(
    box(0.22, 0.35, 0.16, mat.gray, x, 4.35, -5.85)
  );

  const lamp = new THREE.PointLight("#ffe2a0", 1.45, 4);
  lamp.position.set(x, 4.1, -5.2);
  scene.add(lamp);
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

// DOUGHY ORANGE FIGURES
function aperturePerson(x, z, scale = 1) {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  scene.add(g);

  const head = sphere(0.34 * scale, mat.orangePerson);
  head.position.set(0, 1.28 * scale, 0);
  head.scale.set(1, 0.94, 1);
  g.add(head);

  const body = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.25 * scale, 0.5 * scale, 16, 32),
    mat.orangePerson
  );
  body.position.set(0, 0.66 * scale, 0);
  body.scale.set(1.05, 1, 0.9);
  body.castShadow = true;
  body.receiveShadow = true;
  g.add(body);

  const eyeL = sphere(0.028 * scale, mat.face);
  eyeL.position.set(-0.1 * scale, 1.31 * scale, 0.315 * scale);
  g.add(eyeL);

  const eyeR = eyeL.clone();
  eyeR.position.x = 0.1 * scale;
  g.add(eyeR);

  const mouth = box(
    0.12 * scale,
    0.018 * scale,
    0.018 * scale,
    mat.face,
    0,
    1.17 * scale,
    0.325 * scale
  );

  mouth.rotation.z = 0.08;
  g.add(mouth);

  const armL = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.06 * scale, 0.42 * scale, 12, 24),
    mat.orangePerson
  );
  armL.position.set(-0.29 * scale, 0.74 * scale, 0.03 * scale);
  armL.rotation.z = -0.45;
  armL.castShadow = true;
  g.add(armL);

  const armR = armL.clone();
  armR.position.x = 0.29 * scale;
  armR.rotation.z = 0.45;
  g.add(armR);

  const legL = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.075 * scale, 0.35 * scale, 12, 24),
    mat.orangePerson
  );
  legL.position.set(-0.1 * scale, 0.18 * scale, 0);
  legL.rotation.z = 0.1;
  legL.castShadow = true;
  g.add(legL);

  const legR = legL.clone();
  legR.position.x = 0.1 * scale;
  legR.rotation.z = -0.1;
  g.add(legR);

  return g;
}

// PLANTS
function createPlant(x, z, scale = 1) {
  const plant = new THREE.Group();
  plant.position.set(x, 0, z);
  plant.scale.set(scale, scale, scale);
  scene.add(plant);

  plant.add(box(0.55, 0.55, 0.55, mat.gray, 0, 0.28, 0));

  for (let i = 0; i < 16; i++) {
    const leaf = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.055, 0.62, 8, 18),
      i % 2 === 0 ? mat.green : mat.softGreen
    );

    leaf.position.set(
      Math.sin(i * 0.7) * 0.18,
      0.8 + Math.random() * 0.28,
      Math.cos(i * 0.7) * 0.18
    );

    leaf.rotation.z = -0.75 + Math.random() * 1.5;
    leaf.rotation.y = i * 0.65;

    leaf.castShadow = true;
    plant.add(leaf);
  }

  return plant;
}

function createHangingVines(x, z, count = 6) {
  const vines = new THREE.Group();
  vines.position.set(x, 5.9, z);
  scene.add(vines);

  for (let i = 0; i < count; i++) {
    const strand = new THREE.Group();

    strand.position.set(
      (Math.random() - 0.5) * 1.4,
      0,
      (Math.random() - 0.5) * 0.3
    );

    vines.add(strand);

    const length = 5 + Math.floor(Math.random() * 5);

    for (let j = 0; j < length; j++) {
      const leaf = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.035, 0.28, 6, 10),
        j % 2 === 0 ? mat.green : mat.softGreen
      );

      leaf.position.set(
        Math.sin(j * 0.8) * 0.04,
        -j * 0.22,
        0
      );

      leaf.rotation.z = Math.sin(j) * 0.5;
      leaf.castShadow = true;
      strand.add(leaf);
    }
  }

  return vines;
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

  g.add(box(3.3, 2.4, 1.55, mat.white, 0, 1.35, 0));
  g.add(box(3.5, 0.18, 1.65, mat.white2, 0, 2.65, 0));
  g.add(box(2.55, 0.95, 0.08, mat.dark, 0, 1.45, 0.82));
  g.add(box(2.5, 0.04, 0.08, mat.blueLine, 0, 0.52, 0.84));

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

  return { g, rollersLocal };
}

// MACHINE 2
function compressionPress() {
  const g = new THREE.Group();
  g.position.set(-3.5, 0, 0);
  scene.add(g);

  g.add(box(3.4, 2.05, 1.45, mat.white, 0, 1.25, 0));
  g.add(box(3.7, 0.18, 1.55, mat.yellow, 0, 2.4, 0));
  g.add(box(2.4, 1.0, 0.08, mat.belt, 0, 1.2, 0.82));

  const gantry = new THREE.Group();

  gantry.add(box(2.8, 0.12, 0.16, mat.yellow, 0, 0, 0));
  gantry.add(box(0.12, 0.9, 0.16, mat.yellow, -1.15, -0.38, 0));
  gantry.add(box(0.12, 0.9, 0.16, mat.yellow, 1.15, -0.38, 0));

  gantry.position.set(0, 2.15, 0.68);

  g.add(gantry);

  const plate = box(1.7, 0.12, 1.05, mat.gray, 0, 1.62, 0.18);

  g.add(plate);

  controlPanel(g, 1.45, 1.15, 0.82);
  rail(g, 3.3, 0, 2.65, 0.85);

  return { g, gantry, plate };
}

// MACHINE 3
function scannerTable() {
  const g = new THREE.Group();
  g.position.set(2.0, 0, 0);
  scene.add(g);

  g.add(box(3.2, 1.8, 1.35, mat.white, 0, 1.08, 0));
  g.add(box(3.35, 0.18, 1.45, mat.white2, 0, 2.1, 0));
  g.add(box(2.35, 0.85, 0.08, mat.dark, 0, 1.22, 0.77));
  g.add(box(2.35, 0.05, 0.09, mat.yellow, 0, 1.78, 0.82));

  const scanner = new THREE.Group();

  scanner.add(box(1.2, 0.08, 1.05, mat.yellow2, 0, 0, 0));
  scanner.add(box(0.08, 0.8, 1.05, mat.yellow2, -0.58, -0.35, 0));

  scanner.position.set(0, 1.76, 0.25);

  g.add(scanner);

  controlPanel(g, -1.3, 1.1, 0.8);
  vents(g, 0.8, 1.15, 0.82);

  return { g, scanner };
}

// MACHINE 4
function cutterOutput() {
  const g = new THREE.Group();
  g.position.set(7.2, 0, -1.2);
  scene.add(g);

  g.add(box(3.4, 2.3, 1.55, mat.white, 0, 1.35, 0));
  g.add(box(3.65, 0.2, 1.65, mat.white2, 0, 2.62, 0));
  g.add(box(1.6, 1.05, 0.08, mat.dark, -0.35, 1.32, 0.85));

  const arm = new THREE.Group();

  arm.add(box(0.16, 1.15, 0.16, mat.gray, 0, 0.45, 0));
  arm.add(box(0.65, 0.16, 0.16, mat.yellow, -0.24, -0.1, 0));
  arm.add(box(0.28, 0.28, 0.28, mat.yellow2, -0.55, -0.12, 0));

  arm.position.set(0.85, 1.45, 0.58);
  arm.rotation.z = -0.25;

  g.add(arm);

  const flap = box(1.45, 0.12, 1.05, mat.belt, -0.3, 0.88, 0.32);
  flap.rotation.z = -0.08;

  g.add(flap);

  rail(g, 3.2, 0, 2.85, 0.92);
  vents(g, 1.0, 1.42, 0.88);

  return { g, arm, flap };
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

  g.add(box(2.2, 1.75, 1.1, mat.white2, 0, 1.05, 0));
  g.add(box(1.3, 0.14, 1.15, mat.yellow, 0, 2.0, 0));
  g.add(box(0.7, 0.7, 0.05, mat.dark, -0.35, 1.1, 0.58));
  g.add(box(0.35, 0.55, 0.35, mat.gray, 0.65, 2.35, 0));
}

// TOP LEFT STORAGE / FOLIAGE AREA
const storageArea = new THREE.Group();
storageArea.position.set(-11.8, 0, -2.2);
scene.add(storageArea);

for (let i = 0; i < 10; i++) {
  storageArea.add(
    box(
      2.1,
      0.08,
      1.25,
      mat.white2,
      0.08 * i,
      0.15 + i * 0.08,
      0
    )
  );
}

storageArea.add(box(2.4, 0.16, 1.3, mat.white, 1.8, 0.78, 0.2));
storageArea.add(box(0.12, 0.8, 0.12, mat.gray, 0.75, 0.35, -0.35));
storageArea.add(box(0.12, 0.8, 0.12, mat.gray, 2.85, 0.35, -0.35));
storageArea.add(box(0.12, 0.8, 0.12, mat.gray, 0.75, 0.35, 0.75));
storageArea.add(box(0.12, 0.8, 0.12, mat.gray, 2.85, 0.35, 0.75));
storageArea.add(box(3.2, 0.08, 0.08, mat.yellow, 1.2, 2.4, 0));
storageArea.add(box(0.08, 1.5, 0.08, mat.gray, -0.3, 1.65, 0));
storageArea.add(box(0.08, 1.5, 0.08, mat.gray, 2.7, 1.65, 0));

const hangingPanel = box(1.1, 0.06, 0.85, mat.yellow2, 1.2, 1.72, 0);
hangingPanel.rotation.z = -0.25;
storageArea.add(hangingPanel);

// DISTANT FACTORY LAYERS
for (let i = 0; i < 14; i++) {
  const distant = new THREE.Group();

  distant.position.set(
    -20 + i * 3,
    0,
    -12 - Math.random() * 6
  );

  scene.add(distant);

  const h = 1.2 + Math.random() * 2.5;

  distant.add(
    box(
      2 + Math.random() * 2,
      h,
      1.5 + Math.random(),
      mat.darkGray,
      0,
      h / 2,
      0
    )
  );

  distant.add(box(1.2, 0.08, 1.4, mat.yellow, 0, h + 0.2, 0));
  distant.add(box(0.4, 0.5, 0.08, mat.dark, 0, h * 0.7, 0.76));
}

// CABINETS
for (let i = 0; i < 4; i++) {
  const cabinet = new THREE.Group();

  cabinet.position.set(8.8 + i * 0.65, 0, 3.6);
  scene.add(cabinet);

  cabinet.add(box(0.55, 1.8, 0.55, mat.white2, 0, 0.9, 0));
  cabinet.add(box(0.35, 0.22, 0.04, mat.dark, 0, 1.35, 0.3));
  cabinet.add(box(0.28, 0.05, 0.04, mat.red, 0, 1.62, 0.3));
}

// PLANT PLACEMENT
createPlant(-12.4, 2.1, 1.25);
createPlant(-9.7, -2.8, 0.95);
createPlant(-6.5, -4.2, 0.9);
createPlant(1.4, -3.4, 1.1);
createPlant(4.7, -3.2, 1.0);
createPlant(7.5, -4.4, 0.9);
createPlant(9.9, 2.6, 1.05);

createHangingVines(-8.2, -7.1, 8);
createHangingVines(1.5, -7.1, 9);
createHangingVines(8.7, -7.1, 7);

// BARRELS / MATERIALS
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

// PEOPLE
aperturePerson(-10.5, 4.4, 0.9);
aperturePerson(-5.5, 3.6, 0.78);
aperturePerson(0.2, 2.9, 0.75);
aperturePerson(7.6, 3.5, 0.82);

const workerCarry = aperturePerson(-9.8, -1.15, 0.72);
workerCarry.rotation.y = 0.35;

const carriedPanel = box(
  0.9,
  0.06,
  0.65,
  mat.yellow2,
  -9.55,
  1.05,
  -1.05
);

carriedPanel.rotation.z = -0.2;
scene.add(carriedPanel);

// BOX BIN / HOPPER
const hopper = new THREE.Group();

hopper.position.set(-13.2, 0, 0);
scene.add(hopper);

hopper.add(box(2.4, 1.2, 2.1, mat.gray, 0, 0.6, 0));
hopper.add(box(2.2, 0.9, 1.9, mat.dark, 0, 0.75, 0));
hopper.add(box(2.4, 0.12, 0.12, mat.yellow, 0, 1.22, -1.0));
hopper.add(box(2.4, 0.12, 0.12, mat.yellow, 0, 1.22, 1.0));
hopper.add(box(0.12, 0.12, 2.1, mat.yellow, -1.15, 1.22, 0));
hopper.add(box(0.12, 0.12, 2.1, mat.yellow, 1.15, 1.22, 0));

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

picker.add(cyl(0.32, 0.25, mat.darkGray, 0, 0.12, 0));

const lowerArm = box(0.22, 1.5, 0.22, mat.yellow, 0, 0.9, 0);
lowerArm.rotation.z = -0.9;
picker.add(lowerArm);

const upperGroup = new THREE.Group();
upperGroup.position.set(-0.55, 1.45, 0);
picker.add(upperGroup);

const upperArm = box(0.18, 1.2, 0.18, mat.gray, 0, 0.5, 0);
upperArm.rotation.z = 1.1;
upperGroup.add(upperArm);

const claw = new THREE.Group();
claw.position.set(0.52, 1.02, 0);
upperGroup.add(claw);

claw.add(box(0.08, 0.4, 0.08, mat.dark, -0.08, 0, 0));
claw.add(box(0.08, 0.4, 0.08, mat.dark, 0.08, 0, 0));

picker.userData.lowerArm = lowerArm;
picker.userData.upperGroup = upperGroup;
picker.userData.claw = claw;

// FORKLIFT WITH PALLET
const draggableBoxes = [];
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let selectedBox = null;
const dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -1.02);
const dragPoint = new THREE.Vector3();

const forklift = new THREE.Group();

forklift.position.set(-2.4, 0, 4.85);
forklift.rotation.y = -0.65;
forklift.scale.set(1.18, 1.18, 1.18);

scene.add(forklift);

forklift.add(box(1.65, 0.42, 0.9, mat.yellow, 0, 0.38, 0));
forklift.add(box(1.25, 0.22, 0.78, mat.yellow2, 0.1, 0.68, 0));
forklift.add(box(0.75, 0.95, 0.9, mat.yellow, -0.55, 0.92, 0));
forklift.add(box(0.58, 0.45, 0.08, mat.dark, -0.62, 1.05, 0.48));
forklift.add(box(0.38, 0.18, 0.38, mat.dark, 0.12, 0.93, 0));
forklift.add(box(0.16, 0.45, 0.16, mat.dark, 0.02, 1.16, -0.12));
forklift.add(cyl(0.13, 0.06, mat.dark, 0.3, 1.22, 0.05, Math.PI / 2));

forklift.add(box(0.08, 1.2, 0.08, mat.darkGray, -0.25, 1.42, -0.42));
forklift.add(box(0.08, 1.2, 0.08, mat.darkGray, 0.55, 1.42, -0.42));
forklift.add(box(0.08, 1.2, 0.08, mat.darkGray, -0.25, 1.42, 0.42));
forklift.add(box(0.08, 1.2, 0.08, mat.darkGray, 0.55, 1.42, 0.42));
forklift.add(box(0.95, 0.08, 0.9, mat.darkGray, 0.15, 2.02, 0));

forklift.add(box(0.11, 1.85, 0.1, mat.darkGray, 0.85, 1.1, -0.36));
forklift.add(box(0.11, 1.85, 0.1, mat.darkGray, 0.85, 1.1, 0.36));
forklift.add(box(0.82, 0.08, 0.08, mat.darkGray, 0.85, 1.9, 0));
forklift.add(box(0.82, 0.08, 0.08, mat.darkGray, 0.85, 0.55, 0));
forklift.add(box(0.12, 0.62, 0.82, mat.gray, 1.02, 0.82, 0));

forklift.add(box(1.55, 0.055, 0.08, mat.darkGray, 1.62, 0.45, -0.22));
forklift.add(box(1.55, 0.055, 0.08, mat.darkGray, 1.62, 0.45, 0.22));

forklift.add(cyl(0.3, 0.18, mat.dark, -0.58, 0.2, -0.5, Math.PI / 2));
forklift.add(cyl(0.3, 0.18, mat.dark, 0.55, 0.2, -0.5, Math.PI / 2));
forklift.add(cyl(0.3, 0.18, mat.dark, -0.58, 0.2, 0.5, Math.PI / 2));
forklift.add(cyl(0.3, 0.18, mat.dark, 0.55, 0.2, 0.5, Math.PI / 2));

forklift.add(cyl(0.18, 0.2, mat.yellow2, -0.58, 0.2, -0.51, Math.PI / 2));
forklift.add(cyl(0.18, 0.2, mat.yellow2, 0.55, 0.2, -0.51, Math.PI / 2));
forklift.add(cyl(0.18, 0.2, mat.yellow2, -0.58, 0.2, 0.51, Math.PI / 2));
forklift.add(cyl(0.18, 0.2, mat.yellow2, 0.55, 0.2, 0.51, Math.PI / 2));

const driver = aperturePerson(0, 0, 0.55);
driver.position.set(-2.25, 0.28, 4.82);
driver.rotation.y = -0.65;

// PALLET ALIGNED ON FORKS
const pallet = new THREE.Group();

pallet.position.set(-0.65, 0.48, 4.1);
pallet.rotation.y = -0.65;
pallet.scale.set(1.18, 1.18, 1.18);

scene.add(pallet);

pallet.add(box(1.65, 0.12, 1.2, mat.darkGray, 0, 0, 0));
pallet.add(box(1.55, 0.06, 0.12, mat.gray, 0, 0.13, -0.45));
pallet.add(box(1.55, 0.06, 0.12, mat.gray, 0, 0.13, 0));
pallet.add(box(1.55, 0.06, 0.12, mat.gray, 0, 0.13, 0.45));

for (let i = 0; i < 12; i++) {
  const col = i % 3;
  const row = Math.floor(i / 3) % 2;
  const layer = Math.floor(i / 6);

  const bx = -0.5 + col * 0.5;
  const bz = -0.25 + row * 0.5;
  const by = 0.38 + layer * 0.36;

  const crate = new THREE.Group();

  crate.add(box(0.42, 0.3, 0.42, mat.yellow));
  crate.add(box(0.3, 0.04, 0.3, mat.yellow2, 0, 0.17, 0));
  crate.add(box(0.035, 0.28, 0.43, mat.dark, 0.13, 0.02, 0));

  crate.position.set(
    -0.65 + bx,
    pallet.position.y + by,
    4.1 + bz
  );

  crate.rotation.y = pallet.rotation.y;

  crate.userData.draggable = true;
  crate.userData.onConveyor = false;
  crate.userData.speed = 0.022;
  crate.userData.stage = 0;
  crate.userData.scanned = false;
  crate.userData.assembled = false;

  scene.add(crate);
  draggableBoxes.push(crate);
}

// PACKAGES
const packages = [];

function createPackage(x, delay = 0) {
  const p = new THREE.Group();

  p.add(box(0.48, 0.32, 0.48, mat.yellow));
  p.add(box(0.32, 0.04, 0.32, mat.yellow2, 0, 0.18, 0));

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

// BACKGROUND MOVING INDICATORS
const movingIndicators = [];

for (let i = 0; i < 24; i++) {
  const line = box(
    0.6,
    0.04,
    0.04,
    mat.yellow,
    -18 + Math.random() * 36,
    0.6 + Math.random() * 4,
    -7.4
  );

  line.userData.speed = 0.01 + Math.random() * 0.02;

  scene.add(line);
  movingIndicators.push(line);
}

// PACKAGE LOGIC
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
  if (p.position.x > -8.6 && p.userData.stage === 0) {
    p.userData.stage = 1;
  }

  if (p.position.x > -4.0 && p.userData.stage === 1) {
    p.userData.stage = 2;
    p.scale.set(1.24, 0.72, 1.18);
    p.children[0].material = mat.yellow2;
    p.children[1].material = mat.yellow;
  }

  if (p.position.x > 1.1 && p.userData.stage === 2) {
    p.userData.stage = 3;
    p.userData.scanned = true;
    p.children[0].material = mat.white2;
    p.children[1].material = mat.yellow;
  }

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

// DRAG EVENTS
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

    if (!packages.includes(selectedBox)) {
      packages.push(selectedBox);
    }
  } else {
    selectedBox.position.y = 1.15;
  }

  selectedBox = null;
  document.body.style.cursor = "default";
});

// ANIMATION
let time = 0;

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

  picker.rotation.y = Math.sin(time * 0.5) * 0.08;

  picker.userData.lowerArm.rotation.z =
    -0.9 + Math.sin(time * 1.4) * 0.18;

  picker.userData.upperGroup.rotation.z =
    Math.sin(time * 1.8) * 0.25;

  picker.userData.claw.position.y =
    1.02 + Math.sin(time * 2.2) * 0.08;

  glowLights.forEach((l, i) => {
    l.intensity =
      0.65 +
      Math.sin(time * 2 + i) * 0.1;
  });

  movingIndicators.forEach((line) => {
    line.position.x += line.userData.speed;

    if (line.position.x > 18) {
      line.position.x = -18;
    }
  });

  camera.position.x =
    7.4 + Math.sin(time * 0.08) * 0.22;

  camera.position.y =
    5.05 + Math.sin(time * 0.1) * 0.06;

  camera.position.z = 15.8;

  camera.lookAt(-1.2, 0.8, 0);

  renderer.render(scene, camera);
}

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