<template>
  <div ref="container" class="absolute top-0 right-0 w-full h-full -z-10"></div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';
import * as THREE from 'three';
import gsap from 'gsap';
import { BufferGeometry, Float32BufferAttribute, Points, PointsMaterial } from 'three';

interface Planet {
  name: string;
  size: number;
  color: number;
  orbitSpeed: number;
  orbitSize: number;
  orbitTilt: number;
  details?: {
    texture?: string;
    rings?: boolean;
    ringsColor?: number;
    ringsSize?: number;
    atmosphere?: boolean;
    atmosphereColor?: number;
  }
}

const PLANETS: Planet[] = [
  {
    name: 'Mercury',
    size: 0.15,
    color: 0x8c8c8c,
    orbitSpeed: 1.6,
    orbitSize: 4.0,
    orbitTilt: 0.05,
    details: {
      texture: 'mercury-texture.jpg',
      atmosphere: false
    }
  },
  {
    name: 'Venus',
    size: 0.2,
    color: 0xe6b800,
    orbitSpeed: 1.2,
    orbitSize: 4.8,
    orbitTilt: 0.03,
    details: {
      texture: 'venus-texture.jpg',
      atmosphere: true,
      atmosphereColor: 0xffd700
    }
  },
  {
    name: 'Earth',
    size: 0.22,
    color: 0x3498db,
    orbitSpeed: 1.0,
    orbitSize: 5.5,
    orbitTilt: 0.02,
    details: {
      texture: 'earth-texture.jpg',
      atmosphere: true,
      atmosphereColor: 0x6495ED
    }
  },
  {
    name: 'Mars',
    size: 0.18,
    color: 0xe74c3c,
    orbitSpeed: 0.8,
    orbitSize: 6.2,
    orbitTilt: 0.04,
    details: {
      texture: 'mars-texture.jpg',
      atmosphere: true,
      atmosphereColor: 0xff6b6b
    }
  },
  {
    name: 'Jupiter',
    size: 0.4,
    color: 0xf39c12,
    orbitSpeed: 0.6,
    orbitSize: 6.9,
    orbitTilt: 0.01,
    details: {
      texture: 'jupiter-texture.jpg',
      atmosphere: true,
      atmosphereColor: 0xffa07a
    }
  },
  {
    name: 'Saturn',
    size: 0.35,
    color: 0xf1c40f,
    orbitSpeed: 0.4,
    orbitSize: 7.6,
    orbitTilt: 0.03,
    details: {
      texture: 'saturn-texture.jpg',
      rings: true,
      ringsColor: 0xdaa520,
      ringsSize: 1.8,
      atmosphere: true,
      atmosphereColor: 0xffd700
    }
  },
  {
    name: 'Uranus',
    size: 0.25,
    color: 0x00CED1,
    orbitSpeed: 0.3,
    orbitSize: 8.3,
    orbitTilt: 0.05,
    details: {
      texture: 'uranus-texture.jpg',
      rings: true,
      ringsColor: 0x40e0d0,
      ringsSize: 1.4,
      atmosphere: true,
      atmosphereColor: 0x40e0d0
    }
  },
  {
    name: 'Neptune',
    size: 0.23,
    color: 0x0066ff,
    orbitSpeed: 0.2,
    orbitSize: 9.0,
    orbitTilt: 0.04,
    details: {
      texture: 'neptune-texture.jpg',
      rings: true,
      ringsColor: 0x4169e1,
      ringsSize: 1.3,
      atmosphere: true,
      atmosphereColor: 0x4169e1
    }
  }
];

const container = ref<HTMLElement | null>(null);
let scene: THREE.Scene;
let camera: THREE.OrthographicCamera;
let renderer: THREE.WebGLRenderer;
let planetMeshes: THREE.Mesh[] = [];
let animationFrameId: number;

const planetPositions = reactive(
  PLANETS.map(() => ({ x: 0, y: 0, opacity: 1 }))
);

const updateSizes = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const sunSize = height * 0.8;
  return { width, height, sunSize };
};

