/**
 * ============================================================================
 * NIGHT TOWN 3D - Complete First-Person 3D Web Game Engine
 * Powered by Three.js & Web Audio API
 * ============================================================================
 */

import * as THREE from 'three';

/* ============================================================================
 * 1. SOUND MANAGER (Web Audio API Synthesizer - 100% Self-Contained)
 * ============================================================================ */
class SoundManager {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.heartbeatTimer = null;
    this.lastFootstep = 0;
  }

  init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  playFootstep(isSprinting) {
    if (this.muted || !this.ctx) return;
    const now = performance.now();
    const interval = isSprinting ? 280 : 420;
    if (now - this.lastFootstep < interval) return;
    this.lastFootstep = now;

    try {
      const bufferSize = this.ctx.sampleRate * 0.05;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(isSprinting ? 600 : 380, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(isSprinting ? 0.22 : 0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
    } catch (e) {
      // Audio fallback
    }
  }

  playJump() {
    if (this.muted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320, this.ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.18);
    } catch (e) {}
  }

  playLand() {
    if (this.muted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(90, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.14);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.14);
    } catch (e) {}
  }

  playKeyCollect() {
    if (this.muted || !this.ctx) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.07);

        gain.gain.setValueAtTime(0, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.25, this.ctx.currentTime + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + idx * 0.07 + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + idx * 0.07);
        osc.stop(this.ctx.currentTime + idx * 0.07 + 0.36);
      });
    } catch (e) {}
  }

  playDoorOpen() {
    if (this.muted || !this.ctx) return;
    try {
      // Heavy mechanical creak
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(65, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(110, this.ctx.currentTime + 0.8);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(250, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.2);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 1.2);
    } catch (e) {}
  }

  playDoorLocked() {
    if (this.muted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(110, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.01, this.ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.32);
    } catch (e) {}
  }

  playFlashlight() {
    if (this.muted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch (e) {}
  }

  playAlert() {
    if (this.muted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(450, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, this.ctx.currentTime + 0.4);

      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.45);
    } catch (e) {}
  }

  playHeartbeat() {
    if (this.muted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(55, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.13);
    } catch (e) {}
  }

  playGameOver() {
    if (this.muted || !this.ctx) return;
    try {
      const notes = [196, 174.61, 155.56, 130.81];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.2);

        gain.gain.setValueAtTime(0.3, this.ctx.currentTime + idx * 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.2 + 0.6);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(350, this.ctx.currentTime);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + idx * 0.2);
        osc.stop(this.ctx.currentTime + idx * 0.2 + 0.65);
      });
    } catch (e) {}
  }

  playVictory() {
    if (this.muted || !this.ctx) return;
    try {
      const chords = [
        { f: 523.25, t: 0.0 }, // C5
        { f: 659.25, t: 0.15 }, // E5
        { f: 783.99, t: 0.3 }, // G5
        { f: 1046.5, t: 0.5 }, // C6
        { f: 1318.5, t: 0.7 }  // E6
      ];
      chords.forEach(c => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(c.f, this.ctx.currentTime + c.t);

        gain.gain.setValueAtTime(0.28, this.ctx.currentTime + c.t);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + c.t + 0.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + c.t);
        osc.stop(this.ctx.currentTime + c.t + 0.85);
      });
    } catch (e) {}
  }
}

/* ============================================================================
 * 2. PROCEDURAL TEXTURE GENERATOR (Generates rich textures on HTML5 Canvases)
 * ============================================================================ */
class TextureGenerator {
  static createAsphaltTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Base asphalt dark grey
    ctx.fillStyle = '#1c1e24';
    ctx.fillRect(0, 0, 512, 512);

    // Grain & noise
    const imgData = ctx.getImageData(0, 0, 512, 512);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 22;
      data[i] = Math.min(255, Math.max(0, data[i] + noise));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
    }
    ctx.putImageData(imgData, 0, 0);

    // Weathered dashed center line
    ctx.fillStyle = 'rgba(230, 210, 110, 0.65)';
    for (let y = 30; y < 512; y += 80) {
      ctx.fillRect(248, y, 16, 45);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }

  static createSidewalkTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#2a303c';
    ctx.fillRect(0, 0, 256, 256);

    // Tile grid
    ctx.strokeStyle = '#1a1f29';
    ctx.lineWidth = 4;
    ctx.strokeRect(4, 4, 124, 124);
    ctx.strokeRect(128, 4, 124, 124);
    ctx.strokeRect(4, 128, 124, 124);
    ctx.strokeRect(128, 128, 124, 124);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }

  static createBuildingTexture(colorHex, litRatio = 0.25) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Concrete / Brick base
    ctx.fillStyle = colorHex || '#1e2430';
    ctx.fillRect(0, 0, 512, 512);

    // Horizontal brick lines
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.lineWidth = 2;
    for (let y = 0; y < 512; y += 16) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(512, y);
      ctx.stroke();
    }

    // Windows grid
    const rows = 8;
    const cols = 6;
    const winW = 36;
    const winH = 44;
    const gapX = (512 - cols * winW) / (cols + 1);
    const gapY = (512 - rows * winH) / (rows + 1);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = gapX + c * (winW + gapX);
        const y = gapY + r * (winH + gapY);

        // Window frame
        ctx.fillStyle = '#11151e';
        ctx.fillRect(x - 3, y - 3, winW + 6, winH + 6);

        // Window pane: dark or glowing night interior
        const isLit = Math.random() < litRatio;
        if (isLit) {
          const warm = Math.random() > 0.4;
          ctx.fillStyle = warm ? 'rgba(251, 191, 36, 0.85)' : 'rgba(125, 211, 252, 0.8)';
          ctx.fillRect(x, y, winW, winH);
          // Window cross divider
          ctx.fillStyle = '#11151e';
          ctx.fillRect(x + winW / 2 - 1, y, 2, winH);
          ctx.fillRect(x, y + winH / 2 - 1, winW, 2);
        } else {
          ctx.fillStyle = '#0a0d14';
          ctx.fillRect(x, y, winW, winH);
          // Subtle faint reflection
          ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + winW, y + winH);
          ctx.lineTo(x, y + winH);
          ctx.fill();
        }
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }

  static createCrateTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Wood base
    ctx.fillStyle = '#6d4c2d';
    ctx.fillRect(0, 0, 256, 256);

    // Wood planks
    ctx.fillStyle = '#53371e';
    ctx.fillRect(0, 0, 256, 24);
    ctx.fillRect(0, 232, 256, 24);
    ctx.fillRect(0, 0, 24, 256);
    ctx.fillRect(232, 0, 24, 256);

    // Diagonal brace
    ctx.lineWidth = 26;
    ctx.strokeStyle = '#4a301a';
    ctx.beginPath();
    ctx.moveTo(14, 14);
    ctx.lineTo(242, 242);
    ctx.stroke();

    // Rivets / Nails
    ctx.fillStyle = '#222';
    const rivets = [[12, 12], [244, 12], [12, 244], [244, 244]];
    rivets.forEach(([rx, ry]) => {
      ctx.beginPath();
      ctx.arc(rx, ry, 5, 0, Math.PI * 2);
      ctx.fill();
    });

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  static createBarricadeTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#eab308';
    ctx.fillRect(0, 0, 256, 64);

    ctx.fillStyle = '#0f172a';
    for (let x = -64; x < 320; x += 48) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + 24, 0);
      ctx.lineTo(x - 12, 64);
      ctx.lineTo(x - 36, 64);
      ctx.fill();
    }

    return new THREE.CanvasTexture(canvas);
  }
}

/* ============================================================================
 * 3. WORLD BUILDER (Abandoned Night Town Map & Colliders)
 * ============================================================================ */
class WorldBuilder {
  constructor(scene) {
    this.scene = scene;
    this.colliders = []; // Array of { minX, maxX, minZ, maxZ } bounding boxes
    this.interactables = []; // Array of objects with { mesh, type, data, interact }
    this.keys = [];
    this.gateObject = null;
    this.gateDoors = [];
    this.lampLights = [];
  }

  build() {
    this.createEnvironment();
    this.createGround();
    this.createBuildings();
    this.createStreetFurniture();
    this.createStreetLamps();
    this.createTrees();
    this.createExitGate();
    this.createKeys();
    this.createBoundaryWalls();
  }

