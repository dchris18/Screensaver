import * as THREE from "three";

const scene = new THREE.Scene();
scene.background = new THREE.Color("#10100f");
scene.fog = new THREE.Fog("#10100f", 14, 32);

const camera = new THREE.PerspectiveCamera(
  26,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

camera.position.set(0, 1.85, 18.5);
camera.lookAt(0, 0.8, 0);

const renderer = new THREE.WebGLRenderer({
  antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.5));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.22;

document.body.appendChild(renderer.domElement);

const C = {
  wall: "#211b17",
  floor: "#1c1714",
  steel: "#3c3832",
  darkSteel: "#11100f",
  black: "#070707",
  orange: "#b95522",
  orange2: "#f1863c",
  glow: "#ff8a3d",
  pale: "#e0b36d"
};

const mat = {
  wall: new THREE.MeshStandardMaterial({ color: C.wall, roughness: 0.9, metalness: 0.08 }),
  floor: new THREE.MeshStandardMaterial({ color: C.floor, roughness: 0.8, metalness: 0.18 }),
  steel: new THREE.MeshStandardMaterial({ color: C.steel, roughness: 0.42, metalness: 0.48 }),
  darkSteel: new THREE.MeshStandardMaterial({ color: C.darkSteel, roughness: 0.55, metalness: 0.55 }),
  black: new THREE.MeshStandardMaterial({ color: C.black, roughness: 0.45, metalness: 0.35 }),
  orange: new THREE.MeshStandardMaterial({ color: C.orange, roughness: 0.38, metalness: 0.32 }),
  brightOrange: new THREE.MeshStandardMaterial({ color: C.orange2, roughness: 0.32, metalness: 0.28 }),
  pale: new THREE.MeshStandardMaterial({
    color: C.pale,
    emissive: "#8f5a25",
    emissiveIntensity: 0.3,
    roughness: 0.25,
    metalness: 0.12
  }),
  glow: new THREE.MeshBasicMaterial({ color: C.glow }),
  glass: new THREE.MeshStandardMaterial({
    color: "#ff9a4c",
    emissive: C.glow,
    emissiveIntensity: 1.3,
    roughness: 0.12,
    metalness: 0.08,
    transparent: true,
    opacity: 0.65
  }),
  dim: new THREE.MeshStandardMaterial({
    color: "#15110f",
    roughness: 0.85,
    metalness: 0.12
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

function addTextSprite(text, x, y, z, size = 58) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 180;

  const ctx = canvas.getContext("2d");
  ctx.font = `bold ${size}px Arial`;
  ctx.fillStyle = "#d8843a";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 256, 90);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;

  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: texture,
      transparent: true
    })
  );

  sprite.position.set(x, y, z);
  sprite.scale.set(1.7, 0.6, 1);
  scene.add(sprite);
  return sprite;
}

// LIGHTS
scene.add(new THREE.AmbientLight("#ffffff", 0.2));

const key = new THREE.DirectionalLight("#ffd0a3", 3.1);
key.position.set(0, 8, 10);
key.castShadow = true;
key.shadow.mapSize.width = 2048;
key.shadow.mapSize.height = 2048;
key.shadow.camera.left = -14;
key.shadow.camera.right = 14;
key.shadow.camera.top = 10;
key.shadow.camera.bottom = -9;
scene.add(key);

const fill = new THREE.DirectionalLight("#6f6f6f", 0.6);
fill.position.set(-8, 4, 8);
scene.add(fill);

const glowLights = [];

function addGlowLight(x, y, z, intensity = 2.4, distance = 6) {
  const light = new THREE.PointLight(C.glow, intensity, distance);
  light.position.set(x, y, z);
  scene.add(light);
  glowLights.push(light);
  return light;
}

// ROOM FILLS SCREEN
scene.add(box(26, 0.3, 8, mat.floor, 0, -2.25, 0));
scene.add(box(26, 9.2, 0.3, mat.wall, 0, 2.25, -3.85));
scene.add(box(26, 0.3, 8, mat.darkSteel, 0, 6.85, 0));

for (let i = 0; i < 14; i++) {
  scene.add(box(1.8, 8.7, 0.05, mat.wall, -12.5 + i * 2, 2.25, -3.64));
  scene.add(box(0.05, 8.7, 0.08, mat.darkSteel, -11.6 + i * 2, 2.25, -3.55));
}

