import * as THREE from "three";

/* ---------- BASIC SETUP ---------- */

const scene = new THREE.Scene();
scene.background = new THREE.Color("#e3d6c3");
scene.fog = new THREE.Fog("#e3d6c3", 30, 66);

const camera = new THREE.PerspectiveCamera(
  31,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

camera.position.set(4.6, 5.6, 17.4);
camera.lookAt(-2.4, 1.15, 0.15);

const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.5));

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.08;

document.body.appendChild(renderer.domElement);

/* ---------- COLORS / MATERIALS ---------- */

const C = {
  floor: "#cdbda7",
tileA: "#c9b899",
tileB: "#7f8179",

  wall: "#d8c4aa",
  wall2: "#ead8bf",

  white: "#e8dcc8",
  white2: "#cdbfa9",

  gray: "#887f70",
  darkGray: "#3a3a35",

  dark: "#181714",
  belt: "#1d1b18",

  yellow: "#c9962d",
  yellow2: "#e0b24a",
  orange: "#d7913f",
  orange2: "#e5a85d",

  green: "#5f743d",
  green2: "#7f9652",

  blueLine: "#6c7f95",
  red: "#b95342"
};

const mat = {
  floor: new THREE.MeshStandardMaterial({
    color: C.floor,
    roughness: 0.62
  }),

  tileA: new THREE.MeshStandardMaterial({
    color: C.tileA,
    roughness: 0.68
  }),

  tileB: new THREE.MeshStandardMaterial({
    color: C.tileB,
    roughness: 0.68
  }),

  wall: new THREE.MeshStandardMaterial({
    color: C.wall,
    roughness: 0.55
  }),

  wall2: new THREE.MeshStandardMaterial({
    color: C.wall2,
    roughness: 0.55
  }),

  white: new THREE.MeshStandardMaterial({
    color: C.white,
    roughness: 0.32,
    metalness: 0.04
  }),

  white2: new THREE.MeshStandardMaterial({
    color: C.white2,
    roughness: 0.4,
    metalness: 0.05
  }),

  gray: new THREE.MeshStandardMaterial({
    color: C.gray,
    roughness: 0.42,
    metalness: 0.16
  }),

  darkGray: new THREE.MeshStandardMaterial({
    color: C.darkGray,
    roughness: 0.4,
    metalness: 0.22
  }),

  dark: new THREE.MeshStandardMaterial({
    color: C.dark,
    roughness: 0.45,
    metalness: 0.25
  }),

  belt: new THREE.MeshStandardMaterial({
    color: C.belt,
    roughness: 0.48,
    metalness: 0.2
  }),

  yellow: new THREE.MeshStandardMaterial({
    color: C.yellow,
    roughness: 0.27,
    metalness: 0.07
  }),

  yellow2: new THREE.MeshStandardMaterial({
    color: C.yellow2,
    roughness: 0.25,
    metalness: 0.06
  }),

  orange: new THREE.MeshStandardMaterial({
    color: C.orange,
    roughness: 0.3,
    metalness: 0.02
  }),

  orange2: new THREE.MeshStandardMaterial({
    color: C.orange2,
    roughness: 0.28,
    metalness: 0.02
  }),

  green: new THREE.MeshStandardMaterial({
    color: C.green,
    roughness: 0.55
  }),

  green2: new THREE.MeshStandardMaterial({
    color: C.green2,
    roughness: 0.55
  }),

  blueLine: new THREE.MeshStandardMaterial({
    color: C.blueLine,
    roughness: 0.38
  }),

  red: new THREE.MeshStandardMaterial({
    color: C.red,
    roughness: 0.34
  }),

  black: new THREE.MeshBasicMaterial({
    color: "#050505"
  }),

  face: new THREE.MeshBasicMaterial({
    color: "#27190e"
  }),

  glow: new THREE.MeshBasicMaterial({
    color: "#ffe5a8"
  })
};