  createEnvironment() {
    // Night sky color & atmospheric fog
    this.scene.background = new THREE.Color(0x05070a);
    this.scene.fog = new THREE.FogExp2(0x0a0c14, 0.022);

    // Ambient night lighting
    const ambientLight = new THREE.AmbientLight(0x162238, 0.85);
    this.scene.add(ambientLight);

    // Moonlight (Directional Light with blue tint & shadows)
    const moonLight = new THREE.DirectionalLight(0xa5c4e8, 1.2);
    moonLight.position.set(30, 50, 40);
    moonLight.castShadow = true;
    moonLight.shadow.mapSize.width = 2048;
    moonLight.shadow.mapSize.height = 2048;
    moonLight.shadow.camera.near = 10;
    moonLight.shadow.camera.far = 120;
    moonLight.shadow.camera.left = -50;
    moonLight.shadow.camera.right = 50;
    moonLight.shadow.camera.top = 50;
    moonLight.shadow.camera.bottom = -50;
    moonLight.shadow.bias = -0.001;
    this.scene.add(moonLight);

    // Glowing 3D Moon in sky
    const moonGeo = new THREE.SphereGeometry(4, 24, 24);
    const moonMat = new THREE.MeshBasicMaterial({ color: 0xf1f5f9 });
    const moon = new THREE.Mesh(moonGeo, moonMat);
    moon.position.set(65, 85, 75);
    this.scene.add(moon);

    // Moon halo
    const haloGeo = new THREE.SphereGeometry(6, 16, 16);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.18,
      side: THREE.BackSide
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.position.copy(moon.position);
    this.scene.add(halo);

    // Distant Stars particle field
    const starsGeo = new THREE.BufferGeometry();
    const starCount = 350;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 300;
      starPositions[i + 1] = 40 + Math.random() * 80;
      starPositions[i + 2] = (Math.random() - 0.5) * 300;
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starsMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.8, transparent: true, opacity: 0.75 });
    const starField = new THREE.Points(starsGeo, starsMat);
    this.scene.add(starField);
  }

  createGround() {
    // City ground base
    const groundGeo = new THREE.PlaneGeometry(100, 100);
    const asphaltTex = TextureGenerator.createAsphaltTexture();
    asphaltTex.repeat.set(10, 10);
    const groundMat = new THREE.MeshStandardMaterial({
      map: asphaltTex,
      roughness: 0.85,
      metalness: 0.15
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // Sidewalk slabs
    const sidewalkTex = TextureGenerator.createSidewalkTexture();
    sidewalkTex.repeat.set(4, 30);
    const sidewalkMat = new THREE.MeshStandardMaterial({
      map: sidewalkTex,
      roughness: 0.8
    });

    // West Sidewalk
    const wSidewalk = new THREE.Mesh(new THREE.BoxGeometry(4, 0.22, 75), sidewalkMat);
    wSidewalk.position.set(-8, 0.11, 0);
    wSidewalk.receiveShadow = true;
    this.scene.add(wSidewalk);

    // East Sidewalk
    const eSidewalk = new THREE.Mesh(new THREE.BoxGeometry(4, 0.22, 75), sidewalkMat);
    eSidewalk.position.set(8, 0.11, 0);
    eSidewalk.receiveShadow = true;
    this.scene.add(eSidewalk);

    // Cross Street Sidewalks
    const crossSidewalk1 = new THREE.Mesh(new THREE.BoxGeometry(75, 0.22, 4), sidewalkMat);
    crossSidewalk1.position.set(0, 0.11, 15);
    crossSidewalk1.receiveShadow = true;
    this.scene.add(crossSidewalk1);

    const crossSidewalk2 = new THREE.Mesh(new THREE.BoxGeometry(75, 0.22, 4), sidewalkMat);
    crossSidewalk2.position.set(0, 0.11, -15);
    crossSidewalk2.receiveShadow = true;
    this.scene.add(crossSidewalk2);
  }

  createBuildings() {
    // Building definitions: [x, z, width, depth, height, colorHex, litRatio]
    const buildingSpecs = [
      // West Street Blocks
      [-19, 28, 14, 14, 16, '#1a2233', 0.3],
      [-19, 9, 14, 12, 14, '#242b3d', 0.25],
      [-19, -9, 14, 12, 18, '#1e2430', 0.35],
      [-19, -28, 14, 14, 20, '#19202c', 0.2],

      // East Street Blocks
      [19, 28, 14, 14, 15, '#222a3a', 0.25],
      [19, 9, 14, 12, 19, '#1a2233', 0.4],
      [19, -9, 14, 12, 16, '#282f40', 0.3],
      [19, -28, 14, 14, 22, '#1b2332', 0.2],

      // Far West Alley Buildings
      [-34, 22, 10, 20, 12, '#181e28', 0.15],
      [-34, -5, 10, 18, 14, '#151b24', 0.2],
      [-34, -26, 10, 16, 13, '#1a212e', 0.1],

      // Far East Park Enclosures & Warehouses
      [34, 22, 10, 20, 11, '#1b2230', 0.2],
      [34, -5, 10, 18, 15, '#171d28', 0.25],
      [34, -26, 10, 16, 14, '#1f2736', 0.2],

      // South Entrance Gateway flankers
      [-11, 38, 8, 6, 9, '#1c2434', 0.1],
      [11, 38, 8, 6, 9, '#1c2434', 0.1]
    ];

    buildingSpecs.forEach(([x, z, w, d, h, col, lit]) => {
      const tex = TextureGenerator.createBuildingTexture(col, lit);
      tex.repeat.set(Math.round(w / 4), Math.round(h / 3));

      const mat = new THREE.MeshStandardMaterial({
        map: tex,
        roughness: 0.8,
        metalness: 0.1
      });

      const geo = new THREE.BoxGeometry(w, h, d);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, h / 2, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      this.scene.add(mesh);

      // Rooftop rim / cornice
      const rimGeo = new THREE.BoxGeometry(w + 0.6, 0.6, d + 0.6);
      const rimMat = new THREE.MeshStandardMaterial({ color: 0x0f1522, roughness: 0.9 });
      const rim = new THREE.Mesh(rimGeo, rimMat);
      rim.position.set(x, h + 0.3, z);
      this.scene.add(rim);

      // Register collision box (with padding)
      this.addCollider(x - w / 2 - 0.4, x + w / 2 + 0.4, z - d / 2 - 0.4, z + d / 2 + 0.4);
    });

    // Central Town Plaza Fountain / Monument (Key 2 location)
    this.createTownSquareMonument(0, 0);
  }

  createTownSquareMonument(x, z) {
    // Plaza circular / octagonal base
    const baseGeo = new THREE.CylinderGeometry(4.5, 4.8, 0.6, 16);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x222a38, roughness: 0.7 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.set(x, 0.3, z);
    base.receiveShadow = true;
    this.scene.add(base);

    // Center stone pillar
    const pillarGeo = new THREE.CylinderGeometry(0.8, 1.2, 3.5, 12);
    const pillarMat = new THREE.MeshStandardMaterial({ color: 0x2d3748, roughness: 0.6 });
    const pillar = new THREE.Mesh(pillarGeo, pillarMat);
    pillar.position.set(x, 2.0, z);
    pillar.castShadow = true;
    this.scene.add(pillar);

    // Top ornamental bowl
    const bowlGeo = new THREE.CylinderGeometry(1.6, 0.5, 0.8, 12);
    const bowl = new THREE.Mesh(bowlGeo, pillarMat);
    bowl.position.set(x, 3.8, z);
    this.scene.add(bowl);

    // Front display pedestal for Key 2 facing approaching player from south
    const altarGeo = new THREE.BoxGeometry(1.0, 1.1, 1.0);
    const altarMat = new THREE.MeshStandardMaterial({ color: 0x2e3848, roughness: 0.6 });
    const altar = new THREE.Mesh(altarGeo, altarMat);
    altar.position.set(x, 0.55, z + 2.5);
    altar.castShadow = true;
    altar.receiveShadow = true;
    this.scene.add(altar);

    this.addCollider(x - 2.5, x + 2.5, z - 2.5, z + 2.5);
    this.addCollider(x - 0.6, x + 0.6, z + 2.0, z + 3.1);
  }

  createStreetLamps() {
    const lampPositions = [
      [-6, 26], [6, 26],
      [-6, 6], [6, 6],
      [-6, -10], [6, -10],
      [-6, -26], [6, -26],
      [-26, 15], [26, 15],
      [-26, -15], [26, -15]
    ];

    const metalMat = new THREE.MeshStandardMaterial({ color: 0x0a0e17, metalness: 0.85, roughness: 0.3 });
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0xffedd5,
      emissive: 0xffdb8e,
      emissiveIntensity: 1.9,
      roughness: 0.1
    });

    lampPositions.forEach(([lx, lz]) => {
      const lampGroup = new THREE.Group();

      // Pole
      const poleGeo = new THREE.CylinderGeometry(0.12, 0.18, 5.0, 8);
      const pole = new THREE.Mesh(poleGeo, metalMat);
      pole.position.y = 2.5;
      pole.castShadow = true;
      lampGroup.add(pole);

      // Arm
      const armGeo = new THREE.BoxGeometry(0.8, 0.1, 0.1);
      const arm = new THREE.Mesh(armGeo, metalMat);
      arm.position.set(lx < 0 ? 0.35 : -0.35, 4.9, 0);
      lampGroup.add(arm);

      // Lantern housing
      const lanternGeo = new THREE.CylinderGeometry(0.35, 0.22, 0.6, 6);
      const lantern = new THREE.Mesh(lanternGeo, glassMat);
      lantern.position.set(lx < 0 ? 0.7 : -0.7, 4.6, 0);
      lampGroup.add(lantern);

      // Warm PointLight
      const pointLight = new THREE.PointLight(0xffdb8e, 1.7, 17, 2.0);
      pointLight.position.set(lx < 0 ? 0.7 : -0.7, 4.4, 0);
      pointLight.castShadow = true;
      pointLight.shadow.bias = -0.002;
      lampGroup.add(pointLight);

      lampGroup.position.set(lx, 0, lz);
      this.scene.add(lampGroup);

      this.lampLights.push(pointLight);
      this.addCollider(lx - 0.4, lx + 0.4, lz - 0.4, lz + 0.4);
    });
  }

  createStreetFurniture() {
    const crateTex = TextureGenerator.createCrateTexture();
    const crateMat = new THREE.MeshStandardMaterial({ map: crateTex, roughness: 0.85 });
    const barricadeTex = TextureGenerator.createBarricadeTexture();
    const barricadeMat = new THREE.MeshStandardMaterial({ map: barricadeTex, roughness: 0.6 });

    // Wooden crate stacks in alleys
    const cratePositions = [
      // West alley stack (Near Key 1)
      [-26, 0, 1.2, 1.2, 1.2],
      [-26.8, 0, 1.2, 1.2, 1.2],
      [-26.4, 1.2, 1.2, 1.2, 1.2],
      [-27.2, 0, 1.2, 1.2, 1.2],

      // Plaza crates
      [8.5, 0, 1.0, 1.0, 1.0],
      [8.5, 1.0, 1.0, 1.0, 1.0],
      [9.5, 0, 1.0, 1.0, 1.0],

      // East park crates (Near Key 3)
      [24, 0, 1.4, 1.4, 1.4],
      [25.5, 0, 1.4, 1.4, 1.4],
      [24.7, 1.4, 1.4, 1.4, 1.4],
      [26.5, 0, -14.0, 1.2, 0.9, 1.2],

      // Near Exit Gate
      [-4.5, 0, -32, 1.2, 1.2, 1.2],
      [4.5, 0, -32, 1.2, 1.2, 1.2]
    ];

    cratePositions.forEach(([cx, cy, cz, w, h, d]) => {
      const geo = new THREE.BoxGeometry(w, h, d);
      const mesh = new THREE.Mesh(geo, crateMat);
      mesh.position.set(cx, cy + h / 2, cz);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      this.scene.add(mesh);
      this.addCollider(cx - w / 2 - 0.2, cx + w / 2 + 0.2, cz - d / 2 - 0.2, cz + d / 2 + 0.2);
    });

    // Hazard Road Barricades
    const barricadePositions = [
      [-5, 34, 0],
      [5, 34, 0],
      [-24, -20, Math.PI / 4],
      [24, 18, -Math.PI / 6]
    ];

    barricadePositions.forEach(([bx, bz, rot]) => {
      const bGroup = new THREE.Group();
      const boardGeo = new THREE.BoxGeometry(2.4, 0.6, 0.12);
      const board = new THREE.Mesh(boardGeo, barricadeMat);
      board.position.y = 0.8;
      bGroup.add(board);

      // Legs
      const legMat = new THREE.MeshStandardMaterial({ color: 0x334155 });
      const leg1 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.9, 0.4), legMat);
      leg1.position.set(-1.0, 0.45, 0);
      const leg2 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.9, 0.4), legMat);
      leg2.position.set(1.0, 0.45, 0);
      bGroup.add(leg1);
      bGroup.add(leg2);

      bGroup.position.set(bx, 0, bz);
      bGroup.rotation.y = rot;
      this.scene.add(bGroup);

      this.addCollider(bx - 1.2, bx + 1.2, bz - 0.6, bz + 0.6);
    });
  }

  createTrees() {
    // Night trees (twisted dark bark + foliage)
    const treePositions = [
      [25, -5], [28, -8], [24, -12], [27, -18],
      [-25, 20], [-27, 25],
      [-7, 18], [7, 18],
      [-7, -20], [7, -20]
    ];

    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x1c1712, roughness: 0.95 });
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x0f241a, roughness: 0.85 });

    treePositions.forEach(([tx, tz]) => {
      const tree = new THREE.Group();

      // Trunk
      const trunkGeo = new THREE.CylinderGeometry(0.25, 0.45, 4.0, 7);
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = 2.0;
      trunk.castShadow = true;
      tree.add(trunk);

      // Canopy layers
      const cone1 = new THREE.Mesh(new THREE.ConeGeometry(2.2, 3.2, 6), leafMat);
      cone1.position.y = 4.2;
      cone1.castShadow = true;
      tree.add(cone1);

      const cone2 = new THREE.Mesh(new THREE.ConeGeometry(1.6, 2.6, 6), leafMat);
      cone2.position.y = 5.8;
      cone2.castShadow = true;
      tree.add(cone2);

      tree.position.set(tx, 0, tz);
      this.scene.add(tree);

      this.addCollider(tx - 0.7, tx + 0.7, tz - 0.7, tz + 0.7);
    });
  }

  createExitGate() {
    // Located at the far North of Main Street: Z = -35
    const gateGroup = new THREE.Group();
    gateGroup.position.set(0, 0, -35);

    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
    const ironMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9, roughness: 0.25 });

    // Gate pillars
    const pillar1 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 7, 1.2), stoneMat);
    pillar1.position.set(-3.6, 3.5, 0);
    pillar1.castShadow = true;
    gateGroup.add(pillar1);

    const pillar2 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 7, 1.2), stoneMat);
    pillar2.position.set(3.6, 3.5, 0);
    pillar2.castShadow = true;
    gateGroup.add(pillar2);

    // Archway top beam
    const arch = new THREE.Mesh(new THREE.BoxGeometry(8.4, 0.8, 1.2), stoneMat);
    arch.position.set(0, 6.8, 0);
    arch.castShadow = true;
    gateGroup.add(arch);

    // Lock Terminal Panel
    const panelGeo = new THREE.BoxGeometry(0.8, 1.2, 0.4);
    const panelMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.5 });
    const panel = new THREE.Mesh(panelGeo, panelMat);
    panel.position.set(-2.8, 2.5, 0.7);
    gateGroup.add(panel);

    // 3 Status LED Bulbs on the lock panel
    this.keyIndicators = [];
    for (let i = 0; i < 3; i++) {
      const ledGeo = new THREE.SphereGeometry(0.08, 8, 8);
      const ledMat = new THREE.MeshBasicMaterial({ color: 0xef4444 }); // Red when locked
      const led = new THREE.Mesh(ledGeo, ledMat);
      led.position.set(-2.8, 2.8 - i * 0.25, 0.92);
      gateGroup.add(led);
      this.keyIndicators.push(led);
    }

    // Left Gate Door
    const doorGeo = new THREE.BoxGeometry(3.0, 5.8, 0.15);
    const leftDoor = new THREE.Mesh(doorGeo, ironMat);
    leftDoor.position.set(-1.5, 3.0, 0);
    leftDoor.castShadow = true;
    const leftPivot = new THREE.Group();
    leftPivot.position.set(-3.0, 0, 0);
    leftDoor.position.set(1.5, 3.0, 0);
    leftPivot.add(leftDoor);
    gateGroup.add(leftPivot);

    // Right Gate Door
    const rightDoor = new THREE.Mesh(doorGeo, ironMat);
    const rightPivot = new THREE.Group();
    rightPivot.position.set(3.0, 0, 0);
    rightDoor.position.set(-1.5, 3.0, 0);
    rightDoor.castShadow = true;
    rightPivot.add(rightDoor);
    gateGroup.add(rightPivot);

    this.gateDoors = [leftPivot, rightPivot];

    // Escape Road beyond the gate (leads to freedom)
    const freedomLight = new THREE.PointLight(0x10b981, 1.5, 20);
    freedomLight.position.set(0, 4, -8);
    gateGroup.add(freedomLight);

    this.scene.add(gateGroup);
    this.gateObject = gateGroup;

    // Gate collision collider
    this.gateCollider = { minX: -3.6, maxX: 3.6, minZ: -36.0, maxZ: -34.0, isGate: true };
    this.colliders.push(this.gateCollider);

    // Interactable Gate Terminal
    this.interactables.push({
      type: 'gate',
      position: new THREE.Vector3(0, 1.8, -34.5),
      radius: 4.5,
      promptText: 'البوابة الرئيسية',
      action: 'openGate'
    });
  }

  createKeys() {
    // 3 Unique Collectible Keys
    const keyData = [
      {
        id: 1,
        name: 'مفتاح الزقاق الغربي (Bronze Key)',
        pos: new THREE.Vector3(-27.5, 1.4, 1.5),
        color: 0xf97316, // Sleek Orange
        slotId: 'slot-1'
      },
      {
        id: 2,
        name: 'مفتاح ساحة البلدة (Silver Key)',
        pos: new THREE.Vector3(0, 1.45, 2.5),
        color: 0x38bdf8, // Cyan / Silver
        slotId: 'slot-2'
      },
      {
        id: 3,
        name: 'مفتاح حديقة الظلال (Gold Key)',
        pos: new THREE.Vector3(26.5, 1.25, -14.0),
        color: 0x10b981, // Emerald / Gold
        slotId: 'slot-3'
      }
    ];

    keyData.forEach(kd => {
      const keyGroup = new THREE.Group();

      const keyMat = new THREE.MeshStandardMaterial({
        color: kd.color,
        emissive: kd.color,
        emissiveIntensity: 0.7,
        metalness: 0.9,
        roughness: 0.2
      });

      // Key Ring / Bow
      const ringGeo = new THREE.TorusGeometry(0.26, 0.08, 12, 24);
      const ring = new THREE.Mesh(ringGeo, keyMat);
      ring.position.y = 0.55;
      keyGroup.add(ring);

      // Key Stem
      const stemGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.75, 12);
      const stem = new THREE.Mesh(stemGeo, keyMat);
      stem.position.y = 0.15;
      keyGroup.add(stem);

      // Key Teeth
      const teethGeo = new THREE.BoxGeometry(0.18, 0.25, 0.06);
      const teeth = new THREE.Mesh(teethGeo, keyMat);
      teeth.position.set(0.09, -0.12, 0);
      keyGroup.add(teeth);

      // Glowing Point Light attached to key
      const keyLight = new THREE.PointLight(kd.color, 1.4, 6);
      keyLight.position.set(0, 0.3, 0);
      keyGroup.add(keyLight);

      // Glow halo
      const haloGeo = new THREE.SphereGeometry(0.55, 12, 12);
      const haloMat = new THREE.MeshBasicMaterial({
        color: kd.color,
        transparent: true,
        opacity: 0.22,
        side: THREE.BackSide
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.position.set(0, 0.3, 0);
      keyGroup.add(halo);

      keyGroup.position.copy(kd.pos);
      this.scene.add(keyGroup);

      const keyObj = {
        id: kd.id,
        name: kd.name,
        group: keyGroup,
        light: keyLight,
        color: kd.color,
        slotId: kd.slotId,
        collected: false,
        baseY: kd.pos.y,
        position: kd.pos
      };

      this.keys.push(keyObj);

      // Add to interactables
      this.interactables.push({
        type: 'key',
        keyId: kd.id,
        position: kd.pos,
        radius: 3.5,
        promptText: `جمع ${kd.name}`,
        action: 'collectKey'
      });
    });
  }

  createBoundaryWalls() {
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x0b111e,
      roughness: 0.95
    });

    // 4 High Perimeter Walls (X = ±42, Z = ±42)
    const wallConfigs = [
      [0, 42, 86, 1.2, 8],    // South Wall (Behind player start)
      [0, -42, 86, 1.2, 8],   // North Wall
      [-42, 0, 1.2, 86, 8],   // West Wall
      [42, 0, 1.2, 86, 8]     // East Wall
    ];

    wallConfigs.forEach(([wx, wz, w, d, h]) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), wallMat);
      mesh.position.set(wx, h / 2, wz);
      mesh.receiveShadow = true;
      this.scene.add(mesh);
      this.addCollider(wx - w / 2, wx + w / 2, wz - d / 2, wz + d / 2);
    });
  }

  addCollider(minX, maxX, minZ, maxZ) {
    this.colliders.push({ minX, maxX, minZ, maxZ });
  }

  updateKeyIndicators(keysCount) {
    for (let i = 0; i < 3; i++) {
      if (this.keyIndicators[i]) {
        if (i < keysCount) {
          this.keyIndicators[i].material.color.setHex(0x10b981); // Green when unlocked
        } else {
          this.keyIndicators[i].material.color.setHex(0xef4444); // Red
        }
      }
    }
  }

  openGateAnimation(onComplete) {
    const startTime = performance.now();
    const duration = 2400; // 2.4s smooth swing open
    const [leftDoor, rightDoor] = this.gateDoors;

    const animateGate = () => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(1.0, elapsed / duration);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);

      if (leftDoor && rightDoor) {
        leftDoor.rotation.y = -ease * (Math.PI * 0.55);
        rightDoor.rotation.y = ease * (Math.PI * 0.55);
      }

      if (progress < 1.0) {
        requestAnimationFrame(animateGate);
      } else {
        // Remove gate collision
        const idx = this.colliders.indexOf(this.gateCollider);
        if (idx !== -1) {
          this.colliders.splice(idx, 1);
        }
        if (onComplete) onComplete();
      }
    };

    animateGate();
  }

  reset() {
    if (this.gateDoors && this.gateDoors.length === 2) {
      this.gateDoors[0].rotation.y = 0;
      this.gateDoors[1].rotation.y = 0;
    }
    if (this.gateCollider && !this.colliders.includes(this.gateCollider)) {
      this.colliders.push(this.gateCollider);
    }
    this.keys.forEach(k => {
      k.collected = false;
      k.group.visible = true;
    });
    this.updateKeyIndicators(0);
  }
}

