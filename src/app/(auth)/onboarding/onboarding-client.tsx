"use client";

import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";

import { AuthBackdrop } from "@/components/auth/auth-backdrop";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useSession } from "@/lib/auth-client";
import { setImportPending } from "@/lib/import/import-pending-storage";
import { isContactPickerSupported } from "@/lib/import/is-contact-picker-supported";
import { mapPickerResultsToContacts } from "@/lib/import/map-picker-to-contacts";
import { pickContacts } from "@/lib/import/pick-contacts";
import { ui } from "@/lib/i18n/pt-br";
import { isOnboarded } from "@/lib/onboarding/storage";

function subscribeToPickerSupport() {
  return () => {};
}

function getPickerSupportedSnapshot() {
  return isContactPickerSupported();
}

export default function OnboardingClient() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const pickerSupported = useSyncExternalStore(
    subscribeToPickerSupport,
    getPickerSupportedSnapshot,
    () => false,
  );
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  useEffect(() => {
    if (isPending) return;

    const userId = session?.user?.id;
    if (userId && isOnboarded(userId)) {
      router.replace("/");
    }
  }, [isPending, router, session?.user?.id]);

  const handleImportContacts = async () => {
    setIsImporting(true);
    setImportError(null);

    try {
      const results = await pickContacts();
      const contacts = mapPickerResultsToContacts(results);

      if (contacts.length === 0) {
        return;
      }

      setImportPending(contacts);
      router.push("/onboarding/loading?source=import");
    } catch {
      setImportError(ui.onboardingImportError);
    } finally {
      setIsImporting(false);
    }
  };

  if (isPending) {
    return (
      <AuthBackdrop>
        <Spinner className="relative z-10 size-8" />
      </AuthBackdrop>
    );
  }

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
          <h1 className="font-semibold text-2xl text-foreground tracking-tight">
            {ui.onboardingTitle}
          </h1>
          <p className="text-foreground-subtle text-sm leading-relaxed">
            {ui.onboardingDescription}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            type="button"
            variant="outline"
            className="h-11 w-full gap-2 text-sm"
            disabled={!pickerSupported || isImporting}
            onClick={handleImportContacts}
          >
            {isImporting ? <Spinner className="size-4" /> : null}
            {ui.onboardingImportContacts}
          </Button>

          {!pickerSupported ? (
            <p className="text-center text-foreground-subtle text-xs leading-relaxed">
              {ui.onboardingImportUnsupported}
            </p>
          ) : null}

          {importError ? (
            <p className="text-center text-destructive text-sm">
              {importError}
            </p>
          ) : null}

          <Button
            type="button"
            variant="primary"
            className="h-11 w-full text-sm"
            disabled={isImporting}
            onClick={() => router.push("/onboarding/loading?source=dummy")}
          >
            {ui.onboardingUseSampleData}
          </Button>
        </div>
      </motion.div>
    </AuthBackdrop>
  );
}
