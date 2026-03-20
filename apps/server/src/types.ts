import type { RouterClient } from "@orpc/server";
import type { AppRouter } from "./index";

export type AppType = RouterClient<AppRouter>;
