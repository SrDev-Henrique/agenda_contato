import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { OnboardingGate } from "@/components/auth/onboarding-gate";
import { auth } from "@/lib/auth";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-up");
  }

  return (
    <OnboardingGate userId={session.user.id}>{children}</OnboardingGate>
  );
}
