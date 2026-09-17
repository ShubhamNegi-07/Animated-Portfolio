"use client";

import { useEffect, useMemo, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap-client";
import type { Profile } from "@/types";
import "./footer.css";

const ASCII_CHARS = " .:-=+*#%@";
const FONT_SIZE = 18;
const CELL_SIZE = 20;
const ASCII_COLUMNS = 80;
const DPR = 2;
const CHAR_COLOR = "#f97316";
const HOVER_COLOR = "#ff5722";
const HOVER_CHAR_COLOR = "#070707";
const HOVER_RADIUS = 8;
const CLUSTER_SIZE = 10;
const HIGHLIGHT_LIFETIME = 300;
const BACKGROUND_CHAR_INDEX = 0;
const PARALLAX_STRENGTH = 20;
const PARALLAX_EASE = 0.05;

type AsciiCell = {
  col: number;
  row: number;
  char: string;
  highlightEndTime: number;
};

type Hand = {
  canvas: HTMLCanvasElement;
  cells: Map<string, AsciiCell>;
  cellList: AsciiCell[];
  rows: number;
  render: () => void;
};

function sampleImagePixels(image: HTMLImageElement, gridRows: number) {
  const canvas = document.createElement("canvas");
  canvas.width = ASCII_COLUMNS;
  canvas.height = gridRows;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new Uint8ClampedArray();
  ctx.clearRect(0, 0, ASCII_COLUMNS, gridRows);
  ctx.drawImage(image, 0, 0, ASCII_COLUMNS, gridRows);
  return ctx.getImageData(0, 0, ASCII_COLUMNS, gridRows).data;
}

function pixelToCharIndex(pixels: Uint8ClampedArray, pixelOffset: number) {
  const brightness =
    (pixels[pixelOffset] * 0.299 +
      pixels[pixelOffset + 1] * 0.587 +
      pixels[pixelOffset + 2] * 0.114) /
    255;

  return Math.min(
    ASCII_CHARS.length - 1,
    Math.floor((1 - brightness) * ASCII_CHARS.length),
  );
}

function buildCells(image: HTMLImageElement) {
  const rows = Math.round(
    ASCII_COLUMNS / (image.naturalWidth / image.naturalHeight),
  );
  const pixels = sampleImagePixels(image, rows);
  const cells = new Map<string, AsciiCell>();

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < ASCII_COLUMNS; col += 1) {
      const offset = (row * ASCII_COLUMNS + col) * 4;
      const alpha = pixels[offset + 3];
      if (alpha < 128) continue;

      const charIndex = pixelToCharIndex(pixels, offset);
      if (charIndex <= BACKGROUND_CHAR_INDEX) continue;

      cells.set(`${col},${row}`, {
        col,
        row,
        char: ASCII_CHARS[charIndex],
        highlightEndTime: 0,
      });
    }
  }

  return { rows, cells };
}

