"use client";

import { DangerCircleLinear, LetterLinear, LockPasswordLinear } from "solar-icon-set";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoginForm } from "@/hooks/useLoginForm";

import { DemoAccountPicker } from "./DemoAccountPicker";

export function LoginForm() {
  const form = useLoginForm();

  return (
    <div className="space-y-8">
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          form.submit();
        }}
        noValidate
      >
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <LetterLinear size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              autoComplete="username"
              placeholder="you@demo.gooddeeds.app"
              className="pl-11"
              value={form.email}
              onChange={(e) => form.setEmail(e.target.value)}
              aria-invalid={Boolean(form.error)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <LockPasswordLinear size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className="pl-11"
              value={form.password}
              onChange={(e) => form.setPassword(e.target.value)}
              aria-invalid={Boolean(form.error)}
            />
          </div>
        </div>
        {form.error && (
          <p role="alert" className="flex items-start gap-2 rounded-xl bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
            <DangerCircleLinear size={18} className="mt-px shrink-0" />
            {form.error}
          </p>
        )}
        <Button type="submit" size="lg" className="w-full" loading={form.pendingId === "form"} disabled={form.pendingId !== null}>
          Sign in
        </Button>
      </form>

      <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        or explore as
        <span className="h-px flex-1 bg-border" />
      </div>

      <DemoAccountPicker pendingId={form.pendingId} onPick={form.signInAsDemo} />
    </div>
  );
}
