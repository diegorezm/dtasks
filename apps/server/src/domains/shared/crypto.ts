export function generateSecureRandomString(): string {
	const alphabet = "abcdefghijkmnpqrstuvwxyz23456789";
	const bytes = new Uint8Array(24);
	crypto.getRandomValues(bytes);
	let id = "";
	for (let i = 0; i < bytes.length; i++) {
		id += alphabet[bytes[i] >> 3];
	}
	return id;
}

export async function hashPassword(
	password: string,
	providedSalt?: Uint8Array,
): Promise<string> {
	const encoder = new TextEncoder();
	const salt = providedSalt ?? crypto.getRandomValues(new Uint8Array(16));
	const keyMaterial = await crypto.subtle.importKey(
		"raw",
		encoder.encode(password),
		{ name: "PBKDF2" },
		false,
		["deriveBits", "deriveKey"],
	);
	const key = await crypto.subtle.deriveKey(
		{ name: "PBKDF2", salt, iterations: 100_000, hash: "SHA-256" },
		keyMaterial,
		{ name: "AES-GCM", length: 256 },
		true,
		["encrypt", "decrypt"],
	);
	const exportedKey = (await crypto.subtle.exportKey(
		"raw",
		key,
	)) as ArrayBuffer;
	const hashHex = Array.from(new Uint8Array(exportedKey))
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");
	const saltHex = Array.from(salt)
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");
	return `${saltHex}:${hashHex}`;
}

export async function verifyPasswordHash(
	stored: string,
	password: string,
): Promise<boolean> {
	const [saltHex, originalHash] = stored.split(":");
	if (!saltHex) {
		throw new Error("Invalid salt format");
	}
	const matchResult = saltHex.match(/.{1,2}/g);
	if (!matchResult) {
		throw new Error("Invalid salt format");
	}
	const salt = new Uint8Array(
		matchResult.map((byte) => Number.parseInt(byte, 16)),
	);
	const attemptHashWithSalt = await hashPassword(password, salt);
	const [, attemptHash] = attemptHashWithSalt.split(":");
	return attemptHash === originalHash;
}