/* ============================================================================
 * 4. PLAYER & FPS CONTROLLER (WASD, Mouse Look, Sprint, Jump, Flashlight)
 * ============================================================================ */
class PlayerController {
  constructor(camera, domElement, colliders, soundManager) {
    this.camera = camera;
    this.domElement = domElement;
    this.colliders = colliders;
    this.sound = soundManager;

    // Movement physics
    this.position = new THREE.Vector3(0, 1.7, 34); // Starting courtyard
    this.velocity = new THREE.Vector3();
    this.yaw = 0;
    this.pitch = 0;
    this.isGrounded = true;
    this.radius = 0.45; // Player collision radius

    // Speeds & Stats
    this.walkSpeed = 5.2;
    this.sprintSpeed = 8.8;
    this.jumpForce = 6.8;
    this.gravity = 18.5;

    // Stamina
    this.stamina = 100;
    this.maxStamina = 100;
    this.staminaDrain = 28; // per second
    this.staminaRegen = 20; // per second
    this.isSprinting = false;

    // Head-bobbing
    this.bobTimer = 0;
    this.baseEyeHeight = 1.7;

    // Keys State
    this.keys = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      sprint: false,
      jump: false
    };

    // Flashlight
    this.flashlightOn = true;
    this.flashlight = null;
    this.createFlashlight();

