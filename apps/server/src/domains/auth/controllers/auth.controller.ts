import { ORPCError, os } from "@orpc/server";
import { deleteCookie, getCookie, setCookie } from "@orpc/server/helpers";
import type { Context } from "../../../index";
import { loginSchema, registerSchema } from "../models/auth.model";

const COOKIE_NAME = "session_token";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

const base = os.$context<Context>();

export const authRouter = {
  register: base.input(registerSchema).handler(async ({ input, context }) => {
    const { data, error } = await context.authService.register(input);
    if (error) throw new ORPCError("BAD_REQUEST", { message: error.message });

    setCookie(context.reqHeaders, COOKIE_NAME, data.token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: COOKIE_MAX_AGE,
    });

    return { user: data.user };
  }),

  login: base.input(loginSchema).handler(async ({ input, context }) => {
    const { data, error } = await context.authService.login(input);
    if (error)
      throw new ORPCError("UNAUTHORIZED", { message: "Invalid credentials" });

    setCookie(context.reqHeaders, COOKIE_NAME, data.token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: COOKIE_MAX_AGE,
    });

    return { user: data.user };
  }),

  logout: base.handler(async ({ context }) => {
    const token = getCookie(context.reqHeaders, COOKIE_NAME);
    if (!token) throw new ORPCError("UNAUTHORIZED");

    const [sessionId] = token.split(".");
    if (!sessionId) throw new ORPCError("UNAUTHORIZED");

    const { error } = await context.authService.logout(sessionId);
    if (error)
      throw new ORPCError("INTERNAL_SERVER_ERROR", { message: error.message });

    deleteCookie(context.reqHeaders, COOKIE_NAME);
    return { success: true };
  }),

  me: base.handler(async ({ context }) => {
    const token = getCookie(context.reqHeaders, COOKIE_NAME);
    if (!token) throw new ORPCError("UNAUTHORIZED");

    const { data, error } =
      await context.authService.validateSessionToken(token);
    if (error || !data) throw new ORPCError("UNAUTHORIZED");

    return { user: data };
  }),
};