for (let i = 0; i < 9; i++) {
  scene.add(cyl(0.04, 25, mat.darkSteel, 0, 5.8 - i * 0.35, -3.42, 0, Math.PI / 2));
}

for (let i = 0; i < 7; i++) {
  const x = -10 + i * 3.3;
  scene.add(box(1.25, 0.08, 0.08, mat.glow, x, 6.25, -2.55));
  addGlowLight(x, 5.85, -2.1, 1.6, 5);
}

// BACKGROUND DISTANT MACHINES / BELTS
const bgGroup = new THREE.Group();
bgGroup.position.set(0, 0.15, -2.2);
scene.add(bgGroup);

function createBackgroundBelt(y, z, speedOffset = 0) {
  bgGroup.add(box(24, 0.16, 0.45, mat.dim, 0, y, z));
  bgGroup.add(box(23.5, 0.04, 0.4, mat.black, 0, y + 0.12, z));

  for (let i = 0; i < 18; i++) {
    const marker = box(0.08, 0.04, 0.42, mat.orange, -11 + i * 1.3, y + 0.17, z);
    marker.userData.bgMove = true;
    marker.userData.baseY = y + 0.17;
    marker.userData.speedOffset = speedOffset;
    bgGroup.add(marker);
  }
}

createBackgroundBelt(3.35, -0.4, 0);
createBackgroundBelt(1.25, -0.5, 1);
createBackgroundBelt(-0.8, -0.45, 2);

for (let i = 0; i < 10; i++) {
  const x = -11 + i * 2.4;
  bgGroup.add(box(1.2, 1.4, 0.6, mat.dim, x, 2.2 + (i % 2) * 0.5, -0.55));
  bgGroup.add(box(0.7, 0.05, 0.05, mat.glow, x, 2.75 + (i % 2) * 0.5, -0.2));
}

for (let i = 0; i < 12; i++) {
  bgGroup.add(cyl(0.035, 4.5, mat.darkSteel, -12 + i * 2.2, 2.1, -0.7));
}

// CONVEYORS
const rollers = [];
const bgMovers = [];

function createConveyor(y, z, length = 22) {
  scene.add(box(length, 0.35, 1.18, mat.darkSteel, 0, y, z));
  scene.add(box(length - 0.2, 0.08, 1.05, mat.black, 0, y + 0.27, z));

  for (let i = 0; i < 28; i++) {
    const r = cyl(0.12, 1.28, mat.steel, -10.6 + i * 0.78, y + 0.31, z, Math.PI / 2);
    rollers.push(r);
    scene.add(r);
  }

  for (let i = 0; i < 18; i++) {
    scene.add(box(0.06, 0.05, 1.08, mat.orange, -10.1 + i * 1.15, y + 0.38, z));
  }

  for (let i = 0; i < 10; i++) {
    const x = -10.5 + i * 2.3;
    scene.add(box(0.16, 0.9, 0.16, mat.darkSteel, x, y - 0.47, z - 0.45));
    scene.add(box(0.16, 0.9, 0.16, mat.darkSteel, x, y - 0.47, z + 0.45));
  }
}

const upperBeltY = 1.45;
const lowerBeltY = -2.05;

createConveyor(upperBeltY, 0);
createConveyor(lowerBeltY, 0);

scene.add(box(0.36, 2.4, 0.85, mat.darkSteel, 10.75, -0.2, 0));
scene.add(box(1.25, 0.08, 0.95, mat.glow, 10.75, -1.05, 0.02));
addGlowLight(10.55, -0.45, 0.65, 2.5, 5);

// PACKAGES
const packages = [];

for (let i = 0; i < 12; i++) {
  const g = new THREE.Group();

  g.add(box(0.55, 0.42, 0.55, mat.orange));
  g.add(box(0.42, 0.04, 0.42, mat.brightOrange, 0, 0.23, 0));
  g.add(box(0.04, 0.28, 0.57, mat.darkSteel, 0.18, 0.02, 0));

  g.position.set(-10.5 + i * 1.9, upperBeltY + 0.67, 0);
  g.userData = {
    state: "upper",
    speed: 0.024 + Math.random() * 0.006,
    fallSpeed: 0
  };

  packages.push(g);
  scene.add(g);
}

