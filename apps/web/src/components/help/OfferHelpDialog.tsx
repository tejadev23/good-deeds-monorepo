"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { HelpRequest, User } from "@/types";

type Props = {
  request: HelpRequest;
  author?: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pending: boolean;
  onConfirm: (message: string) => Promise<boolean>;
};

export function OfferHelpDialog({ request, author, open, onOpenChange, pending, onConfirm }: Props) {
  const [message, setMessage] = useState("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Offer to help</DialogTitle>
          <DialogDescription>
            {author ? `${author.name.split(" ")[0]} will be notified` : "They'll be notified"} that you can help with “{request.title}”.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="offer-message">
            Add a note <span className="font-normal text-muted-foreground">(optional)</span>
          </Label>
          <Textarea
            id="offer-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={280}
            rows={3}
            placeholder="e.g. I'm free Saturday morning and can bring two friends."
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={pending}>
            Cancel
          </Button>
          <Button
            loading={pending}
            onClick={async () => {
              if (await onConfirm(message)) {
                setMessage("");
                onOpenChange(false);
              }
            }}
          >
            I can help
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