function setupHand(image: HTMLImageElement, canvas: HTMLCanvasElement): Hand {
  const { rows, cells } = buildCells(image);
  const cellList = [...cells.values()];

  canvas.width = ASCII_COLUMNS * CELL_SIZE * DPR;
  canvas.height = rows * CELL_SIZE * DPR;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return { canvas, cells, cellList, rows, render: () => undefined };
  }

  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  ctx.font = `${FONT_SIZE}px monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  const metrics = ctx.measureText("X");
  const glyphHeight =
    metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
  const baselineOffset =
    CELL_SIZE / 2 + glyphHeight / 2 - metrics.actualBoundingBoxDescent;

  const canvasWidth = ASCII_COLUMNS * CELL_SIZE;
  const canvasHeight = rows * CELL_SIZE;

  const render = () => {
    const now = Date.now();
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    for (const cell of cellList) {
      const x = cell.col * CELL_SIZE;
      const y = cell.row * CELL_SIZE;
      const isHighlighted = cell.highlightEndTime > now;

      if (isHighlighted) {
        ctx.fillStyle = HOVER_COLOR;
        ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
      }

      ctx.fillStyle = isHighlighted ? HOVER_CHAR_COLOR : CHAR_COLOR;
      ctx.fillText(cell.char, x + CELL_SIZE / 2, y + baselineOffset);
    }
  };

  return { canvas, cells, cellList, rows, render };
}

function highlightCluster(
  cells: Map<string, AsciiCell>,
  startCell: AsciiCell,
) {
  const now = Date.now();
  startCell.highlightEndTime = now + HIGHLIGHT_LIFETIME;

  const steps = Math.floor(Math.random() * CLUSTER_SIZE) + 1;
  const litCells = [startCell];
  let current = startCell;

  for (let step = 0; step < steps; step += 1) {
    const neighbours: AsciiCell[] = [];
    for (let dy = -1; dy <= 1; dy += 1) {
      for (let dx = -1; dx <= 1; dx += 1) {
        if (dx === 0 && dy === 0) continue;
        const neighbour = cells.get(`${current.col + dx},${current.row + dy}`);
        if (neighbour && !litCells.includes(neighbour)) {
          neighbours.push(neighbour);
        }
      }
    }

    if (neighbours.length === 0) break;

    const next = neighbours[Math.floor(Math.random() * neighbours.length)];
    next.highlightEndTime = now + HIGHLIGHT_LIFETIME + step * 10;
    litCells.push(next);
    current = next;
  }
}

function hoverHand(hand: Hand, clientX: number, clientY: number) {
  const rect = hand.canvas.getBoundingClientRect();
  const mouseCol = ((clientX - rect.left) / rect.width) * ASCII_COLUMNS;
  const mouseRow = ((clientY - rect.top) / rect.height) * hand.rows;

  let closest: AsciiCell | null = null;
  let closestDist = Infinity;

  for (const cell of hand.cellList) {
    const dx = mouseCol - cell.col;
    const dy = mouseRow - cell.row;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < closestDist) {
      closestDist = dist;
      closest = cell;
    }
  }

  if (closest && closestDist <= HOVER_RADIUS) {
    highlightCluster(hand.cells, closest);
  }
}

function CharHeading({ text }: { text: string }) {
  return (
    <h1>
      {Array.from(text).map((char, index) => (
        <span className="char" key={`${char}-${index}`}>
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </h1>
  );
}

export default function Footer({ profile }: { profile: Profile }) {
  const footerRef = useRef<HTMLElement>(null);
  const revealerRef = useRef<HTMLDivElement>(null);
  const leftImgRef = useRef<HTMLImageElement>(null);
  const rightImgRef = useRef<HTMLImageElement>(null);
  const leftCanvasRef = useRef<HTMLCanvasElement>(null);
  const rightCanvasRef = useRef<HTMLCanvasElement>(null);
  const leftHandRef = useRef<HTMLDivElement>(null);
  const rightHandRef = useRef<HTMLDivElement>(null);

  const names = useMemo(() => {
    const parts = profile.name.trim().split(/\s+/);
    return {
      first: parts[0] ?? profile.name,
      last: parts.slice(1).join(" ") || profile.role,
    };
  }, [profile.name, profile.role]);

  useEffect(() => {
    const footer = footerRef.current;
    const revealer = revealerRef.current;
    const leftImg = leftImgRef.current;
    const rightImg = rightImgRef.current;
    const leftCanvas = leftCanvasRef.current;
    const rightCanvas = rightCanvasRef.current;
    const leftWrap = leftHandRef.current;
    const rightWrap = rightHandRef.current;
    if (
      !footer ||
      !revealer ||
      !leftImg ||
      !rightImg ||
      !leftCanvas ||
      !rightCanvas ||
      !leftWrap ||
      !rightWrap
    ) {
      return;
    }

    let cancelled = false;
    let asciiRaf = 0;
    let parallaxRaf = 0;
    const triggers: ScrollTrigger[] = [];
    const tweens: gsap.core.Tween[] = [];

    const headingChars = footer.querySelectorAll<HTMLElement>(".char");
    const contentLines = footer.querySelectorAll<HTMLElement>(".line");
    gsap.set(headingChars, { position: "relative", yPercent: 125 });
    gsap.set(contentLines, { yPercent: 100 });

    const reveal = { left: -125, right: 125 };
    const pointer = { x: 0, y: 0 };
    const drift = { x: 0, y: 0 };
    const parallaxScale = 1 + (PARALLAX_STRENGTH * 2) / 200;
    const handWrappers = [leftWrap, rightWrap];

    const hands: Hand[] = [];

    const waitForImage = (image: HTMLImageElement) =>
      new Promise<void>((resolve) => {
        if (image.complete && image.naturalWidth) {
          resolve();
          return;
        }
        const onLoad = () => {
          image.removeEventListener("error", onLoad);
          resolve();
        };
        image.addEventListener("load", onLoad, { once: true });
        image.addEventListener("error", onLoad, { once: true });
      });

    const animateIn = () => {
      tweens.push(
        gsap.to(reveal, {
          left: 0,
          right: 0,
          duration: 1,
          ease: "power3.out",
          overwrite: true,
        }),
        gsap.to(headingChars, {
          yPercent: 0,
          duration: 1,
          ease: "power3.out",
          stagger: { each: 0.04, from: "center" },
          overwrite: true,
        }),
        gsap.to(contentLines, {
          yPercent: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.08,
          overwrite: true,
        }),
      );
    };

    const animateOut = () => {
      tweens.push(
        gsap.to(reveal, {
          left: -125,
          right: 125,
          duration: 0.4,
          ease: "power2.in",
          overwrite: true,
        }),
        gsap.to(headingChars, {
          yPercent: 125,
          duration: 0.4,
          ease: "power2.in",
          stagger: { each: 0.01, from: "center" },
          overwrite: true,
        }),
        gsap.to(contentLines, {
          yPercent: 100,
          duration: 0.4,
          ease: "power2.in",
          stagger: 0.02,
          overwrite: true,
        }),
      );
    };

    const renderParallax = () => {
      drift.x += (pointer.x - drift.x) * PARALLAX_EASE;
      drift.y += (pointer.y - drift.y) * PARALLAX_EASE;

      handWrappers.forEach((wrapper, index) => {
        const direction = index === 0 ? 1 : -1;
        const revealX = index === 0 ? reveal.left : reveal.right;
        const x = drift.x * direction;
        const y = -drift.y;
        wrapper.style.transform = `translate(calc(${x}px + ${revealX}%), ${y}px) scale(${parallaxScale})`;
      });

      parallaxRaf = requestAnimationFrame(renderParallax);
    };

    const onMouseMove = (event: MouseEvent) => {
      const rect = footer.getBoundingClientRect();
      pointer.x =
        ((event.clientX - rect.left) / rect.width - 0.5) * PARALLAX_STRENGTH * 2;
      pointer.y =
        ((event.clientY - rect.top) / rect.height - 0.5) * PARALLAX_STRENGTH * 2;

      hands.forEach((hand) => hoverHand(hand, event.clientX, event.clientY));
    };

    const start = async () => {
      await Promise.all([waitForImage(leftImg), waitForImage(rightImg)]);
      if (cancelled) return;

      const leftHand = setupHand(leftImg, leftCanvas);
      const rightHand = setupHand(rightImg, rightCanvas);
      hands.push(leftHand, rightHand);

      const tickAscii = () => {
        leftHand.render();
        rightHand.render();
        asciiRaf = requestAnimationFrame(tickAscii);
      };

      tickAscii();
      renderParallax();
      window.addEventListener("mousemove", onMouseMove);

      triggers.push(
        ScrollTrigger.create({
          trigger: revealer,
          start: "top 50%",
          onEnter: animateIn,
        }),
        ScrollTrigger.create({
          trigger: revealer,
          start: "top 85%",
          onLeaveBack: animateOut,
        }),
      );

      ScrollTrigger.refresh();
    };

    void start();

    return () => {
      cancelled = true;
      cancelAnimationFrame(asciiRaf);
      cancelAnimationFrame(parallaxRaf);
      window.removeEventListener("mousemove", onMouseMove);
      triggers.forEach((trigger) => trigger.kill());
      tweens.forEach((tween) => tween.kill());
    };
  }, []);

  return (
    <>
      <div ref={revealerRef} className="ascii-footer-revealer" />
      <footer ref={footerRef} className="ascii-footer">
        <div className="ascii-footer-images">
          <div ref={leftHandRef} className="ascii-footer-hand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={leftImgRef}
              className="ascii-hand"
              src="/images/hand-left.png"
              alt=""
            />
            <canvas ref={leftCanvasRef} />
          </div>
          <div ref={rightHandRef} className="ascii-footer-hand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={rightImgRef}
              className="ascii-hand"
              src="/images/hand-right.png"
              alt=""
            />
            <canvas ref={rightCanvasRef} />
          </div>
        </div>

        <div className="ascii-footer-content">
          <nav className="ascii-footer-links" aria-label="Social">
            {profile.socials.map((item) => (
              <a
                key={item.label}
                href={item.url}
                target="_blank"
                rel="noreferrer"
              >
                <span className="line">{item.label}</span>
              </a>
            ))}
          </nav>
          <p className="ascii-footer-copy">
            <span className="line">
              © {new Date().getFullYear()} {profile.name}. All rights reserved.
            </span>
          </p>
        </div>

        <div className="ascii-footer-header">
          <CharHeading text={names.first} />
          <CharHeading text={names.last} />
        </div>
      </footer>
    </>
  );
}
