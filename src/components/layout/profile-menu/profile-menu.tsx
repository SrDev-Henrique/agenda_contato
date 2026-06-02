"use client";

import { useRouter } from "next/navigation";

import { deleteUser, signOut, useSession } from "@/lib/auth-client";
import { ui } from "@/lib/i18n/pt-br";
import { clearUserLocalData } from "@/lib/onboarding/storage";

import { ProfileMenuSkeleton } from "./profile-menu-skeleton";
import { ProfileMenuView } from "./profile-menu-view";

type ProfileMenuProps = {
  className?: string;
  name?: string;
  avatarUrl?: string;
};

export function ProfileMenu({
  className,
  name: nameOverride,
  avatarUrl: avatarUrlOverride,
}: ProfileMenuProps) {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const name = nameOverride ?? session?.user.name ?? ui.appName;
  const avatarUrl = avatarUrlOverride ?? session?.user.image ?? undefined;
  const isPreview = Boolean(nameOverride);

  const handleSignOut = async () => {
    await signOut();
    router.replace("/sign-up");
  };

  const handleDeleteAccount = async () => {
    const userId = session?.user?.id;
    if (!userId) return;

    clearUserLocalData(userId);

    const result = await deleteUser();

    if (result.error) {
      throw new Error(result.error.message);
    }

    router.replace("/sign-up");
  };

  if (isPending && !isPreview) {
    return <ProfileMenuSkeleton className={className} />;
  }

  return (
    <ProfileMenuView
      className={className}
      name={name}
      avatarUrl={avatarUrl}
      onSignOut={isPreview ? undefined : handleSignOut}
      onDeleteAccount={isPreview ? undefined : handleDeleteAccount}
    />
  );
}