/* ---------- HELPERS ---------- */

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
    new THREE.SphereGeometry(r, 40, 40),
    material
  );

  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  return mesh;
}

function capsule(radius, length, material, x = 0, y = 0, z = 0) {
  const mesh = new THREE.Mesh(
    new THREE.CapsuleGeometry(radius, length, 18, 36),
    material
  );

  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  return mesh;
}

/* ---------- LIGHTING ---------- */

scene.add(
  new THREE.HemisphereLight("#fff4df", "#8d7c68", 1.35)
);

const sun = new THREE.DirectionalLight("#ffe2b5", 1.85);

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

function addLamp(x, y, z, power = 0.65) {
  const light = new THREE.PointLight("#f3bf6a", power, 4.5);
  light.position.set(x, y, z);
  scene.add(light);
  glowLights.push(light);

  scene.add(box(0.28, 0.38, 0.18, mat.gray, x, y, z));
  scene.add(box(0.13, 0.28, 0.1, mat.glow, x, y + 0.04, z + 0.06));

  return light;
}

/* ---------- FLOOR ---------- */

scene.add(
  box(34, 0.18, 21, mat.floor, 0, -0.1, 0)
);

for (let xi = 0; xi < 18; xi++) {
  for (let zi = 0; zi < 11; zi++) {
    const x = -17 + xi * 2;
    const z = -10 + zi * 2;
    const isLight = (xi + zi) % 2 === 0;

    scene.add(
      box(
        1.94,
        0.014,
        1.94,
        isLight ? mat.tileA : mat.tileB,
        x,
        0.018,
        z
      )
    );
  }
}

/* ---------- BACK WALL ---------- */

scene.add(box(34, 7.5, 0.18, mat.wall, 0, 3.45, -8.9));

// LEFT SIDE WALL - fixes the empty white top-left area
scene.add(box(0.22, 7.5, 10.5, mat.wall, -16.9, 3.45, -3.9));
scene.add(box(0.42, 7.6, 0.42, mat.gray, -16.45, 3.45, -7.35));



for (let i = 0; i < 18; i++) {
  scene.add(
    box(
      0.16,
      7.3,
      0.12,
      mat.gray,
      -18 + i * 2.2,
      3.5,
      -7.45
    )
  );
}

for (let i = 0; i < 13; i++) {
  scene.add(
    box(
      36,
      0.07,
      0.1,
      mat.darkGray,
      0,
      1.15 + i * 0.52,
      -7.35
    )
  );
}

for (let i = 0; i < 10; i++) {
  const distant = box(
    0.9,
    2.2 + Math.random() * 1.8,
    0.1,
    mat.gray,
    -14 + i * 3.1,
    2.0,
    -7.9
  );

  distant.material = new THREE.MeshStandardMaterial({
    color: "#b9b2a6",
    transparent: true,
    opacity: 0.35,
    roughness: 0.7
  });

  scene.add(distant);
}

for (let i = 0; i < 10; i++) {
  addLamp(-14.5 + i * 3.1, 4.55, -6.9, 0.9);
}

/* ---------- WALL SIGNAGE ---------- */

function makeTextPanel(text, x, y, z, w = 2.4, h = 1.2) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;

  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#f7efe2";
  ctx.fillRect(0, 0, 512, 256);

  ctx.fillStyle = "#504b43";
  ctx.font = "bold 38px Arial";
  ctx.textAlign = "center";

  text.split("\n").forEach((line, i) => {
    ctx.fillText(line, 256, 76 + i * 48);
  });

  ctx.fillStyle = C.yellow;
  ctx.fillRect(155, 190, 200, 26);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;

  const panel = new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshStandardMaterial({
      map: tex,
      roughness: 0.34
    })
  );

  panel.position.set(x, y, z);
  scene.add(panel);

  return panel;
}

addLamp(-15.4, 4.25, -5.8, 1.4);
addLamp(-14.1, 4.25, -5.8, 1.4);
addLamp(-12.8, 4.25, -5.8, 1.4);

