"use client";

import { useSession } from "next-auth/react";
import { LoginButton } from "./LoginButton";
import { LogoutButton } from "./LogoutButton";

export function AuthStatus() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return session ? (
    <div className="space-y-2">
      <p>Logged in as: {session.address}</p>
      <LogoutButton />
    </div>
  ) : (
    <LoginButton />
  );
}
