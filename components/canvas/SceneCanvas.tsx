"use client";

import dynamic from "next/dynamic";

const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-ink" />,
});

export default function SceneCanvas() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10">
      <HeroScene />
    </div>
  );
}