onMounted(() => {
  if (!container.value) return;

  scene = new THREE.Scene();
  const sizes = updateSizes();

  camera = new THREE.OrthographicCamera(
    -sizes.width / 2, sizes.width / 2,
    sizes.height / 2, -sizes.height / 2,
    0.1, 1000
  );
  camera.position.z = 100;

  renderer = new THREE.WebGLRenderer({ 
    antialias: true, 
    alpha: true 
  });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.value.appendChild(renderer.domElement);

  // Add these shader definitions at the top of your file
  const glowVertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const glowFragmentShader = `
    varying vec2 vUv;
    uniform vec3 color;
    uniform float intensity;
    
    void main() {
      float dist = length(vUv - vec2(0.5));
      float alpha = smoothstep(0.5, 0.0, dist) * intensity;
      gl_FragColor = vec4(color, alpha);
    }
  `;

  const plasmaVertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const plasmaFragmentShader = `
    uniform float time;
    varying vec2 vUv;
    
    vec2 hash2(vec2 p) {
      p = vec2(dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)));
      return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
    }
    
    float noise(vec2 p) {
      const float K1 = 0.366025404;
      const float K2 = 0.211324865;
      
      vec2 i = floor(p + (p.x + p.y) * K1);
      vec2 a = p - i + (i.x + i.y) * K2;
      vec2 o = (a.x > a.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec2 b = a - o + K2;
      vec2 c = a - 1.0 + 2.0 * K2;
      
      vec3 h = max(0.5 - vec3(dot(a,a), dot(b,b), dot(c,c)), 0.0);
      vec3 n = h * h * h * h * vec3(dot(a,hash2(i)), dot(b,hash2(i+o)), dot(c,hash2(i+1.0)));
      
      return dot(n, vec3(70.0));
    }
    
    float fbm(vec2 p) {
      float value = 0.0;
      float amplitude = 0.7;
      float frequency = 1.0;
      for(int i = 0; i < 6; i++) {
        value += amplitude * noise(p * frequency + time * 0.7);
        frequency *= 2.4;
        amplitude *= 0.6;
      }
      return value;
    }
    
    float createHotSpot(vec2 uv, float time, float scale) {
      float spot1 = fbm(uv * 6.0 * scale + time * 0.3);
      float spot2 = fbm(uv * 4.0 * scale - time * 0.2);
      
      float combinedSpot = pow(spot1 * spot2, 0.5);
      return smoothstep(0.3, 0.7, combinedSpot);
    }
    
    float createMultipleHotSpots(vec2 uv, float time) {
      float spots1 = createHotSpot(uv, time * 0.4, 0.3);
      float spots2 = createHotSpot(uv + 0.5, time * 0.2, 0.5);
      float spots3 = createHotSpot(uv - 0.3, time * 0.3, 0.4);
      float spots4 = createHotSpot(uv * 1.5, time * 0.35, 0.6);
      
      return max(max(spots1, spots2 * 0.9), max(spots3 * 0.8, spots4 * 0.7));
    }
    
    void main() {
      vec2 uv = vUv;
      
      float n1 = fbm(uv * 4.0 + time * 0.15);
      float n2 = fbm(uv * 8.0 - time * 0.1);
      float n3 = fbm(uv * 12.0 + time * 0.12);
      
      float finalNoise = (n1 * 0.5 + n2 * 0.3 + n3 * 0.2) * 2.0;
      finalNoise = pow(finalNoise * 0.5 + 0.5, 1.4);
      
      vec3 color1 = vec3(0.7, 0.15, 0.01);
      vec3 color2 = vec3(0.9, 0.4, 0.05);
      vec3 color3 = vec3(0.8, 0.3, 0.02);
      vec3 color4 = vec3(1.0, 0.7, 0.2);
      vec3 color5 = vec3(1.0, 0.85, 0.3);
      
      vec3 finalColor = mix(color1, color2, finalNoise);
      finalColor = mix(finalColor, color3, fbm(uv * 6.0 + time * 0.15));
      
      float allHotSpots = createMultipleHotSpots(uv, time);
      
      float timeVariation = sin(time * 1.0) * 0.5 + 0.5;
      allHotSpots *= mix(0.7, 1.3, timeVariation);
      
      finalColor = mix(finalColor, color4, allHotSpots);
      
      float brightCenters = pow(allHotSpots, 1.5) * (sin(time * 1.5) * 0.3 + 0.7);
      finalColor = mix(finalColor, color5, brightCenters);
      
      float flicker = fbm(uv * 20.0 + time * 0.7) * allHotSpots;
      finalColor += color5 * flicker * 0.2;
      
      float edge = smoothstep(0.5, 0.35, length(uv - 0.5));
      finalColor *= edge * 0.7 + 0.3;
      
      float pulse = sin(time * 1.0) * 0.05 + 0.95;
      finalColor *= pulse;
      
      float brightness = fbm(uv * 2.0 + time * 0.05) * 0.15 + 0.85;
      finalColor *= brightness;
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

  // Solar flare configuration
  const FLARE_CONFIG = {
    ERUPTION_INTERVAL: 10,
    ERUPTION_DURATION: 4,
    PARTICLE_COUNT: 2000,    // Increased for more density
    INITIAL_VELOCITY: 0.03,  // Slower initial speed
    EXPANSION_RATE: 1.02,    // Gentler expansion
    PARTICLE_SIZE_RANGE: { MIN: 1, MAX: 3 }, // Varied particle sizes
    START_OPACITY: 0.9,
    FADE_DURATION: 3,
    COLORS: [               // Multiple colors for variety
      0xffff00, // bright yellow
      0xffd700, // gold
      0xff8c00, // dark orange
      0xff4500  // red-orange
    ]
  };

  const createSolarFlare = (sunSize: number, position: THREE.Vector3) => {
    const geometry = new BufferGeometry();
    const positions = new Float32Array(FLARE_CONFIG.PARTICLE_COUNT * 3);
    const colors = new Float32Array(FLARE_CONFIG.PARTICLE_COUNT * 3);
    const sizes = new Float32Array(FLARE_CONFIG.PARTICLE_COUNT);
    const velocities: THREE.Vector3[] = [];
    
    // Initialize particles with more variety
    for (let i = 0; i < FLARE_CONFIG.PARTICLE_COUNT; i++) {
      const angle = (Math.random() * Math.PI * 2);
      const radius = sunSize * (1.1 + Math.random() * 0.1); // Varied starting positions
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius;
      positions[i * 3 + 2] = 0;
      
      // Random color from palette
      const color = new THREE.Color(
        FLARE_CONFIG.COLORS[Math.floor(Math.random() * FLARE_CONFIG.COLORS.length)]
      );
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      // Random size for each particle
      sizes[i] = THREE.MathUtils.randFloat(
        FLARE_CONFIG.PARTICLE_SIZE_RANGE.MIN,
        FLARE_CONFIG.PARTICLE_SIZE_RANGE.MAX
      );
      
      // Varied velocities
      const speed = FLARE_CONFIG.INITIAL_VELOCITY * (1 + Math.random() * 0.5);
      velocities.push(new THREE.Vector3(
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
        0
      ));
    }
    
    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));
    geometry.setAttribute('size', new Float32BufferAttribute(sizes, 1));
    
    // Custom shader material for better-looking particles
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        opacity: { value: FLARE_CONFIG.START_OPACITY }
      },
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform float opacity;
        varying vec3 vColor;
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          float alpha = (0.5 - dist) * 2.0 * opacity;
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true
    });
    
    const particles = new Points(geometry, material);
    particles.position.copy(position);
    
    return { particles, velocities, geometry };
  };

  const createCelestialBody = (size: number, color: number, position: { x: number, y: number }) => {
    // Create noise texture for sun surface
    const createSunTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d')!;
      
      // Fill base color
      ctx.fillStyle = '#ffff00';
      ctx.fillRect(0, 0, 512, 512);
      
      // Add noise pattern
      for (let i = 0; i < 10000; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const radius = Math.random() * 2 + 1;
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, ${Math.random() * 100 + 155}, ${Math.random() * 0.2})`;
        ctx.fill();
      }
      
      return new THREE.CanvasTexture(canvas);
    };

    // Core of the sun with plasma effect
    const geometry = new THREE.CircleGeometry(size, 128);
    const plasmaMaterial = new THREE.ShaderMaterial({
      vertexShader: plasmaVertexShader,
      fragmentShader: plasmaFragmentShader,
      uniforms: {
        time: { value: 0 }
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: true,
    });
    const body = new THREE.Mesh(geometry, plasmaMaterial);

    // Create glow layers with shader material
    const createGlowLayer = (scale: number, color: THREE.Color, intensity: number) => {
      const glowGeometry = new THREE.CircleGeometry(size * scale, 128);
      const glowMaterial = new THREE.ShaderMaterial({
        vertexShader: glowVertexShader,
        fragmentShader: glowFragmentShader,
        uniforms: {
          color: { value: color },
          intensity: { value: intensity }
        },
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      return new THREE.Mesh(glowGeometry, glowMaterial);
    };

    // Add multiple glow layers with different sizes and intensities
    const glowLayers = [
      { scale: 1.2, color: new THREE.Color(0xff3300), intensity: 0.8 },  // Orange-red
      { scale: 1.6, color: new THREE.Color(0xff4400), intensity: 0.6 },  // Lighter orange
      { scale: 2.0, color: new THREE.Color(0xff5500), intensity: 0.4 },  // Even lighter
      { scale: 2.5, color: new THREE.Color(0xff6600), intensity: 0.2 },  // Faint outer glow
      { scale: 3.0, color: new THREE.Color(0xff7700), intensity: 0.1 }   // Very faint edge
    ].map(({ scale, color, intensity }) => 
      createGlowLayer(scale, color, intensity)
    );

    glowLayers.forEach(layer => body.add(layer));

    body.position.set(position.x, position.y, 0);
    scene.add(body);

    // Create and add solar flare system
    const flareSystem = createSolarFlare(size, new THREE.Vector3(position.x, position.y, 0));
    scene.add(flareSystem.particles);

    // Animate solar flares
    const animateSolarFlare = () => {
      const positions = flareSystem.geometry.attributes.position.array as Float32Array;
      const material = flareSystem.particles.material as unknown as PointsMaterial;

      gsap.timeline({
        repeat: -1,
        repeatDelay: FLARE_CONFIG.ERUPTION_INTERVAL,
        onUpdate: () => {
          // Slower particle movement
          for (let i = 0; i < positions.length; i += 3) {
            const velocity = flareSystem.velocities[i / 3];
            positions[i] += velocity.x;
            positions[i + 1] += velocity.y;
            
            // Gentler expansion
            velocity.multiplyScalar(FLARE_CONFIG.EXPANSION_RATE);
          }
          
          flareSystem.geometry.attributes.position.needsUpdate = true;
        },
        onRepeat: () => {
          console.log('Solar Flare Eruption!'); // Debug message
          
          // Reset particles for next flare
          for (let i = 0; i < positions.length; i += 3) {
            const angle = (Math.random() * Math.PI * 2);
            const radius = size * 1.1;
            positions[i] = Math.cos(angle) * radius;
            positions[i + 1] = Math.sin(angle) * radius;
            positions[i + 2] = 0;
            
            flareSystem.velocities[i / 3].set(
              Math.cos(angle) * FLARE_CONFIG.INITIAL_VELOCITY,
              Math.sin(angle) * FLARE_CONFIG.INITIAL_VELOCITY,
              0
            );
          }
          
          // Reset and fade out
          material.opacity = FLARE_CONFIG.START_OPACITY;
          gsap.to(material, {
            opacity: 0,
            duration: FLARE_CONFIG.FADE_DURATION,
            ease: "power2.out"
          });

          // Add glow burst effect
          addFlareGlow();
        }
      });
    };

    // Start the animation
    animateSolarFlare();

    return body;
  };

  // Create text texture function
  const createTextTexture = (text: string) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return null;
    
    canvas.width = 256;
    canvas.height = 64;
    
    // Add gradient effect
    const gradient = context.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
    gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(0.8, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    context.fillStyle = gradient;
    context.font = 'bold 32px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, canvas.width / 2, canvas.height / 2);
    
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  };

  // Create planet with label function
  const createPlanetWithLabel = (planet: Planet, position: { x: number, y: number }) => {
    const group = new THREE.Group();

    // Create planet with atmosphere if specified
    const planetGeometry = new THREE.CircleGeometry(sizes.sunSize / 2 * planet.size, 64);
    const planetMaterial = new THREE.MeshBasicMaterial({
      color: planet.color,
      transparent: true,
      opacity: 0.95
    });
    const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);

    // Add atmosphere if specified
    if (planet.details?.atmosphere) {
      const atmosphereGeometry = new THREE.CircleGeometry(sizes.sunSize / 2 * planet.size * 1.2, 64);
      const atmosphereMaterial = new THREE.MeshBasicMaterial({
        color: planet.details.atmosphereColor || planet.color,
        transparent: true,
        opacity: 0.2
      });
      const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
      planetMesh.add(atmosphere);
    }

    // Add rings if specified
    if (planet.details?.rings) {
      const ringsGeometry = new THREE.RingGeometry(
        sizes.sunSize / 2 * planet.size * 1.3,
        sizes.sunSize / 2 * planet.size * planet.details.ringsSize!,
        64
      );
      const ringsMaterial = new THREE.MeshBasicMaterial({
        color: planet.details.ringsColor,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide
      });
      const rings = new THREE.Mesh(ringsGeometry, ringsMaterial);
      rings.rotation.x = Math.PI / 2;
      planetMesh.add(rings);
    }

    group.add(planetMesh);

    // Create enhanced label
    const texture = createTextTexture(planet.name);
    if (texture) {
      const labelGeometry = new THREE.PlaneGeometry(
        sizes.sunSize / 2 * planet.size * 2, 
        sizes.sunSize / 2 * planet.size * 0.5
      );
      const labelMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
        opacity: 0.9
      });
      const label = new THREE.Mesh(labelGeometry, labelMaterial);
      label.position.y = -sizes.sunSize / 2 * planet.size * 1.2;
      group.add(label);
    }

    group.position.set(position.x, position.y, 0);
    scene.add(group);
    return group;
  };

  // Create sun and planets
  const sunRadius = sizes.sunSize / 2;
  const sun = createCelestialBody(
    sunRadius,
    0xff3300,
    { x: sizes.width / 2 + sunRadius * 0.3, y: 0 }
  ) as THREE.Mesh;
  sun.renderOrder = 1;

  // Create planets with labels
  const planetGroups = PLANETS.map(planet => 
    createPlanetWithLabel(planet, { x: 0, y: 0 })
  );

  // Handle window resize
  const handleResize = () => {
    const sizes = updateSizes();

    camera.left = -sizes.width / 2;
    camera.right = sizes.width / 2;
    camera.top = sizes.height / 2;
    camera.bottom = -sizes.height / 2;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);

    const sunRadius = sizes.sunSize / 2;
    sun.position.x = sizes.width / 2 + sunRadius * 0.3;
    sun.scale.set(1, 1, 1);

    // Update planet scales
    planetGroups.forEach((group, index) => {
      const planet = PLANETS[index];
      group.children[0].scale.set(planet.size, planet.size, 1);
    });
  };

  window.addEventListener('resize', handleResize);

  // Animation
  const animate = () => {
    requestAnimationFrame(animate);
    const time = performance.now() * 0.001;
    
    // Update plasma effect
    if (sun?.material instanceof THREE.ShaderMaterial) {
      sun.material.uniforms.time.value = time * 0.5; // Slowed down for better effect
    }
    
    renderer.render(scene, camera);
  };

  animate();

  // Add this to your setup/mounted function after creating the sun
  const animateSun = () => {
    const pulseScale = 1.02;
    const duration = 2;
    
    gsap.to(sun.scale, {
      x: pulseScale,
      y: pulseScale,
      duration: duration,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut"
    });
  };

  animateSun();

  // Add a glow effect that varies opacity
  const animateSunGlow = () => {
    const glowLayers = sun.children;
    
    glowLayers.forEach((layer, index) => {
      const glowMesh = layer as THREE.Mesh;
      const material = glowMesh.material as THREE.MeshBasicMaterial;
      
      gsap.to(material, {
        opacity: material.opacity * 0.7,
        duration: 1.5 + (index * 0.2),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    });
  };

  animateSunGlow();

  // Add this after creating the sun
  const animateSunRotation = () => {
    // Continuous rotation for the sun core
    // To change core rotation speed, modify the duration value (lower = faster)
    gsap.to(sun.rotation, {
      z: Math.PI * 2, // Full rotation
      duration: 30, // Duration in seconds - Increased speed (was 100)
      repeat: -1, // Infinite repeat
      ease: "none"
    });

    // Optional: Counter-rotation for glow layers
    sun.children.forEach((layer: THREE.Object3D, index: number) => {
      // To change glow layer speeds, modify these values:
      // - Base duration: 20 (lower = faster)
      // - Speed variance per layer: 0.5 (higher = more variance between layers)
      gsap.to(layer.rotation, {
        z: -Math.PI * 2,
        duration: 20 + (index * 0.5), // Increased speed (was 50 + index * 1)
        repeat: -1,
        ease: "none"
      });
    });
  };

  // Call it after creating the sun
  animateSunRotation();

  // Cleanup
  onBeforeUnmount(() => {
    cancelAnimationFrame(animationFrameId);
    window.removeEventListener('resize', handleResize);
    renderer.dispose();
  });
});

