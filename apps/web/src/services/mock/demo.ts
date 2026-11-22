import type { DemoService } from "../contracts";
import { latency, resetDb, writeSession } from "./storage";

export const mockDemoService: DemoService = {
  async reset() {
    await latency(300, 500);
    resetDb();
    writeSession(null);
  },
};
