"use client";

import { useEffect, useRef } from "react";
import { DM_Mono } from "next/font/google";
import * as THREE from "three";
import type { Profile } from "@/types";
import {
  displayFragmentShader,
  fluidFragmentShader,
  vertexShader,
} from "@/lib/hero-fluid-shaders";

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
});

const TOP_IMAGE = "/images/portrait_top.png";
const BOTTOM_IMAGE = "/images/portrait_bottom.png";
const SIM_SIZE = 500;

type HeroProps = {
  profile: Profile;
};

export default function Hero({ profile: _profile }: HeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let disposed = false;
    let animationId = 0;
    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let simScene: THREE.Scene | null = null;
    let camera: THREE.OrthographicCamera | null = null;
    let displayMaterial: THREE.ShaderMaterial | null = null;
    let trailsMaterial: THREE.ShaderMaterial | null = null;
    let planeGeometry: THREE.PlaneGeometry | null = null;
    let pingPongTargets: THREE.WebGLRenderTarget[] = [];
    let currentTarget = 0;
    let placeholderTop: THREE.CanvasTexture | null = null;
    let placeholderBottom: THREE.CanvasTexture | null = null;
    let loadedTop: THREE.CanvasTexture | null = null;
    let loadedBottom: THREE.CanvasTexture | null = null;

    const mouse = new THREE.Vector2(0.5, 0.5);
    const prevMouse = new THREE.Vector2(0.5, 0.5);
    let isMoving = false;
    let lastMoveTime = 0;
    let canvasRect = canvas.getBoundingClientRect();

    const createPlaceholderTexture = (color: string) => {
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = 512;
      tempCanvas.height = 512;
      const ctx = tempCanvas.getContext("2d");
      if (!ctx) {
        return new THREE.CanvasTexture(tempCanvas);
      }
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, 512, 512);
      const texture = new THREE.CanvasTexture(tempCanvas);
      texture.minFilter = THREE.LinearFilter;
      return texture;
    };

    const loadImage = (
      url: string,
      textureSizeVector: THREE.Vector2,
    ) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";

      img.onload = () => {
        if (disposed || !displayMaterial) return;

        const originalWidth = img.width;
        const originalHeight = img.height;
        textureSizeVector.set(originalWidth, originalHeight);

        const maxSize = 4096;
        let newWidth = originalWidth;
        let newHeight = originalHeight;

        if (originalWidth > maxSize || originalHeight > maxSize) {
          if (originalWidth > originalHeight) {
            newWidth = maxSize;
            newHeight = Math.floor(originalHeight * (maxSize / originalWidth));
          } else {
            newHeight = maxSize;
            newWidth = Math.floor(originalWidth * (maxSize / originalHeight));
          }
        }

        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = newWidth;
        tempCanvas.height = newHeight;
        const ctx = tempCanvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, newWidth, newHeight);

        const newTexture = new THREE.CanvasTexture(tempCanvas);
        newTexture.minFilter = THREE.LinearFilter;
        newTexture.magFilter = THREE.LinearFilter;

        if (url.includes("top")) {
          loadedTop?.dispose();
          loadedTop = newTexture;
          displayMaterial.uniforms.uTopTexture.value = newTexture;
        } else {
          loadedBottom?.dispose();
          loadedBottom = newTexture;
          displayMaterial.uniforms.uBottomTexture.value = newTexture;
        }
      };

      img.src = url;
    };

    const getSize = () => {
      const width = canvas.clientWidth || window.innerWidth;
      const height = canvas.clientHeight || window.innerHeight;
      return { width, height };
    };

    const { width, height } = getSize();

    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      precision: "highp",
      alpha: false,
    });
    renderer.setSize(width, height, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    scene = new THREE.Scene();
    simScene = new THREE.Scene();
    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const gl = renderer.getContext();
    const supportsFloat =
      renderer.capabilities.isWebGL2 &&
      Boolean(gl.getExtension("EXT_color_buffer_float"));

    const targetOptions: THREE.RenderTargetOptions = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: supportsFloat ? THREE.FloatType : THREE.HalfFloatType,
    };

    pingPongTargets = [
      new THREE.WebGLRenderTarget(SIM_SIZE, SIM_SIZE, targetOptions),
      new THREE.WebGLRenderTarget(SIM_SIZE, SIM_SIZE, targetOptions),
    ];

    placeholderTop = createPlaceholderTexture("#0000ff");
    placeholderBottom = createPlaceholderTexture("#ff0000");

    const topTextureSize = new THREE.Vector2(1, 1);
    const bottomTextureSize = new THREE.Vector2(1, 1);

    trailsMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uPrevTrails: { value: null },
        uMouse: { value: mouse },
        uPrevMouse: { value: prevMouse },
        uResolution: { value: new THREE.Vector2(SIM_SIZE, SIM_SIZE) },
        uDecay: { value: 0.8 },
        uIsMoving: { value: false },
      },
      vertexShader,
      fragmentShader: fluidFragmentShader,
    });

    displayMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uFluid: { value: null },
        uTopTexture: { value: placeholderTop },
        uBottomTexture: { value: placeholderBottom },
        uResolution: { value: new THREE.Vector2(width, height) },
        uDpr: { value: window.devicePixelRatio },
        uTopTextureSize: { value: topTextureSize },
        uBottomTextureSize: { value: bottomTextureSize },
      },
      vertexShader,
      fragmentShader: displayFragmentShader,
    });

    loadImage(TOP_IMAGE, topTextureSize);
    loadImage(BOTTOM_IMAGE, bottomTextureSize);

    planeGeometry = new THREE.PlaneGeometry(2, 2);
    const displayMesh = new THREE.Mesh(planeGeometry, displayMaterial);
    scene.add(displayMesh);

    const simMesh = new THREE.Mesh(planeGeometry, trailsMaterial);
    simScene.add(simMesh);

    renderer.setRenderTarget(pingPongTargets[0]);
    renderer.clear();
    renderer.setRenderTarget(pingPongTargets[1]);
    renderer.clear();
    renderer.setRenderTarget(null);

    const updateMouse = (clientX: number, clientY: number) => {
      canvasRect = canvas.getBoundingClientRect();

      if (
        clientX >= canvasRect.left &&
        clientX <= canvasRect.right &&
        clientY >= canvasRect.top &&
        clientY <= canvasRect.bottom
      ) {
        prevMouse.copy(mouse);
        mouse.x = (clientX - canvasRect.left) / canvasRect.width;
        mouse.y = 1 - (clientY - canvasRect.top) / canvasRect.height;
        isMoving = true;
        lastMoveTime = performance.now();
      } else {
        isMoving = false;
      }
    };

    const onMouseMove = (event: MouseEvent) => {
      updateMouse(event.clientX, event.clientY);
    };

    const onTouchMove = (event: TouchEvent) => {
      if (event.touches.length === 0) return;
      event.preventDefault();
      updateMouse(event.touches[0].clientX, event.touches[0].clientY);
    };

    const onWindowResize = () => {
      if (!renderer || !displayMaterial) return;
      const next = getSize();
      renderer.setSize(next.width, next.height, false);
      displayMaterial.uniforms.uResolution.value.set(next.width, next.height);
      displayMaterial.uniforms.uDpr.value = window.devicePixelRatio;
    };

    const animate = () => {
      if (disposed || !renderer || !scene || !simScene || !camera) return;
      animationId = requestAnimationFrame(animate);

      if (isMoving && performance.now() - lastMoveTime > 100) {
        isMoving = false;
      }

      const prevTarget = pingPongTargets[currentTarget];
      currentTarget = (currentTarget + 1) % 2;
      const currentRenderTarget = pingPongTargets[currentTarget];

      if (!trailsMaterial || !displayMaterial) return;

      trailsMaterial.uniforms.uPrevTrails.value = prevTarget.texture;
      trailsMaterial.uniforms.uMouse.value.copy(mouse);
      trailsMaterial.uniforms.uPrevMouse.value.copy(prevMouse);
      trailsMaterial.uniforms.uIsMoving.value = isMoving;

      renderer.setRenderTarget(currentRenderTarget);
      renderer.render(simScene, camera);

      displayMaterial.uniforms.uFluid.value = currentRenderTarget.texture;
      renderer.setRenderTarget(null);
      renderer.render(scene, camera);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("resize", onWindowResize);

    const resizeObserver = new ResizeObserver(() => onWindowResize());
    resizeObserver.observe(canvas);
    onWindowResize();
    animate();

    return () => {
      disposed = true;
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("resize", onWindowResize);

      pingPongTargets.forEach((target) => target.dispose());
      planeGeometry?.dispose();
      trailsMaterial?.dispose();
      displayMaterial?.dispose();
      placeholderTop?.dispose();
      placeholderBottom?.dispose();
      loadedTop?.dispose();
      loadedBottom?.dispose();
      renderer?.dispose();
    };
  }, []);

  return (
    <section
      id="top"
      className={`${dmMono.className} relative h-svh w-full overflow-hidden bg-ink`}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-[1] h-full w-full object-cover object-center"
        aria-hidden
      />

      <div className="pointer-events-none absolute bottom-[18%] left-[2.5%] z-[3] w-[400px] max-w-[calc(100%-1.5rem)]">
        <p className="mb-[0.4rem] block text-[0.75rem] font-semibold uppercase leading-[0.9] text-black/60">
          Full Stack Engineering & Architecture
        </p>
        <h2 className="text-[1.1rem] font-medium uppercase leading-[1.2] text-black">
          Architecting resilient digital ecosystems from robust database
          infrastructure to fluid, high-performance client interfaces.
        </h2>
      </div>

      <div className="pointer-events-none absolute top-[25%] right-[2%] z-[3] w-[400px] max-w-[calc(100%-1.5rem)]">
        <p className="mb-[0.4rem] block text-[0.75rem] font-semibold uppercase leading-[0.9] text-black/60">
          End-to-End Development
        </p>
        <h2 className="text-[1.1rem] font-medium uppercase leading-[1.2] text-black">
          Engineering scalable web applications with meticulous attention to
          clean code, security protocols, and seamless interactivity.
        </h2>
      </div>

      <div className="pointer-events-none absolute bottom-[12%] left-[2.5%] z-[3]">
        <p className="block text-[0.75rem] font-semibold uppercase leading-[0.9] tracking-[1px] text-black/70">
          Full-Stack Architect & Developer — 2026
        </p>
      </div>

      <div className="absolute bottom-0 z-[2] flex w-full items-end justify-between p-8">
        <p className="block text-[0.85rem] font-semibold uppercase leading-[0.9] text-black">
          Clean Code / Robust Systems
        </p>
      </div>

      <div className="pointer-events-none absolute right-10 bottom-[19rem] z-[3]">
        <p className="block text-[0.85rem] font-semibold uppercase tracking-[1px] text-black">
          Available for Projects
        </p>
      </div>
    </section>
  );
}
