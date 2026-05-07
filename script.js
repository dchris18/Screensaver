import * as THREE from "three";

const scene = new THREE.Scene();
scene.background = new THREE.Color("#161513");
scene.fog = new THREE.Fog("#161513", 18, 34);

const camera = new THREE.PerspectiveCamera(
  24,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

camera.position.set(0, 1.25, 15.8);
camera.lookAt(0, 0.9, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.5));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.38;
document.body.appendChild(renderer.domElement);

const C = {
  bg: "#161513",
  wall: "#2c2b28",
  floor: "#24221f",
  dark: "#0b0b0a",
  steel: "#474641",
  steel2: "#6a675e",
  whitePanel: "#d4c4a3",
  orange: "#c75f24",
  orange2: "#ff8a3d",
  glow: "#ff9a45"
};

const mat = {
  wall: new THREE.MeshStandardMaterial({ color: C.wall, roughness: 0.82, metalness: 0.1 }),
  floor: new THREE.MeshStandardMaterial({ color: C.floor, roughness: 0.78, metalness: 0.18 }),
  dark: new THREE.MeshStandardMaterial({ color: C.dark, roughness: 0.5, metalness: 0.5 }),
  steel: new THREE.MeshStandardMaterial({ color: C.steel, roughness: 0.42, metalness: 0.45 }),
  steel2: new THREE.MeshStandardMaterial({ color: C.steel2, roughness: 0.35, metalness: 0.4 }),
  orange: new THREE.MeshStandardMaterial({ color: C.orange, roughness: 0.36, metalness: 0.25 }),
  orange2: new THREE.MeshStandardMaterial({ color: C.orange2, roughness: 0.3, metalness: 0.22 }),
  panel: new THREE.MeshStandardMaterial({
    color: C.whitePanel,
    emissive: "#8a6a38",
    emissiveIntensity: 0.16,
    roughness: 0.28,
    metalness: 0.08
  }),
  glow: new THREE.MeshBasicMaterial({ color: C.glow })
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

function addLabel(text, x, y, z) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 160;

  const ctx = canvas.getContext("2d");
  ctx.font = "bold 54px Arial";
  ctx.fillStyle = "#f0a45b";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 256, 80);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;

  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: tex, transparent: true })
  );

  sprite.position.set(x, y, z);
  sprite.scale.set(1.8, 0.55, 1);
  scene.add(sprite);
}

// lighting
scene.add(new THREE.AmbientLight("#ffffff", 0.34));

const key = new THREE.DirectionalLight("#ffd8b0", 3.6);
key.position.set(0, 7, 8);
key.castShadow = true;
key.shadow.mapSize.width = 2048;
key.shadow.mapSize.height = 2048;
key.shadow.camera.left = -13;
key.shadow.camera.right = 13;
key.shadow.camera.top = 8;
key.shadow.camera.bottom = -7;
scene.add(key);

const backGlow = new THREE.PointLight(C.glow, 4, 18);
backGlow.position.set(0, 4.5, -2);
scene.add(backGlow);

const glowLights = [];

function glowLight(x, y, z, power = 2.5) {
  const l = new THREE.PointLight(C.glow, power, 6);
  l.position.set(x, y, z);
  scene.add(l);
  glowLights.push(l);
  return l;
}

// room
scene.add(box(24, 0.32, 7, mat.floor, 0, -1.95, 0));
scene.add(box(24, 7.8, 0.3, mat.wall, 0, 1.9, -3.55));
scene.add(box(24, 0.28, 7, mat.dark, 0, 5.85, 0));

for (let i = 0; i < 13; i++) {
  scene.add(box(0.04, 7.5, 0.08, mat.dark, -11.5 + i * 1.9, 1.9, -3.38));
}

for (let i = 0; i < 7; i++) {
  scene.add(cyl(0.035, 23, mat.dark, 0, 4.9 - i * 0.32, -3.25, 0, Math.PI / 2));
}

