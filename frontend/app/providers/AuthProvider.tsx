// frontend/app/providers/AuthProvider.tsx

/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { createSIWEConfig } from "@reown/appkit-siwe";
import { getCsrfToken, signIn, signOut, getSession } from "next-auth/react";
import { solana, solanaDevnet } from "@reown/appkit/networks";
import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";

declare module "next-auth" {
  interface Session {
    address?: string;
    chainId?: number;
  }
}

export const siweConfig = createSIWEConfig({
  getMessageParams: async () => ({
    domain: typeof window !== "undefined" ? window.location.host : "",
    uri: typeof window !== "undefined" ? window.location.origin : "",
    chains: [Number(solana.id), Number(solanaDevnet.id)],
    statement: "Sign in to SolFundMe",
  }),
  createMessage: ({ address, ...args }) => {
    // You might need to import formatMessage from @reown/appkit-siwe if needed
    return `Sign in to SolFundMe with address: ${address}`;
  },
  getNonce: async () => {
    const nonce = await getCsrfToken();
    if (!nonce) throw new Error("Failed to get nonce!");
    return nonce;
  },
  getSession: async () => {
    const session = await getSession();
    if (!session) return null;
    return {
      address: session.address as string,
      chainId: session.chainId as number,
    };
  },
  verifyMessage: async ({ message, signature }) => {
    try {
      const result = await signIn("credentials", {
        message,
        redirect: false,
        signature,
        callbackUrl: "/",
      });
      return Boolean(result?.ok);
    } catch (error) {
      return false;
    }
  },
  signOut: async () => {
    try {
      await signOut({ redirect: false });
      return true;
    } catch (error) {
      return false;
    }
  },
});

export function AuthProvider({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
