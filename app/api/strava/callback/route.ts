import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { exchangeAuthorizationCode } from "@/lib/strava/client";
import { writeTokenStore } from "@/lib/strava/token-store";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(
      new URL("/log-activity?strava=error", request.url)
    );
  }

  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const cookieStore = await cookies();
  const expectedState = cookieStore.get("strava_oauth_state")?.value;

  if (!code || !state || !expectedState || state !== expectedState) {
    return NextResponse.json(
      { error: "Invalid Strava OAuth state or missing code." },
      { status: 400 }
    );
  }

  try {
    const tokens = await exchangeAuthorizationCode(code);
    await writeTokenStore(tokens);

    const response = NextResponse.redirect(
      new URL("/log-activity?strava=connected", request.url)
    );
    response.cookies.set({
      name: "strava_oauth_state",
      value: "",
      maxAge: 0,
      path: "/",
    });
    return response;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: "Strava token exchange failed." },
      { status: 500 }
    );
  }
}
