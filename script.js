import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color("#171717");
scene.fog = new THREE.Fog("#171717", 12, 30);

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

// 2.5D side/isometric angle
camera.position.set(8, 5, 12);
camera.lookAt(0, 1.5, 0);

const renderer = new THREE.WebGLRenderer({
  antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.appendChild(renderer.domElement);

// COLORS
const orange = "#c96f2d";
const darkOrange = "#8f421f";
const gray = "#4a4a4a";
const darkGray = "#242424";
const lightGray = "#777777";
const glowOrange = "#ff8b3d";

// LIGHTS
const ambient = new THREE.AmbientLight("#ffffff", 0.45);
scene.add(ambient);

const mainLight = new THREE.DirectionalLight("#ffd1a3", 2.1);
mainLight.position.set(4, 8, 6);
mainLight.castShadow = true;
scene.add(mainLight);

const orangeLight = new THREE.PointLight(glowOrange, 3, 12);
orangeLight.position.set(-3, 3.5, 2);
scene.add(orangeLight);

// MATERIALS
const matFloor = new THREE.MeshStandardMaterial({
  color: "#2b2b2b",
  roughness: 0.8
});

const matWall = new THREE.MeshStandardMaterial({
  color: "#333333",
  roughness: 0.7
});

const matOrange = new THREE.MeshStandardMaterial({
  color: orange,
  roughness: 0.45,
  metalness: 0.2
});

const matDarkOrange = new THREE.MeshStandardMaterial({
  color: darkOrange,
  roughness: 0.5,
  metalness: 0.15
});

const matGray = new THREE.MeshStandardMaterial({
  color: gray,
  roughness: 0.4,
  metalness: 0.35
});

const matDarkGray = new THREE.MeshStandardMaterial({
  color: darkGray,
  roughness: 0.65,
  metalness: 0.25
});

const matGlow = new THREE.MeshBasicMaterial({
  color: glowOrange
});

// ROOM
const floor = new THREE.Mesh(
  new THREE.BoxGeometry(18, 0.25, 7),
  matFloor
);
floor.position.set(0, -0.15, 0);
floor.receiveShadow = true;
scene.add(floor);

const backWall = new THREE.Mesh(
  new THREE.BoxGeometry(18, 5, 0.25),
  matWall
);
backWall.position.set(0, 2.35, -3.6);
backWall.receiveShadow = true;
scene.add(backWall);

const sideWall = new THREE.Mesh(
  new THREE.BoxGeometry(0.25, 5, 7),
  matWall
);
sideWall.position.set(-9, 2.35, 0);
scene.add(sideWall);

// WALL PIPES
for (let i = 0; i < 5; i++) {
  const pipe = new THREE.Mesh(
    new THREE.CylinderGeometry(0.045, 0.045, 17, 16),
    matDarkGray
  );

  pipe.rotation.z = Math.PI / 2;
  pipe.position.set(0, 3.8 - i * 0.45, -3.42);
  scene.add(pipe);
}

// CONVEYOR BELT
const beltBase = new THREE.Mesh(
  new THREE.BoxGeometry(14.5, 0.35, 1.1),
  matDarkGray
);
beltBase.position.set(0, 0.55, 0);
beltBase.castShadow = true;
beltBase.receiveShadow = true;
scene.add(beltBase);

const beltTop = new THREE.Mesh(
  new THREE.BoxGeometry(14.4, 0.08, 1),
  new THREE.MeshStandardMaterial({
    color: "#111111",
    roughness: 0.5,
    metalness: 0.4
  })
);
beltTop.position.set(0, 0.78, 0);
scene.add(beltTop);

// Conveyor rollers
const rollers = [];

for (let i = 0; i < 16; i++) {
  const roller = new THREE.Mesh(
    new THREE.CylinderGeometry(0.13, 0.13, 1.2, 24),
    matGray
  );

  roller.rotation.x = Math.PI / 2;
  roller.position.set(-6.8 + i * 0.9, 0.8, 0);
  roller.castShadow = true;

  rollers.push(roller);
  scene.add(roller);
}

// MOVING BOXES
const boxes = [];

for (let i = 0; i < 6; i++) {
  const box = new THREE.Mesh(
    new THREE.BoxGeometry(0.55, 0.45, 0.55),
    matOrange
  );

  box.position.set(-7 + i * 2.6, 1.13, 0);
  box.castShadow = true;

  boxes.push(box);
  scene.add(box);
}

// MACHINE HELPERS
function createMachine(x, type) {
  const group = new THREE.Group();
  group.position.x = x;

  const base = new THREE.Mesh(
    new THREE.BoxGeometry(1.6, 1.2, 1.45),
    matGray
  );
  base.position.y = 1.35;
  base.castShadow = true;
  group.add(base);

  const top = new THREE.Mesh(
    new THREE.BoxGeometry(1.9, 0.35, 1.6),
    matDarkOrange
  );
  top.position.y = 2.15;
  top.castShadow = true;
  group.add(top);

  const screen = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 0.38, 0.04),
    matGlow
  );
  screen.position.set(0, 1.55, 0.75);
  group.add(screen);

  const arm = new THREE.Mesh(
    new THREE.BoxGeometry(0.25, 1, 0.25),
    matDarkGray
  );
  arm.position.y = 2.65;
  arm.castShadow = true;
  group.add(arm);

  let tool;

  if (type === "smash") {
    tool = new THREE.Mesh(
      new THREE.BoxGeometry(0.95, 0.25, 0.95),
      matOrange
    );
    tool.position.y = 2.05;
  }

  if (type === "scan") {
    tool = new THREE.Mesh(
      new THREE.BoxGeometry(1.15, 0.12, 1.15),
      matGlow
    );
    tool.position.y = 2.05;
  }

  if (type === "side") {
    tool = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.35, 1.5),
      matOrange
    );
    tool.position.set(0, 1.45, 0);
  }

  group.add(tool);

  scene.add(group);

  return {
    group,
    arm,
    tool,
    type,
    baseY: tool.position.y
  };
}

