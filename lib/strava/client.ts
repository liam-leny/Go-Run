import "server-only";

import type { StoredStravaTokens, StravaTokenResponse } from "./types";
import { readTokenStore, writeTokenStore } from "./token-store";
import { getStravaEnv } from "./env";

const STRAVA_API_BASE = "https://www.strava.com/api/v3";
const STRAVA_TOKEN_URL = "https://www.strava.com/oauth/token";
const TOKEN_REFRESH_BUFFER_SECONDS = 60;

function toStoredTokens(
  data: StravaTokenResponse,
  fallbackAthlete?: StoredStravaTokens["athlete"]
): StoredStravaTokens {
  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: data.expires_at,
    athlete: data.athlete ?? fallbackAthlete,
  };
}

async function postToken(
  params: Record<string, string>
): Promise<StravaTokenResponse> {
  const response = await fetch(STRAVA_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(params),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Strava token error ${response.status}: ${text}`);
  }

  return (await response.json()) as StravaTokenResponse;
}

export async function exchangeAuthorizationCode(
  code: string
): Promise<StoredStravaTokens> {
  const { clientId, clientSecret } = getStravaEnv();
  const data = await postToken({
    client_id: clientId,
    client_secret: clientSecret,
    code,
    grant_type: "authorization_code",
  });

  return toStoredTokens(data);
}

export async function refreshAccessToken(
  tokens: StoredStravaTokens
): Promise<StoredStravaTokens> {
  const { clientId, clientSecret } = getStravaEnv();
  const data = await postToken({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "refresh_token",
    refresh_token: tokens.refresh_token,
  });

  return toStoredTokens(data, tokens.athlete);
}

export async function getValidAccessToken(): Promise<string> {
  const stored = await readTokenStore();
  if (!stored) {
    throw new Error("No Strava tokens found. Connect your account first.");
  }

  const now = Math.floor(Date.now() / 1000);
  if (stored.expires_at <= now + TOKEN_REFRESH_BUFFER_SECONDS) {
    const refreshed = await refreshAccessToken(stored);
    await writeTokenStore(refreshed);
    return refreshed.access_token;
  }

  return stored.access_token;
}

export class StravaClient {
  constructor(private accessToken: string) {}

  static async fromTokenStore(): Promise<StravaClient> {
    const accessToken = await getValidAccessToken();
    return new StravaClient(accessToken);
  }

  async get<T>(
    path: string,
    params?: Record<string, string | number | boolean>
  ): Promise<T> {
    const base = STRAVA_API_BASE.endsWith("/")
      ? STRAVA_API_BASE
      : `${STRAVA_API_BASE}/`;
    const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
    const url = new URL(normalizedPath, base);

    if (params) {
      for (const [key, value] of Object.entries(params)) {
        url.searchParams.set(key, String(value));
      }
    }

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Strava API error ${response.status}: ${text}`);
    }

    return (await response.json()) as T;
  }
}
