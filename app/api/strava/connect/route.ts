import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { getStravaEnv } from "@/lib/strava/env";

export const runtime = "nodejs";

export async function GET() {
  const { clientId, redirectUri, scopes } = getStravaEnv();
  const state = randomBytes(16).toString("hex");

  const url = new URL("https://www.strava.com/oauth/authorize");
  url.search = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: redirectUri,
    approval_prompt: "auto",
    scope: scopes,
    state,
  }).toString();

  const response = NextResponse.redirect(url);
  response.cookies.set({
    name: "strava_oauth_state",
    value: state,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 600,
    path: "/",
  });

  return response;
}
