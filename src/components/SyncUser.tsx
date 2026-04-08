"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import {
  getPendingFavorites,
  clearPendingFavorites,
} from "@/lib/pending-favorites";
import { syncPendingFavorites } from "@/app/actions";

export function SyncUser() {
  const { isSignedIn } = useUser();

  useEffect(() => {
    if (!isSignedIn) return;

    // Sync user profile to Supabase
    fetch("/api/auth/sync", { method: "POST" });

    // Sync any pending guest favorites
    const pending = getPendingFavorites();
    if (pending.length > 0) {
      syncPendingFavorites(pending).then(() => {
        clearPendingFavorites();
      });
    }
  }, [isSignedIn]);

  return null;
}
