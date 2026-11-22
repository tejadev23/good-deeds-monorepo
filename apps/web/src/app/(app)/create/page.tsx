import type { Metadata } from "next";
import { Suspense } from "react";

import { PageHeader } from "@/components/common/PageHeader";
import { CreateDeedForm } from "@/components/deeds/CreateDeedForm";

export const metadata: Metadata = { title: "Share a good deed" };

export default function CreateDeedPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Share a good deed" description="Big or small — every act of kindness inspires someone." />
      <Suspense>
        <CreateDeedForm />
      </Suspense>
    </div>
  );
}
