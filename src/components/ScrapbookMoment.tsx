"use client";

import { Moment } from "@/lib/supabase";
import MediaDisplay from "./MediaDisplay";
import { HiMapPin, HiClock, HiCheckCircle } from "react-icons/hi2";
import Image from "next/image";
import { useEffect, useState } from "react";

interface ScrapbookMomentProps {
  moment: Moment;
}

// Sticker configuration
const AVAILABLE_STICKERS = Array.from(
  { length: 13 },
  (_, i) => `/stickers/${i + 1}.png`
);

// Helper function to generate consistent random values based on moment ID
function seededRandom(seed: string, index = 0): number {
  const hash = seed.split("").reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, index);
  return Math.abs(hash % 1000) / 1000;
}

// Define sticker type
interface StickerType {
  src: string;
  x: number;
  y: number;
  size: number;
  rotation: number;
  id: string;
  zone: string;
}

// Check if two stickers overlap
function checkOverlap(sticker1: StickerType, sticker2: StickerType): boolean {
  const buffer = 20; // Minimum distance between stickers
  const dx = Math.abs(sticker1.x - sticker2.x);
  const dy = Math.abs(sticker1.y - sticker2.y);
  const minDistance = ((sticker1.size + sticker2.size) / 200) * 100 + buffer; // Convert to percentage

  return Math.sqrt(dx * dx + dy * dy) < minDistance;
}

// Generate random stickers for a moment
function generateStickers(momentId: string, count = 3) {
  const stickers: StickerType[] = [];

  // Define edge positions (corners and sides) - more spread out
  const edgePositions = [
    // Top edge
    { x: -15, y: -20, zone: "top-left" },
    { x: 85, y: -18, zone: "top-right" },
    { x: 40, y: -15, zone: "top-center" },

    // Bottom edge
    { x: -10, y: 80, zone: "bottom-left" },
    { x: 90, y: 85, zone: "bottom-right" },
    { x: 45, y: 90, zone: "bottom-center" },

    // Side edges
    { x: -20, y: 25, zone: "left-top" },
    { x: -15, y: 55, zone: "left-bottom" },
    { x: 100, y: 20, zone: "right-top" },
    { x: 105, y: 50, zone: "right-bottom" },

    // Corners (well outside boundaries)
    { x: -25, y: -25, zone: "corner-top-left" },
    { x: 105, y: -30, zone: "corner-top-right" },
    { x: -30, y: 105, zone: "corner-bottom-left" },
    { x: 110, y: 100, zone: "corner-bottom-right" },
  ];

  const maxAttempts = 50;

  for (let i = 0; i < count; i++) {
    let attempts = 0;
    let validPosition = false;
    let newSticker: StickerType | undefined;

    while (!validPosition && attempts < maxAttempts) {
      const stickerIndex = Math.floor(
        seededRandom(momentId, i + attempts * 10) * AVAILABLE_STICKERS.length
      );

      // Select a random edge position
      const positionIndex = Math.floor(
        seededRandom(momentId, i + 50 + attempts * 10) * edgePositions.length
      );
      const basePosition = edgePositions[positionIndex];

      // Add some randomness to the position
      const x =
        basePosition.x +
        (seededRandom(momentId, i + 100 + attempts * 10) - 0.5) * 15;
      const y =
        basePosition.y +
        (seededRandom(momentId, i + 200 + attempts * 10) - 0.5) * 15;

      // Much bigger stickers
      const size = 100 + seededRandom(momentId, i + 300 + attempts * 10) * 80; // 100-180px (slightly smaller for better spacing)
      const rotation =
        -45 + seededRandom(momentId, i + 400 + attempts * 10) * 90; // -45 to 45 degrees

      newSticker = {
        src: AVAILABLE_STICKERS[stickerIndex],
        x,
        y,
        size,
        rotation,
        id: `${momentId}-sticker-${i}`,
        zone: basePosition.zone,
      };

      // Check for overlaps with existing stickers
      if (newSticker) {
        validPosition = stickers.every(
          (existingSticker) => !checkOverlap(newSticker!, existingSticker)
        );
      }
      attempts++;
    }

    if (validPosition && newSticker) {
      stickers.push(newSticker);
    }
  }

  return stickers;
}

// Template configurations
const getTemplateConfig = (category: string | null, momentId: string) => {
  const baseRotation = -3 + seededRandom(momentId, 999) * 6; // -3 to 3 degrees

  switch (category?.toLowerCase()) {
    case "anniversary":
      return {
        bgColor: "bg-rose-50",
        accentColor: "text-rose-600",
        borderColor: "border-rose-200",
        fontClass: "handwriting-print",
        titleFontClass: "handwriting-marker",
        stickerCount: 4,
        rotation: baseRotation,
        paperType: "note-paper torn-edge",
      };
    case "favourite":
    case "favorite":
      return {
        bgColor: "bg-yellow-50",
        accentColor: "text-yellow-600",
        borderColor: "border-yellow-200",
        fontClass: "handwriting-print",
        titleFontClass: "handwriting-marker",
        stickerCount: 5,
        rotation: baseRotation,
        paperType: "note-paper vintage-frame",
      };
    case "milestone":
      return {
        bgColor: "bg-green-50",
        accentColor: "text-green-600",
        borderColor: "border-green-200",
        fontClass: "handwriting-print",
        titleFontClass: "handwriting-marker",
        stickerCount: 4,
        rotation: baseRotation,
        paperType: "note-paper vintage-frame",
      };
    default:
      return {
        bgColor: "bg-blue-50",
        accentColor: "text-blue-600",
        borderColor: "border-blue-200",
        fontClass: "handwriting-print",
        titleFontClass: "handwriting-marker",
        stickerCount: 3,
        rotation: baseRotation,
        paperType: "note-paper torn-edge",
      };
  }
};