/* ---------- CLEAN TOP LEFT CATWALK ---------- */

const topLeftFeature = new THREE.Group();
topLeftFeature.position.set(-14.25, 0, -3.15);
scene.add(topLeftFeature);

// tall back structure
topLeftFeature.add(box(2.55, 4.15, 1.15, mat.white2, 0, 2.08, 0));
topLeftFeature.add(box(2.7, 0.18, 1.28, mat.yellow, 0, 4.25, 0));

// dark service screen
topLeftFeature.add(box(1.7, 1.0, 0.08, mat.dark, 0, 2.75, 0.65));

// lower service base
topLeftFeature.add(box(2.1, 0.8, 1.0, mat.gray, 0, 0.45, 0));
topLeftFeature.add(box(1.6, 0.45, 0.08, mat.dark, 0, 0.55, 0.55));

// upper balcony platform
topLeftFeature.add(box(3.8, 0.18, 1.05, mat.gray, 0.55, 3.55, 0.15));
topLeftFeature.add(box(3.6, 0.08, 0.9, mat.darkGray, 0.55, 3.67, 0.15));

// balcony posts
for (let i = 0; i < 7; i++) {
  topLeftFeature.add(
    box(0.055, 0.6, 0.055, mat.darkGray, -1.0 + i * 0.55, 3.95, 0.68)
  );
}

// balcony rail
topLeftFeature.add(box(3.45, 0.06, 0.06, mat.yellow, 0.55, 4.28, 0.68));

// clean side stair body
const stairBase = new THREE.Group();
stairBase.position.set(-1.55, 0.8, 0.65);
stairBase.rotation.z = -0.42;
topLeftFeature.add(stairBase);

stairBase.add(box(2.25, 0.08, 0.08, mat.darkGray, 0, 0, -0.24));
stairBase.add(box(2.25, 0.08, 0.08, mat.darkGray, 0, 0, 0.24));

for (let i = 0; i < 8; i++) {
  stairBase.add(
    box(
      0.32,
      0.07,
      0.58,
      mat.gray,
      -1.0 + i * 0.28,
      0.05,
      0
    )
  );
}

// stair handrail
const handRail = box(2.35, 0.055, 0.055, mat.yellow, -0.05, 2.12, 0.92);
handRail.rotation.z = -0.42;
topLeftFeature.add(handRail);

// support legs
topLeftFeature.add(box(0.09, 3.2, 0.09, mat.darkGray, -1.25, 1.6, -0.3));
topLeftFeature.add(box(0.09, 3.2, 0.09, mat.darkGray, 1.75, 1.6, -0.3));
topLeftFeature.add(box(0.09, 3.2, 0.09, mat.darkGray, -1.25, 1.6, 0.6));
topLeftFeature.add(box(0.09, 3.2, 0.09, mat.darkGray, 1.75, 1.6, 0.6));

// small industrial lights
topLeftFeature.add(box(0.25, 0.18, 0.1, mat.red, -0.65, 1.38, 0.62));
topLeftFeature.add(box(0.25, 0.18, 0.1, mat.yellow2, -0.28, 1.38, 0.62));

const topLeftLight = new THREE.PointLight("#d89a45", 1.1, 5);
topLeftLight.position.set(-14.2, 3.8, -2.2);
scene.add(topLeftLight);
glowLights.push(topLeftLight);


/* ---------- CONVEYORS ---------- */

const rollers = [];

function conveyor(x, y, z, length, rotationY = 0) {
  const g = new THREE.Group();

  g.position.set(x, y, z);
  g.rotation.y = rotationY;

  scene.add(g);

  g.add(box(length, 0.34, 1.3, mat.white2, 0, 0, 0));
  g.add(box(length - 0.25, 0.08, 1.05, mat.belt, 0, 0.25, 0));

  g.add(box(length, 0.06, 0.08, mat.yellow, 0, 0.36, -0.62));
  g.add(box(length, 0.06, 0.08, mat.yellow, 0, 0.36, 0.62));

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

    g.add(box(0.12, 0.72, 0.12, mat.gray, px, -0.42, -0.5));
    g.add(box(0.12, 0.72, 0.12, mat.gray, px, -0.42, 0.5));
  }

  return g;
}