    // Event bindings & controls
    this.isLocked = false;
    this.isDragging = false;
    this.lastPointerX = 0;
    this.lastPointerY = 0;
    this.setupInputs();
  }

  createFlashlight() {
    this.flashlight = new THREE.SpotLight(0xffffff, 2.4, 32, Math.PI / 6.5, 0.4, 1.8);
    this.flashlight.position.set(0.25, -0.2, 0.2); // Just to the right of eye
    this.flashlight.castShadow = true;
    this.flashlight.shadow.bias = -0.002;

    this.flashlightTarget = new THREE.Object3D();
    this.flashlightTarget.position.set(0, 0, -5);
    this.camera.add(this.flashlightTarget);
    this.flashlight.target = this.flashlightTarget;

    this.camera.add(this.flashlight);
  }

  toggleFlashlight() {
    this.flashlightOn = !this.flashlightOn;
    this.flashlight.intensity = this.flashlightOn ? 2.4 : 0;
    this.sound.playFlashlight();
    return this.flashlightOn;
  }

  setupInputs() {
    // Mouse / Touch Look with Pointer Lock or Drag Fallback
    this.domElement.addEventListener('pointerdown', (e) => {
      if (!this.isLocked) {
        this.isDragging = true;
        this.lastPointerX = e.clientX;
        this.lastPointerY = e.clientY;
      }
    });

    window.addEventListener('pointermove', (e) => {
      if (this.isLocked) {
        const sensitivity = 0.0022;
        this.yaw -= e.movementX * sensitivity;
        this.pitch -= e.movementY * sensitivity;
        this.pitch = Math.max(-Math.PI * 0.46, Math.min(Math.PI * 0.46, this.pitch));
      } else if (this.isDragging) {
        const dx = e.clientX - this.lastPointerX;
        const dy = e.clientY - this.lastPointerY;
        this.lastPointerX = e.clientX;
        this.lastPointerY = e.clientY;
        const dragSensitivity = 0.0035;
        this.yaw -= dx * dragSensitivity;
        this.pitch -= dy * dragSensitivity;
        this.pitch = Math.max(-Math.PI * 0.46, Math.min(Math.PI * 0.46, this.pitch));
      }
    });

    window.addEventListener('pointerup', () => {
      this.isDragging = false;
    });
    window.addEventListener('pointercancel', () => {
      this.isDragging = false;
    });

    // Keyboard inputs
    window.addEventListener('keydown', (e) => {
      switch (e.code) {
        case 'KeyW': case 'ArrowUp': this.keys.forward = true; break;
        case 'KeyS': case 'ArrowDown': this.keys.backward = true; break;
        case 'KeyA': case 'ArrowLeft': this.keys.left = true; break;
        case 'KeyD': case 'ArrowRight': this.keys.right = true; break;
        case 'ShiftLeft': case 'ShiftRight': this.keys.sprint = true; break;
        case 'Space':
          if (this.isGrounded) {
            this.velocity.y = this.jumpForce;
            this.isGrounded = false;
            this.sound.playJump();
          }
          break;
        case 'KeyF':
          this.toggleFlashlight();
          break;
      }
    });

    window.addEventListener('keyup', (e) => {
      switch (e.code) {
        case 'KeyW': case 'ArrowUp': this.keys.forward = false; break;
        case 'KeyS': case 'ArrowDown': this.keys.backward = false; break;
        case 'KeyA': case 'ArrowLeft': this.keys.left = false; break;
        case 'KeyD': case 'ArrowRight': this.keys.right = false; break;
        case 'ShiftLeft': case 'ShiftRight': this.keys.sprint = false; break;
      }
    });

    this.setupMobileControls();
  }

  setupMobileControls() {
    const bindTouchKey = (id, keyName) => {
      const btn = document.getElementById(id);
      if (!btn) return;
      const start = (e) => {
        e.preventDefault();
        btn.classList.add('pressed');
        this.keys[keyName] = true;
      };
      const end = (e) => {
        e.preventDefault();
        btn.classList.remove('pressed');
        this.keys[keyName] = false;
      };
      btn.addEventListener('pointerdown', start);
      btn.addEventListener('pointerup', end);
      btn.addEventListener('pointercancel', end);
      btn.addEventListener('pointerleave', end);
    };

    bindTouchKey('touch-up', 'forward');
    bindTouchKey('touch-down', 'backward');
    bindTouchKey('touch-left', 'left');
    bindTouchKey('touch-right', 'right');
    bindTouchKey('touch-sprint', 'sprint');

    // Jump button
    const jumpBtn = document.getElementById('touch-jump');
    if (jumpBtn) {
      jumpBtn.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        jumpBtn.classList.add('pressed');
        if (this.isGrounded) {
          this.velocity.y = this.jumpForce;
          this.isGrounded = false;
          this.sound.playJump();
        }
      });
      const endJump = () => jumpBtn.classList.remove('pressed');
      jumpBtn.addEventListener('pointerup', endJump);
      jumpBtn.addEventListener('pointercancel', endJump);
    }

    // Flashlight button
    const lightBtn = document.getElementById('touch-light');
    if (lightBtn) {
      lightBtn.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        this.toggleFlashlight();
      });
    }
  }

  update(delta) {
    // 1. Calculate horizontal movement direction relative to camera yaw
    const moveDir = new THREE.Vector3();
    if (this.keys.forward) moveDir.z -= 1;
    if (this.keys.backward) moveDir.z += 1;
    if (this.keys.left) moveDir.x -= 1;
    if (this.keys.right) moveDir.x += 1;

    const isMoving = moveDir.lengthSq() > 0.01;
    if (isMoving) moveDir.normalize();

    // Rotate movement vector according to camera yaw
    moveDir.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.yaw);

    // 2. Sprinting & Stamina logic
    if (this.keys.sprint && isMoving && this.stamina > 5) {
      this.isSprinting = true;
      this.stamina = Math.max(0, this.stamina - this.staminaDrain * delta);
    } else {
      this.isSprinting = false;
      this.stamina = Math.min(this.maxStamina, this.stamina + this.staminaRegen * delta);
    }

    const currentSpeed = this.isSprinting ? this.sprintSpeed : this.walkSpeed;

    // 3. Apply Horizontal Velocity with smooth acceleration/damping
    const targetVelX = moveDir.x * currentSpeed;
    const targetVelZ = moveDir.z * currentSpeed;
    const damping = 12.0;

    this.velocity.x += (targetVelX - this.velocity.x) * Math.min(1.0, damping * delta);
    this.velocity.z += (targetVelZ - this.velocity.z) * Math.min(1.0, damping * delta);

    // 4. Apply Gravity
    this.velocity.y -= this.gravity * delta;

    // 5. Proposed new position
    const nextX = this.position.x + this.velocity.x * delta;
    const nextZ = this.position.z + this.velocity.z * delta;
    const nextY = this.position.y + this.velocity.y * delta;

    // 6. Sliding Collision Detection with World Obstacles
    // Check X axis motion
    if (!this.checkCollision(nextX, this.position.z)) {
      this.position.x = nextX;
    } else {
      this.velocity.x = 0;
    }

    // Check Z axis motion
    if (!this.checkCollision(this.position.x, nextZ)) {
      this.position.z = nextZ;
    } else {
      this.velocity.z = 0;
    }

    // Check Y axis / Ground
    if (nextY <= this.baseEyeHeight) {
      if (!this.isGrounded && this.velocity.y < -3.0) {
        this.sound.playLand();
      }
      this.position.y = this.baseEyeHeight;
      this.velocity.y = 0;
      this.isGrounded = true;
    } else {
      this.position.y = nextY;
      this.isGrounded = false;
    }

    // 7. Head Bobbing & Footsteps
    if (isMoving && this.isGrounded) {
      const bobSpeed = this.isSprinting ? 14 : 9;
      this.bobTimer += delta * bobSpeed;
      const bobOffsetY = Math.sin(this.bobTimer) * (this.isSprinting ? 0.08 : 0.04);
      this.camera.position.y = this.position.y + bobOffsetY;

      // Play footstep on downward bob crest
      this.sound.playFootstep(this.isSprinting);
    } else {
      this.bobTimer = 0;
      this.camera.position.y = this.position.y;
    }

    this.camera.position.x = this.position.x;
    this.camera.position.z = this.position.z;

    // 8. Update Camera Rotation (Yaw & Pitch)
    const euler = new THREE.Euler(0, 0, 0, 'YXZ');
    euler.x = this.pitch;
    euler.y = this.yaw;
    this.camera.quaternion.setFromEuler(euler);

    // Subtle dynamic FOV on sprint
    const targetFov = this.isSprinting ? 80 : 72;
    this.camera.fov += (targetFov - this.camera.fov) * delta * 5.0;
    this.camera.updateProjectionMatrix();
  }

  checkCollision(x, z) {
    const r = this.radius;
    for (const b of this.colliders) {
      if (x + r > b.minX && x - r < b.maxX && z + r > b.minZ && z - r < b.maxZ) {
        return true;
      }
    }
    return false;
  }

  reset(x = 0, y = 1.7, z = 34) {
    this.position.set(x, y, z);
    this.velocity.set(0, 0, 0);
    this.yaw = 0;
    this.pitch = 0;
    this.stamina = 100;
    this.isSprinting = false;
    this.isGrounded = true;
    this.bobTimer = 0;
    this.isDragging = false;
    this.keys = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      sprint: false,
      jump: false
    };
  }
}

