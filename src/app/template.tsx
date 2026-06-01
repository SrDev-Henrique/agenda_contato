import { AppShellPageTransition } from "@/components/layout/app-shell-page-transition";

export default function Template({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AppShellPageTransition>{children}</AppShellPageTransition>;
}
