"use client";

import { UserX } from "lucide-react";
import Link from "next/link";

import { appMainPanelClassName } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ui } from "@/lib/i18n/pt-br";
import { cn } from "@/lib/utils";

type ContactNotFoundProps = {
  isHydrated: boolean;
};

export function ContactNotFound({ isHydrated }: ContactNotFoundProps) {
  if (!isHydrated) {
    return (
      <section
        className={cn(appMainPanelClassName, "items-center justify-center p-6")}
      >
        <Spinner className="size-8 text-primary" />
        <p className="mt-4 text-foreground-muted text-sm">{ui.loading}</p>
      </section>
    );
  }

  return (
    <section
      className={cn(
        appMainPanelClassName,
        "items-center justify-center p-8 text-center",
      )}
    >
      <div className="flex size-16 items-center justify-center rounded-2xl bg-muted text-foreground-muted">
        <UserX className="size-8" aria-hidden />
      </div>
      <h1 className="mt-5 text-foreground">{ui.contactNotFound}</h1>
      <p className="mt-2 max-w-sm text-foreground-muted text-sm leading-6">
        {ui.contactNotFoundHint}
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <Button asChild variant="primary">
          <Link href="/">{ui.navAllPeople}</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/eventos">{ui.navEvents}</Link>
        </Button>
      </div>
    </section>
  );
}
