import * as THREE from "three";

const scene = new THREE.Scene();
scene.background = new THREE.Color("#151310");
scene.fog = new THREE.Fog("#151310", 18, 38);

const camera = new THREE.PerspectiveCamera(28, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 1.35, 19.5);
camera.lookAt(0, 0.9, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.5));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.45;
document.body.appendChild(renderer.domElement);

const C = {
  wall: "#29241f",
  floor: "#201b17",
  dark: "#080706",
  steel: "#4c4942",
  steel2: "#746f63",
  brass: "#b47a3c",
  copper: "#b85c28",
  orange: "#f28a3a",
  glow: "#ff9a45",
  cream: "#d6c39c"
};

const mat = {
  wall: new THREE.MeshStandardMaterial({ color: C.wall, roughness: 0.86, metalness: 0.08 }),
  floor: new THREE.MeshStandardMaterial({ color: C.floor, roughness: 0.8, metalness: 0.16 }),
  dark: new THREE.MeshStandardMaterial({ color: C.dark, roughness: 0.52, metalness: 0.48 }),
  steel: new THREE.MeshStandardMaterial({ color: C.steel, roughness: 0.42, metalness: 0.48 }),
  steel2: new THREE.MeshStandardMaterial({ color: C.steel2, roughness: 0.38, metalness: 0.42 }),
  brass: new THREE.MeshStandardMaterial({ color: C.brass, roughness: 0.32, metalness: 0.52 }),
  copper: new THREE.MeshStandardMaterial({ color: C.copper, roughness: 0.34, metalness: 0.42 }),
  orange: new THREE.MeshStandardMaterial({ color: C.orange, roughness: 0.3, metalness: 0.25 }),
  cream: new THREE.MeshStandardMaterial({
    color: C.cream,
    emissive: "#8d6a31",
    emissiveIntensity: 0.18,
    roughness: 0.3,
    metalness: 0.08
  }),
  glow: new THREE.MeshBasicMaterial({ color: C.glow }),
  glass: new THREE.MeshStandardMaterial({
    color: C.orange,
    emissive: C.glow,
    emissiveIntensity: 1.25,
    roughness: 0.1,
    metalness: 0.05,
    transparent: true,
    opacity: 0.62
  }),
  bg: new THREE.MeshStandardMaterial({
    color: "#15110e",
    roughness: 0.9,
    metalness: 0.12
  })
};

function box(w, h, d, material, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

function cyl(r, h, material, x = 0, y = 0, z = 0, rotX = 0, rotZ = 0) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 32), material);
  m.position.set(x, y, z);
  m.rotation.x = rotX;
  m.rotation.z = rotZ;
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

function label(text, x, y, z) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 160;

  const ctx = canvas.getContext("2d");
  ctx.font = "bold 52px Arial";
  ctx.fillStyle = "#f0a45b";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 256, 80);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;

  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true }));
  sprite.position.set(x, y, z);
  sprite.scale.set(1.75, 0.55, 1);
  scene.add(sprite);
}

// lights
scene.add(new THREE.AmbientLight("#ffffff", 0.36));

const key = new THREE.DirectionalLight("#ffe0bd", 3.4);
key.position.set(0, 7, 9);
key.castShadow = true;
key.shadow.mapSize.width = 2048;
key.shadow.mapSize.height = 2048;
key.shadow.camera.left = -14;
key.shadow.camera.right = 14;
key.shadow.camera.top = 8;
key.shadow.camera.bottom = -8;
scene.add(key);

const glowLights = [];

function addGlow(x, y, z, power = 2.5, dist = 6) {
  const l = new THREE.PointLight(C.glow, power, dist);
  l.position.set(x, y, z);
  scene.add(l);
  glowLights.push(l);
}

// room
scene.add(box(26, 0.32, 7, mat.floor, 0, -1.95, 0));
scene.add(box(26, 7.8, 0.3, mat.wall, 0, 1.9, -3.6));
scene.add(box(26, 0.28, 7, mat.dark, 0, 5.85, 0));

