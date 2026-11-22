/**
 * DEMO ONLY — these credentials exist purely so reviewers can explore the
 * prototype from different perspectives. They are validated in the browser
 * and must never be used as production authentication.
 */
export interface DemoAccount {
  userId: string;
  name: string;
  email: string;
  password: string;
  persona: string;
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    userId: "u_sarah",
    name: "Sarah Green",
    email: "sarah@demo.gooddeeds.app",
    password: "Sarah123",
    persona: "Nature enthusiast · trees & cleanups",
  },
  {
    userId: "u_aarav",
    name: "Aarav Helps",
    email: "aarav@demo.gooddeeds.app",
    password: "Aarav123",
    persona: "Community volunteer · food drives",
  },
  {
    userId: "u_maya",
    name: "Maya Cares",
    email: "maya@demo.gooddeeds.app",
    password: "Maya123",
    persona: "Animal lover · strays & shelters",
  },
];