/* ============================================================================
 * 5. AI ENEMY - THE NIGHT WATCHERS (Autonomous Patrol & Player Chase AI)
 * ============================================================================ */
class NightWatcher {
  constructor(scene, waypoints, colliders, soundManager, name = 'Watcher') {
    this.scene = scene;
    this.waypoints = waypoints;
    this.colliders = colliders;
    this.sound = soundManager;
    this.name = name;

    this.currentWaypointIdx = 0;
    this.state = 'PATROL'; // 'PATROL', 'CHASE', 'RETURN'
    this.patrolSpeed = 2.4;
    this.chaseSpeed = 5.2;

    this.detectRange = 14.0;
    this.loseRange = 24.0;
    this.catchRange = 1.4;

    this.loseTimer = 0;
    this.hasAlerted = false;

    this.mesh = this.createMesh();
    this.position = this.mesh.position;
    this.position.copy(this.waypoints[0]);
    this.scene.add(this.mesh);
  }

  createMesh() {
    const group = new THREE.Group();

    // Dark metallic torso
    const bodyGeo = new THREE.CylinderGeometry(0.4, 0.25, 1.6, 8);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x090d16,
      metalness: 0.9,
      roughness: 0.3
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 1.2;
    body.castShadow = true;
    group.add(body);

    // Menacing floating head
    const headGeo = new THREE.SphereGeometry(0.35, 12, 12);
    const head = new THREE.Mesh(headGeo, bodyMat);
    head.position.y = 2.15;
    group.add(head);

    // Glowing piercing red sensor eyes
    const eyeGeo = new THREE.SphereGeometry(0.08, 8, 8);
    this.eyeMat = new THREE.MeshBasicMaterial({ color: 0xff1e1e });

    const leftEye = new THREE.Mesh(eyeGeo, this.eyeMat);
    leftEye.position.set(-0.14, 2.2, -0.3);
    group.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, this.eyeMat);
    rightEye.position.set(0.14, 2.2, -0.3);
    group.add(rightEye);

