// frontend/lib/config.ts

export const PROGRAM_ID = "816C7G5Jsi85t2z6TWQKsmDVXCReyRnW6w6WQx5LJnQR"; // Your program ID from Solana Playground

// Import your IDL
export const IDL = {
  version: "0.1.0",
  name: "solfundme_solana",
  instructions: [
    {
      name: "initializeCampaign",
      accounts: [
        { name: "campaign", isMut: true, isSigner: false },
        { name: "creator", isMut: true, isSigner: true },
        { name: "systemProgram", isMut: false, isSigner: false },
      ],
      args: [
        { name: "config", type: { defined: "CampaignConfig" } },
        { name: "milestones", type: { vec: { defined: "Milestone" } } },
      ],
    },
    {
      name: "updateCampaign",
      accounts: [
        { name: "campaign", isMut: true, isSigner: false },
        { name: "creator", isMut: false, isSigner: true },
      ],
      args: [
        { name: "description", type: { option: "string" } },
        { name: "imageUrl", type: { option: "string" } },
        { name: "websiteUrl", type: { option: "string" } },
      ],
    },
    {
      name: "addCampaignUpdate",
      accounts: [
        { name: "campaign", isMut: true, isSigner: false },
        { name: "creator", isMut: false, isSigner: true },
      ],
      args: [
        { name: "title", type: "string" },
        { name: "content", type: "string" },
      ],
    },
    {
      name: "fundCampaign",
      accounts: [
        { name: "campaign", isMut: true, isSigner: false },
        { name: "funder", isMut: true, isSigner: true },
        { name: "systemProgram", isMut: false, isSigner: false },
      ],
      args: [{ name: "amount", type: "u64" }],
    },
    {
      name: "withdrawMilestone",
      accounts: [
        { name: "campaign", isMut: true, isSigner: false },
        { name: "creator", isMut: true, isSigner: true },
        { name: "systemProgram", isMut: false, isSigner: false },
      ],
      args: [],
    },
    {
      name: "requestRefund",
      accounts: [
        { name: "campaign", isMut: true, isSigner: false },
        { name: "funder", isMut: true, isSigner: true },
        { name: "systemProgram", isMut: false, isSigner: false },
      ],
      args: [],
    },
    {
      name: "pauseCampaign",
      accounts: [
        { name: "campaign", isMut: true, isSigner: false },
        { name: "creator", isMut: false, isSigner: true },
      ],
      args: [],
    },
    {
      name: "resumeCampaign",
      accounts: [
        { name: "campaign", isMut: true, isSigner: false },
        { name: "creator", isMut: false, isSigner: true },
      ],
      args: [],
    },
    {
      name: "emergencyShutdown",
      accounts: [
        { name: "campaign", isMut: true, isSigner: false },
        { name: "creator", isMut: false, isSigner: true },
      ],
      args: [],
    },
  ],
  accounts: [
    {
      name: "Campaign",
      type: {
        kind: "struct",
        fields: [
          { name: "creator", type: "publicKey" },
          { name: "name", type: "string" },
          { name: "description", type: "string" },
          { name: "category", type: "string" },
          { name: "imageUrl", type: "string" },
          { name: "websiteUrl", type: "string" },
          { name: "goalAmount", type: "u64" },
          { name: "minContribution", type: "u64" },
          { name: "amountRaised", type: "u64" },
          { name: "withdrawnAmount", type: "u64" },
          { name: "startTime", type: "i64" },
          { name: "endTime", type: "i64" },
          { name: "isActive", type: "bool" },
          { name: "isPaused", type: "bool" },
          { name: "allowsRefund", type: "bool" },
          { name: "autoRefundOnFailure", type: "bool" },
          { name: "milestones", type: { vec: { defined: "Milestone" } } },
          { name: "currentMilestone", type: "u8" },
          { name: "updates", type: { vec: { defined: "Update" } } },
          { name: "funders", type: { vec: { defined: "Funder" } } },
          { name: "bump", type: "u8" },
        ],
      },
    },
  ],
  types: [
    {
      name: "CampaignConfig",
      type: {
        kind: "struct",
        fields: [
          { name: "name", type: "string" },
          { name: "description", type: "string" },
          { name: "category", type: "string" },
          { name: "imageUrl", type: "string" },
          { name: "websiteUrl", type: "string" },
          { name: "goalAmount", type: "u64" },
          { name: "minContribution", type: "u64" },
          { name: "campaignDuration", type: "i64" },
          { name: "allowsRefund", type: "bool" },
          { name: "autoRefundOnFailure", type: "bool" },
        ],
      },
    },
    {
      name: "Milestone",
      type: {
        kind: "struct",
        fields: [
          { name: "title", type: "string" },
          { name: "description", type: "string" },
          { name: "percentage", type: "u8" },
          { name: "expectedCompletionTime", type: "i64" },
          { name: "isCompleted", type: "bool" },
        ],
      },
    },
    {
      name: "Update",
      type: {
        kind: "struct",
        fields: [
          { name: "timestamp", type: "i64" },
          { name: "title", type: "string" },
          { name: "content", type: "string" },
        ],
      },
    },
    {
      name: "Funder",
      type: {
        kind: "struct",
        fields: [
          { name: "address", type: "publicKey" },
          { name: "amount", type: "u64" },
          { name: "hasClaimedRefund", type: "bool" },
        ],
      },
    },
  ],
  events: [
    {
      name: "CampaignCreated",
      fields: [
        { name: "campaign", type: "publicKey", index: false },
        { name: "creator", type: "publicKey", index: false },
        { name: "goalAmount", type: "u64", index: false },
        { name: "endTime", type: "i64", index: false },
      ],
    },
    {
      name: "CampaignUpdated",
      fields: [
        { name: "campaign", type: "publicKey", index: false },
        { name: "timestamp", type: "i64", index: false },
      ],
    },
    {
      name: "UpdateAdded",
      fields: [
        { name: "campaign", type: "publicKey", index: false },
        { name: "timestamp", type: "i64", index: false },
      ],
    },
    {
      name: "FundingReceived",
      fields: [
        { name: "campaign", type: "publicKey", index: false },
        { name: "funder", type: "publicKey", index: false },
        { name: "amount", type: "u64", index: false },
      ],
    },
    {
      name: "MilestoneWithdrawn",
      fields: [
        { name: "campaign", type: "publicKey", index: false },
        { name: "milestoneIndex", type: "u8", index: false },
        { name: "amount", type: "u64", index: false },
      ],
    },
    {
      name: "RefundClaimed",
      fields: [
        { name: "campaign", type: "publicKey", index: false },
        { name: "funder", type: "publicKey", index: false },
        { name: "amount", type: "u64", index: false },
      ],
    },
    {
      name: "CampaignPaused",
      fields: [
        { name: "campaign", type: "publicKey", index: false },
        { name: "timestamp", type: "i64", index: false },
      ],
    },
    {
      name: "CampaignResumed",
      fields: [
        { name: "campaign", type: "publicKey", index: false },
        { name: "timestamp", type: "i64", index: false },
      ],
    },
    {
      name: "EmergencyShutdownTriggered",
      fields: [
        { name: "campaign", type: "publicKey", index: false },
        { name: "timestamp", type: "i64", index: false },
      ],
    },
  ],
  errors: [
    { code: 6000, name: "CampaignNotActive", msg: "Campaign is not active" },
    { code: 6001, name: "CampaignPaused", msg: "Campaign is paused" },
    { code: 6002, name: "CampaignNotPaused", msg: "Campaign is not paused" },
    {
      code: 6003,
      name: "CampaignAlreadyPaused",
      msg: "Campaign has already been paused",
    },
    { code: 6004, name: "CampaignEnded", msg: "Campaign has ended" },
    {
      code: 6005,
      name: "CampaignStillActive",
      msg: "Campaign is still active",
    },
    {
      code: 6006,
      name: "UnauthorizedOperation",
      msg: "Unauthorized operation",
    },
    { code: 6007, name: "InsufficientFunds", msg: "Insufficient funds" },
    { code: 6008, name: "CalculationOverflow", msg: "Calculation overflow" },
    {
      code: 6009,
      name: "InvalidParameters",
      msg: "Invalid parameters provided",
    },
    { code: 6010, name: "TooManyMilestones", msg: "Too many milestones" },
    {
      code: 6011,
      name: "BelowMinimumContribution",
      msg: "Below minimum contribution",
    },
    { code: 6012, name: "GoalNotReached", msg: "Goal amount not reached" },
    { code: 6013, name: "NoMoreMilestones", msg: "No more milestones" },
    {
      code: 6014,
      name: "MilestoneTooEarly",
      msg: "Milestone withdrawal too early",
    },
    { code: 6015, name: "RefundsNotAllowed", msg: "Refunds not allowed" },
    { code: 6016, name: "RefundNotEligible", msg: "Not eligible for refund" },
    { code: 6017, name: "NoFunderRecord", msg: "No funder record found" },
    { code: 6018, name: "RefundAlreadyClaimed", msg: "Refund already claimed" },
  ],
};
