"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function GoogleAntigravityParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const { viewport, pointer } = useThree();

  const count = 600;

  // Generate a sharp, antialiased circular texture so all dots are 100% round
  const circleTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Draw smooth, antialiased round circle
    ctx.beginPath();
    ctx.arc(32, 32, 28, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, []);

  // Google Brand Colors Palette in smooth gradient cycle order:
  // Blue (#4285F4) -> Red (#EA4335) -> Yellow (#FBBC05) -> Green (#34A853)
  const googlePalette = useMemo(() => [
    new THREE.Color("#4285F4"), // Google Blue
    new THREE.Color("#EA4335"), // Google Red
    new THREE.Color("#FBBC05"), // Google Yellow
    new THREE.Color("#34A853"), // Google Green
  ], []);

  // Setup initial harmonious flow grid & data structures
  const [positions, basePositions, colors, phases, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const base = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const ph = new Float32Array(count);
    const sp = new Float32Array(count);

    // Arrange dots in a harmonious multi-layered flow field
    const cols = 30;
    const rows = 20;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;

      // Structured organic flow distribution
      const colIndex = i % cols;
      const rowIndex = Math.floor(i / cols) % rows;
      const layer = Math.floor(i / (cols * rows));

      const u = (colIndex / (cols - 1) - 0.5) * 26; // X span
      const v = (rowIndex / (rows - 1) - 0.5) * 16; // Y span
      const jitterX = (Math.random() - 0.5) * 1.2;
      const jitterY = (Math.random() - 0.5) * 1.2;
      const z = (layer - 0.5) * 4 + (Math.random() - 0.5) * 2;

      const x = u + jitterX;
      const y = v + jitterY;

      pos[idx] = x;
      pos[idx + 1] = y;
      pos[idx + 2] = z;

      base[idx] = x;
      base[idx + 1] = y;
      base[idx + 2] = z;

      // Initial color assignment
      const initColor = googlePalette[i % googlePalette.length];
      col[idx] = initColor.r;
      col[idx + 1] = initColor.g;
      col[idx + 2] = initColor.b;

      ph[i] = (x * 0.12) + (y * 0.12) + Math.random() * 0.4;
      sp[i] = 0.5 + Math.random() * 0.5;
    }

    return [pos, base, col, ph, sp];
  }, [googlePalette]);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const time = state.clock.getElapsedTime();

    // Mouse coordinates in Three.js viewport space
    const targetMouseX = (pointer.x * viewport.width) / 2;
    const targetMouseY = (pointer.y * viewport.height) / 2;

    const positionsAttr = pointsRef.current.geometry.attributes.position;
    const colorsAttr = pointsRef.current.geometry.attributes.color;
    const posArray = positionsAttr.array as Float32Array;
    const colArray = colorsAttr.array as Float32Array;

    const numColors = googlePalette.length; // 4

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const bx = basePositions[idx];
      const by = basePositions[idx + 1];
      const bz = basePositions[idx + 2];
      const phase = phases[i];
      const speed = speeds[i];

      // Smooth flowing wave motion (harmonic fluid flow)
      const flowTime = time * speed * 0.4;
      const flowWaveX = Math.sin(flowTime + phase + by * 0.2) * 0.7;
      const flowWaveY = Math.cos(flowTime + phase + bx * 0.2) * 0.7;
      const flowWaveZ = Math.sin(flowTime * 0.8 + bx * 0.15 + by * 0.15) * 1.2;

      const flowX = bx + flowWaveX;
      const flowY = by + flowWaveY;
      const flowZ = bz + flowWaveZ;

      // Interactive Antigravity Mouse Tracking & Distortion
      const dx = targetMouseX - posArray[idx];
      const dy = targetMouseY - posArray[idx + 1];
      const dist = Math.sqrt(dx * dx + dy * dy);

      const influenceRadius = 5.5;
      let targetX = flowX;
      let targetY = flowY;
      let targetZ = flowZ;

      if (dist < influenceRadius) {
        // Antigravity swirl and gentle tracking around cursor
        const force = Math.pow((influenceRadius - dist) / influenceRadius, 1.6);
        const angle = Math.atan2(dy, dx) + Math.PI / 2; // Swirl vector

        targetX += (dx * 0.35 + Math.cos(angle) * 1.5) * force;
        targetY += (dy * 0.35 + Math.sin(angle) * 1.5) * force;
        targetZ += force * 2.5; // Pops forward toward camera
      }

      // Smooth springy easing
      posArray[idx] += (targetX - posArray[idx]) * 0.06;
      posArray[idx + 1] += (targetY - posArray[idx + 1]) * 0.06;
      posArray[idx + 2] += (targetZ - posArray[idx + 2]) * 0.06;

      // ==========================================
      // AUTOMATIC GOOGLE GRADIENT COLOR TRANSITION
      // ==========================================
      // Continuous parameter cycling through Blue -> Red -> Yellow -> Green -> Blue
      const colorCycleSpeed = 0.4;
      const continuousColorT = ((time * colorCycleSpeed) + phase * 1.5 + (bx * 0.08) + (by * 0.08)) % numColors;
      const normalizedT = (continuousColorT + numColors) % numColors;

      const colorIndex1 = Math.floor(normalizedT);
      const colorIndex2 = (colorIndex1 + 1) % numColors;
      const blendFactor = normalizedT - colorIndex1;

      // Smooth cosine interpolation between the two adjacent Google colors
      const smoothBlend = 0.5 * (1 - Math.cos(blendFactor * Math.PI));

      const c1 = googlePalette[colorIndex1];
      const c2 = googlePalette[colorIndex2];

      const r = c1.r + (c2.r - c1.r) * smoothBlend;
      const g = c1.g + (c2.g - c1.g) * smoothBlend;
      const b = c1.b + (c2.b - c1.b) * smoothBlend;

      colArray[idx] = r;
      colArray[idx + 1] = g;
      colArray[idx + 2] = b;
    }

    positionsAttr.needsUpdate = true;
    colorsAttr.needsUpdate = true;

    // Very gentle panoramic camera parallax
    pointsRef.current.rotation.y = THREE.MathUtils.lerp(pointsRef.current.rotation.y, (pointer.x * Math.PI) / 36, 0.04);
    pointsRef.current.rotation.x = THREE.MathUtils.lerp(pointsRef.current.rotation.x, (-pointer.y * Math.PI) / 36, 0.04);
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.18}
        vertexColors
        map={circleTexture || undefined}
        transparent
        alphaTest={0.01}
        opacity={0.9}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

export function Login3DBackground() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none bg-white overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 14], fov: 55 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl, scene }) => {
          gl.setClearColor("#ffffff", 1);
          scene.background = new THREE.Color("#ffffff");
        }}
      >
        {/* Explicit Pure White Background */}
        <color attach="background" args={["#ffffff"]} />
        {/* Soft fog to blend edges cleanly */}
        <fog attach="fog" args={["#ffffff", 8, 22]} />
        <GoogleAntigravityParticles />
      </Canvas>
    </div>
  );
}
