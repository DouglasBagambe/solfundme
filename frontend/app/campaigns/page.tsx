// frontend/app/campaigns/page.tsx

/* eslint-disable @next/next/no-img-element */

"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useProgram } from "../../hooks/useProgram";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, Search, Filter, ArrowUpDown } from "lucide-react";
import { useRouter } from "next/navigation";

const ITEMS_PER_PAGE = 6;

interface Campaign {
  address: string;
  name: string;
  createdAt: number;
  description?: string;
  imageUrl?: string;
  goalAmount?: number;
  amountRaised?: number;
  progress?: number;
  isActive?: boolean;
  isPaused?: boolean;
  endTime?: number;
}

const CampaignCard = ({ campaign }: { campaign: Campaign }) => {
  const router = useRouter();
  const { toast } = useToast();

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="text-lg">{campaign.name}</CardTitle>
        <p className="text-sm text-gray-500">
          Created: {new Date(campaign.createdAt).toLocaleDateString()}
        </p>
      </CardHeader>
      <CardContent className="flex-grow">
        {campaign.imageUrl && (
          <img
            src={campaign.imageUrl}
            alt={campaign.name}
            className="w-full h-40 object-cover rounded-md mb-4"
          />
        )}
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">{campaign.description}</p>
            <div className="flex justify-between text-sm mb-1">
              <span>Progress</span>
              <span>{campaign.progress?.toFixed(1)}%</span>
            </div>
            <Progress value={campaign.progress} className="h-2" />
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-gray-500">Goal</p>
              <p className="font-medium">
                {campaign.goalAmount
                  ? `${(campaign.goalAmount / 1e9).toFixed(2)} SOL`
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Raised</p>
              <p className="font-medium">
                {campaign.amountRaised
                  ? `${(campaign.amountRaised / 1e9).toFixed(2)} SOL`
                  : "0 SOL"}
              </p>
            </div>
          </div>
          <div className="mt-2">
            <p className="text-sm text-gray-500">Status</p>
            <div className="flex gap-2 mt-1">
              {campaign.isActive ? (
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                  Active
                </span>
              ) : (
                <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                  Inactive
                </span>
              )}
              {campaign.isPaused && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                  Paused
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <CardContent className="border-t pt-4">
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              navigator.clipboard.writeText(campaign.address);
              toast({
                title: "Address copied",
                description: "Campaign address copied to clipboard",
              });
            }}
          >
            Copy Address
          </Button>
          <Button
            variant="default"
            className="flex-1"
            onClick={() => router.push(`/campaign/${campaign.address}`)}
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const CampaignsPage = () => {
  const { getCampaignDetails } = useProgram();
  const { toast } = useToast();
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(false);
  const [activeCampaigns, setActiveCampaigns] = useState<Campaign[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterBy, setFilterBy] = useState("all");

  const fetchActiveCampaigns = useCallback(async () => {
    setIsLoadingCampaigns(true);
    try {
      const userCampaigns = JSON.parse(
        localStorage.getItem("userCampaigns") || "[]"
      );

      const detailedCampaigns = await Promise.all(
        userCampaigns.map(async (campaign: { address: string }) => {
          try {
            const details = await getCampaignDetails(campaign.address);
            return {
              ...campaign,
              ...details,
              progress: (details.amountRaised / details.goalAmount) * 100,
            };
          } catch (error) {
            console.error(
              `Error fetching details for campaign ${campaign.address}:`,
              error
            );
            return campaign;
          }
        })
      );

      setActiveCampaigns(detailedCampaigns);
      setFilteredCampaigns(detailedCampaigns);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      toast({
        title: "Error",
        description: "Failed to fetch active campaigns",
        variant: "destructive",
      });
    } finally {
      setIsLoadingCampaigns(false);
    }
  }, [getCampaignDetails, toast]);

  useEffect(() => {
    fetchActiveCampaigns();
  }, [fetchActiveCampaigns]);

  // Filter and sort campaigns
  useEffect(() => {
    let result = [...activeCampaigns];

    // Apply search
    if (searchTerm) {
      result = result.filter(
        (campaign) =>
          campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          campaign.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply filter
    if (filterBy !== "all") {
      result = result.filter((campaign) => {
        switch (filterBy) {
          case "active":
            return campaign.isActive && !campaign.isPaused;
          case "completed":
            return (campaign.progress ?? 0) >= 100;
          case "failed":
            return (
              !campaign.isActive || (campaign.endTime ?? 0) < Date.now() / 1000
            );
          default:
            return true;
        }
      });
    }

    // Apply sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return b.createdAt - a.createdAt;
        case "oldest":
          return a.createdAt - b.createdAt;
        case "mostFunded":
          return (b.amountRaised || 0) - (a.amountRaised || 0);
        case "leastFunded":
          return (a.amountRaised || 0) - (b.amountRaised || 0);
        default:
          return 0;
      }
    });

    setFilteredCampaigns(result);
  }, [activeCampaigns, searchTerm, sortBy, filterBy]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredCampaigns.length / ITEMS_PER_PAGE);
  const paginatedCampaigns = filteredCampaigns.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Active Campaigns</CardTitle>
            <Button
              variant="outline"
              size="icon"
              onClick={fetchActiveCampaigns}
              disabled={isLoadingCampaigns}
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  isLoadingCampaigns ? "animate-spin" : ""
                }`}
              />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search campaigns..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={filterBy} onValueChange={setFilterBy}>
                  <SelectTrigger className="w-[140px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Campaigns</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[140px]">
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="mostFunded">Most Funded</SelectItem>
                    <SelectItem value="leastFunded">Least Funded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isLoadingCampaigns ? (
              <div className="text-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">Loading campaigns...</p>
              </div>
            ) : filteredCampaigns.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No campaigns found</p>
              </div>
            ) : (
              <>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {paginatedCampaigns.map((campaign) => (
                    <CampaignCard key={campaign.address} campaign={campaign} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <div className="flex items-center gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <Button
                            key={page}
                            variant={
                              currentPage === page ? "default" : "outline"
                            }
                            onClick={() => setCurrentPage(page)}
                            className="w-8 h-8 p-0"
                          >
                            {page}
                          </Button>
                        )
                      )}
                    </div>
                    <Button
                      variant="outline"
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignsPage;
