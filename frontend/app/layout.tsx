import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import AnimatedContent from "./components/AnimatedContent";
import { AuthProvider } from "./providers/AuthProvider";

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
        style={{
          background:
            "linear-gradient(to bottom right, rgba(23, 23, 43, 0.9), rgba(15, 23, 42, 0.9))",
        }}
      >
        <AuthProvider>
          <div className="relative">
            {/* Enhanced animated background layers */}
            <div className="fixed inset-0 -z-10 h-full w-full overflow-hidden">
              {/* Top gradient orb */}
              <div
                className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[100vw] h-[100vw] animate-pulse"
                style={{
                  background:
                    "radial-gradient(circle, rgba(147, 51, 234, 0.25) 0%, rgba(126, 34, 206, 0.15) 30%, transparent 70%)",
                  filter: "blur(3xl)",
                  transform: "rotate(0deg)",
                  animation: "spin 20s linear infinite",
                }}
              />

              {/* Bottom gradient orb */}
              <div
                className="absolute bottom-0 translate-y-1/2 right-1/2 translate-x-1/2 w-[100vw] h-[100vw] animate-pulse delay-75"
                style={{
                  background:
                    "radial-gradient(circle, rgba(6, 182, 212, 0.25) 0%, rgba(59, 130, 246, 0.15) 30%, transparent 70%)",
                  filter: "blur(3xl)",
                  transform: "rotate(0deg)",
                  animation: "spin 25s linear infinite reverse",
                }}
              />

              {/* Moving light streaks */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(60deg, transparent 0%, rgba(147, 51, 234, 0.1) 15%, transparent 40%)",
                  animation: "aurora 15s linear infinite",
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(-60deg, transparent 0%, rgba(6, 182, 212, 0.1) 25%, transparent 50%)",
                  animation: "aurora 15s linear infinite",
                  animationDelay: "-5s",
                }}
              />
            </div>

            {/* Subtle grid overlay */}
            <div className="fixed inset-0 -z-5 h-full w-full">
              <div className="absolute inset-0 bg-grid-small-white/[0.03] [mask-image:linear-gradient(to_bottom,transparent,black,transparent)]" />
            </div>

            {/* Floating particles effect */}
            <div
              className="fixed inset-0 -z-5"
              style={{
                background:
                  "radial-gradient(600px circle at 50% 200px, rgba(147, 51, 234, 0.15), transparent 80%)",
                animation: "pulse 6s ease-in-out infinite",
              }}
            />

            {/* Content container with subtle blur */}
            <div className="relative z-10 flex flex-col min-h-screen backdrop-blur-[0.5px]">
              <Header />
              <main className="flex-1 container mx-auto px-4 py-8">
                <div className="relative">
                  <AnimatedContent>{children}</AnimatedContent>
                  {/* Enhanced accent glows */}
                  <div
                    className="absolute -top-10 -left-10 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl animate-blob"
                    style={{ background: "rgba(147, 51, 234, 0.25)" }}
                  />
                  <div
                    className="absolute -bottom-10 -right-10 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"
                    style={{ background: "rgba(6, 182, 212, 0.25)" }}
                  />
                </div>
              </main>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
