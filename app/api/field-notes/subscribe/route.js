import { NextResponse } from "next/server";
import { appendNewsletterSubscriber, isValidSubscriberEmail } from "@/src/lib/newsletterSheet";

export const runtime = "nodejs";
export const SUBSCRIBE_RATE_LIMIT_MS = 3000;

const attempts = globalThis.__fieldNotesSubscribeAttempts || new Map();
globalThis.__fieldNotesSubscribeAttempts = attempts;

function getClientKey(request, email) {
  const forwardedFor = request.headers.get("x-forwarded-for") || "";
  const ip = forwardedFor.split(",")[0].trim() || request.headers.get("x-real-ip") || "unknown";
  return `${ip}:${email}`;
}

function isRateLimited(request, email, now = Date.now()) {
  const key = getClientKey(request, email);
  const lastAttempt = attempts.get(key) || 0;

  if (now - lastAttempt < SUBSCRIBE_RATE_LIMIT_MS) {
    return true;
  }

  attempts.set(key, now);
  return false;
}

export async function POST(request) {
  const body = await request.json().catch(() => null);
  const email = String(body?.email || "").trim().toLowerCase();

  if (body?.website) {
    return NextResponse.json({ ok: true });
  }

  if (!isValidSubscriberEmail(email)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }

  if (isRateLimited(request, email)) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      { status: 429, headers: { "Retry-After": "3" } }
    );
  }

  try {
    await appendNewsletterSubscriber({
      email,
      metadata: {
        city: request.headers.get("x-vercel-ip-city"),
      },
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("field notes subscribe failed", error);
    return NextResponse.json({ ok: false, error: "subscribe_failed" }, { status: 500 });
  }
}
