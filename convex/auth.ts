import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { betterAuth } from "better-auth/minimal";
import { components } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import { query } from "./_generated/server";
import authConfig from "./auth.config";

const siteUrl = process.env.SITE_URL;
const secret = process.env.BETTER_AUTH_SECRET;

if (!secret) {
    throw new Error("Missing BETTER_AUTH_SECRET environment variable");
}

if (!siteUrl) {
    throw new Error("Missing SITE_URL environment variable");
}

export const authComponent = createClient<DataModel>(components.betterAuth);

export function createAuth(ctx: GenericCtx<DataModel>) {
    return betterAuth({
        appName: "DTasks",
        baseURL: siteUrl,
        database: authComponent.adapter(ctx),
        secret: secret,
        emailAndPassword: {
            enabled: true,
            requireEmailVerification: false,
        },
        plugins: [convex({ authConfig })],
    });
}

export const getCurrentUser = query({
    args: {},
    handler: async (ctx) => authComponent.safeGetAuthUser(ctx),
});