    // Forward scanning red spotlight
    this.searchLight = new THREE.SpotLight(0xff0022, 2.5, 16, Math.PI / 5, 0.3, 1.5);
    this.searchLight.position.set(0, 2.1, -0.35);
    this.lightTarget = new THREE.Object3D();
    this.lightTarget.position.set(0, 0, -6);
    group.add(this.lightTarget);
    this.searchLight.target = this.lightTarget;
    group.add(this.searchLight);

    // Eerie floating particles / aura
    const haloGeo = new THREE.RingGeometry(0.6, 0.75, 16);
    this.ringMat = new THREE.MeshBasicMaterial({ color: 0xff0033, side: THREE.DoubleSide, transparent: true, opacity: 0.4 });
    const ring = new THREE.Mesh(haloGeo, this.ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.5;
    group.add(ring);
    this.ring = ring;

    return group;
  }

  update(delta, playerPos, playerFlashlightOn, playerIsSprinting, onCatchPlayer) {
    // Floating hover animation
    this.mesh.position.y = 0.15 + Math.sin(performance.now() * 0.003) * 0.15;
    if (this.ring) this.ring.rotation.z += delta * 2;

    const distToPlayer = this.position.distanceTo(playerPos);

    // Dynamic detection threshold (easier to detect if player is sprinting or flashlight on)
    let activeDetectRadius = this.detectRange;
    if (playerFlashlightOn) activeDetectRadius += 4.5;
    if (playerIsSprinting) activeDetectRadius += 5.0;

    // ==========================================
    // STATE MACHINE
    // ==========================================
    if (this.state === 'PATROL') {
      this.eyeMat.color.setHex(0xf97316); // Amber while patrolling
      this.searchLight.color.setHex(0xf97316);

      // Check for player detection
      if (distToPlayer < activeDetectRadius) {
        // Line of Sight check
        if (this.hasLineOfSight(playerPos)) {
          this.state = 'CHASE';
          this.loseTimer = 0;
          if (!this.hasAlerted) {
            this.sound.playAlert();
            this.hasAlerted = true;
          }
        }
      }

      // Patrol movement along waypoints
      const targetWp = this.waypoints[this.currentWaypointIdx];
      const moveVec = new THREE.Vector3().subVectors(targetWp, this.position);
      moveVec.y = 0;
      const distToWp = moveVec.length();

      if (distToWp < 1.0) {
        this.currentWaypointIdx = (this.currentWaypointIdx + 1) % this.waypoints.length;
      } else {
        moveVec.normalize();
        this.moveWithCollision(moveVec, this.patrolSpeed * delta);
        this.rotateTowards(targetWp, delta * 4);
      }
    } else if (this.state === 'CHASE') {
      this.eyeMat.color.setHex(0xff0022); // Crimson red while chasing!
      this.searchLight.color.setHex(0xff0022);
      this.searchLight.intensity = 3.5;

      // Heartbeat pulse when enemy is chasing player
      if (distToPlayer < 18.0 && Math.random() < 0.08) {
        this.sound.playHeartbeat();
      }

      // Move toward player
      const chaseVec = new THREE.Vector3().subVectors(playerPos, this.position);
      chaseVec.y = 0;
      chaseVec.normalize();

      this.moveWithCollision(chaseVec, this.chaseSpeed * delta);
      this.rotateTowards(playerPos, delta * 6);

      // Caught player check!
      if (distToPlayer < this.catchRange) {
        if (onCatchPlayer) onCatchPlayer(this);
        return;
      }

      // Player escape / break-off condition
      if (distToPlayer > this.loseRange || !this.hasLineOfSight(playerPos)) {
        this.loseTimer += delta;
        if (this.loseTimer > 3.0) {
          this.state = 'PATROL';
          this.hasAlerted = false;
          this.searchLight.intensity = 2.0;
        }
      } else {
        this.loseTimer = 0;
      }
    }
  }

  moveWithCollision(dir, step) {
    const nextX = this.position.x + dir.x * step;
    const nextZ = this.position.z + dir.z * step;

    // Check collision against world buildings/props
    let blockedX = false;
    let blockedZ = false;

    for (const b of this.colliders) {
      if (nextX + 0.5 > b.minX && nextX - 0.5 < b.maxX && this.position.z + 0.5 > b.minZ && this.position.z - 0.5 < b.maxZ) {
        blockedX = true;
      }
      if (this.position.x + 0.5 > b.minX && this.position.x - 0.5 < b.maxX && nextZ + 0.5 > b.minZ && nextZ - 0.5 < b.maxZ) {
        blockedZ = true;
      }
    }

    if (!blockedX) this.position.x = nextX;
    if (!blockedZ) this.position.z = nextZ;
  }

  rotateTowards(target, speed) {
    const dx = target.x - this.position.x;
    const dz = target.z - this.position.z;
    const targetAngle = Math.atan2(-dx, -dz);

    // Smooth rotation
    const currentAngle = this.mesh.rotation.y;
    let diff = targetAngle - currentAngle;
    while (diff < -Math.PI) diff += Math.PI * 2;
    while (diff > Math.PI) diff -= Math.PI * 2;

    this.mesh.rotation.y += diff * Math.min(1.0, speed);
  }

  hasLineOfSight(playerPos) {
    const p1x = this.position.x;
    const p1z = this.position.z;
    const p2x = playerPos.x;
    const p2z = playerPos.z;

    for (const b of this.colliders) {
      // Only substantial structures (buildings and boundary walls) block vision
      const w = b.maxX - b.minX;
      const d = b.maxZ - b.minZ;
      if (w < 1.5 && d < 1.5) continue; // Skip street lamps, crates, small props

      if (this.lineIntersectsBox(p1x, p1z, p2x, p2z, b.minX, b.maxX, b.minZ, b.maxZ)) {
        return false;
      }
    }
    return true;
  }

  lineIntersectsBox(x1, z1, x2, z2, minX, maxX, minZ, maxZ) {
    let dx = x2 - x1;
    let dz = z2 - z1;
    let tmin = 0;
    let tmax = 1;

    if (Math.abs(dx) < 1e-6) {
      if (x1 < minX || x1 > maxX) return false;
    } else {
      let t1 = (minX - x1) / dx;
      let t2 = (maxX - x1) / dx;
      if (t1 > t2) { const tmp = t1; t1 = t2; t2 = tmp; }
      tmin = Math.max(tmin, t1);
      tmax = Math.min(tmax, t2);
      if (tmin > tmax) return false;
    }

    if (Math.abs(dz) < 1e-6) {
      if (z1 < minZ || z1 > maxZ) return false;
    } else {
      let t1 = (minZ - z1) / dz;
      let t2 = (maxZ - z1) / dz;
      if (t1 > t2) { const tmp = t1; t1 = t2; t2 = tmp; }
      tmin = Math.max(tmin, t1);
      tmax = Math.min(tmax, t2);
      if (tmin > tmax) return false;
    }

    return tmin <= tmax && tmax >= 0 && tmin <= 1;
  }

