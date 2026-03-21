import type { Login, Register } from "@dtask/schemas";
import {
	generateSecureRandomString,
	hashPassword,
	verifyPasswordHash,
} from "@/domains/shared/crypto";
import { type Result, tryCatch } from "@/domains/shared/try-catch";
import type { SessionsRepository } from "../repositories/sessions.repository";
import type { UsersRepository } from "../repositories/users.repository";

type Meta = { ipAddress?: string; userAgent?: string };

export class AuthService {
	constructor(
		private readonly userRepository: UsersRepository,
		private readonly sessionsRepository: SessionsRepository,
	) {}

	async register(
		data: Register,
		meta?: Meta,
	): Promise<
		Result<{
			user: NonNullable<Awaited<ReturnType<UsersRepository["insert"]>>>;
			token: string;
		}>
	> {
		const passwordHash = await hashPassword(data.password);
		const { data: user, error: userError } = await tryCatch(
			this.userRepository.insert({ ...data, passwordHash: passwordHash }),
		);
		if (userError || !user)
			return {
				data: null,
				error: userError ?? new Error("Something went wrong."),
			};

		const { data: token, error: sessionError } = await tryCatch(
			this.createSession(user.id, meta),
		);
		if (sessionError) return { data: null, error: sessionError };

		return { data: { user, token }, error: null };
	}

	async login(
		data: Login,
		meta?: Meta,
	): Promise<
		Result<{
			user: NonNullable<Awaited<ReturnType<UsersRepository["findByEmail"]>>>;
			token: string;
		}>
	> {
		const { data: user, error: userError } = await tryCatch(
			this.userRepository.findByEmail(data.email),
		);

		if (userError || !user)
			return {
				data: null,
				error: userError ?? new Error("User does not exist."),
			};

		const isCorrectPassword = await verifyPasswordHash(
			user.passwordHash,
			data.password,
		);

		if (!isCorrectPassword) {
			return {
				data: null,
				error: new Error(
					"Wrong password or email, please verify if the information is correct..",
				),
			};
		}

		const { data: token, error: sessionError } = await tryCatch(
			this.createSession(user.id, meta),
		);
		if (sessionError) return { data: null, error: sessionError };

		return { data: { user, token }, error: null };
	}

	async validateSessionToken(
		token: string,
	): Promise<
		Result<NonNullable<Awaited<ReturnType<SessionsRepository["findById"]>>>>
	> {
		const tokenParts = token.split(".");
		if (tokenParts.length !== 2)
			return { data: null, error: new Error("Invalid token") };

		const [sessionId, sessionSecret] = tokenParts;
		if (!sessionId || !sessionSecret)
			return { data: null, error: new Error("Invalid token") };

		const { data: session, error: sessionError } = await tryCatch(
			this.sessionsRepository.findById(sessionId),
		);
		if (sessionError) return { data: null, error: sessionError };
		if (!session) return { data: null, error: new Error("Session not found") };

		const storedHash = new Uint8Array(session.secretHash);
		const tokenSecretHash = await this.hashSecret(sessionSecret);
		const validSecret = this.constantTimeEqual(tokenSecretHash, storedHash);
		if (!validSecret) return { data: null, error: new Error("Invalid token") };

		return { data: session, error: null };
	}

	async logout(sessionId: string): Promise<Result<true>> {
		const { error } = await tryCatch(this.sessionsRepository.delete(sessionId));
		if (error) return { data: null, error };
		return { data: true, error: null };
	}

	private async createSession(userId: string, meta?: Meta): Promise<string> {
		const now = new Date();
		const id = generateSecureRandomString();
		const secret = generateSecureRandomString();
		const secretHash = await this.hashSecret(secret);
		const token = `${id}.${secret}`;

		await this.sessionsRepository.insert({
			id,
			secretHash,
			createdAt: now,
			userId,
			expiresAt: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 7),
			userAgent: meta?.userAgent,
			ipAddress: meta?.ipAddress,
		});

		return token;
	}

	private async hashSecret(secret: string): Promise<Buffer> {
		const secretBytes = new TextEncoder().encode(secret);
		const secretHashBuffer = await crypto.subtle.digest("SHA-256", secretBytes);
		return Buffer.from(secretHashBuffer);
	}

	private constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
		if (a.byteLength !== b.byteLength) return false;
		let c = 0;
		for (let i = 0; i < a.byteLength; i++) {
			c |= a[i] ^ b[i];
		}
		return c === 0;
	}
}
