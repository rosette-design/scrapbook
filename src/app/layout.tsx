import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Montserrat,
  Homemade_Apple,
  Reenie_Beanie,
  Permanent_Marker,
  Caveat,
} from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "700"],
});

// Scrapbook handwriting fonts
const homemadeApple = Homemade_Apple({
  variable: "--font-homemade-apple",
  subsets: ["latin"],
  weight: ["400"],
});

const reenieBeanie = Reenie_Beanie({
  variable: "--font-reenie-beanie",
  subsets: ["latin"],
  weight: ["400"],
});

const permanentMarker = Permanent_Marker({
  variable: "--font-permanent-marker",
  subsets: ["latin"],
  weight: ["400"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Rosette Demo",
  description: "Rosette is a platform for creating and sharing your moments.",
  icons: {
    icon: [
      { url: "/favicons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicons/favicon.ico", sizes: "any" },
    ],
    apple: [
      {
        url: "/favicons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    other: [
      {
        rel: "android-chrome-192x192",
        url: "/favicons/android-chrome-192x192.png",
      },
      {
        rel: "android-chrome-512x512",
        url: "/favicons/android-chrome-512x512.png",
      },
    ],
  },
  manifest: "/favicons/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} ${homemadeApple.variable} ${reenieBeanie.variable} ${permanentMarker.variable} ${caveat.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
