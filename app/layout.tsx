import type { Metadata } from "next";
import { Instrument_Sans, Syne } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shubham Negi — Full-Stack Developer",
  description:
    "Portfolio of Shubham Negi, a full-stack developer building scalable web apps, robust backends, and high-performance frontends.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${syne.variable} ${instrument.variable}`}>
      <body className="bg-ink font-sans text-paper antialiased">{children}</body>
    </html>
  );
}
