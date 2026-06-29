import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const abcRepro = localFont({
  src: "./ABCReproVariable.woff2",
  variable: "--font-heading",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: "swarm.fail — write one rule, command a swarm",
  description:
    "Submit one local policy. We clone it into a swarm and drop it on a map it's never seen. One number: steps to cover the map. Beat the Lévy-flight forager.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${abcRepro.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
