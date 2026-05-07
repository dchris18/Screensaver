import * as THREE from "three";

const scene = new THREE.Scene();
scene.background = new THREE.Color("#141414");
scene.fog = new THREE.Fog("#141414", 18, 36);

const camera = new THREE.PerspectiveCamera(
  30,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

camera.position.set(0, 2.2, 24);
camera.lookAt(0, 1.1, 0);

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
  bg: "#141414",
  wall: "#2a2723",
  floor: "#24211e",
  steel: "#3c3a36",
  darkSteel: "#171615",
  black: "#0d0d0d",
  orange: "#c46124",
  orange2: "#f48637",
  glow: "#ff8a3d"
};

const mat = {
  wall: new THREE.MeshStandardMaterial({ color: C.wall, roughness: 0.88, metalness: 0.08 }),
  floor: new THREE.MeshStandardMaterial({ color: C.floor, roughness: 0.75, metalness: 0.18 }),
  steel: new THREE.MeshStandardMaterial({ color: C.steel, roughness: 0.45, metalness: 0.45 }),
  darkSteel: new THREE.MeshStandardMaterial({ color: C.darkSteel, roughness: 0.55, metalness: 0.55 }),
  black: new THREE.MeshStandardMaterial({ color: C.black, roughness: 0.45, metalness: 0.35 }),
  orange: new THREE.MeshStandardMaterial({ color: C.orange, roughness: 0.4, metalness: 0.28 }),
  brightOrange: new THREE.MeshStandardMaterial({ color: C.orange2, roughness: 0.35, metalness: 0.22 }),
  glow: new THREE.MeshBasicMaterial({ color: C.glow }),
  glass: new THREE.MeshStandardMaterial({
    color: "#ff9348",
    emissive: C.glow,
    emissiveIntensity: 1.4,
    roughness: 0.15,
    metalness: 0.05,
    transparent: true,
    opacity: 0.72
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
  ctx.fillStyle = "#d87935";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 256, 90);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;

  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true }));
  sprite.position.set(x, y, z);
  sprite.scale.set(1.9, 0.65, 1);
  scene.add(sprite);
  return sprite;
}

// LIGHTS
scene.add(new THREE.AmbientLight("#ffffff", 0.22));

const key = new THREE.DirectionalLight("#ffd0a3", 2.8);
key.position.set(0, 8, 10);
key.castShadow = true;
key.shadow.mapSize.width = 2048;
key.shadow.mapSize.height = 2048;
key.shadow.camera.left = -13;
key.shadow.camera.right = 13;
key.shadow.camera.top = 9;
key.shadow.camera.bottom = -8;
scene.add(key);

const fill = new THREE.DirectionalLight("#777777", 0.8);
fill.position.set(-8, 5, 10);
scene.add(fill);

const glowLights = [];

function addGlowLight(x, y, z, intensity = 2.4, distance = 6) {
  const light = new THREE.PointLight(C.glow, intensity, distance);
  light.position.set(x, y, z);
  scene.add(light);
  glowLights.push(light);
  return light;
}

// ROOM
scene.add(box(23, 0.28, 7, mat.floor, 0, -2.05, 0));
scene.add(box(23, 8.5, 0.3, mat.wall, 0, 2.2, -3.7));
scene.add(box(23, 0.3, 7, mat.darkSteel, 0, 6.5, 0));

for (let i = 0; i < 12; i++) {
  scene.add(box(1.8, 8, 0.05, mat.wall, -11 + i * 2, 2.25, -3.52));
  scene.add(box(0.045, 8, 0.08, mat.darkSteel, -10 + i * 2, 2.25, -3.46));
}

for (let i = 0; i < 7; i++) {
  scene.add(cyl(0.045, 22, mat.darkSteel, 0, 5.35 - i * 0.35, -3.35, 0, Math.PI / 2));
}

for (let i = 0; i < 9; i++) {
  scene.add(cyl(0.055, 7.8, mat.darkSteel, -10 + i * 2.5, 2.25, -3.25));
}

