import { NextResponse } from "next/server";
import { readTokenStore } from "@/lib/strava/token-store";

export const runtime = "nodejs";

export async function GET() {
  const tokens = await readTokenStore();
  const connected = Boolean(tokens?.refresh_token);

  return NextResponse.json({
    connected,
    athlete: tokens?.athlete ?? null,
    expires_at: tokens?.expires_at ?? null,
  });
}
