"use client";

import { UsersGroupRoundedLinear } from "solar-icon-set";

import { EmptyState } from "@/components/common/EmptyState";
import { UserRow } from "@/components/discover/UserRow";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { User } from "@/types";

export type FollowTab = "followers" | "following";

type Props = {
  name: string;
  open: FollowTab | null;
  onOpenChange: (tab: FollowTab | null) => void;
  followers: User[];
  following: User[];
};

function PeopleList({ people, empty }: { people: User[]; empty: string }) {
  if (people.length === 0) return <EmptyState icon={UsersGroupRoundedLinear} title={empty} className="border-none py-8" />;
  return (
    <div className="space-y-4">
      {people.map((u) => (
        <UserRow key={u.id} user={u} />
      ))}
    </div>
  );
}

export function FollowListDialog({ name, open, onOpenChange, followers, following }: Props) {
  return (
    <Dialog open={open !== null} onOpenChange={(o) => !o && onOpenChange(null)}>
      <DialogContent className="max-h-[80dvh] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{name}</DialogTitle>
        </DialogHeader>
        {open && (
          <Tabs value={open} onValueChange={(v) => onOpenChange(v as FollowTab)} className="min-h-0 flex-1">
            <TabsList className="w-full">
              <TabsTrigger value="followers" className="flex-1">
                Followers · {followers.length}
              </TabsTrigger>
              <TabsTrigger value="following" className="flex-1">
                Following · {following.length}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="followers" className="-mx-6 overflow-y-auto px-6 pb-1">
              <PeopleList people={followers} empty="No followers yet" />
            </TabsContent>
            <TabsContent value="following" className="-mx-6 overflow-y-auto px-6 pb-1">
              <PeopleList people={following} empty="Not following anyone yet" />
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