for (let i = 0; i < 14; i++) {
  scene.add(box(0.045, 7.5, 0.08, mat.dark, -12.4 + i * 1.9, 1.9, -3.4));
}

for (let i = 0; i < 8; i++) {
  scene.add(cyl(0.035, 25, mat.dark, 0, 5.1 - i * 0.32, -3.25, 0, Math.PI / 2));
}

for (let i = 0; i < 6; i++) {
  const x = -9.5 + i * 3.8;
  scene.add(box(1.35, 0.08, 0.08, mat.glow, x, 5.35, -2.55));
  addGlow(x, 4.9, -2.25, 1.4, 5);
}

// background factory depth
const bg = new THREE.Group();
bg.position.set(0, -0.1, -2.35);
scene.add(bg);

for (let i = 0; i < 10; i++) {
  const x = -11.8 + i * 2.6;

  bg.add(box(1.35, 1.75, 0.45, mat.bg, x, 1.35 + (i % 2) * 0.5, -0.6));
  bg.add(box(0.85, 0.06, 0.06, mat.glow, x, 2.25 + (i % 2) * 0.5, -0.25));

  const pipe = cyl(0.028, 2.2, mat.dark, x + 0.7, 2.2, -0.45);
  bg.add(pipe);
}

for (let y of [3.05, 1.0, -0.55]) {
  bg.add(box(25, 0.12, 0.35, mat.dark, 0, y, -0.72));
}

for (let i = 0; i < 18; i++) {
  bg.add(box(0.07, 0.05, 0.32, mat.copper, -12 + i * 1.4, 1.1, -0.45));
}

// conveyor
const beltY = -0.92;
const rollers = [];

scene.add(box(24.5, 0.38, 1.18, mat.dark, 0, beltY, 0));
scene.add(box(24.2, 0.08, 1.05, mat.steel, 0, beltY + 0.28, 0));

for (let i = 0; i < 32; i++) {
  const r = cyl(0.115, 1.25, mat.steel2, -11.8 + i * 0.76, beltY + 0.33, 0, Math.PI / 2);
  rollers.push(r);
  scene.add(r);
}

// packages
const packages = [];

for (let i = 0; i < 10; i++) {
  const p = new THREE.Group();
  p.add(box(0.55, 0.42, 0.55, mat.copper));
  p.add(box(0.4, 0.05, 0.4, mat.orange, 0, 0.24, 0));
  p.add(box(0.04, 0.3, 0.57, mat.dark, 0.18, 0.02, 0));

  p.position.set(-11.5 + i * 2.35, beltY + 0.73, 0);
  p.userData.speed = 0.026 + Math.random() * 0.004;

  packages.push(p);
  scene.add(p);
}

// machine details
function bolts(g, y = -0.45) {
  for (let i = 0; i < 6; i++) {
    g.add(cyl(0.045, 0.04, mat.orange, -0.75 + i * 0.3, y, 0.72, Math.PI / 2));
  }
}

function vents(g, x = 0, y = 2.7) {
  for (let i = 0; i < 5; i++) {
    g.add(box(0.95, 0.035, 0.05, mat.dark, x, y - i * 0.14, 0.67));
  }
}

function pipes(g) {
  g.add(cyl(0.045, 2.2, mat.brass, -1.15, 2.6, -0.35));
  g.add(cyl(0.045, 2.2, mat.brass, 1.15, 2.6, -0.35));
  g.add(cyl(0.04, 1.4, mat.copper, 0, 3.8, -0.32, 0, Math.PI / 2));
}

function machineShell(g, variant) {
  const width = variant === "wide" ? 2.9 : variant === "thin" ? 2.25 : 2.65;
  const height = variant === "tall" ? 4.45 : 4.1;

  g.add(box(width, height, 1.45, mat.steel, 0, 1.25, -0.18));
  g.add(box(width + 0.25, 0.48, 1.65, mat.dark, 0, 3.55, -0.18));
  g.add(box(width + 0.1, 0.45, 1.6, mat.dark, 0, -0.75, -0.18));

  g.add(box(0.16, 3.5, 1.55, mat.dark, -width / 2, 1.25, -0.12));
  g.add(box(0.16, 3.5, 1.55, mat.dark, width / 2, 1.25, -0.12));

  g.add(box(1.45, 1.18, 0.08, mat.cream, 0, 1.35, 0.62));
  g.add(box(1.25, 0.08, 0.06, mat.glow, 0, 2.35, 0.66));

  pipes(g);
  vents(g);
  bolts(g);
}