function addWarningStripes(group, y = 1.13) {
  for (let i = 0; i < 5; i++) {
    const stripe = box(0.12, 0.05, 1.4, mat.brightOrange, -0.55 + i * 0.28, y, 0.63);
    stripe.rotation.z = -0.6;
    group.add(stripe);
  }
}

function addBolts(group, y = 1.25) {
  for (let i = 0; i < 5; i++) {
    group.add(cyl(0.045, 0.04, mat.brightOrange, -0.7 + i * 0.35, y, 0.7, Math.PI / 2));
  }
}

function machineShell(g, style = "default") {
  if (style === "wide") {
    g.add(box(2.45, 2.6, 1.35, mat.steel, 0, 2.65, -0.18));
    g.add(box(2.7, 0.48, 1.5, mat.darkSteel, 0, 4.18, -0.18));
    g.add(box(2.5, 0.35, 1.45, mat.darkSteel, 0, 1.05, -0.18));
  } else if (style === "thin") {
    g.add(box(1.7, 3.2, 1.2, mat.steel, 0, 2.75, -0.18));
    g.add(box(2.0, 0.45, 1.45, mat.darkSteel, 0, 4.45, -0.18));
    g.add(box(1.9, 0.35, 1.35, mat.darkSteel, 0, 1.0, -0.18));
  } else if (style === "heavy") {
    g.add(box(2.55, 3.4, 1.6, mat.steel, 0, 2.65, -0.2));
    g.add(box(2.75, 0.65, 1.75, mat.darkSteel, 0, 4.55, -0.2));
    g.add(box(2.65, 0.5, 1.7, mat.darkSteel, 0, 0.9, -0.2));
  } else {
    g.add(box(2.15, 3.0, 1.35, mat.steel, 0, 2.65, -0.18));
    g.add(box(2.35, 0.45, 1.55, mat.darkSteel, 0, 4.32, -0.18));
    g.add(box(2.25, 0.35, 1.5, mat.darkSteel, 0, 1.0, -0.18));
  }

  g.add(box(0.16, 2.55, 1.45, mat.darkSteel, -1.18, 2.55, -0.15));
  g.add(box(0.16, 2.55, 1.45, mat.darkSteel, 1.18, 2.55, -0.15));
  g.add(box(1.1, 0.08, 0.05, mat.glow, 0, 3.55, 0.62));
  addWarningStripes(g);
  addBolts(g);
}