function rail(g, width, x, y, z) {
  g.add(box(width, 0.05, 0.05, mat.gray, x, y, z));
  g.add(box(width, 0.05, 0.05, mat.gray, x, y + 0.35, z));

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
  g.add(box(0.55, 0.52, 0.08, mat.white2, x, y, z));
  g.add(box(0.38, 0.2, 0.04, mat.dark, x, y + 0.1, z + 0.05));
  g.add(box(0.08, 0.08, 0.04, mat.red, x - 0.15, y - 0.13, z + 0.05));
  g.add(box(0.08, 0.08, 0.04, mat.yellow, x, y - 0.13, z + 0.05));
}

/* ---------- SOFT FIGURES ---------- */

function aperturePerson(x, z, scale = 1) {
  const g = new THREE.Group();

  g.position.set(x, 0, z);
  scene.add(g);

  const body = capsule(0.28 * scale, 0.58 * scale, mat.orange, 0, 0.58 * scale, 0);
  body.scale.set(1.05, 1, 0.92);
  g.add(body);

  const hip = sphere(0.25 * scale, mat.orange, 0, 0.31 * scale, 0);
  hip.scale.set(1.08, 0.55, 0.9);
  g.add(hip);

  const neck = sphere(0.25 * scale, mat.orange, 0, 0.88 * scale, 0);
  neck.scale.set(1, 0.55, 0.9);
  g.add(neck);

  const head = sphere(0.35 * scale, mat.orange, 0, 1.22 * scale, 0);
  head.scale.set(1, 0.96, 1);
  g.add(head);

  const eyeL = sphere(0.028 * scale, mat.face, -0.1 * scale, 1.26 * scale, 0.33 * scale);
  const eyeR = eyeL.clone();
  eyeR.position.x = 0.1 * scale;

  g.add(eyeL);
  g.add(eyeR);

  const mouth = box(
    0.12 * scale,
    0.018 * scale,
    0.018 * scale,
    mat.face,
    0,
    1.1 * scale,
    0.34 * scale
  );

  mouth.rotation.z = 0.06;
  g.add(mouth);

  const armL = capsule(0.075 * scale, 0.42 * scale, mat.orange, -0.31 * scale, 0.62 * scale, 0.03 * scale);
  armL.rotation.z = -0.18;

  const armR = capsule(0.075 * scale, 0.42 * scale, mat.orange, 0.31 * scale, 0.62 * scale, 0.03 * scale);
  armR.rotation.z = 0.18;

  g.add(armL);
  g.add(armR);

  const shoulderL = sphere(0.095 * scale, mat.orange, -0.25 * scale, 0.78 * scale, 0);
  shoulderL.scale.set(1, 0.75, 1);

  const shoulderR = shoulderL.clone();
  shoulderR.position.x = 0.25 * scale;

  g.add(shoulderL);
  g.add(shoulderR);

  const legL = capsule(0.085 * scale, 0.36 * scale, mat.orange, -0.105 * scale, 0.11 * scale, 0);
  legL.rotation.z = 0.04;

  const legR = capsule(0.085 * scale, 0.36 * scale, mat.orange, 0.105 * scale, 0.11 * scale, 0);
  legR.rotation.z = -0.04;

  g.add(legL);
  g.add(legR);

  return g;
}

/* ---------- MAIN LAYOUT ---------- */

conveyor(-5.8, 0.52, 0, 8.5, 0);
conveyor(2.7, 0.52, 0, 8.5, 0);
conveyor(7.3, 0.82, -2.4, 4.8, -0.5);
conveyor(-7.5, 0.45, -3.5, 4.2, 0.25);

