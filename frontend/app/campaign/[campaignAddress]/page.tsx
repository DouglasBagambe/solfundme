// frontend/app/campaign/[campaignAddress]/page.tsx

"use client";

import dynamic from "next/dynamic";
import { ConnectionProvider } from "@solana/wallet-adapter-react";
import { WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";

// Dynamic import of the actual campaign details component
const CampaignDetails = dynamic(
  () => import("../../components/CampaignDetails"),
  {
    ssr: false,
  }
);

// Configure wallets
const wallets = [new PhantomWalletAdapter(), new SolflareWalletAdapter()];

export default function CampaignPage() {
  return (
    <ConnectionProvider endpoint="https://api.devnet.solana.com">
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <CampaignDetails />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
