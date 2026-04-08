"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";

export function SyncUser() {
  const { isSignedIn } = useUser();

  useEffect(() => {
    if (isSignedIn) {
      fetch("/api/auth/sync", { method: "POST" });
    }
  }, [isSignedIn]);

  return null;
}