// visible 90-degree transfer belt into the right-side machine
const transferBelt = new THREE.Group();
transferBelt.position.set(6.95, 0.55, -0.82);
scene.add(transferBelt);

transferBelt.add(box(1.35, 0.28, 2.55, mat.white2, 0, 0, 0));
transferBelt.add(box(1.02, 0.08, 2.35, mat.belt, 0, 0.25, 0));

transferBelt.add(box(0.08, 0.08, 2.35, mat.yellow, -0.57, 0.37, 0));
transferBelt.add(box(0.08, 0.08, 2.35, mat.yellow, 0.57, 0.37, 0));

for (let i = 0; i < 7; i++) {
  const r = cyl(
    0.07,
    1.02,
    mat.dark,
    0,
    0.34,
    -1.02 + i * 0.34,
    Math.PI / 2
  );

  transferBelt.add(r);
  rollers.push(r);
}

/* ---------- MACHINES ---------- */

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

function cutterOutput() {
  const g = new THREE.Group();

  g.position.set(7.55, 0, -1.38);
  scene.add(g);

  // main body
  g.add(box(3.75, 2.25, 1.65, mat.white, 0, 1.35, 0));
  g.add(box(4.0, 0.2, 1.82, mat.white2, 0, 2.6, 0));

  // true hollow opening, bigger and centered over transfer belt
  g.add(box(2.45, 1.05, 0.1, mat.dark, -0.15, 1.28, 0.88));

  // inside tunnel pieces so it feels hollow
  g.add(box(2.25, 0.08, 1.15, mat.belt, -0.15, 0.88, 0.35));
  g.add(box(0.12, 1.0, 1.05, mat.darkGray, -1.35, 1.3, 0.38));
  g.add(box(0.12, 1.0, 1.05, mat.darkGray, 1.05, 1.3, 0.38));
  g.add(box(2.45, 0.1, 1.05, mat.darkGray, -0.15, 1.82, 0.38));

  // yellow trim around opening
  g.add(box(2.55, 0.08, 0.08, mat.yellow, -0.15, 1.86, 0.94));
  g.add(box(0.08, 1.05, 0.08, mat.yellow, -1.43, 1.35, 0.94));
  g.add(box(0.08, 1.05, 0.08, mat.yellow, 1.13, 1.35, 0.94));

  // animated cutter arm
  const arm = new THREE.Group();

  arm.add(box(0.16, 1.15, 0.16, mat.gray, 0, 0.45, 0));
  arm.add(box(0.75, 0.16, 0.16, mat.yellow, -0.28, -0.1, 0));
  arm.add(box(0.32, 0.32, 0.32, mat.yellow2, -0.65, -0.12, 0));

  arm.position.set(1.05, 1.55, 0.58);
  arm.rotation.z = -0.25;
  g.add(arm);

  const flap = box(1.55, 0.12, 1.0, mat.belt, -0.15, 0.98, 0.35);
  flap.rotation.z = -0.08;
  g.add(flap);

  controlPanel(g, -1.55, 1.1, 0.92);
  vents(g, 1.25, 1.42, 0.93);

  return { g, arm, flap };
}

const machineA = feedChamber();
const machineB = compressionPress();
const machineC = scannerTable();
const machineD = cutterOutput();

/* ---------- BACKGROUND MACHINES ---------- */

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


/* ---------- PROPS ---------- */

for (let i = 0; i < 8; i++) {
  const barrel = new THREE.Group();

  barrel.position.set(
    -10.8 + (i % 4) * 0.55,
    0,
    3.2 + Math.floor(i / 4) * 0.55
  );

  scene.add(barrel);

  barrel.add(cyl(0.25, 0.52, mat.gray, 0, 0.26, 0));
  barrel.add(cyl(0.255, 0.035, mat.darkGray, 0, 0.53, 0));
  barrel.add(cyl(0.255, 0.035, mat.darkGray, 0, 0.03, 0));

  barrel.add(cyl(0.26, 0.035, mat.darkGray, 0, 0.18, 0));
  barrel.add(cyl(0.26, 0.035, mat.darkGray, 0, 0.36, 0));

  barrel.add(box(0.18, 0.035, 0.04, mat.dark, 0, 0.56, 0));
}

