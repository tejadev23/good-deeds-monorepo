import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { pinoHttp } from "pino-http";
import type { AppContext } from "./context";
import { authenticate } from "./middleware/auth";
import { errorHandler, notFoundHandler } from "./middleware/errors";
import { commentsRouter, deedCommentsRouter } from "./modules/comments/router";
import { deedsRouter, savedRouter } from "./modules/deeds/router";
import { meRouter } from "./modules/me/router";
import { notificationsRouter } from "./modules/notifications/router";
import { adminRouter, reportsRouter } from "./modules/reports/router";
import { usersRouter } from "./modules/users/router";

export function createApp(ctx: AppContext) {
  const app = express();
  app.disable("x-powered-by");
  app.set("trust proxy", 1); // Cloud Run sits behind one proxy

  app.use(helmet());
  app.use(cors({ origin: ctx.env.CORS_ORIGINS, credentials: false, maxAge: 600 }));
  app.use(express.json({ limit: "100kb" }));
  if (ctx.env.NODE_ENV !== "test") {
    app.use(
      pinoHttp({
        logger: ctx.logger,
        autoLogging: { ignore: (req) => req.url === "/health" },
        // Keep logs small and never log auth headers.
        serializers: {
          req: (req: { method: string; url: string }) => ({ method: req.method, url: req.url }),
          res: (res: { statusCode: number }) => ({ statusCode: res.statusCode }),
        },
      }),
    );
  }

  app.get("/health", async (_req, res) => {
    await ctx.db.$queryRaw`SELECT 1`;
    res.json({ ok: true });
  });

  const v1 = express.Router();
  if (ctx.env.NODE_ENV !== "test") {
    v1.use(rateLimit({ windowMs: 60_000, limit: 300, standardHeaders: "draft-8", legacyHeaders: false }));
  }
  v1.use(authenticate(ctx));
  v1.use("/me/saved", savedRouter(ctx));
  v1.use("/me", meRouter(ctx));
  v1.use("/users", usersRouter(ctx));
  v1.use("/deeds/:id/comments", deedCommentsRouter(ctx));
  v1.use("/deeds", deedsRouter(ctx));
  v1.use("/comments", commentsRouter(ctx));
  v1.use("/notifications", notificationsRouter(ctx));
  v1.use("/reports", reportsRouter(ctx));
  v1.use("/admin", adminRouter(ctx));
  app.use("/v1", v1);

  app.use(notFoundHandler);
  app.use(errorHandler(ctx));
  return app;
}
