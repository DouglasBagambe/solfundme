// frontend/hooks/useProgram.ts

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCallback } from "react";
import { BN, Program, AnchorProvider, Idl } from "@project-serum/anchor";
import { SystemProgram, Connection, PublicKey, Keypair } from "@solana/web3.js";
import { IDL as rawIDL, PROGRAM_ID } from "../lib/config";

const IDL: Idl = rawIDL as Idl;
const SOLANA_RPC_URL = "https://api.devnet.solana.com";

export interface CampaignConfig {
  name: string;
  description: string;
  category: string;
  imageUrl: string;
  websiteUrl: string;
  goalAmount: BN;
  minContribution: BN;
  campaignDuration: BN;
  allowsRefund: boolean;
  autoRefundOnFailure: boolean;
}

export interface Milestone {
  title: string;
  description: string;
  percentage: number;
  expectedCompletionTime: BN;
  isCompleted: boolean;
}

export interface CampaignDetails {
  creator: PublicKey;
  name: string;
  description: string;
  category: string;
  imageUrl: string;
  websiteUrl: string;
  goalAmount: number;
  minContribution: number;
  amountRaised: number;
  withdrawnAmount: number;
  startTime: number;
  endTime: number;
  isActive: boolean;
  isPaused: boolean;
  allowsRefund: boolean;
  autoRefundOnFailure: boolean;
  milestones: Milestone[];
  currentMilestone: number;
  updates: Array<{
    timestamp: number;
    title: string;
    content: string;
  }>;
  funders: Array<{
    address: PublicKey;
    amount: number;
    hasClaimedRefund: boolean;
  }>;
}