/* ---------- HOPPER / PICKER ARM ---------- */

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

/* ---------- FORKLIFT / PALLET ---------- */

const draggableBoxes = [];
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let selectedBox = null;

const dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -1.02);
const dragPoint = new THREE.Vector3();

const forklift = new THREE.Group();

forklift.position.set(-3.55, 0, 5.55);
forklift.rotation.y = -0.18;
forklift.scale.set(1.38, 1.38, 1.38);

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


const pallet = new THREE.Group();

pallet.position.set(1.15, 0.24, 5.12);
pallet.rotation.y = -0.18;
pallet.scale.set(1.16, 1.16, 1.16);

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
const by = 0.2 + layer * 0.32;

  const crate = new THREE.Group();

  crate.add(box(0.42, 0.3, 0.42, mat.yellow));
  crate.add(box(0.3, 0.04, 0.3, mat.yellow2, 0, 0.17, 0));
  crate.add(box(0.035, 0.28, 0.43, mat.dark, 0.13, 0.02, 0));

crate.position.set(
  1.15 + bx,
  pallet.position.y + by,
  5.12 + bz
);

crate.rotation.y = -0.18;

  crate.userData.draggable = true;
  crate.userData.onConveyor = false;
  crate.userData.speed = 0.022;
  crate.userData.stage = 0;
  crate.userData.scanned = false;
  crate.userData.assembled = false;

  scene.add(crate);
  draggableBoxes.push(crate);
}

/* ---------- PACKAGES ---------- */

const packages = [];

function createPackage(x, delay = 0) {
  const p = new THREE.Group();

  p.add(box(0.48, 0.32, 0.48, mat.yellow));
  p.add(box(0.32, 0.04, 0.32, mat.yellow2, 0, 0.18, 0));

  p.position.set(x, 1.02, 0);

  p.userData.speed = 0.02 + Math.random() * 0.004;
  p.userData.stage = 0;
  p.userData.delay = delay;
  p.userData.pathStage = 0;
  p.userData.scanned = false;
  p.userData.assembled = false;

  scene.add(p);
  packages.push(p);

  return p;
}

for (let i = 0; i < 7; i++) {
  createPackage(-9.6 + i * 2.6, i * 0.4);
}

/* ---------- BACKGROUND INDICATORS ---------- */

const movingIndicators = [];

for (let i = 0; i < 24; i++) {
  const line = box(
    0.6,
    0.04,
    0.04,
    mat.yellow,
    -18 + Math.random() * 36,
    0.6 + Math.random() * 4,
    -7.25
  );

  scene.add(line);

  line.userData.speed = 0.01 + Math.random() * 0.02;

  movingIndicators.push(line);
}

/* ---------- PACKAGE LOGIC ---------- */

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
    p.remove(p.children[p.children.length - 1]);
  }
}

function animatePackageStages(p) {
  if (p.position.x > -8.6 && p.userData.stage === 0) {
    p.userData.stage = 1;
  }

  if (p.position.x > -4.0 && p.userData.stage === 1) {
    p.userData.stage = 2;
    p.scale.set(1.22, 0.74, 1.15);
    if (p.children[0]) p.children[0].material = mat.yellow2;
    if (p.children[1]) p.children[1].material = mat.yellow;
  }

  if (p.position.x > 1.1 && p.userData.stage === 2) {
    p.userData.stage = 3;
    if (p.children[0]) p.children[0].material = mat.white2;
    if (p.children[1]) p.children[1].material = mat.yellow;
  }

if (p.position.x > 5.35 && p.userData.stage === 3) {
  p.userData.stage = 4;

  if (p.children[0]) p.children[0].material = mat.yellow;
  if (p.children[1]) p.children[1].material = mat.yellow2;

  p.scale.set(1, 1, 1);
}

/* ---------- DRAGGING ---------- */

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
    selectedBox.position.x < 8.6 &&
    selectedBox.position.z > -0.85 &&
    selectedBox.position.z < 0.85;

  if (onMainConveyor) {
    selectedBox.position.y = 1.02;
    selectedBox.position.z = 0;
    selectedBox.rotation.x = 0;
    selectedBox.rotation.z = 0;

    selectedBox.userData.onConveyor = true;
    selectedBox.userData.stage = 0;

    if (!packages.includes(selectedBox)) {
      packages.push(selectedBox);
    }
} else {
selectedBox.position.y = 0.25;
  selectedBox.rotation.x = 0;
  selectedBox.rotation.z = 0;
  selectedBox.userData.onConveyor = false;
}

  selectedBox = null;
  document.body.style.cursor = "default";
});