function createMachine(x, yOffset, label, type) {
  const g = new THREE.Group();
  g.position.set(x, yOffset, 0);
  scene.add(g);

  let moving = null;
  let moving2 = null;
  let moving3 = null;
  let arm = null;

  if (type === "press") {
    machineShell(g, "heavy");

    g.add(box(1.25, 1.1, 0.08, mat.black, 0, 2.55, 0.62));
    arm = box(0.32, 1.25, 0.32, mat.darkSteel, 0, 3.35, 0.15);
    moving = box(1.45, 0.3, 1.1, mat.brightOrange, 0, 2.55, 0.15);
    moving2 = box(1.0, 0.12, 0.8, mat.pale, 0, 1.78, 0.2);

    g.add(arm, moving, moving2);
  }

  if (type === "scan") {
    machineShell(g, "wide");

    g.add(box(1.75, 1.4, 0.08, mat.black, 0, 2.55, 0.62));
    moving = box(1.7, 0.08, 1.25, mat.glow, 0, 2.05, 0.12);
    moving2 = box(0.08, 1.2, 1.25, mat.glow, -0.8, 2.55, 0.12);
    moving3 = box(1.4, 0.08, 0.08, mat.pale, 0, 3.1, 0.65);

    g.add(moving, moving2, moving3);
  }

  if (type === "sort") {
    machineShell(g, "thin");

    g.add(box(1.25, 1.1, 0.08, mat.glass, 0, 2.5, 0.62));
    arm = box(0.3, 1.15, 0.3, mat.darkSteel, -0.55, 2.75, 0.25);
    arm.rotation.z = -0.35;
    moving = box(0.42, 0.42, 1.9, mat.brightOrange, 0.35, 2.0, 0.1);
    moving2 = box(0.8, 0.08, 0.8, mat.glow, 0.2, 3.05, 0.62);

    g.add(arm, moving, moving2);
  }

  if (type === "crush") {
    machineShell(g, "heavy");

    g.add(box(1.45, 1.15, 0.08, mat.black, 0, 2.55, 0.62));
    moving = box(1.45, 0.25, 1.1, mat.brightOrange, 0, 2.95, 0.1);
    moving2 = box(1.45, 0.25, 1.1, mat.brightOrange, 0, 2.0, 0.1);
    moving3 = box(0.95, 0.08, 0.95, mat.glow, 0, 2.45, 0.1);

    g.add(moving, moving2, moving3);
  }

  if (type === "laser") {
    machineShell(g, "thin");

    g.add(box(1.2, 1.35, 0.08, mat.black, 0, 2.5, 0.62));
    moving = box(0.12, 1.55, 0.12, mat.glow, 0, 2.45, 0.22);
    moving2 = box(1.25, 0.12, 1.05, mat.brightOrange, 0, 3.1, 0.1);
    moving3 = box(1.0, 0.08, 1.0, mat.pale, 0, 1.72, 0.1);

    g.add(moving, moving2, moving3);
  }

  if (type === "check") {
    machineShell(g, "wide");

    g.add(box(1.5, 1.15, 0.08, mat.glass, 0, 2.5, 0.62));

    moving = new THREE.Group();
    const ringA = cyl(0.55, 0.055, mat.glow, 0, 0, 0, Math.PI / 2);
    const ringB = cyl(0.36, 0.055, mat.brightOrange, 0, 0, 0, Math.PI / 2);
    const bar = box(1.15, 0.08, 0.08, mat.pale);

    moving.add(ringA, ringB, bar);
    moving.position.set(0, 2.55, 0.25);

    moving2 = box(1.2, 0.08, 0.05, mat.glow, 0, 3.15, 0.65);

    g.add(moving, moving2);
  }

  if (type === "stamp") {
    machineShell(g, "default");

    g.add(box(1.35, 0.95, 0.08, mat.black, 0, 2.55, 0.62));
    arm = box(0.22, 1.25, 0.22, mat.darkSteel, 0, 3.35, 0.12);
    moving = box(0.95, 0.22, 0.95, mat.brightOrange, 0, 2.55, 0.12);
    moving2 = box(1.0, 0.06, 1.0, mat.glow, 0, 1.85, 0.12);
    moving3 = box(1.15, 0.08, 0.05, mat.pale, 0, 3.1, 0.64);

    g.add(arm, moving, moving2, moving3);
  }

  if (type === "output") {
    machineShell(g, "wide");

    g.add(box(1.55, 1.15, 0.08, mat.glass, 0, 2.45, 0.62));
    moving = box(1.25, 0.18, 1.05, mat.brightOrange, 0, 1.75, 0.1);
    moving2 = box(0.28, 0.28, 1.5, mat.orange, 0.75, 2.3, 0.1);
    moving3 = box(1.1, 0.1, 0.7, mat.pale, 0, 2.95, 0.63);

    g.add(moving, moving2, moving3);
  }

  addTextSprite(label, x, yOffset + 4.95, 0.72, 54);
  addGlowLight(x, yOffset + 2.45, 0.8, 2.4, 5);

  return {
    g,
    type,
    moving,
    moving2,
    moving3,
    arm,
    startY: moving ? moving.position.y : 0,
    startZ: moving ? moving.position.z : 0
  };
}

const machines = [
  createMachine(-8.25, 0.95, "01 PRESS", "press"),
  createMachine(-2.75, 0.95, "02 SCAN", "scan"),
  createMachine(2.75, 0.95, "03 SORT", "sort"),
  createMachine(8.25, 0.95, "04 CRUSH", "crush"),

  createMachine(8.25, -2.85, "05 LASER", "laser"),
  createMachine(2.75, -2.85, "06 CHECK", "check"),
  createMachine(-2.75, -2.85, "07 STAMP", "stamp"),
  createMachine(-8.25, -2.85, "08 OUTPUT", "output")
];