function createMachine(x, name, type) {
  const g = new THREE.Group();
  g.position.set(x, 0, 0);
  scene.add(g);

  const parts = {};

  if (type === "forge") {
    machineShell(g, "tall");
    parts.pressRod = box(0.28, 1.05, 0.28, mat.dark, 0, 2.85, 0.12);
    parts.pressHead = box(1.28, 0.28, 1.0, mat.orange, 0, 2.18, 0.12);
    parts.steam = cyl(0.18, 0.8, mat.glass, -0.78, 1.3, 0.25, Math.PI / 2);
    parts.gear = cyl(0.34, 0.1, mat.brass, 0.92, 2.8, 0.5, Math.PI / 2);
    g.add(parts.pressRod, parts.pressHead, parts.steam, parts.gear);
  }

  if (type === "scanner") {
    machineShell(g, "wide");
    parts.scanBar = box(1.65, 0.08, 1.15, mat.glow, 0, 0.92, 0.12);
    parts.scanWall = box(0.08, 1.25, 1.15, mat.glow, -0.78, 1.38, 0.12);
    parts.ring = cyl(0.42, 0.07, mat.brass, 0.85, 2.85, 0.52, Math.PI / 2);
    parts.lens = cyl(0.22, 0.08, mat.glass, -0.9, 2.75, 0.55, Math.PI / 2);
    g.add(parts.scanBar, parts.scanWall, parts.ring, parts.lens);
  }

  if (type === "assembler") {
    machineShell(g, "thin");
    parts.armBase = cyl(0.3, 0.32, mat.dark, -0.55, 0.65, 0.35);
    parts.armA = box(0.24, 1.05, 0.24, mat.copper, -0.25, 1.12, 0.35);
    parts.armA.rotation.z = -0.45;
    parts.armB = box(0.2, 0.88, 0.2, mat.steel2, 0.25, 1.65, 0.35);
    parts.armB.rotation.z = 0.45;
    parts.claw = box(0.58, 0.1, 0.16, mat.orange, 0.55, 1.98, 0.35);
    parts.piston = cyl(0.05, 1.1, mat.brass, 0.75, 1.65, 0.42, 0, 0.35);
    g.add(parts.armBase, parts.armA, parts.armB, parts.claw, parts.piston);
  }

  if (type === "output") {
    machineShell(g, "wide");
    parts.door = box(1.28, 0.18, 1.0, mat.orange, 0, 0.82, 0.12);
    parts.ejector = box(0.32, 0.32, 1.35, mat.copper, 0.72, 1.34, 0.1);
    parts.gauge = cyl(0.28, 0.08, mat.brass, -0.85, 2.85, 0.52, Math.PI / 2);
    parts.needle = box(0.04, 0.32, 0.04, mat.orange, -0.85, 2.85, 0.6);
    g.add(parts.door, parts.ejector, parts.gauge, parts.needle);
  }

  label(name, x, 4.08, 0.75);
  addGlow(x, 1.45, 0.8, 2.8, 6);

  return { g, type, parts };
}

const machines = [
  createMachine(-8.7, "01 FORGE", "forge"),
  createMachine(-2.9, "02 SCAN", "scanner"),
  createMachine(2.9, "03 ASSEMBLE", "assembler"),
  createMachine(8.7, "04 OUTPUT", "output")
];

// sparks
const sparkGeo = new THREE.BufferGeometry();
const sparkCount = 150;
const sparkPositions = new Float32Array(sparkCount * 3);
const sparkVel = [];

