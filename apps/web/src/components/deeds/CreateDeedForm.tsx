"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarLinear, MapPointLinear } from "solar-icon-set";

import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DESCRIPTION_LIMIT, MAX_IMAGES, TITLE_LIMIT, useCreateDeed } from "@/hooks/useCreateDeed";
import { toDateInputValue } from "@/lib/format";

import { CategoryPicker } from "./CategoryPicker";
import { ChallengeField } from "./ChallengeField";
import { InspiredByPreview } from "./InspiredByPreview";
import { FieldError } from "./FieldError";
import { ImageUploader } from "./ImageUploader";

export function CreateDeedForm() {
  const router = useRouter();
  const form = useCreateDeed();
  const { values, errors } = form;
  const [confirmLeave, setConfirmLeave] = useState(false);

  const cancel = () => (form.isDirty ? setConfirmLeave(true) : router.back());

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        void form.submit();
      }}
      className="space-y-5"
    >
      {values.inspiredById && <InspiredByPreview deedId={values.inspiredById} onRemove={() => form.setField("inspiredById", "")} />}

      <Card>
        <CardContent className="space-y-5 pt-5">
          <div className="space-y-2">
            <Label htmlFor="title">What did you do?</Label>
            <Input
              id="title"
              value={values.title}
              onChange={(e) => form.setField("title", e.target.value)}
              placeholder="e.g. Planted 20 saplings at the school ground"
              maxLength={TITLE_LIMIT}
              aria-invalid={Boolean(errors.title)}
              aria-describedby="title-error"
            />
            <FieldError id="title-error" message={errors.title} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="description">Tell the story</Label>
              <span className="text-xs tabular-nums text-muted-foreground">
                {values.description.length}/{DESCRIPTION_LIMIT}
              </span>
            </div>
            <Textarea
              id="description"
              value={values.description}
              onChange={(e) => form.setField("description", e.target.value)}
              placeholder="Who was there, what happened, how it felt — and how others can help next time."
              maxLength={DESCRIPTION_LIMIT}
              rows={5}
              aria-invalid={Boolean(errors.description)}
              aria-describedby="description-error"
            />
            <FieldError id="description-error" message={errors.description} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-3 pt-5">
          <Label>Category</Label>
          <CategoryPicker value={values.category} onChange={(c) => form.setField("category", c)} invalid={Boolean(errors.category)} />
          <FieldError id="category-error" message={errors.category} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-3 pt-5">
          <div className="flex items-baseline justify-between">
            <Label>Photos</Label>
            <span className="text-xs text-muted-foreground">Optional, but they inspire people</span>
          </div>
          <ImageUploader images={form.images} max={MAX_IMAGES} processing={form.processingImages} onAdd={(f) => void form.addImages(f)} onRemove={form.removeImage} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="grid gap-5 pt-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="activityDate">
              <CalendarLinear size={16} /> Date of activity
            </Label>
            <Input
              id="activityDate"
              type="date"
              value={values.activityDate}
              max={toDateInputValue()}
              onChange={(e) => form.setField("activityDate", e.target.value)}
              aria-invalid={Boolean(errors.activityDate)}
              aria-describedby="date-error"
            />
            <FieldError id="date-error" message={errors.activityDate} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">
              <MapPointLinear size={16} /> Location <span className="font-normal text-muted-foreground">(optional)</span>
            </Label>
            <Input id="location" value={values.location} onChange={(e) => form.setField("location", e.target.value)} placeholder="Neighbourhood, city" maxLength={60} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-5">
          <ChallengeField
            challengeId={values.challengeId}
            amount={values.challengeAmount}
            amountError={errors.challengeAmount}
            onChallenge={(id) => form.setField("challengeId", id)}
            onAmount={(a) => form.setField("challengeAmount", a)}
          />
        </CardContent>
      </Card>

      <div className="sticky bottom-20 z-10 flex gap-3 rounded-3xl border border-border/80 bg-card/95 p-3 shadow-lift backdrop-blur lg:static lg:border-none lg:bg-transparent lg:p-0 lg:shadow-none">
        <Button type="button" variant="outline" className="flex-1 sm:flex-none" onClick={cancel} disabled={form.submitting}>
          Cancel
        </Button>
        <Button type="submit" className="flex-1" loading={form.submitting} disabled={form.processingImages}>
          {form.submitting ? "Publishing…" : "Publish deed"}
        </Button>
      </div>

      <ConfirmDialog
        open={confirmLeave}
        onOpenChange={setConfirmLeave}
        title="Discard this deed?"
        description="Your draft hasn't been published yet and will be lost."
        confirmLabel="Discard"
        destructive
        onConfirm={() => router.back()}
      />
    </form>
  );
}
