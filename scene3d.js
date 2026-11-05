import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js";

(() => {
  const host = document.querySelector(".nexus-scene");
  if (!host || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  } catch (error) {
    console.warn("NEXUS 3D scene unavailable; keeping the static illustration.", error);
    return;
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
  renderer.setSize(host.clientWidth, host.clientHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  renderer.domElement.className = "nexus-three-canvas";
  renderer.domElement.setAttribute("aria-hidden", "true");
  host.prepend(renderer.domElement);
  host.classList.add("nx-webgl-ready");

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, host.clientWidth / host.clientHeight, 0.1, 100);
  camera.position.set(8, 7, 11);
  camera.lookAt(0, 1.2, 0);

  scene.add(new THREE.HemisphereLight(0xbac8ff, 0x11121b, 2.1));
  const key = new THREE.DirectionalLight(0xffffff, 3.2);
  key.position.set(5, 9, 7);
  scene.add(key);
  const violet = new THREE.PointLight(0x847dff, 32, 16);
  violet.position.set(-4, 3, -2);
  scene.add(violet);
  const cyan = new THREE.PointLight(0x00b3dd, 22, 14);
  cyan.position.set(4, 2, 4);
  scene.add(cyan);

  const city = new THREE.Group();
  scene.add(city);

  const mat = (color, roughness = 0.58, metalness = 0.12) =>
    new THREE.MeshStandardMaterial({ color, roughness, metalness });
  const groundMat = mat(0x202333, 0.82, 0.18);
  const buildingMats = [0x34384d, 0x292e42, 0x42465d, 0x222b3c].map(c => mat(c, 0.48, 0.25));
  const glassMat = new THREE.MeshStandardMaterial({
    color: 0x6677c9, emissive: 0x263b91, emissiveIntensity: 0.38,
    metalness: 0.55, roughness: 0.24
  });
  const solarMat = new THREE.MeshStandardMaterial({
    color: 0x283e72, emissive: 0x182a60, emissiveIntensity: 0.32,
    metalness: 0.72, roughness: 0.25
  });
  const frameMat = mat(0x9ca9d8, 0.35, 0.72);

  const ground = new THREE.Mesh(new THREE.CylinderGeometry(5.3, 5.3, 0.28, 8), groundMat);
  ground.position.y = -0.18;
  ground.rotation.y = Math.PI / 8;
  city.add(ground);

  const platform = new THREE.Mesh(
    new THREE.CylinderGeometry(4.8, 5.1, 0.12, 8),
    mat(0x30364c, 0.52, 0.42)
  );
  platform.position.y = 0.02;
  platform.rotation.y = Math.PI / 8;
  city.add(platform);

  function addBuilding(x, z, width, depth, height, index) {
    const group = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(width, height, depth),
      buildingMats[index % buildingMats.length]
    );
    body.position.y = height / 2 + 0.12;
    group.add(body);

    const roof = new THREE.Mesh(new THREE.BoxGeometry(width * 1.04, 0.08, depth * 1.04), frameMat);
    roof.position.y = height + 0.16;
    group.add(roof);

    const windowGeometry = new THREE.BoxGeometry(0.035, 0.19, depth * 0.72);
    for (let y = 0.45; y < height - 0.1; y += 0.42) {
      const window = new THREE.Mesh(windowGeometry, glassMat);
      window.position.set(width / 2 + 0.022, y, 0);
      group.add(window);
    }
    group.position.set(x, 0, z);
    city.add(group);
  }

  addBuilding(-1.55, -0.7, 1.05, 1.0, 2.65, 0);
  addBuilding(0.15, -1.0, 1.0, 0.95, 3.65, 1);
  addBuilding(1.8, -0.15, 0.85, 0.9, 2.15, 2);
  addBuilding(-2.15, 1.0, 0.78, 0.8, 1.55, 3);
  addBuilding(0.45, 1.15, 0.9, 0.82, 1.85, 0);

  // Solar array: individual dark-blue photovoltaic modules on a tilted rack.
  const array = new THREE.Group();
  const panelBase = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.12, 1.75), frameMat);
  array.add(panelBase);
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 5; col++) {
      const panel = new THREE.Mesh(new THREE.BoxGeometry(0.59, 0.035, 0.52), solarMat);
      panel.position.set(-1.22 + col * 0.61, 0.085, -0.59 + row * 0.59);
      array.add(panel);
      const line = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.012, 0.51), frameMat);
      line.position.set(panel.position.x + 0.29, 0.11, panel.position.z);
      array.add(line);
    }
  }
  array.position.set(-0.1, 0.32, 2.65);
  array.rotation.x = -0.28;
  city.add(array);

  // Energy storage unit.
  const battery = new THREE.Group();
  const batteryBody = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 1.05, 0.55),
    mat(0x363c53, 0.38, 0.48)
  );
  batteryBody.position.y = 0.62;
  battery.add(batteryBody);
  const batteryLight = new THREE.Mesh(
    new THREE.BoxGeometry(0.42, 0.055, 0.035),
    new THREE.MeshBasicMaterial({ color: 0x00d4ed })
  );
  batteryLight.position.set(0, 0.82, 0.29);
  battery.add(batteryLight);
  battery.position.set(2.7, 0.12, 1.7);
  city.add(battery);

  // Fine orbit rings and energy particles.
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x777dff, transparent: true, opacity: 0.42 });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(4.25, 0.012, 8, 140), ringMat);
  ring.rotation.x = Math.PI / 2.35;
  ring.position.y = 0.22;
  city.add(ring);

  const particlePositions = [];
  for (let i = 0; i < 90; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 2.8 + Math.random() * 2.1;
    particlePositions.push(Math.cos(angle) * radius, Math.random() * 3.5 + 0.3, Math.sin(angle) * radius);
  }
  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute("position", new THREE.Float32BufferAttribute(particlePositions, 3));
  const particles = new THREE.Points(
    particleGeometry,
    new THREE.PointsMaterial({ color: 0x9aa6ff, size: 0.035, transparent: true, opacity: 0.7 })
  );
  city.add(particles);

  let pointerX = 0, pointerY = 0, targetX = 0, targetY = 0;
  let frame = 0;
  const onPointerMove = event => {
    const rect = host.getBoundingClientRect();
    targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 0.42;
    targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 0.22;
  };
  host.addEventListener("pointermove", onPointerMove, { passive: true });
  host.addEventListener("pointerleave", () => { targetX = 0; targetY = 0; });

  const resizeObserver = new ResizeObserver(() => {
    const width = host.clientWidth, height = host.clientHeight;
    if (!width || !height) return;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  });
  resizeObserver.observe(host);

  let visible = true;
  const visibilityObserver = new IntersectionObserver(entries => {
    visible = entries.some(entry => entry.isIntersecting);
  });
  visibilityObserver.observe(host);

  function animate() {
    frame = requestAnimationFrame(animate);
    if (!visible) return;
    pointerX += (targetX - pointerX) * 0.035;
    pointerY += (targetY - pointerY) * 0.035;
    city.rotation.y = Math.sin(performance.now() * 0.00013) * 0.08 + pointerX;
    city.rotation.x = pointerY;
    particles.rotation.y -= 0.00035;
    ring.rotation.z += 0.00045;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener("pagehide", () => {
    cancelAnimationFrame(frame);
    resizeObserver.disconnect();
    visibilityObserver.disconnect();
    host.removeEventListener("pointermove", onPointerMove);
    renderer.dispose();
  }, { once: true });
})();
