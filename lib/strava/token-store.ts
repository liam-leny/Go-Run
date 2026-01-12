import "server-only";

import { promises as fs } from "fs";
import path from "path";
import type { StoredStravaTokens } from "./types";

const tokenFilePath = path.join(process.cwd(), ".strava-token.json");

export async function readTokenStore(): Promise<StoredStravaTokens | null> {
  try {
    const raw = await fs.readFile(tokenFilePath, "utf8");
    return JSON.parse(raw) as StoredStravaTokens;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

export async function writeTokenStore(tokens: StoredStravaTokens): Promise<void> {
  const payload = JSON.stringify(tokens, null, 2);
  await fs.writeFile(tokenFilePath, payload, "utf8");
}

export async function clearTokenStore(): Promise<void> {
  try {
    await fs.unlink(tokenFilePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  }
}