for (let i = 0; i < 6; i++) {
  const x = -8 + i * 3.2;
  scene.add(box(1.25, 0.08, 0.08, mat.glow, x, 6.05, -2.6));
  addGlowLight(x, 5.65, -2.2, 1.3, 5);
}

// CONVEYORS
const rollers = [];

function createConveyor(y, z, length = 19) {
  scene.add(box(length, 0.35, 1.2, mat.darkSteel, 0, y, z));
  scene.add(box(length - 0.2, 0.08, 1.08, mat.black, 0, y + 0.27, z));

  for (let i = 0; i < 23; i++) {
    const r = cyl(0.13, 1.32, mat.steel, -9 + i * 0.82, y + 0.31, z, Math.PI / 2);
    rollers.push(r);
    scene.add(r);
  }

  for (let i = 0; i < 16; i++) {
    scene.add(box(0.06, 0.05, 1.15, mat.orange, -8.7 + i * 1.15, y + 0.38, z));
  }

  for (let i = 0; i < 8; i++) {
    const x = -8.5 + i * 2.4;
    scene.add(box(0.18, 0.85, 0.18, mat.darkSteel, x, y - 0.45, z - 0.48));
    scene.add(box(0.18, 0.85, 0.18, mat.darkSteel, x, y - 0.45, z + 0.48));
  }
}

const upperBeltY = 1.65;
const lowerBeltY = -2.15;

createConveyor(upperBeltY, 0);
createConveyor(lowerBeltY, 0);

// drop chute after upper crush
scene.add(box(0.35, 2.1, 0.85, mat.darkSteel, 9.5, -0.05, 0));
scene.add(box(1.1, 0.08, 0.95, mat.glow, 9.5, -0.95, 0.02));
addGlowLight(9.3, -0.45, 0.6, 2.3, 5);

// PACKAGES
const packages = [];

for (let i = 0; i < 9; i++) {
  const g = new THREE.Group();

  g.add(box(0.55, 0.42, 0.55, mat.orange));
  g.add(box(0.42, 0.04, 0.42, mat.brightOrange, 0, 0.23, 0));

  g.position.set(-9 + i * 2.2, upperBeltY + 0.67, 0);
  g.userData = {
    state: "upper",
    speed: 0.022 + Math.random() * 0.008,
    fallSpeed: 0
  };

  packages.push(g);
  scene.add(g);
}

function addWarningStripes(group, y = -0.1) {
  for (let i = 0; i < 5; i++) {
    const stripe = box(0.12, 0.05, 1.55, mat.brightOrange, -0.55 + i * 0.28, y, 0);
    stripe.rotation.z = -0.6;
    group.add(stripe);
  }
}