export const useProgram = () => {
  const getProgram = useCallback(async (wallet: any) => {
    const connection = new Connection(SOLANA_RPC_URL);
    const provider = new AnchorProvider(connection, wallet, {
      commitment: "processed",
    });
    return new Program(IDL, new PublicKey(PROGRAM_ID), provider);
  }, []);

  const createCampaign = useCallback(
    async (wallet: any, config: CampaignConfig, milestones: Milestone[]) => {
      try {
        const program = await getProgram(wallet);

        const [campaignPda] = PublicKey.findProgramAddressSync(
          [
            Buffer.from("campaign"),
            wallet.publicKey.toBuffer(),
            Buffer.from(config.name),
          ],
          program.programId
        );

        const tx = await program.methods
          .initializeCampaign(config, milestones)
          .accounts({
            campaign: campaignPda,
            creator: wallet.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .rpc();

        return {
          tx,
          campaignPda: campaignPda.toString(),
        };
      } catch (error) {
        console.error("Error creating campaign:", error);
        throw error;
      }
    },
    [getProgram]
  );

  const getCampaignDetails = useCallback(
    async (campaignAddress: string): Promise<CampaignDetails> => {
      try {
        // Create a dummy wallet if none is connected
        const dummyWallet = {
          publicKey: null,
          signTransaction: async () => {
            throw new Error("Wallet not connected");
          },
          signAllTransactions: async () => {
            throw new Error("Wallet not connected");
          },
          signMessage: async () => {
            throw new Error("Wallet not connected");
          },
        };

        const program = await getProgram(window.solana || dummyWallet);
        const campaignAccount = (await program.account.campaign.fetch(
          new PublicKey(campaignAddress)
        )) as any;

        return {
          creator: campaignAccount.creator as PublicKey,
          name: campaignAccount.name as string,
          description: campaignAccount.description as string,
          category: campaignAccount.category as string,
          imageUrl: campaignAccount.imageUrl as string,
          websiteUrl: campaignAccount.websiteUrl as string,
          goalAmount: campaignAccount.goalAmount.toNumber(),
          minContribution: campaignAccount.minContribution.toNumber(),
          amountRaised: campaignAccount.amountRaised.toNumber(),
          withdrawnAmount: campaignAccount.withdrawnAmount.toNumber(),
          startTime: campaignAccount.startTime.toNumber(),
          endTime: campaignAccount.endTime.toNumber(),
          isActive: campaignAccount.isActive,
          isPaused: campaignAccount.isPaused,
          allowsRefund: campaignAccount.allowsRefund,
          autoRefundOnFailure: campaignAccount.autoRefundOnFailure,
          milestones: campaignAccount.milestones,
          currentMilestone: campaignAccount.currentMilestone,
          updates: campaignAccount.updates.map((update: any) => ({
            timestamp: update.timestamp.toNumber(),
            title: update.title,
            content: update.content,
          })),
          funders: campaignAccount.funders.map((funder: any) => ({
            address: funder.address,
            amount: funder.amount.toNumber(),
            hasClaimedRefund: funder.hasClaimedRefund,
          })),
        };
      } catch (error) {
        console.error("Error fetching campaign details:", error);
        throw error;
      }
    },
    [getProgram]
  );

  const fundCampaign = useCallback(
    async (wallet: any, campaignAddress: string, amount: number) => {
      try {
        const program = await getProgram(wallet);
        const tx = await program.methods
          .fundCampaign(new BN(amount))
          .accounts({
            campaign: new PublicKey(campaignAddress),
            funder: wallet.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .rpc();
        return tx;
      } catch (error) {
        console.error("Error funding campaign:", error);
        throw error;
      }
    },
    [getProgram]
  );

  const updateCampaign = useCallback(
    async (
      wallet: any,
      campaignAddress: string,
      updates: {
        description?: string;
        imageUrl?: string;
        websiteUrl?: string;
      }
    ) => {
      try {
        const program = await getProgram(wallet);
        const tx = await program.methods
          .updateCampaign(
            updates.description,
            updates.imageUrl,
            updates.websiteUrl
          )
          .accounts({
            campaign: new PublicKey(campaignAddress),
            creator: wallet.publicKey,
          })
          .rpc();
        return tx;
      } catch (error) {
        console.error("Error updating campaign:", error);
        throw error;
      }
    },
    [getProgram]
  );

  const addUpdate = useCallback(
    async (
      wallet: any,
      campaignAddress: string,
      title: string,
      content: string
    ) => {
      try {
        const program = await getProgram(wallet);
        const tx = await program.methods
          .addCampaignUpdate(title, content)
          .accounts({
            campaign: new PublicKey(campaignAddress),
            creator: wallet.publicKey,
          })
          .rpc();
        return tx;
      } catch (error) {
        console.error("Error adding update:", error);
        throw error;
      }
    },
    [getProgram]
  );

  const withdrawMilestone = useCallback(
    async (wallet: any, campaignAddress: string) => {
      try {
        const program = await getProgram(wallet);
        const tx = await program.methods
          .withdrawMilestone()
          .accounts({
            campaign: new PublicKey(campaignAddress),
            creator: wallet.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .rpc();
        return tx;
      } catch (error) {
        console.error("Error withdrawing milestone:", error);
        throw error;
      }
    },
    [getProgram]
  );

  const requestRefund = useCallback(
    async (wallet: any, campaignAddress: string) => {
      try {
        const program = await getProgram(wallet);
        const tx = await program.methods
          .requestRefund()
          .accounts({
            campaign: new PublicKey(campaignAddress),
            funder: wallet.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .rpc();
        return tx;
      } catch (error) {
        console.error("Error requesting refund:", error);
        throw error;
      }
    },
    [getProgram]
  );

  const togglePause = useCallback(
    async (wallet: any, campaignAddress: string, isPaused: boolean) => {
      try {
        const program = await getProgram(wallet);
        const method = isPaused ? "resumeCampaign" : "pauseCampaign";
        const tx = await program.methods[method]()
          .accounts({
            campaign: new PublicKey(campaignAddress),
            creator: wallet.publicKey,
          })
          .rpc();
        return tx;
      } catch (error) {
        console.error("Error toggling pause state:", error);
        throw error;
      }
    },
    [getProgram]
  );

  const emergencyShutdown = useCallback(
    async (wallet: any, campaignAddress: string) => {
      try {
        const program = await getProgram(wallet);
        const tx = await program.methods
          .emergencyShutdown()
          .accounts({
            campaign: new PublicKey(campaignAddress),
            creator: wallet.publicKey,
          })
          .rpc();
        return tx;
      } catch (error) {
        console.error("Error performing emergency shutdown:", error);
        throw error;
      }
    },
    [getProgram]
  );

  return {
    createCampaign,
    getCampaignDetails,
    fundCampaign,
    updateCampaign,
    addUpdate,
    withdrawMilestone,
    requestRefund,
    togglePause,
    emergencyShutdown,
  };
};