function addFlareGlow() {
    throw new Error('Function not implemented.');
}

const createSolarFlares = () => {
  const flareGeometry = new THREE.BufferGeometry();
  const flareCount = 50;
  const positions = new Float32Array(flareCount * 3);
  const velocities = new Float32Array(flareCount * 3);
  
  for(let i = 0; i < flareCount; i++) {
    const angle = (Math.random() * Math.PI * 2);
    const radius = 1 * 1.1;
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = Math.sin(angle) * radius;
    positions[i * 3 + 2] = 0;
    
    velocities[i * 3] = (Math.random() - 0.5) * 0.02;
    velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
    velocities[i * 3 + 2] = 0;
  }
  
  flareGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  
  const flareMaterial = new THREE.PointsMaterial({
    color: 0xff3300,
    size: 2,
    blending: THREE.AdditiveBlending,
    transparent: true
  });
  
  const flareSystem = new THREE.Points(flareGeometry, flareMaterial);
  scene.add(flareSystem);
  return { flareSystem, positions, velocities };
};

const createCorona = () => {
  const coronaGeometry = new THREE.RingGeometry(
    1.2 * 100, // Assuming sunRadius is 100, replace with the actual value or variable if defined
    2 * 100,   // Assuming sunRadius is 100, replace with the actual value or variable if defined
    64
  );
  const coronaMaterial = new THREE.ShaderMaterial({
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      varying vec2 vUv;
      
      void main() {
        float intensity = 1.0 - (vUv.y * 2.0);
        intensity *= 0.7;
        
        vec3 color = vec3(1.0, 0.6, 0.1) * intensity;
        gl_FragColor = vec4(color, intensity * 0.5);
      }
    `,
    uniforms: {
      time: { value: 0 }
    },
    transparent: true,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide
  });
  
  const corona = new THREE.Mesh(coronaGeometry, coronaMaterial);
  scene.add(corona);
  return corona;
};

const createMagneticFields = () => {
  const curves = [];
  const fieldCount = 12;
  
  for(let i = 0; i < fieldCount; i++) {
    const points = [];
    const startAngle = (i / fieldCount) * Math.PI * 2;
    const endAngle = ((i + 0.5) / fieldCount) * Math.PI * 2;
    
    for(let t = 0; t <= 1; t += 0.1) {
      const angle = startAngle * (1 - t) + endAngle * t;
      const radius = 1 * (1 + Math.sin(t * Math.PI) * 0.3);
      points.push(new THREE.Vector3(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        0
      ));
    }
    
    const curve = new THREE.CatmullRomCurve3(points);
    curves.push(curve);
  }
  
  const fieldMaterial = new THREE.LineBasicMaterial({
    color: 0xff6600,
    transparent: true,
    opacity: 0.3
  });
  
  const fields = curves.map(curve => {
    const geometry = new THREE.BufferGeometry().setFromPoints(
      curve.getPoints(50)
    );
    return new THREE.Line(geometry, fieldMaterial);
  });
  
  fields.forEach(field => scene.add(field));
  return fields;
};
</script>

<style scoped>
canvas {
  position: fixed !important;
}

/* Add smooth transitions for label opacity */
div {
  transition: opacity 0.3s ease;
}
</style>