function createMachine(x, yOffset, label, type) {
  const g = new THREE.Group();
  g.position.set(x, yOffset, 0);
  scene.add(g);

  g.add(box(2.25, 3.2, 1.45, mat.steel, 0, 2.55, -0.2));
  g.add(box(2.45, 0.45, 1.65, mat.darkSteel, 0, 4.35, -0.2));
  g.add(box(2.35, 0.45, 1.65, mat.darkSteel, 0, 0.95, -0.2));
  g.add(box(2.25, 0.18, 1.55, mat.orange, 0, 4.08, -0.18));

  g.add(box(1.32, 1.35, 0.05, mat.black, 0, 2.28, 0.54));
  g.add(box(1.02, 0.92, 0.04, mat.glass, 0, 2.24, 0.58));
  g.add(box(1.25, 0.08, 0.05, mat.glow, 0, 3.22, 0.62));

  g.add(box(0.18, 2.3, 1.55, mat.darkSteel, -1.18, 2.5, -0.2));
  g.add(box(0.18, 2.3, 1.55, mat.darkSteel, 1.18, 2.5, -0.2));

  addWarningStripes(g, 1.22);
  addTextSprite(label, x, yOffset + 4.78, 0.7, 54);
  addGlowLight(x, yOffset + 2.4, 0.8, 2.2, 5);

  let moving = null;
  let arm = null;

  if (type === "press") {
    arm = box(0.32, 1.2, 0.32, mat.darkSteel, 0, 3.3, 0.1);
    moving = box(1.25, 0.25, 1.1, mat.brightOrange, 0, 2.65, 0.1);
    g.add(arm, moving);
  }

  if (type === "scan") {
    moving = box(1.45, 0.1, 1.2, mat.glow, 0, 2.75, 0.15);
    g.add(moving);
  }

  if (type === "side") {
    arm = box(0.24, 1.25, 0.24, mat.darkSteel, 0, 3.2, 0.1);
    moving = box(0.45, 0.45, 1.7, mat.brightOrange, 0, 2.2, 0.1);
    g.add(arm, moving);
  }

  if (type === "laser") {
    moving = box(0.12, 1.35, 0.12, mat.glow, 0, 2.45, 0.2);
    g.add(moving);
  }

  return {
    g,
    type,
    moving,
    arm,
    startY: moving ? moving.position.y : 0,
    startZ: moving ? moving.position.z : 0
  };
}

const machines = [
  createMachine(-7.1, 1.0, "01 PRESS", "press"),
  createMachine(-2.35, 1.0, "02 SCAN", "scan"),
  createMachine(2.35, 1.0, "03 SORT", "side"),
  createMachine(7.1, 1.0, "04 CRUSH", "press"),

  createMachine(7.1, -2.8, "05 LASER", "laser"),
  createMachine(2.35, -2.8, "06 CHECK", "scan"),
  createMachine(-2.35, -2.8, "07 STAMP", "press"),
  createMachine(-7.1, -2.8, "08 OUTPUT", "side")
];

// ROBOT ARMS
function createRobotArm(x, y, z, flip = 1) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  g.scale.x = flip;
  scene.add(g);

  const arm1 = box(0.26, 1.25, 0.26, mat.orange, 0.35, 0.9, 0);
  arm1.rotation.z = -0.55;

  const arm2 = box(0.22, 1.0, 0.22, mat.steel, 1.05, 1.85, 0);
  arm2.rotation.z = 0.45;

  g.add(
    cyl(0.34, 0.32, mat.darkSteel),
    cyl(0.18, 0.25, mat.orange, 0, 0.35, 0, Math.PI / 2),
    arm1,
    cyl(0.18, 0.25, mat.darkSteel, 0.72, 1.35, 0, Math.PI / 2),
    arm2,
    box(0.55, 0.12, 0.16, mat.brightOrange, 1.28, 2.22, 0)
  );

  return g;
}

const robot1 = createRobotArm(-4.7, 1.1, 0.75);
const robot2 = createRobotArm(4.7, 1.1, 0.75, -1);
const robot3 = createRobotArm(4.7, -0.9, 0.75, -1);
const robot4 = createRobotArm(-4.7, -0.9, 0.75);

// SPARKS
const sparkGeo = new THREE.BufferGeometry();
const sparkCount = 120;
const sparkPositions = new Float32Array(sparkCount * 3);
const sparkVel = [];

for (let i = 0; i < sparkCount; i++) {
  sparkPositions[i * 3] = -7.1;
  sparkPositions[i * 3 + 1] = 2.1;
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
    size: 0.045,
    transparent: true,
    opacity: 0.9
  })
);

scene.add(sparks);

// DUST
const dustGeo = new THREE.BufferGeometry();
const dustCount = 280;
const dustPositions = new Float32Array(dustCount * 3);

for (let i = 0; i < dustCount; i++) {
  dustPositions[i * 3] = (Math.random() - 0.5) * 22;
  dustPositions[i * 3 + 1] = -1.5 + Math.random() * 7.5;
  dustPositions[i * 3 + 2] = -2.5 + Math.random() * 3.8;
}

dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));

const dust = new THREE.Points(
  dustGeo,
  new THREE.PointsMaterial({
    color: "#b07145",
    size: 0.018,
    transparent: true,
    opacity: 0.18
  })
);

scene.add(dust);

let time = 0;

function animate() {
  requestAnimationFrame(animate);
  time += 0.016;

  rollers.forEach((r) => {
    r.rotation.z -= 0.09;
  });

  packages.forEach((p) => {
    if (p.userData.state === "upper") {
      p.position.x += p.userData.speed;

      if (p.position.x > 9.2) {
        p.userData.state = "falling";
        p.userData.fallSpeed = 0;
        p.position.x = 9.2;
      }
    }

    if (p.userData.state === "falling") {
      p.userData.fallSpeed += 0.006;
      p.position.y -= p.userData.fallSpeed;
      p.rotation.z += 0.04;

      if (p.position.y <= lowerBeltY + 0.67) {
        p.position.y = lowerBeltY + 0.67;
        p.position.x = 8.8;
        p.rotation.z = 0;
        p.userData.state = "lower";
      }
    }

    if (p.userData.state === "lower") {
      p.position.x -= p.userData.speed;

      if (p.position.x < -9.7) {
        p.position.x = -9.7;
        p.position.y = upperBeltY + 0.67;
        p.userData.state = "upper";
      }
    }

    p.rotation.y += 0.008;
  });

  machines.forEach((m, i) => {
    const d = i * 0.7;

    if (m.type === "press") {
      const hit = Math.pow(Math.abs(Math.sin(time * 2.2 + d)), 4);
      m.moving.position.y = m.startY - hit * 0.95;
      if (m.arm) m.arm.scale.y = 1 + hit * 0.55;
    }

    if (m.type === "scan") {
      m.moving.scale.x = 1.05 + Math.sin(time * 5.5 + d) * 0.12;
      m.moving.scale.z = 1.05 + Math.sin(time * 5.5 + d) * 0.12;
      m.moving.position.y = m.startY + Math.sin(time * 3.2 + d) * 0.08;
    }

    if (m.type === "side") {
      m.moving.position.z = m.startZ + Math.sin(time * 2.8 + d) * 0.75;
      if (m.arm) m.arm.rotation.z = Math.sin(time * 2.8 + d) * 0.06;
    }

    if (m.type === "laser") {
      m.moving.scale.y = 0.7 + Math.abs(Math.sin(time * 4.5 + d)) * 1.1;
      m.moving.rotation.y += 0.02;
    }
  });

  robot1.rotation.y = Math.sin(time * 1.1) * 0.25;
  robot2.rotation.y = -Math.sin(time * 1.25) * 0.25;
  robot3.rotation.y = Math.sin(time * 1.05) * 0.22;
  robot4.rotation.y = -Math.sin(time * 1.2) * 0.22;

  glowLights.forEach((l, i) => {
    l.intensity = 1.8 + Math.sin(time * 2.1 + i) * 0.35;
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
      const sourceX = Math.random() > 0.5 ? -7.1 : 7.1;
      const sourceY = Math.random() > 0.5 ? 2.05 : 0.05;

      pos[i * 3] = sourceX + (Math.random() - 0.5) * 0.7;
      pos[i * 3 + 1] = sourceY + Math.random() * 0.4;
      pos[i * 3 + 2] = 0.82;

      v.x = (Math.random() - 0.5) * 0.055;
      v.y = Math.random() * 0.07;
      v.z = (Math.random() - 0.5) * 0.035;
      v.life = 0.5 + Math.random() * 0.7;
    }
  }

  sparks.geometry.attributes.position.needsUpdate = true;
  dust.rotation.y += 0.0005;

camera.position.x = Math.sin(time * 0.18) * 0.12;
camera.position.y = 2.2 + Math.sin(time * 0.14) * 0.035;
camera.position.z = 24;
camera.lookAt(0, 1.1, 0);

  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});