for (let i = 0; i < sparkCount; i++) {
  sparkPositions[i * 3] = -8.7;
  sparkPositions[i * 3 + 1] = 1.2;
  sparkPositions[i * 3 + 2] = 0.85;

  sparkVel.push({
    x: (Math.random() - 0.5) * 0.045,
    y: Math.random() * 0.055,
    z: (Math.random() - 0.5) * 0.035,
    life: Math.random()
  });
}

sparkGeo.setAttribute("position", new THREE.BufferAttribute(sparkPositions, 3));

const sparks = new THREE.Points(
  sparkGeo,
  new THREE.PointsMaterial({
    color: C.glow,
    size: 0.035,
    transparent: true,
    opacity: 0.85
  })
);

scene.add(sparks);

let time = 0;

function animate() {
  requestAnimationFrame(animate);
  time += 0.016;

  rollers.forEach((r) => {
    r.rotation.z -= 0.095;
  });

  packages.forEach((p) => {
    p.position.x += p.userData.speed;
    if (p.position.x > 11.7) p.position.x = -11.7;
    p.rotation.y += 0.005;
  });

  machines.forEach((m, i) => {
    const d = i * 0.7;

    if (m.type === "forge") {
      const hit = Math.pow(Math.abs(Math.sin(time * 2 + d)), 4);
      m.parts.pressHead.position.y = 2.18 - hit * 0.62;
      m.parts.pressRod.scale.y = 1 + hit * 0.28;
      m.parts.gear.rotation.z += 0.04;
      m.parts.steam.scale.x = 1 + Math.sin(time * 4) * 0.08;
    }

    if (m.type === "scanner") {
      m.parts.scanBar.position.y = 0.92 + Math.sin(time * 3 + d) * 0.45;
      m.parts.scanWall.position.x = -0.78 + Math.sin(time * 2.5 + d) * 1.35;
      m.parts.ring.rotation.z += 0.045;
      m.parts.lens.rotation.z -= 0.03;
    }

    if (m.type === "assembler") {
      const s = Math.sin(time * 1.55 + d);
      m.parts.armA.rotation.z = -0.45 + s * 0.22;
      m.parts.armB.rotation.z = 0.45 - s * 0.28;
      m.parts.claw.position.x = 0.55 + s * 0.22;
      m.parts.claw.position.y = 1.98 + Math.sin(time * 2.2 + d) * 0.08;
      m.parts.piston.scale.y = 1 + s * 0.08;
    }

    if (m.type === "output") {
      m.parts.door.rotation.x = Math.sin(time * 1.6 + d) * 0.16;
      m.parts.ejector.position.z = Math.sin(time * 2 + d) * 0.42;
      m.parts.needle.rotation.z = Math.sin(time * 2.3 + d) * 0.7;
    }
  });

  bg.children.forEach((child, i) => {
    if (child.geometry && i % 5 === 0) {
      child.position.x += 0.004;
      if (child.position.x > 12.5) child.position.x = -12.5;
    }
  });

  glowLights.forEach((l, i) => {
    l.intensity = 2 + Math.sin(time * 2 + i) * 0.35;
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
        [-8.7, 1.2],
        [2.9, 1.35],
        [8.7, 1.2]
      ];

      const s = sources[Math.floor(Math.random() * sources.length)];

      pos[i * 3] = s[0] + (Math.random() - 0.5) * 0.65;
      pos[i * 3 + 1] = s[1] + Math.random() * 0.35;
      pos[i * 3 + 2] = 0.82;

      v.x = (Math.random() - 0.5) * 0.05;
      v.y = Math.random() * 0.06;
      v.z = (Math.random() - 0.5) * 0.035;
      v.life = 0.5 + Math.random() * 0.8;
    }
  }

  sparks.geometry.attributes.position.needsUpdate = true;

  camera.position.x = Math.sin(time * 0.12) * 0.05;
  camera.position.y = 1.35 + Math.sin(time * 0.1) * 0.02;
  camera.position.z = 19.5;
  camera.lookAt(0, 0.9, 0);

  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});