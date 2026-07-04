import { ui } from "@/lib/i18n/pt-br";

export const SUPABASE_DATABASE_PAUSED_CODE = "SUPABASE_DATABASE_PAUSED";

function collectErrorMessages(error: unknown, depth = 0): string[] {
  if (depth > 5 || error == null) return [];

  const messages: string[] = [];

  if (typeof error === "string") {
    messages.push(error);
    return messages;
  }

  if (error instanceof Error) {
    messages.push(error.message);
    if (error.cause) {
      messages.push(...collectErrorMessages(error.cause, depth + 1));
    }
    return messages;
  }

  if (typeof error === "object") {
    if ("message" in error && typeof error.message === "string") {
      messages.push(error.message);
    }

    if ("code" in error && error.code === SUPABASE_DATABASE_PAUSED_CODE) {
      messages.push(ui.supabaseDatabasePaused);
    }

    if ("cause" in error) {
      messages.push(...collectErrorMessages(error.cause, depth + 1));
    }
  }

  return messages;
}

export function isSupabaseDatabaseUnavailableError(error: unknown): boolean {
  const text = collectErrorMessages(error).join(" ").toLowerCase();

  return (
    ((text.includes("tenant/user") || text.includes("tenant or user")) &&
      text.includes("not found")) ||
    (text.includes("pooler.supabase.com") && text.includes("not found"))
  );
}

export function getAuthErrorMessage(
  error: unknown,
  fallback = ui.signUpError,
): string {
  if (isSupabaseDatabaseUnavailableError(error)) {
    return ui.supabaseDatabasePaused;
  }

  if (error && typeof error === "object") {
    if ("code" in error && error.code === SUPABASE_DATABASE_PAUSED_CODE) {
      return ui.supabaseDatabasePaused;
    }

    if ("message" in error && typeof error.message === "string") {
      const message = error.message.trim();
      if (message.length > 0) {
        return message;
      }
    }
  }

  return fallback;
}

export function createSupabaseDatabasePausedResponse(): Response {
  return Response.json(
    {
      code: SUPABASE_DATABASE_PAUSED_CODE,
      message: ui.supabaseDatabasePaused,
    },
    {
      status: 503,
      headers: { "Content-Type": "application/json" },
    },
  );
}
