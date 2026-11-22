"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORY_LIST } from "@/config/categories";
import { FieldError } from "@/components/deeds/FieldError";
import { useCreateHelpRequest } from "@/hooks/useCreateHelpRequest";
import { toDateInputValue } from "@/lib/format";
import type { DeedCategory } from "@/types";

export function HelpRequestDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { values, errors, setField, submit, submitting } = useCreateHelpRequest(() => onOpenChange(false));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92dvh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Ask the community for help</DialogTitle>
          <DialogDescription>Be specific about what's needed, when and where — it makes it easy for people to say yes.</DialogDescription>
        </DialogHeader>
        <form
          id="help-form"
          noValidate
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            void submit();
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="help-title">What do you need?</Label>
            <Input id="help-title" value={values.title} maxLength={80} onChange={(e) => setField("title", e.target.value)} placeholder="e.g. 3 volunteers to serve lunch on Sunday" aria-invalid={Boolean(errors.title)} />
            <FieldError id="help-title-error" message={errors.title} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="help-description">Details</Label>
            <Textarea id="help-description" rows={4} maxLength={600} value={values.description} onChange={(e) => setField("description", e.target.value)} placeholder="Timing, what to bring, who to contact…" aria-invalid={Boolean(errors.description)} />
            <FieldError id="help-description-error" message={errors.description} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="help-category">Category</Label>
              <Select value={values.category} onValueChange={(v) => setField("category", v as DeedCategory)}>
                <SelectTrigger id="help-category" aria-invalid={Boolean(errors.category)}>
                  <SelectValue placeholder="Choose one" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_LIST.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError id="help-category-error" message={errors.category} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="help-helpers">People needed</Label>
              <Input id="help-helpers" type="number" min={1} max={50} inputMode="numeric" value={values.helpersNeeded} onChange={(e) => setField("helpersNeeded", e.target.value)} aria-invalid={Boolean(errors.helpersNeeded)} />
              <FieldError id="help-helpers-error" message={errors.helpersNeeded} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="help-location">Where</Label>
              <Input id="help-location" maxLength={60} value={values.location} onChange={(e) => setField("location", e.target.value)} aria-invalid={Boolean(errors.location)} />
              <FieldError id="help-location-error" message={errors.location} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="help-date">Needed by</Label>
              <Input id="help-date" type="date" min={toDateInputValue()} value={values.neededBy} onChange={(e) => setField("neededBy", e.target.value)} aria-invalid={Boolean(errors.neededBy)} />
              <FieldError id="help-date-error" message={errors.neededBy} />
            </div>
          </div>
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" form="help-form" loading={submitting}>
            Post request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
