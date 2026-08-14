"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { forwardRef, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";

type Uniforms = {
  uTime: { value: number };
  uColor: { value: THREE.Color };
  uSpeed: { value: number };
  uScale: { value: number };
  uRotation: { value: number };
  uNoiseIntensity: { value: number };
};

const hexToNormalizedRGB = (hex: string) => {
  const value = hex.replace("#", "");
  return [
    parseInt(value.slice(0, 2), 16) / 255,
    parseInt(value.slice(2, 4), 16) / 255,
    parseInt(value.slice(4, 6), 16) / 255,
  ] as const;
};

const vertexShader = `
varying vec2 vUv;
varying vec3 vPosition;
void main() {
  vPosition = position;
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const fragmentShader = `
varying vec2 vUv;
varying vec3 vPosition;
uniform float uTime;
uniform vec3 uColor;
uniform float uSpeed;
uniform float uScale;
uniform float uRotation;
uniform float uNoiseIntensity;
const float e = 2.71828182845904523536;
float noise(vec2 texCoord) {
  vec2 r = (e * sin(e * texCoord));
  return fract(r.x * r.y * (1.0 + texCoord.x));
}
vec2 rotateUvs(vec2 uv, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return mat2(c, -s, s, c) * uv;
}
void main() {
  float rnd = noise(gl_FragCoord.xy);
  vec2 tex = rotateUvs(vUv * uScale, uRotation) * uScale;
  float tOffset = uSpeed * uTime;
  tex.y += 0.03 * sin(8.0 * tex.x - tOffset);
  float pattern = 0.6 + 0.4 * sin(5.0 * (tex.x + tex.y + cos(3.0 * tex.x + 5.0 * tex.y) + 0.02 * tOffset) + sin(20.0 * (tex.x + tex.y - 0.1 * tOffset)));
  vec4 col = vec4(uColor, 1.0) * pattern - rnd / 15.0 * uNoiseIntensity;
  gl_FragColor = vec4(col.rgb, 1.0);
}`;

const SilkPlane = forwardRef<
  THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>,
  { uniforms: Uniforms }
>(function SilkPlane({ uniforms }, ref) {
  const { viewport, invalidate } = useThree();

  useLayoutEffect(() => {
    if (ref && "current" in ref && ref.current) {
      ref.current.scale.set(viewport.width, viewport.height, 1);
    }
  }, [ref, viewport]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      if (document.visibilityState === "visible") invalidate();
      timer = setTimeout(tick, 50);
    };
    tick();
    return () => clearTimeout(timer);
  }, [invalidate]);

  useFrame((_, delta) => {
    if (ref && "current" in ref && ref.current) {
      ref.current.material.uniforms.uTime.value += 0.1 * delta;
    }
  });

  return (
    <mesh ref={ref}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
});
SilkPlane.displayName = "SilkPlane";

type SilkProps = {
  speed?: number;
  scale?: number;
  color?: string;
  noiseIntensity?: number;
  rotation?: number;
};

export default function Silk({
  speed = 5,
  scale = 1,
  color = "#D4AF37",
  noiseIntensity = 1.5,
  rotation = 0,
}: SilkProps) {
  const meshRef =
    useRef<THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>>(null);
  const uniforms = useMemo<Uniforms>(
    () => ({
      uSpeed: { value: speed },
      uScale: { value: scale },
      uNoiseIntensity: { value: noiseIntensity },
      uColor: { value: new THREE.Color(...hexToNormalizedRGB(color)) },
      uRotation: { value: rotation },
      uTime: { value: 0 },
    }),
    [],
  );

  useEffect(() => {
    uniforms.uSpeed.value = speed;
    uniforms.uScale.value = scale;
    uniforms.uNoiseIntensity.value = noiseIntensity;
    uniforms.uColor.value.setRGB(...hexToNormalizedRGB(color));
    uniforms.uRotation.value = rotation;
  }, [speed, scale, noiseIntensity, color, rotation, uniforms]);

  return (
    <Canvas
      className="silk-canvas"
      dpr={1}
      frameloop="demand"
      gl={{ antialias: false, powerPreference: "low-power" }}
      camera={{ position: [0, 0, 1] }}
    >
      <SilkPlane ref={meshRef} uniforms={uniforms} />
    </Canvas>
  );
}
