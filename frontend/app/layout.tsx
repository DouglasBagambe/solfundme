// frontend/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import AnimatedContent from "./components/AnimatedContent";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SolFundMe - Decentralized Crowdfunding",
  description: "Decentralized crowdfunding platform on Solana",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-grid-pattern`}
      >
        <div className="relative">
          {/* Animated gradient orb in the background */}
          <div className="fixed inset-0 -z-10 h-full w-full">
            <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[80vw] h-[80vw] rounded-full bg-gradient-radial from-purple-500 via-violet-500/50 to-transparent blur-3xl" />
            <div className="absolute bottom-0 translate-y-1/2 right-1/2 translate-x-1/2 w-[80vw] h-[80vw] rounded-full bg-gradient-radial from-cyan-500 via-blue-500/50 to-transparent blur-3xl" />
          </div>

          {/* Grid pattern overlay */}
          <div className="fixed inset-0 -z-5 h-full w-full bg-grid-small-black/[0.02] dark:bg-grid-small-white/[0.02]" />

          {/* Content container */}
          <div className="relative z-10 flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8">
              <AnimatedContent>{children}</AnimatedContent>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
