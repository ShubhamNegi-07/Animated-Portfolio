import { metadata as studioMetadata, viewport } from "next-sanity/studio";

export const metadata = {
  ...studioMetadata,
  title: "Studio — Animated Portfolio",
};

export { viewport };

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-svh bg-white text-black">{children}</div>;
}
