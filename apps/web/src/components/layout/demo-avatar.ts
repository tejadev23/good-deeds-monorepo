import type { DemoAccount } from "@/config/demo-accounts";
import type { User } from "@/types";

/** Avatar data for a demo account, falling back to initials if profiles aren't loaded. */
export function avatarForDemo(account: DemoAccount, users: User[]): Pick<User, "name" | "avatarUrl" | "username"> {
  const user = users.find((u) => u.id === account.userId);
  return user ?? { name: account.name, avatarUrl: "", username: account.userId };
}
