"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { ROUTES } from "@/config/routes";
import { prepareImage } from "@/lib/image";
import { toDateInputValue } from "@/lib/format";
import { errorMessage } from "@/services";
import { useChallengeStore } from "@/store/challengeStore";
import { useDeedStore } from "@/store/deedStore";
import { useFeedStore } from "@/store/feedStore";
import type { DeedCategory } from "@/types";

import { useCurrentUserId } from "./useCurrentUser";

export const MAX_IMAGES = 4;
export const TITLE_LIMIT = 80;
export const DESCRIPTION_LIMIT = 1000;

interface DeedFormValues {
  title: string;
  description: string;
  category: DeedCategory | "";
  activityDate: string;
  location: string;
  inspiredById: string;
  challengeId: string;
  challengeAmount: string;
}

type FormErrors = Partial<Record<keyof DeedFormValues, string>>;

const initialValues = (inspiredById = "", category: DeedCategory | "" = "", challengeId = ""): DeedFormValues => ({
  title: "",
  description: "",
  category,
  activityDate: toDateInputValue(),
  location: "",
  inspiredById,
  challengeId,
  challengeAmount: "",
});

function validate(values: DeedFormValues): FormErrors {
  const errors: FormErrors = {};
  if (values.title.trim().length < 4) errors.title = "Give your deed a short title (at least 4 characters).";
  if (values.description.trim().length < 10) errors.description = "Tell the community a little more about what you did.";
  if (!values.category) errors.category = "Pick the category that fits best.";
  if (!values.activityDate) errors.activityDate = "When did this happen?";
  else if (values.activityDate > toDateInputValue()) errors.activityDate = "The date can't be in the future.";
  if (values.challengeId && !(Number(values.challengeAmount) > 0)) errors.challengeAmount = "How much did you add? Enter a number above zero.";
  return errors;
}

export function useCreateDeed() {
  const router = useRouter();
  const viewerId = useCurrentUserId();
  const createDeed = useDeedStore((s) => s.createDeed);
  const resetFeedFilters = useFeedStore((s) => s.reset);
  const markJoined = useChallengeStore((s) => s.markJoined);
  const searchParams = useSearchParams();
  const deeds = useDeedStore((s) => s.deeds);
  const challenges = useChallengeStore((s) => s.challenges);
  const [values, setValues] = useState<DeedFormValues>(() =>
    initialValues(searchParams.get("inspiredBy") ?? "", "", searchParams.get("challenge") ?? ""),
  );

  // Once data is available, default the category to the inspiring deed's or the challenge's.
  const origin = deeds.find((d) => d.id === values.inspiredById);
  const linkedChallenge = challenges.find((c) => c.id === values.challengeId);
  const suggestedCategory = linkedChallenge?.category ?? origin?.category;
  useEffect(() => {
    if (suggestedCategory) setValues((prev) => (prev.category ? prev : { ...prev, category: suggestedCategory }));
  }, [suggestedCategory]);
  const [images, setImages] = useState<string[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [processingImages, setProcessingImages] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const setField = <K extends keyof DeedFormValues>(key: K, value: DeedFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const addImages = async (files: FileList | File[]) => {
    const list = Array.from(files).slice(0, MAX_IMAGES - images.length);
    if (list.length === 0) {
      toast.message(`You can add up to ${MAX_IMAGES} photos.`);
      return;
    }
    setProcessingImages(true);
    try {
      const prepared = await Promise.all(list.map(prepareImage));
      setImages((prev) => [...prev, ...prepared].slice(0, MAX_IMAGES));
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setProcessingImages(false);
    }
  };

  const removeImage = (index: number) => setImages((prev) => prev.filter((_, i) => i !== index));

  const isDirty = values.title !== "" || values.description !== "" || images.length > 0;

  const submit = async () => {
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0 || !viewerId || !values.category) return;
    setSubmitting(true);
    try {
      await createDeed(viewerId, {
        title: values.title,
        description: values.description,
        category: values.category,
        activityDate: values.activityDate,
        location: values.location,
        images,
        inspiredById: origin?.id,
        challenge: linkedChallenge ? { challengeId: linkedChallenge.id, amount: Number(values.challengeAmount) } : undefined,
      });
      if (linkedChallenge) markJoined(linkedChallenge.id, viewerId);
      resetFeedFilters();
      toast.success("Your good deed is live 🌱", { description: "Thank you for inspiring the community." });
      router.push(ROUTES.feed);
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return { values, images, errors, setField, addImages, removeImage, processingImages, submitting, submit, isDirty };
}