/* ---------- ANIMATION ---------- */

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

  // press: slow slide, sharp stamp
  machineB.gantry.position.x = Math.sin(time * 0.9) * 0.28;

  const pressPulse = Math.abs(Math.sin(time * 2.2));
  machineB.plate.position.y = 1.7 - pressPulse * 0.28;

  // scanner: sweeping bar
  machineC.scanner.position.x = Math.sin(time * 1.7) * 0.95;
  machineC.scanner.position.y = 1.78;

  // cutter/output arm
  machineD.arm.rotation.z = -0.25 + Math.sin(time * 1.4) * 0.28;
  machineD.flap.rotation.z = -0.08 + Math.sin(time * 1.1) * 0.08;

packages.forEach((p) => {
  if (selectedBox === p) return;

  if (p.userData.pathStage === undefined) {
    p.userData.pathStage = 0;
  }

  if (p.userData.pathStage === 0) {
    p.position.x += p.userData.speed;
    p.position.z = 0;
    p.position.y = 1.02;

    if (p.position.x >= 6.95) {
      p.userData.pathStage = 1;
      p.position.x = 6.95;
    }
  }

  else if (p.userData.pathStage === 1) {
    p.position.z -= p.userData.speed;
    p.position.x = 6.95;
    p.position.y = 1.08;
    p.rotation.y += 0.022;

    if (p.position.z <= -1.7) {
      p.userData.pathStage = 2;
      p.position.z = -1.7;
    }
  }

  else if (p.userData.pathStage === 2) {
    p.position.x += p.userData.speed;
    p.position.z = -1.7;
    p.position.y = 1.08;

    if (p.position.x >= 8.7) {
      resetPackage(p);
      p.position.x = -9.6;
      p.position.z = 0;
      p.position.y = 1.02;
      p.userData.pathStage = 0;
      return;
    }
  }

  animatePackageStages(p);

  if (p.userData.stage === 1) p.rotation.y += 0.004;
  if (p.userData.stage === 2) p.rotation.y += 0.006;
  if (p.userData.stage === 3) p.rotation.y += 0.008;
});

  picker.rotation.y = Math.sin(time * 0.5) * 0.08;

  picker.userData.lowerArm.rotation.z =
    -0.9 + Math.sin(time * 1.4) * 0.18;

  picker.userData.upperGroup.rotation.z =
    Math.sin(time * 1.8) * 0.25;

  picker.userData.claw.position.y =
    1.02 + Math.sin(time * 2.2) * 0.08;

  glowLights.forEach((l, i) => {
    l.intensity = 0.65 + Math.sin(time * 2 + i) * 0.12;
  });

  movingIndicators.forEach((line) => {
    line.position.x += line.userData.speed;

    if (line.position.x > 18) {
      line.position.x = -18;
    }
  });

camera.position.x = 4.6 + Math.sin(time * 0.08) * 0.12;
camera.position.y = 5.6 + Math.sin(time * 0.1) * 0.04;
camera.position.z = 17.4;

camera.lookAt(-2.4, 1.15, 0.15);

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