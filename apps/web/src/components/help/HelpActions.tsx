"use client";

import { useState } from "react";
import { CheckCircleLinear, HandShakeLinear, RestartLinear } from "solar-icon-set";

import { Button, type ButtonProps } from "@/components/ui/button";
import { useHelpActions } from "@/hooks/useHelp";
import { useUsersById } from "@/hooks/useUsersById";
import type { HelpRequest } from "@/types";

import { OfferHelpDialog } from "./OfferHelpDialog";

export function HelpActions({ request, size = "sm" }: { request: HelpRequest; size?: ButtonProps["size"] }) {
  const actions = useHelpActions(request);
  const author = useUsersById().get(request.authorId);
  const [open, setOpen] = useState(false);

  if (actions.isAuthor) {
    return (
      <Button size={size} variant={actions.isOpen ? "secondary" : "outline"} loading={actions.pending} onClick={() => void actions.toggleFulfilled()}>
        {!actions.pending && (actions.isOpen ? <CheckCircleLinear size={16} /> : <RestartLinear size={16} />)}
        {actions.isOpen ? "Mark as fulfilled" : "Reopen"}
      </Button>
    );
  }

  if (!actions.isOpen) {
    return (
      <Button size={size} variant="outline" disabled>
        <CheckCircleLinear size={16} /> Fulfilled
      </Button>
    );
  }

  if (actions.hasOffered) {
    return (
      <Button size={size} variant="outline" loading={actions.pending} onClick={() => void actions.withdrawOffer()} aria-label="You offered to help. Withdraw your offer">
        {!actions.pending && <CheckCircleLinear size={16} />}
        You offered · Withdraw
      </Button>
    );
  }

  return (
    <>
      <Button size={size} onClick={() => setOpen(true)}>
        <HandShakeLinear size={16} /> I can help
      </Button>
      <OfferHelpDialog request={request} author={author} open={open} onOpenChange={setOpen} pending={actions.pending} onConfirm={actions.offerHelp} />
    </>
  );
}
