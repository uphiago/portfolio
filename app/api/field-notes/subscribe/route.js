import { NextResponse } from "next/server";
import { appendNewsletterSubscriber, isValidSubscriberEmail } from "@/src/lib/newsletterSheet";

export const runtime = "nodejs";

export async function POST(request) {
  const body = await request.json().catch(() => null);
  const email = String(body?.email || "").trim().toLowerCase();

  if (body?.website) {
    return NextResponse.json({ ok: true });
  }

  if (!isValidSubscriberEmail(email)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
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