for (let i = 0; i < 6; i++) {
  const x = -9 + i * 3.6;
  scene.add(box(1.4, 0.08, 0.08, mat.glow, x, 5.3, -2.55));
  glowLight(x, 4.9, -2.2, 1.7);
}

// distant factory silhouettes
const bg = new THREE.Group();
bg.position.set(0, 0, -2.1);
scene.add(bg);

for (let i = 0; i < 9; i++) {
  const x = -11 + i * 2.7;
  bg.add(box(1.5, 1.8, 0.45, mat.dark, x, 1.5 + (i % 2) * 0.6, -0.6));
  bg.add(box(0.95, 0.06, 0.06, mat.glow, x, 2.45 + (i % 2) * 0.6, -0.25));
}

for (let y of [2.9, 0.65, -0.8]) {
  bg.add(box(24, 0.12, 0.35, mat.dark, 0, y, -0.75));
}

// conveyor
const beltY = -0.9;
const rollers = [];

scene.add(box(23, 0.36, 1.18, mat.dark, 0, beltY, 0));
scene.add(box(22.8, 0.08, 1.06, mat.steel, 0, beltY + 0.27, 0));

for (let i = 0; i < 30; i++) {
  const r = cyl(0.115, 1.25, mat.steel2, -11.2 + i * 0.77, beltY + 0.32, 0, Math.PI / 2);
  rollers.push(r);
  scene.add(r);
}

for (let i = 0; i < 11; i++) {
  const x = -10.8 + i * 2.1;
  scene.add(box(0.14, 1.25, 0.14, mat.dark, x, beltY - 0.55, -0.45));
  scene.add(box(0.14, 1.25, 0.14, mat.dark, x, beltY - 0.55, 0.45));
}

// packages
const packages = [];

for (let i = 0; i < 9; i++) {
  const p = new THREE.Group();
  p.add(box(0.55, 0.42, 0.55, mat.orange));
  p.add(box(0.42, 0.05, 0.42, mat.orange2, 0, 0.24, 0));
  p.add(box(0.04, 0.3, 0.57, mat.dark, 0.18, 0.02, 0));

  p.position.set(-11 + i * 2.3, beltY + 0.72, 0);
  p.userData.speed = 0.027 + Math.random() * 0.006;

  packages.push(p);
  scene.add(p);
}

// machines
function createFrameMachine(x, label, type) {
  const g = new THREE.Group();
  g.position.set(x, 0, 0);
  scene.add(g);

  g.add(box(2.55, 3.95, 1.45, mat.steel, 0, 1.3, -0.18));
  g.add(box(2.85, 0.5, 1.65, mat.dark, 0, 3.55, -0.18));
  g.add(box(2.7, 0.45, 1.6, mat.dark, 0, -0.75, -0.18));

  g.add(box(0.18, 3.5, 1.55, mat.dark, -1.35, 1.25, -0.12));
  g.add(box(0.18, 3.5, 1.55, mat.dark, 1.35, 1.25, -0.12));

  g.add(box(1.45, 1.25, 0.08, mat.panel, 0, 1.4, 0.62));
  g.add(box(1.25, 0.08, 0.06, mat.glow, 0, 2.35, 0.66));

  glowLight(x, 1.45, 0.8, 2.8);
  addLabel(label, x, 3.98, 0.75);

  const parts = {};

  if (type === "press") {
    parts.rod = box(0.28, 1.1, 0.28, mat.dark, 0, 2.75, 0.12);
    parts.head = box(1.25, 0.28, 1.0, mat.orange2, 0, 2.12, 0.12);
    parts.pad = box(1.0, 0.1, 0.85, mat.panel, 0, 0.65, 0.12);
    g.add(parts.rod, parts.head, parts.pad);
  }

  if (type === "scan") {
    parts.scanA = box(1.55, 0.08, 1.15, mat.glow, 0, 0.95, 0.1);
    parts.scanB = box(0.08, 1.25, 1.15, mat.glow, -0.7, 1.4, 0.1);
    parts.panel = box(1.2, 0.08, 0.05, mat.orange2, 0, 2.8, 0.65);
    g.add(parts.scanA, parts.scanB, parts.panel);
  }

  if (type === "assemble") {
    parts.armBase = cyl(0.28, 0.35, mat.dark, -0.6, 0.7, 0.35);
    parts.arm1 = box(0.25, 1.0, 0.25, mat.orange, -0.35, 1.15, 0.35);
    parts.arm1.rotation.z = -0.5;
    parts.arm2 = box(0.2, 0.9, 0.2, mat.steel2, 0.2, 1.65, 0.35);
    parts.arm2.rotation.z = 0.5;
    parts.claw = box(0.55, 0.1, 0.15, mat.orange2, 0.45, 2.0, 0.35);
    g.add(parts.armBase, parts.arm1, parts.arm2, parts.claw);
  }

  if (type === "output") {
    parts.door = box(1.28, 0.2, 1.0, mat.orange2, 0, 0.85, 0.12);
    parts.ejector = box(0.35, 0.35, 1.45, mat.orange, 0.75, 1.35, 0.1);
    parts.light = box(1.05, 0.08, 0.08, mat.panel, 0, 2.75, 0.65);
    g.add(parts.door, parts.ejector, parts.light);
  }

  return { g, type, parts };
}

