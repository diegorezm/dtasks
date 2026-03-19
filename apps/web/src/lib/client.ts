import { env } from "@dtask/env/web";
import type { AppType } from "@dtask/server";
import { hc } from "hono/client";

export const client = hc<AppType>(env.VITE_SERVER_URL);
