// frontend/app/components/CampaignDetails.tsx

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */

"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useProgram } from "@/hooks/useProgram";
import { useWallet } from "@solana/wallet-adapter-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, ArrowLeft, AlertTriangle, TagIcon } from "lucide-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

interface CampaignDetails {
  creator: string;
  name: string;
  description: string;
  category: string;
  imageUrl: string;
  amountRaised: number;
  goalAmount: number;
  minContribution: number;
  endTime: number;
  isActive: boolean;
  isPaused: boolean;
  allowsRefund: boolean;
  autoRefundOnFailure: boolean;
  withdrawnAmount: number;
  funders: Array<{
    address: string;
    amount: number;
    hasClaimedRefund: boolean;
  }>;
  updates: { title: string; content: string; timestamp: number }[];
  milestones: {
    title: string;
    description: string;
    percentage: number;
    isCompleted: boolean;
  }[];
  currentMilestone: number;
}

const CampaignDetails = () => {
  const router = useRouter();
  const params = useParams();
  const campaignAddress = params.campaignAddress as string;
  const {
    getCampaignDetails,
    fundCampaign,
    withdrawMilestone,
    togglePause,
    emergencyShutdown,
    requestRefund,
  } = useProgram();
  const wallet = useWallet();
  const { toast } = useToast();

  const [campaign, setCampaign] = useState<CampaignDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [fundAmount, setFundAmount] = useState("");
  const [funding, setFunding] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [requestingRefund, setRequestingRefund] = useState(false);

  const isCreator = wallet.publicKey?.toString() === campaign?.creator;
  const remainingAmount =
    (campaign?.amountRaised || 0) - (campaign?.withdrawnAmount || 0);
  const hasEndedOrFailed = campaign?.endTime
    ? Date.now() / 1000 > campaign.endTime
    : false;
  const isFundingDisabled =
    !campaign?.isActive || campaign?.isPaused || hasEndedOrFailed;
  const isFunder = campaign?.funders.some(
    (f) => f.address === wallet.publicKey?.toString()
  );
  const canRequestRefund =
    campaign?.allowsRefund &&
    isFunder &&
    !campaign?.funders.find((f) => f.address === wallet.publicKey?.toString())
      ?.hasClaimedRefund;
  const campaignFailed =
    hasEndedOrFailed &&
    (campaign?.amountRaised || 0) < (campaign?.goalAmount || 0);

  const fetchCampaignDetails = async () => {
    if (!campaignAddress) return;

    console.log("Fetching details for:", campaignAddress);
    try {
      const details = await getCampaignDetails(campaignAddress);
      console.log("Campaign details:", details);
      setCampaign({
        ...details,
        creator: details.creator.toString(),
        funders: details.funders.map((funder) => ({
          ...funder,
          address: funder.address.toString(),
        })),
      });
    } catch (error) {
      console.error("Error fetching campaign details:", error);
      toast({
        title: "Error",
        description: "Failed to fetch campaign details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFund = async () => {
    if (!wallet.connected) {
      toast({
        title: "Connect Wallet",
        description: "Please connect your wallet to fund this campaign",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(fundAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    if (amount * 1e9 < (campaign?.minContribution || 0)) {
      toast({
        title: "Invalid Amount",
        description: `Minimum contribution is ${
          (campaign?.minContribution || 0) / 1e9
        } SOL`,
        variant: "destructive",
      });
      return;
    }

    setFunding(true);
    try {
      const lamports = amount * 1e9;
      await fundCampaign(wallet, campaignAddress, lamports);
      toast({
        title: "Success",
        description: "Successfully funded the campaign",
      });
      await fetchCampaignDetails();
      setFundAmount("");
    } catch (error) {
      console.error("Funding error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to fund campaign",
        variant: "destructive",
      });
    } finally {
      setFunding(false);
    }
  };

  const handleWithdraw = async () => {
    if (!isCreator || !wallet.connected) {
      toast({
        title: "Error",
        description: "Only the creator can withdraw funds",
        variant: "destructive",
      });
      return;
    }

    if (remainingAmount <= 0) {
      toast({
        title: "Error",
        description: "No funds available to withdraw",
        variant: "destructive",
      });
      return;
    }

    setWithdrawing(true);
    try {
      const tx = await withdrawMilestone(wallet, campaignAddress);
      console.log("Withdrawal transaction:", tx);

      toast({
        title: "Success",
        description: "Successfully withdrawn funds",
      });
      await fetchCampaignDetails();
    } catch (error) {
      console.error("Withdrawal error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to withdraw funds. Please check if the current milestone requirements are met.",
        variant: "destructive",
      });
    } finally {
      setWithdrawing(false);
    }
  };

  const handleRequestRefund = async () => {
    if (!wallet.connected || !canRequestRefund) {
      toast({
        title: "Error",
        description: "Unable to request refund at this time",
        variant: "destructive",
      });
      return;
    }

    setRequestingRefund(true);
    try {
      await requestRefund(wallet, campaignAddress);
      toast({
        title: "Success",
        description: "Successfully claimed refund",
      });
      await fetchCampaignDetails();
    } catch (error) {
      console.error("Refund error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to claim refund",
        variant: "destructive",
      });
    } finally {
      setRequestingRefund(false);
    }
  };

  const handleTogglePause = async () => {
    if (!isCreator || !wallet.connected) {
      toast({
        title: "Error",
        description: "Only the creator can pause/resume the campaign",
        variant: "destructive",
      });
      return;
    }

    setToggling(true);
    try {
      await togglePause(wallet, campaignAddress, campaign?.isPaused || false);
      toast({
        title: "Success",
        description: `Successfully ${
          campaign?.isPaused ? "resumed" : "paused"
        } the campaign`,
      });
      await fetchCampaignDetails();
    } catch (error) {
      console.error("Toggle pause error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to toggle campaign state",
        variant: "destructive",
      });
    } finally {
      setToggling(false);
    }
  };

  const handleEmergencyShutdown = async () => {
    if (!isCreator || !wallet.connected) {
      toast({
        title: "Error",
        description: "Only the creator can shut down the campaign",
        variant: "destructive",
      });
      return;
    }

    try {
      await emergencyShutdown(wallet, campaignAddress);
      toast({
        title: "Success",
        description: "Campaign has been shut down",
      });
      await fetchCampaignDetails();
    } catch (error) {
      console.error("Emergency shutdown error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to shut down campaign",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchCampaignDetails();
  }, [campaignAddress]);

  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <RefreshCw className="h-8 w-8 animate-spin mx-auto" />
        <p className="mt-2">Loading campaign details...</p>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p>Campaign not found</p>
        <Button onClick={() => router.push("/")} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Campaigns
        </Button>
      </div>
    );
  }

  const progress = (campaign.amountRaised / campaign.goalAmount) * 100;
  const currentMilestone = campaign.milestones[campaign.currentMilestone];

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <Button variant="outline" onClick={() => router.push("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Campaigns
        </Button>
        <WalletMultiButton />
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <div>
              <span>{campaign.name}</span>
              <div className="flex items-center mt-2">
                <TagIcon className="h-4 w-4 mr-2" />
                <span className="text-sm text-gray-500">
                  {campaign.category}
                </span>
              </div>
            </div>
            {isCreator && (
              <div className="space-x-2">
                <Button
                  variant="outline"
                  onClick={handleTogglePause}
                  disabled={toggling}
                >
                  {campaign.isPaused ? "Resume Campaign" : "Pause Campaign"}
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleEmergencyShutdown}
                  disabled={!campaign.isActive}
                >
                  Emergency Shutdown
                </Button>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {campaign.imageUrl && (
            <img
              src={campaign.imageUrl}
              alt={campaign.name}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
          )}
          <p className="text-gray-600 mb-4">{campaign.description}</p>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span>Progress</span>
                <span>{progress.toFixed(1)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Goal Amount</p>
                <p className="font-medium">
                  {(campaign.goalAmount / 1e9).toFixed(2)} SOL
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Amount Raised</p>
                <p className="font-medium">
                  {(campaign.amountRaised / 1e9).toFixed(2)} SOL
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Minimum Contribution</p>
                <p className="font-medium">
                  {(campaign.minContribution / 1e9).toFixed(2)} SOL
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">End Date</p>
                <p className="font-medium">
                  {new Date(campaign.endTime * 1000).toLocaleDateString()}
                </p>
              </div>
              {isCreator && (
                <div>
                  <p className="text-sm text-gray-500">Available to Withdraw</p>
                  <p className="font-medium">
                    {(remainingAmount / 1e9).toFixed(2)} SOL
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 bg-gray-100 rounded-lg">
              <h3 className="font-medium mb-2">Campaign Status</h3>
              <div className="space-y-2">
                <p className="text-sm">
                  State:{" "}
                  {!campaign.isActive
                    ? "Inactive"
                    : campaign.isPaused
                    ? "Paused"
                    : "Active"}
                </p>
                <p className="text-sm">
                  Time Status: {hasEndedOrFailed ? "Ended" : "Active"}
                </p>
                <p className="text-sm">
                  Goal Status:{" "}
                  {campaignFailed ? "Failed to reach goal" : "On track"}
                </p>
                <p className="text-sm">
                  Refunds: {campaign.allowsRefund ? "Allowed" : "Not allowed"}
                  {campaign.autoRefundOnFailure && " (Auto-refund on failure)"}
                </p>
              </div>
            </div>

            {isFundingDisabled ? (
              <div className="text-center p-4 bg-gray-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
                <p className="text-gray-600">
                  {campaign.isPaused
                    ? "Campaign is paused"
                    : hasEndedOrFailed
                    ? "Campaign has ended"
                    : "Campaign is not active"}
                </p>
                {canRequestRefund && (
                  <Button
                    className="mt-4"
                    onClick={handleRequestRefund}
                    disabled={requestingRefund}
                  >
                    {requestingRefund
                      ? "Processing Refund..."
                      : "Request Refund"}
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <Input
                  type="number"
                  placeholder="Amount in SOL"
                  value={fundAmount}
                  onChange={(e) => setFundAmount(e.target.value)}
                  min={(campaign.minContribution / 1e9).toString()}
                  step="0.1"
                />
                <Button
                  className="w-full"
                  onClick={handleFund}
                  disabled={funding || !wallet.connected}
                >
                  {funding ? "Processing..." : "Fund Campaign"}
                </Button>
              </div>
            )}

            {isCreator && remainingAmount > 0 && currentMilestone && (
              <div className="space-y-2">
                <p className="text-sm text-gray-500">
                  Current milestone completion required:{" "}
                  {currentMilestone.percentage}%
                  {progress >= currentMilestone.percentage && " (Met)"}
                </p>
                <Button
                  className="w-full"
                  onClick={handleWithdraw}
                  disabled={
                    withdrawing || progress < currentMilestone.percentage
                  }
                >
                  {withdrawing
                    ? "Processing Withdrawal..."
                    : progress < currentMilestone.percentage
                    ? "Milestone Target Not Met"
                    : "Withdraw Available Funds"}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {currentMilestone && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Current Milestone</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <h3 className="font-medium">{currentMilestone.title}</h3>
              <p className="text-gray-600">{currentMilestone.description}</p>
              <div className="flex justify-between">
                <span>Target: {currentMilestone.percentage}%</span>
                <span>
                  {currentMilestone.isCompleted ? "Completed" : "In Progress"}
                </span>
              </div>
              <Progress
                value={(progress / currentMilestone.percentage) * 100}
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {campaign.updates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Campaign Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {campaign.updates.map((update, index) => (
                <div key={index} className="border-b last:border-0 pb-4">
                  <h3 className="font-medium mb-1">{update.title}</h3>
                  <p className="text-gray-600 mb-2">{update.content}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(update.timestamp * 1000).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CampaignDetails;
