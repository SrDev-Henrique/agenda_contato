import { toNextJsHandler } from "better-auth/next-js";

import { pool } from "@/db";
import { auth } from "@/lib/auth";
import {
  createSupabaseDatabasePausedResponse,
  isSupabaseDatabaseUnavailableError,
} from "@/lib/auth-errors";

export const runtime = "nodejs";

const handler = toNextJsHandler(auth);

async function withSupabaseDatabaseErrorResponse(
  response: Response,
): Promise<Response> {
  if (response.status < 500) return response;

  try {
    await pool.query("SELECT 1");
    return response;
  } catch (error) {
    if (!isSupabaseDatabaseUnavailableError(error)) {
      return response;
    }

    return createSupabaseDatabasePausedResponse();
  }
}

async function handleAuthRequest(request: Request): Promise<Response> {
  const response = await handler(request);
  return withSupabaseDatabaseErrorResponse(response);
}

export const GET = handleAuthRequest;
export const POST = handleAuthRequest;
