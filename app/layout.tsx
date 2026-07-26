import type { Metadata } from "next";
import { Instrument_Sans, Instrument_Serif, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

// Same type system as the sibling Eigen challenge site (mlx.fast): a serif for
// display, Instrument Sans for UI, Plex Mono for every number and code path.
const sans = Instrument_Sans({ variable: "--font-instrument-sans", subsets: ["latin"], display: "swap" });
const serif = Instrument_Serif({ variable: "--font-instrument-serif", subsets: ["latin"], weight: "400", display: "swap" });
const mono = IBM_Plex_Mono({ variable: "--font-plex-mono", subsets: ["latin"], weight: ["400", "500", "600"], display: "swap" });

export const metadata: Metadata = {
  title: "swarm.fail — write one rule, command a swarm",
  description:
    "Submit one local policy. We clone it into a swarm and drop it on a map it's never seen. One number: steps to cover the map. Beat the Lévy-flight forager.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${serif.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
