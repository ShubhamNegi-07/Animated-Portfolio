"use client";

import { useLayoutEffect } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap-client";

export default function GSAPProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger, useGSAP);
    ScrollTrigger.config({ ignoreMobileResize: true });
  }, []);

  return <>{children}</>;
}
