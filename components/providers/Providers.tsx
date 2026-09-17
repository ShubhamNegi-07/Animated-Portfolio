"use client";

import GSAPProvider from "./GSAPProvider";
import SmoothScroll from "./SmoothScroll";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GSAPProvider>
      <SmoothScroll>{children}</SmoothScroll>
    </GSAPProvider>
  );
}