  reset() {
    this.state = 'PATROL';
    this.currentWaypointIdx = 0;
    this.position.copy(this.waypoints[0]);
    this.hasAlerted = false;
    this.loseTimer = 0;
    if (this.eyeMat) this.eyeMat.color.setHex(0xf97316);
    if (this.searchLight) {
      this.searchLight.color.setHex(0xf97316);
      this.searchLight.intensity = 2.0;
    }
  }
}

/* ============================================================================
 * 6. GAME CORE CONTROLLER (Main Game Loop, HUD, State, Interaction)
 * ============================================================================ */
class NightTownGame {
  constructor() {
    this.state = 'START'; // 'START', 'PLAYING', 'PAUSED', 'GAMEOVER', 'VICTORY'
    this.collectedKeys = 0;
    this.totalKeys = 3;
    this.gateUnlocked = false;

    // Timer
    this.startTime = 0;
    this.elapsedTime = 0;
    this.finalTimeStr = '00:00.0';

    // DOM Elements
    this.container = document.getElementById('canvas-container');
    this.hud = document.getElementById('hud');
    this.startScreen = document.getElementById('start-screen');
    this.gameOverScreen = document.getElementById('game-over-screen');
    this.victoryScreen = document.getElementById('victory-screen');
    this.pauseScreen = document.getElementById('pause-screen');
    this.dangerVignette = document.getElementById('danger-vignette');
    this.crosshair = document.getElementById('crosshair');
    this.interactionPrompt = document.getElementById('interaction-prompt');
    this.promptActionText = document.getElementById('prompt-action-text');
    this.keysCounter = document.getElementById('keys-counter');
    this.gameTimer = document.getElementById('game-timer');
    this.staminaFill = document.getElementById('stamina-fill');
    this.staminaVal = document.getElementById('stamina-val');
    this.flashlightStatus = document.getElementById('flashlight-status');
    this.badgeFlashlight = document.getElementById('badge-flashlight');
    this.badgeAudio = document.getElementById('badge-audio');
    this.audioIcon = document.getElementById('audio-icon');
    this.audioStatus = document.getElementById('audio-status');
    this.toast = document.getElementById('hud-toast');

    // Systems
    this.sound = new SoundManager();
    this.raycaster = new THREE.Raycaster();
    this.raycaster.far = 4.5; // Max interaction distance

    this.initThree();
    this.initWorld();
    this.initPlayer();
    this.initEnemies();
    this.bindEvents();

    // Start animation loop
    this.clock = new THREE.Clock();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  initThree() {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      72,
      window.innerWidth / window.innerHeight,
      0.1,
      150
    );

    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;

    this.container.appendChild(this.renderer.domElement);
    this.scene.add(this.camera);
  }

  initWorld() {
    this.world = new WorldBuilder(this.scene);
    this.world.build();
  }

  initPlayer() {
    this.player = new PlayerController(this.camera, this.renderer.domElement, this.world.colliders, this.sound);
  }

  initEnemies() {
    // Watcher 1: Patrols Main Street and Western Alley
    const wp1 = [
      new THREE.Vector3(0, 0, 20),
      new THREE.Vector3(-12, 0, 15),
      new THREE.Vector3(-26, 0, 8),
      new THREE.Vector3(-26, 0, -8),
      new THREE.Vector3(-12, 0, -15),
      new THREE.Vector3(0, 0, -10)
    ];

    // Watcher 2: Patrols Central Plaza, Eastern Park, and Northern Gate Approach
    const wp2 = [
      new THREE.Vector3(0, 0, -5),
      new THREE.Vector3(14, 0, -5),
      new THREE.Vector3(26, 0, -18),
      new THREE.Vector3(12, 0, -26),
      new THREE.Vector3(0, 0, -25)
    ];

    this.enemies = [
      new NightWatcher(this.scene, wp1, this.world.colliders, this.sound, 'Shadow Stalker 1'),
      new NightWatcher(this.scene, wp2, this.world.colliders, this.sound, 'Shadow Stalker 2')
    ];
  }

  bindEvents() {
    // Window Resize
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Start Button
    document.getElementById('btn-start-game').addEventListener('click', () => {
      this.sound.init();
      this.startGame();
    });

    // Retry Button (Game Over)
    document.getElementById('btn-retry').addEventListener('click', () => {
      this.restartGame();
    });

    // Play Again Button (Victory)
    document.getElementById('btn-play-again').addEventListener('click', () => {
      this.restartGame();
    });

    // Resume Button (Pause)
    document.getElementById('btn-resume').addEventListener('click', () => {
      this.requestPointerLock();
    });

    // Pointer Lock Change
    this.wasExplicitlyLocked = false;
    document.addEventListener('pointerlockchange', () => {
      const isLocked = document.pointerLockElement === this.renderer.domElement;
      this.player.isLocked = isLocked;

      if (!isLocked && this.state === 'PLAYING' && this.wasExplicitlyLocked) {
        this.pauseGame();
      } else if (isLocked && this.state === 'PAUSED') {
        this.resumeGame();
      }

      if (isLocked) {
        this.wasExplicitlyLocked = true;
      }
    });

    // Click canvas to interact or request pointer lock
    this.renderer.domElement.addEventListener('click', () => {
      if (this.state === 'PLAYING') {
        const target = this.getAimTarget();
        if (target) {
          this.handleInteraction();
          return;
        }
        this.requestPointerLock();
      } else if (this.state === 'PAUSED') {
        this.requestPointerLock();
      }
    });

    // Interaction prompt click to interact
    if (this.interactionPrompt) {
      this.interactionPrompt.addEventListener('click', () => {
        if (this.state === 'PLAYING') {
          this.handleInteraction();
        }
      });
    }

    // Mobile interact button
    const touchInteract = document.getElementById('touch-interact');
    if (touchInteract) {
      touchInteract.addEventListener('click', (e) => {
        e.preventDefault();
        if (this.state === 'PLAYING') {
          this.handleInteraction();
        }
      });
    }

    // Interaction Key 'E'
    window.addEventListener('keydown', (e) => {
      if (e.code === 'KeyE' && this.state === 'PLAYING') {
        this.handleInteraction();
      }
    });

    // Flashlight badge click
    this.badgeFlashlight.addEventListener('click', (e) => {
      e.stopPropagation();
      const on = this.player.toggleFlashlight();
      this.updateFlashlightUI(on);
    });

    // Audio badge click
    this.badgeAudio.addEventListener('click', (e) => {
      e.stopPropagation();
      const muted = this.sound.toggleMute();
      this.audioIcon.textContent = muted ? '🔇' : '🔊';
      this.audioStatus.textContent = muted ? 'الصوت: مكتوم' : 'الصوت: مشغل';
    });
  }

  requestPointerLock() {
    try {
      const p = this.renderer.domElement.requestPointerLock();
      if (p && typeof p.catch === 'function') {
        p.catch(() => {
          // Handled gracefully in iframe/mobile environments
        });
      }
    } catch (err) {
      // Ignore if iframe policy blocks pointer lock
    }
  }

  startGame() {
    this.state = 'PLAYING';
    this.startTime = performance.now();
    this.startScreen.classList.add('hidden');
    this.hud.classList.add('active');
    this.requestPointerLock();
    this.showToast('استكشف المدينة واعثر على المفاتيح الثلاثة! 🔑');
  }

  pauseGame() {
    this.state = 'PAUSED';
    this.pauseScreen.classList.remove('hidden');
  }

  resumeGame() {
    this.state = 'PLAYING';
    this.pauseScreen.classList.add('hidden');
  }

  gameOver(killerEnemy) {
    if (this.state === 'GAMEOVER') return;
    this.state = 'GAMEOVER';
    this.wasExplicitlyLocked = false;
    try { document.exitPointerLock(); } catch (e) {}

    this.sound.playGameOver();
    this.dangerVignette.classList.remove('active');
    this.hud.classList.remove('active');

    document.getElementById('game-over-keys').textContent = `${this.collectedKeys} / ${this.totalKeys}`;
    document.getElementById('game-over-time').textContent = this.formatTime(this.elapsedTime);
    this.gameOverScreen.classList.remove('hidden');
  }

  victory() {
    if (this.state === 'VICTORY') return;
    this.state = 'VICTORY';
    this.wasExplicitlyLocked = false;
    try { document.exitPointerLock(); } catch (e) {}

    this.sound.playVictory();
    this.dangerVignette.classList.remove('active');
    this.hud.classList.remove('active');

    this.finalTimeStr = this.formatTime(this.elapsedTime);
    document.getElementById('victory-time').textContent = this.finalTimeStr;
    this.victoryScreen.classList.remove('hidden');
  }

