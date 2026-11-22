"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import type { DemoAccount } from "@/config/demo-accounts";
import { ROUTES } from "@/config/routes";
import { errorMessage } from "@/services";
import { useSessionStore } from "@/store/sessionStore";

export function useLoginForm() {
  const router = useRouter();
  const login = useSessionStore((s) => s.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const signIn = async (emailValue: string, passwordValue: string, id: string) => {
    setError(null);
    setPendingId(id);
    try {
      await login(emailValue, passwordValue);
      router.replace(ROUTES.feed);
    } catch (err) {
      setError(errorMessage(err));
      setPendingId(null);
    }
  };

  const submit = () => {
    if (!email.trim() || !password) {
      setError("Enter an email and password, or pick a demo account below.");
      return;
    }
    void signIn(email, password, "form");
  };

  const signInAsDemo = (account: DemoAccount) => {
    setEmail(account.email);
    setPassword(account.password);
    void signIn(account.email, account.password, account.userId);
  };

  return {
    email,
    password,
    error,
    pendingId,
    setEmail: (v: string) => {
      setEmail(v);
      setError(null);
    },
    setPassword: (v: string) => {
      setPassword(v);
      setError(null);
    },
    submit,
    signInAsDemo,
  };
}
