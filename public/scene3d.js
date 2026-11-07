import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js";

(() => {
  const host = document.querySelector(".nexus-scene");
  if (!host) return;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  } catch (error) {
    console.warn("NEXUS energy core unavailable; CSS atmosphere remains visible.", error);
    host.classList.add("nx-webgl-fallback");
    return;
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
  renderer.setSize(host.clientWidth, host.clientHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.32;
  renderer.domElement.className = "nexus-three-canvas";
  renderer.domElement.setAttribute("aria-hidden", "true");
  host.prepend(renderer.domElement);
  host.classList.add("nx-webgl-ready");

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, host.clientWidth / host.clientHeight, .1, 100);
  camera.position.set(0, 1.2, 10.8);
  camera.lookAt(0, 0, 0);

  scene.add(new THREE.HemisphereLight(0xffe8b5, 0x171008, 2.2));
  const key = new THREE.DirectionalLight(0xffe6a3, 3.5);
  key.position.set(4, 6, 7);
  scene.add(key);
  const rim = new THREE.PointLight(0xd99b35, 42, 18);
  rim.position.set(-4, 1.8, -2);
  scene.add(rim);
  const warm = new THREE.PointLight(0xffd77a, 26, 14);
  warm.position.set(4, -2, 4);
  scene.add(warm);

  const core = new THREE.Group();
  scene.add(core);

  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1.72, 96, 96),
    new THREE.MeshPhysicalMaterial({
      color: 0x9d7029, metalness: .78, roughness: .23,
      clearcoat: 1, clearcoatRoughness: .16,
      emissive: 0x4c2e08, emissiveIntensity: .32
    })
  );
  core.add(sphere);

  const innerGlow = new THREE.Mesh(
    new THREE.SphereGeometry(1.64, 64, 64),
    new THREE.MeshBasicMaterial({ color: 0xf2c76b, transparent: true, opacity: .10, wireframe: true })
  );
  core.add(innerGlow);

  const wire = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.78, 2),
    new THREE.MeshBasicMaterial({ color: 0xf2d18a, wireframe: true, transparent: true, opacity: .16 })
  );
  core.add(wire);

  // Solar-cell facets arranged as a fine, curved grid over the energy sphere.
  const cellMaterial = new THREE.MeshStandardMaterial({
    color: 0x292219, metalness: .82, roughness: .28,
    emissive: 0x8c5e19, emissiveIntensity: .13,
    side: THREE.DoubleSide
  });
  const cellLines = new THREE.Group();
  const radius = 1.735;
  for (let lat = -4; lat <= 4; lat++) {
    const phi = Math.PI / 2 + lat * .22;
    const y = radius * Math.cos(phi);
    const ringRadius = radius * Math.sin(phi);
    const line = new THREE.Mesh(
      new THREE.TorusGeometry(Math.abs(ringRadius), .009, 5, 100),
      new THREE.MeshBasicMaterial({ color: 0xf2d18a, transparent: true, opacity: .27 })
    );
    line.position.y = y;
    line.rotation.x = Math.PI / 2;
    cellLines.add(line);
  }
  for (let lon = 0; lon < 12; lon++) {
    const curve = new THREE.EllipseCurve(0, 0, radius, radius, 0, Math.PI * 2, false, 0);
    const points = curve.getPoints(100);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const meridian = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0xf2d18a, transparent: true, opacity: .18 }));
    meridian.rotation.y = lon * Math.PI / 12;
    cellLines.add(meridian);
  }
  core.add(cellLines);

  // Three orbital rings, deliberately thin and elegant rather than dashboard-like.
  const orbitGroup = new THREE.Group();
  scene.add(orbitGroup);
  const orbitSpecs = [
    { radius: 2.55, tube: .018, color: 0xf0cf79, opacity: .72, x: 1.04, y: .20, z: -.18 },
    { radius: 3.05, tube: .009, color: 0xb88635, opacity: .55, x: .52, y: -.44, z: .36 },
    { radius: 3.48, tube: .008, color: 0xf5dfa0, opacity: .32, x: 1.42, y: .72, z: .12 }
  ];
  const orbitMeshes = orbitSpecs.map(spec => {
    const mesh = new THREE.Mesh(
      new THREE.TorusGeometry(spec.radius, spec.tube, 8, 180),
      new THREE.MeshBasicMaterial({ color: spec.color, transparent: true, opacity: spec.opacity })
    );
    mesh.rotation.set(spec.x, spec.y, spec.z);
    orbitGroup.add(mesh);
    return mesh;
  });

  // Small solar collectors mounted along the outer orbit.
  const collectorGroup = new THREE.Group();
  const collectorMaterial = new THREE.MeshStandardMaterial({
    color: 0x46351b, metalness: .75, roughness: .3,
    emissive: 0x8b5c17, emissiveIntensity: .2
  });
  const collectorEdge = new THREE.MeshStandardMaterial({ color: 0xe9c46a, metalness: .7, roughness: .25 });
  for (let i = 0; i < 4; i++) {
    const angle = i * Math.PI / 2 + .28;
    const panel = new THREE.Group();
    const plate = new THREE.Mesh(new THREE.BoxGeometry(.72, .045, .48), collectorMaterial);
    panel.add(plate);
    const frame = new THREE.Mesh(new THREE.BoxGeometry(.78, .025, .54), collectorEdge);
    frame.position.y = -.035;
    panel.add(frame);
    for (let k = -1; k <= 1; k++) {
      const seam = new THREE.Mesh(new THREE.BoxGeometry(.012, .012, .46), collectorEdge);
      seam.position.x = k * .19;
      panel.add(seam);
    }
    panel.position.set(Math.cos(angle) * 3.1, Math.sin(angle) * 1.35, Math.sin(angle * 2) * .65);
    panel.lookAt(0, 0, 0);
    collectorGroup.add(panel);
  }
  orbitGroup.add(collectorGroup);

  // Fine energy particles around the orbital field.
  const positions = [];
  for (let i = 0; i < 220; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r = 2.5 + Math.random() * 2.2;
    positions.push(Math.cos(angle) * r, (Math.random() - .5) * 4.3, Math.sin(angle) * r);
  }
  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  const particles = new THREE.Points(
    particleGeometry,
    new THREE.PointsMaterial({ color: 0xf5dfa0, size: .026, transparent: true, opacity: .76, sizeAttenuation: true })
  );
  scene.add(particles);

  const halo = new THREE.Mesh(
    new THREE.CircleGeometry(4.4, 96),
    new THREE.MeshBasicMaterial({ color: 0x9b671f, transparent: true, opacity: .055, side: THREE.DoubleSide })
  );
  halo.position.z = -2.7;
  scene.add(halo);

  let pointerX = 0, pointerY = 0, targetX = 0, targetY = 0;
  const onPointerMove = event => {
    const rect = host.getBoundingClientRect();
    targetX = ((event.clientX - rect.left) / rect.width - .5) * .42;
    targetY = ((event.clientY - rect.top) / rect.height - .5) * .28;
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

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let frame = 0;
  function animate() {
    frame = requestAnimationFrame(animate);
    if (!visible) return;
    pointerX += (targetX - pointerX) * .035;
    pointerY += (targetY - pointerY) * .035;
    if (!reducedMotion) {
      core.rotation.y += .0018;
      cellLines.rotation.y -= .0012;
      orbitGroup.rotation.y += .0011;
      particles.rotation.y += .00022;
    }
    core.rotation.x += (pointerY - core.rotation.x) * .035;
    core.rotation.z += (pointerX - core.rotation.z) * .025;
    orbitGroup.rotation.x += (pointerY * .35 - orbitGroup.rotation.x) * .012;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener("pagehide", () => {
    cancelAnimationFrame(frame);
    resizeObserver.disconnect();
    visibilityObserver.disconnect();
    host.removeEventListener("pointermove", onPointerMove);
    renderer.dispose();
    scene.traverse(object => {
      if (object.geometry) object.geometry.dispose();
      if (object.material) {
        (Array.isArray(object.material) ? object.material : [object.material]).forEach(material => material.dispose());
      }
    });
  }, { once: true });
})();
