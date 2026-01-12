import "server-only";

export type StravaEnv = {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string;
};

export function getStravaEnv(): StravaEnv {
  const clientId = process.env.STRAVA_CLIENT_ID;
  const clientSecret = process.env.STRAVA_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Missing STRAVA_CLIENT_ID or STRAVA_CLIENT_SECRET");
  }

  const redirectUri =
    process.env.STRAVA_REDIRECT_URI ??
    "http://localhost:3000/api/strava/callback";
  const scopes = process.env.STRAVA_SCOPES ?? "read,activity:read_all";

  return { clientId, clientSecret, redirectUri, scopes };
}
