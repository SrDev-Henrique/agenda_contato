import { toNextJsHandler } from "better-auth/next-js";

import { pool } from "@/db";
import { auth } from "@/lib/auth";
import {
  createSupabaseDatabasePausedResponse,
  isSupabaseDatabaseUnavailableError,
} from "@/lib/auth-errors";

export const runtime = "nodejs";

const { GET: authGET, POST: authPOST } = toNextJsHandler(auth);

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

async function wrapAuthHandler(
  handler: (request: Request) => Promise<Response>,
  request: Request,
): Promise<Response> {
  const response = await handler(request);
  return withSupabaseDatabaseErrorResponse(response);
}

export const GET = (request: Request) => wrapAuthHandler(authGET, request);
export const POST = (request: Request) => wrapAuthHandler(authPOST, request);
