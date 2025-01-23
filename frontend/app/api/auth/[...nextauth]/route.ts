// frontend/app/api/auth/[...nextauth]/route.ts

/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {
  verifySignature,
  getChainIdFromMessage,
  getAddressFromMessage,
} from "@reown/appkit-siwe";

const nextAuthSecret = process.env.NEXTAUTH_SECRET;
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!nextAuthSecret) {
  throw new Error("NEXTAUTH_SECRET is not set");
}

if (!projectId) {
  throw new Error("NEXT_PUBLIC_PROJECT_ID is not set");
}

const providers = [
  CredentialsProvider({
    name: "Solana",
    credentials: {
      message: { label: "Message", type: "text" },
      signature: { label: "Signature", type: "text" },
    },
    async authorize(credentials) {
      try {
        if (!credentials?.message) {
          throw new Error("SiweMessage is undefined");
        }

        const { message, signature } = credentials;
        const address = getAddressFromMessage(message);
        const chainId = getChainIdFromMessage(message);

        const isValid = await verifySignature({
          address,
          message,
          signature,
          chainId,
          projectId,
        });

        return isValid ? { id: `${chainId}:${address}` } : null;
      } catch (e) {
        return null;
      }
    },
  }),
];

const handler = NextAuth({
  secret: nextAuthSecret,
  providers,
  session: { strategy: "jwt" },
  callbacks: {
    session({ session, token }) {
      if (!token.sub) return session;

      const [, chainId, address] = token.sub.split(":");
      if (chainId && address) {
        session.address = address;
        session.chainId = parseInt(chainId, 10);
      }

      return session;
    },
  },
});

export { handler as GET, handler as POST };
