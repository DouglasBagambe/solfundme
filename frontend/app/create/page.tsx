// frontend/app/create/page.tsx

/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProgram } from "../../hooks/useProgram";
import { useWallet } from "@solana/wallet-adapter-react";
import { BN } from "@project-serum/anchor";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const CreateCampaignPage = () => {
  const { createCampaign } = useProgram();
  const wallet = useWallet();
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [newCampaign, setNewCampaign] = useState({
    name: "",
    description: "",
    category: "",
    imageUrl: "",
    websiteUrl: "",
    goalAmount: "",
    minContribution: "",
    campaignDuration: "",
  });

  const validateCampaignData = () => {
    if (!newCampaign.name || !newCampaign.description) {
      throw new Error("Name and description are required");
    }
    if (!newCampaign.goalAmount || Number(newCampaign.goalAmount) <= 0) {
      throw new Error("Goal amount must be greater than 0");
    }
    if (
      !newCampaign.minContribution ||
      Number(newCampaign.minContribution) <= 0
    ) {
      throw new Error("Minimum contribution must be greater than 0");
    }
    if (
      !newCampaign.campaignDuration ||
      Number(newCampaign.campaignDuration) <= 0
    ) {
      throw new Error("Campaign duration must be greater than 0 days");
    }
  };

  const handleCreateCampaign = async () => {
    if (!wallet.connected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      validateCampaignData();

      const config = {
        name: newCampaign.name,
        description: newCampaign.description,
        category: newCampaign.category || "General",
        imageUrl: newCampaign.imageUrl || "",
        websiteUrl: newCampaign.websiteUrl || "",
        goalAmount: new BN(Number(newCampaign.goalAmount) * 1e9),
        minContribution: new BN(Number(newCampaign.minContribution) * 1e9),
        campaignDuration: new BN(
          Number(newCampaign.campaignDuration) * 24 * 60 * 60
        ),
        allowsRefund: true,
        autoRefundOnFailure: true,
      };

      const milestones = [
        {
          title: "Initial Release",
          description: "Initial funds release",
          percentage: 100,
          expectedCompletionTime: new BN(Date.now() / 1000 + 7 * 24 * 60 * 60),
          isCompleted: false,
        },
      ];

      const { tx, campaignPda } = await createCampaign(
        wallet,
        config,
        milestones
      );

      // Store campaign info in localStorage for reference
      const userCampaigns = JSON.parse(
        localStorage.getItem("userCampaigns") || "[]"
      );
      userCampaigns.push({
        address: campaignPda,
        name: newCampaign.name,
        createdAt: Date.now(),
      });
      localStorage.setItem("userCampaigns", JSON.stringify(userCampaigns));

      toast({
        title: "Success!",
        description: "Campaign created successfully",
      });

      // Reset form
      setNewCampaign({
        name: "",
        description: "",
        category: "",
        imageUrl: "",
        websiteUrl: "",
        goalAmount: "",
        minContribution: "",
        campaignDuration: "",
      });

      router.push("/campaigns");
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create campaign",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCampaign((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Create New Campaign</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="name">Campaign Name</Label>
              <Input
                id="name"
                name="name"
                value={newCampaign.name}
                onChange={handleInputChange}
                placeholder="Enter campaign name"
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                value={newCampaign.description}
                onChange={handleInputChange}
                placeholder="Enter campaign description"
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="goalAmount">Goal Amount (SOL)</Label>
              <Input
                id="goalAmount"
                name="goalAmount"
                type="number"
                value={newCampaign.goalAmount}
                onChange={handleInputChange}
                placeholder="Enter goal amount"
                disabled={isLoading}
                min="0"
                step="0.1"
              />
            </div>

            <div>
              <Label htmlFor="minContribution">
                Minimum Contribution (SOL)
              </Label>
              <Input
                id="minContribution"
                name="minContribution"
                type="number"
                value={newCampaign.minContribution}
                onChange={handleInputChange}
                placeholder="Enter minimum contribution"
                disabled={isLoading}
                min="0"
                step="0.1"
              />
            </div>

            <div>
              <Label htmlFor="campaignDuration">Duration (days)</Label>
              <Input
                id="campaignDuration"
                name="campaignDuration"
                type="number"
                value={newCampaign.campaignDuration}
                onChange={handleInputChange}
                placeholder="Enter campaign duration in days"
                disabled={isLoading}
                min="1"
              />
            </div>

            <Button
              className="mt-4"
              onClick={handleCreateCampaign}
              disabled={isLoading}
            >
              {isLoading ? "Creating Campaign..." : "Create Campaign"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateCampaignPage;
