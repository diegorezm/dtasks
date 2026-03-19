import { env } from "@dtask/env/server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

const app = new Hono()
  .use(logger())
  .use(
    "/*",
    cors({
      origin: env.CORS_ORIGIN,
      allowMethods: ["GET", "POST", "OPTIONS"],
    }),
  )
  .get("/health", (c) => {
    return c.json({ status: "ok" });
  });

export default app;
