"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { DEMO_ACCOUNTS, type DemoAccount } from "@/config/demo-accounts";
import { absoluteUrl, ROUTES } from "@/config/routes";
import { errorMessage, services } from "@/services";
import { useDeedStore } from "@/store/deedStore";
import { useNotificationStore } from "@/store/notificationStore";
import { useSessionStore } from "@/store/sessionStore";

import { useCurrentUserId } from "./useCurrentUser";

/** Switch persona, sign out and reset the demo — used by the account menu. */
export function useAccountActions() {
  const router = useRouter();
  const currentId = useCurrentUserId();
  const login = useSessionStore((s) => s.login);
  const logout = useSessionStore((s) => s.logout);
  const [busy, setBusy] = useState(false);

  const clearViewerData = () => {
    useDeedStore.setState({ savedIds: [] });
    useNotificationStore.setState({ items: [], status: "idle" });
  };

  const switchTo = async (account: DemoAccount) => {
    if (account.userId === currentId) return;
    setBusy(true);
    try {
      clearViewerData();
      await login(account.email, account.password);
      toast.success(`Now viewing as ${account.name}`);
      router.push(ROUTES.feed);
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setBusy(false);
    }
  };

  const signOut = async () => {
    await logout();
    clearViewerData();
    router.replace(ROUTES.login);
  };

  const resetDemo = async () => {
    setBusy(true);
    try {
      await services.demo.reset();
      // Hard reload so every store starts from the fresh seed.
      window.location.assign(absoluteUrl(ROUTES.login));
    } catch (error) {
      toast.error(errorMessage(error));
      setBusy(false);
    }
  };

  const otherAccounts = DEMO_ACCOUNTS.filter((a) => a.userId !== currentId);

  return { busy, switchTo, signOut, resetDemo, otherAccounts, accounts: DEMO_ACCOUNTS };
}
