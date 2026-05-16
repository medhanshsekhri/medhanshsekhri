"use client";

import { useEffect, useRef } from "react";

export interface GalleryItem {
  image: string;
  text: string;
}

interface Props {
  items: GalleryItem[];
  bend?: number;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function debounce<T extends (...args: unknown[]) => void>(fn: T, ms: number) {
  let id: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(id);
    id = setTimeout(() => fn(...args), ms);
  };
}

// Vertex shader — curves the plane like a film strip bent into a circular arc
const VERT = `
attribute vec3 position;
attribute vec2 uv;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float uBend;
uniform float uOffset;
varying vec2 vUv;
void main() {
  vUv = uv;
  vec3 p = position;
  float theta = p.x * uBend * 0.5;
  float sinT = sin(theta);
  float cosT = cos(theta);
  float r = 1.0 / (uBend * 0.5 + 0.0001);
  p.x = r * sinT;
  p.z += r * (cosT - 1.0);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
`;

const FRAG = `
precision highp float;
uniform sampler2D tMap;
uniform float uAlpha;
varying vec2 vUv;
void main() {
  vec4 c = texture2D(tMap, vUv);
  gl_FragColor = vec4(c.rgb, c.a * uAlpha);
}
`;

export default function CircularGallery({ items, bend = 3 }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let destroyed = false;
    let cleanupFn: (() => void) | undefined;

    (async () => {
      const OGL = await import("ogl");
      const { Renderer, Camera, Transform, Plane, Mesh, Program, Texture } = OGL;

      if (destroyed) return;

      const W = container.clientWidth || 500;
      const H = container.clientHeight || 600;

      const renderer = new Renderer({ alpha: true, antialias: true, width: W, height: H });
      const gl = renderer.gl;
      gl.clearColor(0, 0, 0, 0);

      const canvas = gl.canvas as HTMLCanvasElement;
      Object.assign(canvas.style, {
        position: "absolute",
        inset: "0",
        width: "100%",
        height: "100%",
      });
      container.appendChild(canvas);

      const camera = new Camera(gl, { fov: 45, near: 0.1, far: 100 });
      camera.position.set(0, 0, 6);
      camera.perspective({ aspect: W / H });

      const scene = new Transform();

      const ITEM_W = 1.8;
      const ITEM_H = 2.4;
      const GAP = 2.7;

      const geo = new Plane(gl, {
        width: ITEM_W,
        height: ITEM_H,
        widthSegments: 20,
        heightSegments: 1,
      });

      const meshData = items.map((item, i) => {
        const tex = new Texture(gl, { generateMipmaps: false });
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => { tex.image = img; };
        img.onerror = () => {};
        img.src = item.image;

        const prog = new Program(gl, {
          vertex: VERT,
          fragment: FRAG,
          uniforms: {
            tMap: { value: tex },
            uBend: { value: bend },
            uOffset: { value: 0 },
            uAlpha: { value: 1 },
          },
          transparent: true,
          depthTest: false,
        });

        const mesh = new Mesh(gl, { geometry: geo, program: prog });
        mesh.position.y = -i * GAP;
        mesh.setParent(scene);

        return { mesh, prog };
      });

      let scroll = 0;
      let target = 0;
      let raf = 0;
      const maxScroll = (items.length - 1) * GAP;

      const onWheel = (e: WheelEvent) => {
        e.preventDefault();
        target = Math.max(0, Math.min(maxScroll, target + e.deltaY * 0.004));
      };

      let touchY = 0;
      const onTouchStart = (e: TouchEvent) => { touchY = e.touches[0].clientY; };
      const onTouchMove = (e: TouchEvent) => {
        const dy = touchY - e.touches[0].clientY;
        touchY = e.touches[0].clientY;
        target = Math.max(0, Math.min(maxScroll, target + dy * 0.007));
      };

      container.addEventListener("wheel", onWheel, { passive: false });
      container.addEventListener("touchstart", onTouchStart, { passive: true });
      container.addEventListener("touchmove", onTouchMove, { passive: true });

      const onResize = debounce(() => {
        if (destroyed) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        renderer.setSize(w, h);
        camera.perspective({ aspect: w / h });
      }, 100);

      window.addEventListener("resize", onResize);

      function tick() {
        if (destroyed) return;
        raf = requestAnimationFrame(tick);

        scroll = lerp(scroll, target, 0.075);

        meshData.forEach(({ mesh, prog }, i) => {
          const worldY = -i * GAP + scroll;
          mesh.position.y = worldY;
          const dist = Math.abs(worldY);
          prog.uniforms.uAlpha.value = Math.max(0, 1 - dist / (GAP * 2.2));
        });

        renderer.render({ scene, camera });
      }

      tick();

      cleanupFn = () => {
        destroyed = true;
        cancelAnimationFrame(raf);
        container.removeEventListener("wheel", onWheel);
        container.removeEventListener("touchstart", onTouchStart);
        container.removeEventListener("touchmove", onTouchMove);
        window.removeEventListener("resize", onResize);
        if (canvas.parentNode === container) container.removeChild(canvas);
      };
    })().catch(console.error);

    return () => {
      destroyed = true;
      cleanupFn?.();
    };
  }, [items, bend]);

  return (
    <div
      ref={mountRef}
      style={{
        position: "relative",
        width: "100%",
        minHeight: 600,
        height: "100%",
      }}
    />
  );
}
