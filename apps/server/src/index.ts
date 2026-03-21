import { createDatabase } from "@dtask/db";
import { env } from "@dtask/env/server";
import { LoggingHandlerPlugin } from "@orpc/experimental-pino";
import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import type { RequestHeadersPluginContext } from "@orpc/server/plugins";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import pino from "pino";
import { authRouter } from "./domains/auth/controllers/auth.controller";
import { SessionsRepository } from "./domains/auth/repositories/sessions.repository";
import { UsersRepository } from "./domains/auth/repositories/users.repository";
import { AuthService } from "./domains/auth/services/auth.service";

export interface Context extends RequestHeadersPluginContext {
	authService: AuthService;
}

const appRouter = {
	auth: authRouter,
};

const pinoLogger = pino();

export type AppRouter = typeof appRouter;

const handler = new RPCHandler<Context>(appRouter, {
	interceptors: [onError((error) => pinoLogger.error(error))],
	plugins: [new LoggingHandlerPlugin({ logger: pinoLogger })],
});

export const app = new Hono()
	.use(logger())
	.use(
		"/*",
		cors({
			origin: env.CORS_ORIGIN,
			allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE", "PATCH"],
			credentials: true,
		}),
	)
	.get("/health", (c) => c.json({ status: "ok" }))
	.use("/rpc/*", async (c, next) => {
		const db = createDatabase(env.DB);

		const authService = new AuthService(
			new UsersRepository(db),
			new SessionsRepository(db),
		);

		const { matched, response } = await handler.handle(c.req.raw, {
			prefix: "/rpc",
			context: { authService, reqHeaders: c.req.raw.headers },
		});

		if (matched) return c.newResponse(response.body, response);
		await next();
	});

export default app;
