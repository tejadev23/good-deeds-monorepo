"use client";

import { useState } from "react";
import { addDays } from "date-fns";
import { toast } from "sonner";

import { toDateInputValue } from "@/lib/format";
import { errorMessage } from "@/services";
import { useHelpStore } from "@/store/helpStore";
import type { DeedCategory } from "@/types";

import { useCurrentUser } from "./useCurrentUser";

interface HelpFormValues {
  title: string;
  description: string;
  category: DeedCategory | "";
  location: string;
  neededBy: string;
  helpersNeeded: string;
}

type Errors = Partial<Record<keyof HelpFormValues, string>>;

export function useCreateHelpRequest(onCreated: () => void) {
  const user = useCurrentUser();
  const create = useHelpStore((s) => s.create);
  const blank = (): HelpFormValues => ({
    title: "",
    description: "",
    category: "",
    location: user?.location ?? "",
    neededBy: toDateInputValue(addDays(new Date(), 7)),
    helpersNeeded: "2",
  });
  const [values, setValues] = useState<HelpFormValues>(blank);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  const setField = <K extends keyof HelpFormValues>(key: K, value: HelpFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (): Errors => {
    const e: Errors = {};
    if (values.title.trim().length < 4) e.title = "What do you need help with?";
    if (values.description.trim().length < 10) e.description = "Add a few details so people know how to help.";
    if (!values.category) e.category = "Pick a category.";
    if (!values.location.trim()) e.location = "Where is the help needed?";
    if (!values.neededBy || values.neededBy < toDateInputValue()) e.neededBy = "Choose today or a future date.";
    const helpers = Number(values.helpersNeeded);
    if (!Number.isInteger(helpers) || helpers < 1 || helpers > 50) e.helpersNeeded = "Between 1 and 50 people.";
    return e;
  };

  const submit = async () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0 || !user || !values.category) return;
    setSubmitting(true);
    try {
      await create(user.id, {
        title: values.title,
        description: values.description,
        category: values.category,
        location: values.location,
        neededBy: values.neededBy,
        helpersNeeded: Number(values.helpersNeeded),
      });
      toast.success("Your request is on the board", { description: "Neighbours who can help will offer here." });
      setValues(blank());
      onCreated();
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return { values, errors, setField, submit, submitting };
}
