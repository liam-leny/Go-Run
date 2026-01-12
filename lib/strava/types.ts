export type StravaAthlete = {
  id: number;
  username?: string;
  firstname?: string;
  lastname?: string;
};

export type StravaTokenResponse = {
  token_type: string;
  access_token: string;
  refresh_token: string;
  expires_at: number;
  expires_in: number;
  athlete?: StravaAthlete;
};

export type StoredStravaTokens = {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  athlete?: StravaAthlete;
};
