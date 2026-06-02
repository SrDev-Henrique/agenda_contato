"use client";

import { ChevronRight } from "lucide-react";
import { motion } from "motion/react";

import { ContactsSearch } from "@/components/layout/contacts-search";
import { ProfileMenu } from "@/components/layout/profile-menu";
import {
  type SidebarItemId,
  SidebarNavList,
} from "@/components/layout/sidebar-nav";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ui } from "@/lib/i18n/pt-br";
import { useAppMotion } from "@/lib/motion";
import type { Tag } from "@/types/tag";
import Link from "next/link";

type MobileNavSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeItem: SidebarItemId;
  peopleHref: string;
  untaggedCount: number;
  tags?: Tag[];
  trigger: React.ReactNode;
  onAddContact: () => void;
  tagsPanelOpen?: boolean;
  tagsNavActive?: boolean;
  onTagsToggle?: () => void;
};

export function MobileNavSheet({
  open,
  onOpenChange,
  activeItem,
  peopleHref,
  untaggedCount,
  tags = [],
  trigger,
  onAddContact,
  tagsPanelOpen = false,
  tagsNavActive = false,
  onTagsToggle,
}: MobileNavSheetProps) {
  const close = () => onOpenChange(false);
  const { sheetContentVariants } = useAppMotion();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent
        side="right"
        className="z-160 flex w-[min(100vw-2rem,280px)] flex-col gap-0 border-sidebar-border bg-sidebar p-0 text-sidebar-foreground"
      >
        <motion.div
          className="flex min-h-0 flex-1 flex-col"
          variants={sheetContentVariants}
          initial="initial"
          animate="animate"
        >
          <SheetHeader className="border-sidebar-border border-b px-4 py-4">
            <SheetTitle className="text-left font-bebas-neue text-2xl text-accent leading-none tracking-wide">
              <Link href="/">{ui.appName}</Link>
            </SheetTitle>
          </SheetHeader>

          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-4">
            <ContactsSearch
              className="max-w-none"
              contentClassName="w-[min(100vw-3rem,320px)]"
              inputClassName="h-8 rounded-md border-sidebar-border bg-sidebar-accent/70 pl-8 text-xs shadow-none"
              placeholder={ui.searchPlaceholder}
            />

            <SidebarNavList
              activeItem={activeItem}
              peopleHref={peopleHref}
              onNavigate={close}
              layoutScope="mobile"
              className="mt-4"
              tagsExpanded={tagsPanelOpen}
              tagsNavActive={tagsNavActive}
              onTagsToggle={onTagsToggle}
              tags={tags}
            />

            <div className="mt-5">
              <button
                type="button"
                className="group flex w-full items-center justify-between rounded-lg bg-sidebar-accent px-3 py-2 text-left transition-colors hover:bg-muted"
              >
                <span className="flex flex-col gap-0.5">
                  <span className="font-medium text-[0.6rem] text-foreground-subtle uppercase">
                    {ui.navUntagged}
                  </span>
                  <span className="text-sidebar-foreground text-xl leading-none">
                    {untaggedCount}
                  </span>
                </span>
                <ChevronRight className="size-3.5 text-foreground-subtle transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>

            <Button
              className="mt-3 w-full"
              variant="primary"
              type="button"
              onClick={() => {
                close();
                onAddContact();
              }}
            >
              {ui.addContact}
              <span aria-hidden="true">+</span>
            </Button>

            <div className="relative z-10 mt-auto pt-6 pb-4">
              <ProfileMenu className="border-0 bg-transparent px-0 py-0" />
            </div>
          </div>
        </motion.div>
      </SheetContent>
    </Sheet>
  );
}