export default function ScrapbookMoment({ moment }: ScrapbookMomentProps) {
  const [stickers, setStickers] = useState<StickerType[]>([]);
  const template = getTemplateConfig(moment.category || null, moment.id);

  useEffect(() => {
    setStickers(generateStickers(moment.id, template.stickerCount));
  }, [moment.id, template.stickerCount]);

  const photoRotation = -5 + seededRandom(moment.id, 500) * 10; // -5 to 5 degrees
  const floatDelay = seededRandom(moment.id, 600) * 2; // 0-2 second delay

  return (
    <div className="relative">
      <div
        className={`moment-card paper-texture ${template.bgColor} ${template.paperType} relative overflow-visible`}
        style={
          {
            "--card-rotation": `${template.rotation}deg`,
            "--float-delay": `${floatDelay}s`,
            "--float-rotation": `${template.rotation}deg`,
            zIndex: 1,
          } as React.CSSProperties
        }
      >
        {/* Title - Handwritten style */}
        <div className="relative z-20 mb-6">
          <h3
            className={`text-2xl font-bold ${template.accentColor} ${template.titleFontClass} mb-2`}
          >
            {moment.title}
          </h3>

          {moment.category && (
            <span
              className={`inline-block px-3 py-1 ${template.bgColor} ${template.borderColor} border-2 text-sm rounded-full ${template.fontClass} transform rotate-1`}
            >
              {moment.category}
            </span>
          )}
        </div>

        {/* Photo/Media Section */}
        {moment.media_url && (
          <div
            className="photo-frame mb-6 relative z-20 hover:scale-105 transition-transform duration-300"
            style={
              { "--rotation": `${photoRotation}deg` } as React.CSSProperties
            }
          >
            <MediaDisplay
              url={moment.media_url}
              alt={moment.title}
              title={moment.title}
              className="!mb-0"
            />
            {/* Random photo corner decoration */}
            {seededRandom(moment.id, 777) > 0.6 && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-400 rounded-full opacity-80 transform rotate-45"></div>
            )}
          </div>
        )}

        {/* Content - Handwritten note style */}
        {moment.content && (
          <div className="relative z-20 mb-6">
            <div className="bg-yellow-100 p-4 transform -rotate-1 shadow-md border-l-4 border-yellow-400">
              <p
                className={`${template.fontClass} text-gray-800 text-xl leading-relaxed whitespace-pre-wrap`}
              >
                {moment.content}
              </p>
            </div>
          </div>
        )}

        {/* Date and Location Info */}
        <div className="relative z-20 space-y-3">
          {(moment.city || moment.country) && (
            <div className="flex items-center gap-2">
              <HiMapPin className={`${template.accentColor}`} size={20} />
              <span className={`${template.fontClass} text-xl text-gray-700`}>
                {[moment.city, moment.country].filter(Boolean).join(", ")}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <HiClock className="text-orange-500" size={20} />
            <span className={`${template.fontClass} text-xl text-gray-700`}>
              {new Date(moment.started_at).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          {moment.completed_at && (
            <div className="flex items-center gap-2">
              <HiCheckCircle className="text-green-500" size={20} />
              <span className={`${template.fontClass} text-xl text-gray-700`}>
                Completed on{" "}
                {new Date(moment.completed_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          )}
        </div>

        {/* Completion badge */}
        {moment.completed_at && (
          <div className="absolute top-4 right-4 z-30">
            <div className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm font-bold transform rotate-12 shadow-lg">
              ✓ Done!
            </div>
          </div>
        )}

        {/* Tape effect for some cards */}
        {seededRandom(moment.id, 888) > 0.5 && (
          <div className="absolute top-0 left-1/4 w-16 h-8 bg-yellow-200 opacity-60 transform -rotate-12 shadow-sm border border-yellow-300"></div>
        )}
      </div>

      {/* Stickers - rendered after the card to ensure they're on top */}
      {stickers.map((sticker) => (
        <Image
          key={sticker.id}
          src={sticker.src}
          alt="Decorative sticker"
          width={sticker.size}
          height={sticker.size}
          className="absolute hover:scale-105 transition-transform duration-300"
          style={{
            left: `${sticker.x}%`,
            top: `${sticker.y}%`,
            transform: `rotate(${sticker.rotation}deg)`,
            zIndex: 10000,
          }}
        />
      ))}
    </div>
  );
}