// ROBOT ARMS
function createRobotArm(x, y, z, flip = 1) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  g.scale.x = flip;
  scene.add(g);

  const arm1 = box(0.24, 1.15, 0.24, mat.orange, 0.35, 0.9, 0);
  arm1.rotation.z = -0.55;

  const arm2 = box(0.2, 0.92, 0.2, mat.steel, 1.05, 1.8, 0);
  arm2.rotation.z = 0.45;

  g.add(
    cyl(0.32, 0.3, mat.darkSteel),
    cyl(0.16, 0.24, mat.orange, 0, 0.35, 0, Math.PI / 2),
    arm1,
    cyl(0.16, 0.24, mat.darkSteel, 0.72, 1.35, 0, Math.PI / 2),
    arm2,
    box(0.52, 0.1, 0.15, mat.brightOrange, 1.28, 2.18, 0)
  );

  return g;
}

const robots = [
  createRobotArm(-5.4, 1.95, 0.75),
  createRobotArm(5.4, 1.95, 0.75, -1),
  createRobotArm(5.4, -1.85, 0.75, -1),
  createRobotArm(-5.4, -1.85, 0.75)
];

// SPARKS
const sparkGeo = new THREE.BufferGeometry();
const sparkCount = 150;
const sparkPositions = new Float32Array(sparkCount * 3);
const sparkVel = [];

for (let i = 0; i < sparkCount; i++) {
  sparkPositions[i * 3] = -8.25;
  sparkPositions[i * 3 + 1] = 2.2;
  sparkPositions[i * 3 + 2] = 0.85;

  sparkVel.push({
    x: (Math.random() - 0.5) * 0.05,
    y: Math.random() * 0.06,
    z: (Math.random() - 0.5) * 0.04,
    life: Math.random()
  });
}

sparkGeo.setAttribute("position", new THREE.BufferAttribute(sparkPositions, 3));

const sparks = new THREE.Points(
  sparkGeo,
  new THREE.PointsMaterial({
    color: C.glow,
    size: 0.04,
    transparent: true,
    opacity: 0.9
  })
);

scene.add(sparks);

// DUST
const dustGeo = new THREE.BufferGeometry();
const dustCount = 360;
const dustPositions = new Float32Array(dustCount * 3);

for (let i = 0; i < dustCount; i++) {
  dustPositions[i * 3] = (Math.random() - 0.5) * 24;
  dustPositions[i * 3 + 1] = -1.9 + Math.random() * 8;
  dustPositions[i * 3 + 2] = -3 + Math.random() * 4.5;
}

dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));

const dust = new THREE.Points(
  dustGeo,
  new THREE.PointsMaterial({
    color: "#b07145",
    size: 0.016,
    transparent: true,
    opacity: 0.16
  })
);

scene.add(dust);

let time = 0;