const machines = [
  createFrameMachine(-7.8, "01 PRESS", "press"),
  createFrameMachine(-2.6, "02 SCAN", "scan"),
  createFrameMachine(2.6, "03 BUILD", "assemble"),
  createFrameMachine(7.8, "04 OUTPUT", "output")
];

// sparks
const sparkGeo = new THREE.BufferGeometry();
const sparkCount = 130;
const sparkPositions = new Float32Array(sparkCount * 3);
const sparkVel = [];

for (let i = 0; i < sparkCount; i++) {
  sparkPositions[i * 3] = -7.8;
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
    r.rotation.z -= 0.1;
  });

  packages.forEach((p) => {
    p.position.x += p.userData.speed;

    if (p.position.x > 11.3) {
      p.position.x = -11.3;
    }

    p.rotation.y += 0.006;
  });

  machines.forEach((m, i) => {
    const d = i * 0.8;

    if (m.type === "press") {
      const hit = Math.pow(Math.abs(Math.sin(time * 2.1 + d)), 4);
      m.parts.head.position.y = 2.12 - hit * 0.75;
      m.parts.rod.scale.y = 1 + hit * 0.35;
      m.parts.pad.scale.x = 1 + hit * 0.06;
    }

    if (m.type === "scan") {
      m.parts.scanA.position.y = 0.95 + Math.sin(time * 3.2 + d) * 0.55;
      m.parts.scanB.position.x = -0.7 + Math.sin(time * 2.6 + d) * 1.4;
      m.parts.panel.scale.x = 1 + Math.sin(time * 4 + d) * 0.08;
    }

    if (m.type === "assemble") {
      const swing = Math.sin(time * 1.6 + d);
      m.parts.arm1.rotation.z = -0.5 + swing * 0.25;
      m.parts.arm2.rotation.z = 0.5 - swing * 0.35;
      m.parts.claw.position.x = 0.45 + swing * 0.28;
      m.parts.claw.position.y = 2.0 + Math.sin(time * 2.4 + d) * 0.12;
    }

    if (m.type === "output") {
      m.parts.door.rotation.x = Math.sin(time * 1.7 + d) * 0.22;
      m.parts.ejector.position.z = Math.sin(time * 2.1 + d) * 0.55;
      m.parts.light.scale.x = 1 + Math.sin(time * 3 + d) * 0.12;
    }
  });

  glowLights.forEach((l, i) => {
    l.intensity = 2.1 + Math.sin(time * 2 + i) * 0.4;
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
        [-7.8, 1.25],
        [2.6, 1.3],
        [7.8, 1.2]
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

  camera.position.x = Math.sin(time * 0.13) * 0.06;
  camera.position.y = 1.25 + Math.sin(time * 0.11) * 0.025;
  camera.position.z = 15.8;
  camera.lookAt(0, 0.9, 0);

  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});