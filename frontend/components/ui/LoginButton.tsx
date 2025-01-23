"use client";

import { useState } from "react";
import { Button } from "./button";
import { createAppKit } from "@reown/appkit";
import { solana, solanaDevnet } from "@reown/appkit/networks";

export function LoginButton() {
  const [loading, setLoading] = useState(false);

  const projectId = process.env.NEXT_PUBLIC_PROJECT_ID ?? "";

  const handleLogin = async () => {
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
      modal.open(); // Use .open() instead of .login()
    } catch (error) {
      console.error("Login failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleLogin} disabled={loading} className="w-full">
      {loading ? "Logging in..." : "Login"}
    </Button>
  );
}
