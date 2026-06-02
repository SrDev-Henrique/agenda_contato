"use client";

import { motion } from "motion/react";
import { useState } from "react";

import { AuthBackdrop } from "@/components/auth/auth-backdrop";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { signIn } from "@/lib/auth-client";
import { ui } from "@/lib/i18n/pt-br";

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGithubSignIn = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn.social({
        provider: "github",
        callbackURL: "/onboarding",
      });

      if (result.error) {
        const message =
          typeof result.error === "object" &&
          result.error !== null &&
          "message" in result.error &&
          typeof result.error.message === "string"
            ? result.error.message
            : ui.signUpError;
        setError(message);
        setIsLoading(false);
        return;
      }

      const oauthUrl =
        result.data &&
        typeof result.data === "object" &&
        "url" in result.data &&
        typeof result.data.url === "string"
          ? result.data.url
          : null;

      if (oauthUrl) {
        window.location.assign(oauthUrl);
        return;
      }

      setIsLoading(false);
    } catch {
      setError(ui.signUpError);
      setIsLoading(false);
    }
  };

  return (
    <AuthBackdrop>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md rounded-2xl border border-border/80 bg-surface/90 p-8 shadow-xl backdrop-blur-sm"
      >
        <div className="mb-8 space-y-2 text-center">
          <p className="font-semibold text-accent text-lg tracking-tight">
            {ui.appName}
          </p>
          <h1>{ui.signUpTitle}</h1>
          <p className="text-foreground-subtle text-sm leading-relaxed">
            {ui.signUpDescription}
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          className="h-11 w-full gap-2 text-sm"
          disabled={isLoading}
          onClick={handleGithubSignIn}
        >
          {isLoading ? (
            <Spinner className="size-4" />
          ) : (
            <GitHubIcon className="size-4" />
          )}
          {ui.connectGithub}
        </Button>

        {error ? (
          <p className="mt-4 text-center text-destructive text-sm">{error}</p>
        ) : null}
      </motion.div>
    </AuthBackdrop>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
    </svg>
  );
}
