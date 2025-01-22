// frontend/app/page.tsx
"use client";
import dynamic from "next/dynamic";
import { WalletProvider } from "@solana/wallet-adapter-react";
import { ConnectionProvider } from "@solana/wallet-adapter-react";
import { SolanaAdapter } from "@reown/appkit-adapter-solana/react";
import { solana, solanaDevnet } from "@reown/appkit/networks";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { createAppKit } from "@reown/appkit";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { motion } from "framer-motion";

const CampaignsPage = dynamic(() => import("./campaigns/page"), {
  ssr: false,
});

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) {
  throw new Error("Project Id is not defined.");
}

// Configure wallets
const wallets = [new PhantomWalletAdapter(), new SolflareWalletAdapter()];

// Initialize Reown AppKit
const solanaAdapter = new SolanaAdapter({ wallets });

createAppKit({
  adapters: [solanaAdapter],
  projectId,
  networks: [solana, solanaDevnet],
  features: {
    analytics: true,
    email: true,
    socials: ["google", "x", "github", "discord"],
    emailShowWallets: true,
  },
  themeMode: "light",
});

export default function Home() {
  return (
    <ConnectionProvider endpoint="https://api.devnet.solana.com">
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="relative">
            {/* Hero Section */}
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="relative min-h-[40vh] flex items-center justify-center overflow-hidden"
            >
              <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-950/95 via-blue-950/95 to-cyan-950/95 backdrop-blur-sm" />
              </div>

              <div className="relative z-10 text-center space-y-8 max-w-4xl mx-auto px-4">
                <motion.h1
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-6xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400"
                >
                  Crowdfunding on Solana
                </motion.h1>

                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl md:text-2xl text-gray-300"
                >
                  Decentralized. Transparent. Revolutionary.
                </motion.p>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-wrap gap-4 justify-center"
                >
                  <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg font-bold text-white shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:-translate-y-1">
                    Start a Campaign
                  </button>
                  <button className="px-8 py-4 bg-white/10 backdrop-blur-sm rounded-lg font-bold text-white border border-white/20 hover:bg-white/20 transition-all duration-300 hover:-translate-y-1">
                    Explore Projects
                  </button>
                </motion.div>
              </div>
            </motion.section>

            {/* Campaign List Section */}
            <section className="relative z-10 py-16">
              <CampaignsPage />
            </section>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
