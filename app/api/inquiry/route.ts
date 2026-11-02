import { NextResponse } from "next/server";

const citizenNumberKeys = new Set(["bsn", "sofinummer", "citizenservicenumber"]);

function withoutCitizenNumber(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(withoutCitizenNumber);
  if (!value || typeof value !== "object") return value;
  const next: Record<string, unknown> = {};
  for (const [key, item] of Object.entries(value)) {
    if (citizenNumberKeys.has(key.toLowerCase())) continue;
    next[key] = withoutCitizenNumber(item);
  }
  return next;
}

export async function POST(request: Request) {
  const webhook = process.env.INQUIRY_WEBHOOK_URL?.trim();
  if (!webhook) {
    return NextResponse.json({ error: "unconfigured" }, { status: 503 });
  }
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  const response = await fetch(webhook, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(withoutCitizenNumber(body)),
  });
  if (!response.ok) {
    return NextResponse.json({ error: "upstream" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
