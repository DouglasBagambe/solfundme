"use client";

import { signOut } from "next-auth/react";
import { Button } from "./button";
import { useState } from "react";

export function LogoutButton() {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut({ redirect: false });
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="destructive"
      onClick={handleLogout}
      disabled={loading}
      className="w-full"
    >
      {loading ? "Logging out..." : "Logout"}
    </Button>
  );
}
