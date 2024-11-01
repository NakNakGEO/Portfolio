<template>
  <div ref="container" class="fixed top-0 left-0 w-full h-full z-0"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { gsap } from 'gsap';

const container = ref<HTMLDivElement | null>(null);
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let stars: THREE.Points;
let animationFrameId: number;

const init = () => {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
  
  renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    alpha: true 
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.value?.appendChild(renderer.domElement);

  // Create stars with different sizes and colors
  const starsGeometry = new THREE.BufferGeometry();
  const starsMaterial = new THREE.PointsMaterial({
    size: 0.1,
    sizeAttenuation: true,
    vertexColors: true,
  });

  const starsVertices = [];
  const colors = [];
  
  for (let i = 0; i < 15000; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = (Math.random() - 0.5) * 2000;
    starsVertices.push(x, y, z);

    const color = new THREE.Color();
    color.setHSL(Math.random(), 0.5, 0.5 + Math.random() * 0.5);
    colors.push(color.r, color.g, color.b);
  }

  starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
  starsGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  
  stars = new THREE.Points(starsGeometry, starsMaterial);
  scene.add(stars);

  camera.position.z = 500;

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enableZoom = false;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.5;

  // Add ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  // Animate camera on load
  gsap.to(camera.position, {
    z: 300,
    duration: 2,
    ease: "power2.out"
  });
};

const animate = () => {
  animationFrameId = requestAnimationFrame(animate);
  stars.rotation.y += 0.0003;
  stars.rotation.x += 0.0001;
  renderer.render(scene, camera);
};

const handleResize = () => {
  if (!container.value) return;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};

onMounted(() => {
  init();
  animate();
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  cancelAnimationFrame(animationFrameId);
  window.removeEventListener('resize', handleResize);
  renderer.dispose();
});
</script>