function animate() {
  requestAnimationFrame(animate);
  time += 0.016;

  rollers.forEach((r) => {
    r.rotation.z -= 0.1;
  });

  bgGroup.children.forEach((child) => {
    if (child.userData.bgMove) {
      child.position.x += 0.012 + child.userData.speedOffset * 0.002;
      if (child.position.x > 12) child.position.x = -12;
    }
  });

  packages.forEach((p) => {
    if (p.userData.state === "upper") {
      p.position.x += p.userData.speed;

      if (p.position.x > 10.55) {
        p.userData.state = "falling";
        p.userData.fallSpeed = 0;
        p.position.x = 10.55;
      }
    }

    if (p.userData.state === "falling") {
      p.userData.fallSpeed += 0.006;
      p.position.y -= p.userData.fallSpeed;
      p.rotation.z += 0.045;

      if (p.position.y <= lowerBeltY + 0.67) {
        p.position.y = lowerBeltY + 0.67;
        p.position.x = 10.25;
        p.rotation.z = 0;
        p.userData.state = "lower";
      }
    }

    if (p.userData.state === "lower") {
      p.position.x -= p.userData.speed;

      if (p.position.x < -10.9) {
        p.position.x = -10.9;
        p.position.y = upperBeltY + 0.67;
        p.userData.state = "upper";
      }
    }

    p.rotation.y += 0.008;
  });

  machines.forEach((m, i) => {
    const d = i * 0.65;

    if (m.type === "press") {
      const hit = Math.pow(Math.abs(Math.sin(time * 2.3 + d)), 4);
      m.moving.position.y = m.startY - hit * 0.95;
      if (m.arm) m.arm.scale.y = 1 + hit * 0.52;
      if (m.moving2) m.moving2.scale.x = 1 + hit * 0.08;
    }

    if (m.type === "scan") {
      m.moving.position.y = 2.05 + Math.sin(time * 4 + d) * 0.55;
      m.moving2.position.x = -0.8 + Math.sin(time * 3 + d) * 1.6;
      m.moving3.material.emissiveIntensity = 0.3 + Math.abs(Math.sin(time * 5 + d)) * 0.5;
    }

    if (m.type === "sort") {
      m.moving.position.z = m.startZ + Math.sin(time * 2.8 + d) * 0.85;
      if (m.arm) m.arm.rotation.z = -0.35 + Math.sin(time * 2.8 + d) * 0.28;
      m.moving2.rotation.z += 0.035;
    }

    if (m.type === "crush") {
      const squeeze = Math.abs(Math.sin(time * 2.5 + d));
      m.moving.position.y = 3.0 - squeeze * 0.48;
      m.moving2.position.y = 1.95 + squeeze * 0.48;
      m.moving3.scale.setScalar(1 + squeeze * 0.15);
    }

    if (m.type === "laser") {
      m.moving.scale.y = 0.4 + Math.abs(Math.sin(time * 5.5 + d)) * 1.35;
      m.moving.rotation.y += 0.06;
      m.moving2.rotation.y += 0.018;
      m.moving3.scale.x = 1 + Math.sin(time * 5 + d) * 0.08;
    }

    if (m.type === "check") {
      m.moving.rotation.x += 0.035;
      m.moving.rotation.y += 0.045;
      m.moving.scale.setScalar(1 + Math.sin(time * 3 + d) * 0.08);
      m.moving2.scale.x = 1 + Math.sin(time * 4 + d) * 0.18;
    }

    if (m.type === "stamp") {
      const stamp = Math.pow(Math.abs(Math.sin(time * 2.7 + d)), 5);
      m.moving.position.y = m.startY - stamp * 0.75;
      if (m.arm) m.arm.scale.y = 1 + stamp * 0.44;
      m.moving2.scale.setScalar(1 + stamp * 0.16);
      m.moving3.scale.x = 1 + stamp * 0.1;
    }

    if (m.type === "output") {
      m.moving.rotation.x = Math.sin(time * 2 + d) * 0.25;
      m.moving2.position.z = Math.sin(time * 2.4 + d) * 0.85;
      m.moving3.position.x = Math.sin(time * 1.8 + d) * 0.35;
    }
  });

  robots.forEach((robot, i) => {
    robot.rotation.y = Math.sin(time * (1.1 + i * 0.05)) * 0.28;
    robot.rotation.z = Math.sin(time * (0.8 + i * 0.07)) * 0.03;
  });

  glowLights.forEach((l, i) => {
    l.intensity = 1.85 + Math.sin(time * 2.2 + i) * 0.45;
  });

  const pos = sparks.geometry.attributes.position.array;

  for (let i = 0; i < sparkCount; i++) {
    const v = sparkVel[i];

    pos[i * 3] += v.x;
    pos[i * 3 + 1] += v.y;
    pos[i * 3 + 2] += v.z;

    v.y -= 0.002;
    v.life -= 0.018;

    if (v.life <= 0) {
      const sources = [
        [-8.25, 2.2],
        [8.25, 2.2],
        [8.25, -1.65],
        [-2.75, -1.65]
      ];

      const s = sources[Math.floor(Math.random() * sources.length)];

      pos[i * 3] = s[0] + (Math.random() - 0.5) * 0.7;
      pos[i * 3 + 1] = s[1] + Math.random() * 0.4;
      pos[i * 3 + 2] = 0.82;

      v.x = (Math.random() - 0.5) * 0.055;
      v.y = Math.random() * 0.07;
      v.z = (Math.random() - 0.5) * 0.035;
      v.life = 0.5 + Math.random() * 0.7;
    }
  }

  sparks.geometry.attributes.position.needsUpdate = true;

  dust.rotation.y += 0.00045;

  camera.position.x = Math.sin(time * 0.16) * 0.08;
  camera.position.y = 1.85 + Math.sin(time * 0.13) * 0.025;
  camera.position.z = 18.5;
  camera.lookAt(0, 0.8, 0);

  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});