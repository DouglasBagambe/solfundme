"use client";

import { useState } from "react";
import { Button } from "./button";
import { createAppKit } from "@reown/appkit";
import { solana, solanaDevnet } from "@reown/appkit/networks";

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID ?? "";

if (!projectId) {
  throw new Error("Project ID is not defined");
}

export function SignupButton() {
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setLoading(true);
    try {
      const modal = createAppKit({
        projectId,
        networks: [solana, solanaDevnet],
        features: {
          email: true,
          socials: ["google", "github", "discord"],
        },
      });
      modal.open();
    } catch (error) {
      console.error("Signup failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleSignup} disabled={loading} className="w-full">
      {loading ? "Creating Account..." : "Sign Up"}
    </Button>
  );
}
