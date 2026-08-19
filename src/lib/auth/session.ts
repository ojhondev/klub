import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "klub_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 dias

type SessionPayload = {
  usuarioId: string;
  lojaId: string;
  exp: number;
};

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET não configurado");
  return secret;
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

function encode(payload: SessionPayload): string {
  const json = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${json}.${sign(json)}`;
}

function decode(token: string): SessionPayload | null {
  const [json, signature] = token.split(".");
  if (!json || !signature) return null;

  const expected = sign(json);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const payload = JSON.parse(Buffer.from(json, "base64url").toString()) as SessionPayload;
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function createSession(usuarioId: string, lojaId: string) {
  const payload: SessionPayload = {
    usuarioId,
    lojaId,
    exp: Date.now() + MAX_AGE_SECONDS * 1000,
  };
  const store = await cookies();
  store.set(COOKIE_NAME, encode(payload), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return decode(token);
}

export async function destroySession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