  restartGame() {
    this.state = 'PLAYING';
    this.collectedKeys = 0;
    this.gateUnlocked = false;
    this.startTime = performance.now();
    this.elapsedTime = 0;

    // Reset world (gate doors rotation, gate collider, keys visibility, lock LEDs)
    this.world.reset();

    // Reset player position, keys, and stats
    this.player.reset(0, 1.7, 34);

    // Reset UI
    this.keysCounter.textContent = `(0 / 3)`;
    for (let i = 1; i <= 3; i++) {
      const slot = document.getElementById(`slot-${i}`);
      if (slot) slot.classList.remove('collected');
    }
    const objectiveText = document.getElementById('objective-text');
    if (objectiveText) {
      objectiveText.textContent = 'استكشف الشوارع وابحث عن 3 مفاتيح لفتح البوابة الشمالية';
    }
    this.dangerVignette.classList.remove('active');

    // Reset enemies
    this.enemies.forEach(e => e.reset());

    // Reset modals
    this.gameOverScreen.classList.add('hidden');
    this.victoryScreen.classList.add('hidden');
    this.pauseScreen.classList.add('hidden');
    this.hud.classList.add('active');

    this.requestPointerLock();
    this.showToast('تمت إعادة اللعبة! حظاً موفقاً في الهروب.');
  }

  collectKey(keyObj) {
    if (!keyObj || keyObj.collected) return;
    keyObj.collected = true;
    keyObj.group.visible = false;
    this.collectedKeys++;
    this.sound.playKeyCollect();

    // Update UI
    this.keysCounter.textContent = `(${this.collectedKeys} / ${this.totalKeys})`;
    const slot = document.getElementById(keyObj.slotId);
    if (slot) slot.classList.add('collected');

    this.world.updateKeyIndicators(this.collectedKeys);

    if (this.collectedKeys >= this.totalKeys) {
      this.showToast('🎉 عثرت على جميع المفاتيح! توجه فوراً إلى البوابة الشمالية للهروب!');
      const objEl = document.getElementById('objective-text');
      if (objEl) objEl.textContent = 'توجه إلى البوابة الشمالية وافتحها للهروب!';
    } else {
      this.showToast(`🔑 تم جمع ${keyObj.name}! (${this.collectedKeys}/${this.totalKeys})`);
    }
  }

  handleInteraction() {
    const target = this.getAimTarget();
    if (!target) {
      // Proximity assist: if within 2.2m of any uncollected key
      const nearKey = this.world.keys.find(k => !k.collected && this.camera.position.distanceTo(k.position) < 2.2);
      if (nearKey) {
        this.collectKey(nearKey);
      }
      return;
    }

    if (target.type === 'key') {
      const keyObj = this.world.keys.find(k => k.id === target.keyId);
      if (keyObj) {
        this.collectKey(keyObj);
      }
    } else if (target.type === 'gate') {
      if (this.collectedKeys >= this.totalKeys) {
        if (!this.gateUnlocked) {
          this.gateUnlocked = true;
          this.sound.playDoorOpen();
          this.showToast('🚪 انفتحت البوابة الرئيسية! اعبر بسرعة للهروب!');
          this.world.openGateAnimation(() => {
            this.showToast('اعبر إلى الجانب الآخر للفوز!');
          });
        }
      } else {
        this.sound.playDoorLocked();
        const needed = this.totalKeys - this.collectedKeys;
        this.showToast(`⚠️ البوابة مغلقة بإحكام! تحتاج إلى ${needed} مفاتيح إضافية.`);
      }
    }
  }

  getAimTarget() {
    this.raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);
    const cameraPos = this.camera.position;

    // Check keys
    for (const k of this.world.keys) {
      if (!k.collected) {
        const dist = cameraPos.distanceTo(k.position);
        if (dist <= 3.8) {
          const dirToKey = new THREE.Vector3().subVectors(k.position, cameraPos).normalize();
          const camDir = new THREE.Vector3();
          this.camera.getWorldDirection(camDir);
          if (camDir.dot(dirToKey) > 0.80 || dist <= 1.8) {
            return { type: 'key', keyId: k.id, promptText: `جمع ${k.name}` };
          }
        }
      }
    }

    // Check Gate Terminal (at Z = -35)
    const gatePos = new THREE.Vector3(0, 2.0, -34.5);
    const distToGate = cameraPos.distanceTo(gatePos);
    if (distToGate <= 5.5) {
      const camDir = new THREE.Vector3();
      this.camera.getWorldDirection(camDir);
      const dirToGate = new THREE.Vector3().subVectors(gatePos, cameraPos).normalize();
      if (camDir.dot(dirToGate) > 0.78 || distToGate <= 3.0) {
        return {
          type: 'gate',
          promptText: this.collectedKeys >= this.totalKeys ? 'إضغط لفتح البوابة والهروب' : 'البوابة الرئيسية (مغلقة - تحتاج 3 مفاتيح)'
        };
      }
    }

    return null;
  }

  updateHUD(delta) {
    // 1. Timer
    if (this.state === 'PLAYING') {
      this.elapsedTime = (performance.now() - this.startTime) / 1000;
      this.gameTimer.textContent = this.formatTime(this.elapsedTime);
    }

    // 2. Stamina Bar
    const staminaPercent = Math.round((this.player.stamina / this.player.maxStamina) * 100);
    this.staminaFill.style.width = `${staminaPercent}%`;
    this.staminaVal.textContent = `${staminaPercent}%`;
    if (staminaPercent < 20) {
      this.staminaFill.classList.add('tired');
    } else {
      this.staminaFill.classList.remove('tired');
    }

    // 3. Flashlight Indicator
    this.updateFlashlightUI(this.player.flashlightOn);

    // 4. Crosshair and Interaction Prompt
    const aimTarget = this.getAimTarget();
    if (aimTarget) {
      this.crosshair.classList.add('interactable');
      this.promptActionText.textContent = aimTarget.promptText;
      this.interactionPrompt.classList.add('show');
    } else {
      this.crosshair.classList.remove('interactable');
      this.interactionPrompt.classList.remove('show');
    }

    // 5. Danger Vignette check (active if any enemy is currently chasing)
    const anyChasing = this.enemies.some(e => e.state === 'CHASE');
    if (anyChasing) {
      this.dangerVignette.classList.add('active');
    } else {
      this.dangerVignette.classList.remove('active');
    }

    // 6. Check Victory Condition: Player reached beyond opened gate
    if (this.gateUnlocked && this.player.position.z < -38.5) {
      this.victory();
    }
  }

  updateFlashlightUI(on) {
    if (on) {
      this.badgeFlashlight.classList.add('active');
      this.flashlightStatus.textContent = 'كشاف: مشغل [F]';
    } else {
      this.badgeFlashlight.classList.remove('active');
      this.flashlightStatus.textContent = 'كشاف: مطفأ [F]';
    }
  }

  showToast(msg) {
    this.toast.textContent = msg;
    this.toast.classList.add('show');
    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.toast.classList.remove('show');
    }, 3800);
  }

  formatTime(totalSeconds) {
    const mins = Math.floor(totalSeconds / 60);
    const secs = Math.floor(totalSeconds % 60);
    const ms = Math.floor((totalSeconds % 1) * 10);
    const mStr = mins < 10 ? '0' + mins : mins;
    const sStr = secs < 10 ? '0' + secs : secs;
    return `${mStr}:${sStr}.${ms}`;
  }

  animate() {
    requestAnimationFrame(this.animate);
    const delta = Math.min(this.clock.getDelta(), 0.1);

    if (this.state === 'PLAYING') {
      // 1. Update Player Physics & Camera
      this.player.update(delta);

      // 2. Animate Keys (Hover & Bobbing) & Proximity Auto-Pickup
      const time = performance.now() * 0.002;
      this.world.keys.forEach((k, idx) => {
        if (!k.collected) {
          k.group.rotation.y += delta * 1.8;
          k.group.position.y = k.baseY + Math.sin(time + idx) * 0.15;
          k.light.intensity = 1.2 + Math.sin(time * 2 + idx) * 0.4;

          // Proximity auto-pickup when walking right into the key
          if (this.player.position.distanceTo(k.position) < 1.35) {
            this.collectKey(k);
          }
        }
      });

      // 3. Update AI Enemies
      this.enemies.forEach(enemy => {
        enemy.update(
          delta,
          this.player.position,
          this.player.flashlightOn,
          this.player.isSprinting,
          (caughtBy) => this.gameOver(caughtBy)
        );
      });

      // 4. Update HUD
      this.updateHUD(delta);
    }

    // Render Scene
    this.renderer.render(this.scene, this.camera);
  }
}

// Auto-initialize game when document is ready
window.addEventListener('DOMContentLoaded', () => {
  new NightTownGame();
});