const machines = [
  createMachine(-5.2, "smash"),
  createMachine(-1.7, "scan"),
  createMachine(1.8, "side"),
  createMachine(5.2, "smash")
];

// BACKGROUND DETAILS
for (let i = 0; i < 9; i++) {
  const column = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 4.4, 0.18),
    matDarkGray
  );

  column.position.set(-8 + i * 2, 2.1, -3.2);
  scene.add(column);
}

for (let i = 0; i < 5; i++) {
  const light = new THREE.Mesh(
    new THREE.BoxGeometry(1.1, 0.08, 0.08),
    matGlow
  );

  light.position.set(-6 + i * 3, 4.45, -2.7);
  scene.add(light);
}

// CAMERA DRIFT FOR SCREENSAVER FEEL
let time = 0;

function animate() {
  requestAnimationFrame(animate);

  time += 0.016;

  // rollers spin
  rollers.forEach((roller) => {
    roller.rotation.z -= 0.08;
  });

  // boxes move along belt
  boxes.forEach((box, i) => {
    box.position.x += 0.025;

    if (box.position.x > 7.4) {
      box.position.x = -7.4;
    }

    box.rotation.y += 0.01;
  });

  // machines animate differently
  machines.forEach((machine, i) => {
    const delay = i * 0.8;

    if (machine.type === "smash") {
      const motion = Math.abs(Math.sin(time * 2.2 + delay));
      machine.tool.position.y = 2.35 - motion * 0.8;
      machine.arm.scale.y = 1 + motion * 0.35;
    }

    if (machine.type === "scan") {
      machine.tool.position.y = 2.05 + Math.sin(time * 3 + delay) * 0.08;
      machine.tool.scale.x = 1 + Math.sin(time * 5) * 0.12;
      machine.tool.scale.z = 1 + Math.sin(time * 5) * 0.12;
    }

    if (machine.type === "side") {
      machine.tool.position.z = Math.sin(time * 2.5 + delay) * 0.65;
    }
  });

  // glowing pulse
  orangeLight.intensity = 2.5 + Math.sin(time * 2) * 0.6;

  // slow screensaver camera movement
  camera.position.x = 8 + Math.sin(time * 0.25) * 0.8;
  camera.position.y = 5 + Math.sin(time * 0.18) * 0.3;
  camera.lookAt(0, 1.5, 0);

  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
});