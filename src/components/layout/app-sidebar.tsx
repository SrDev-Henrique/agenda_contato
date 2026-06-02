"use client";

import { ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

import { CreateContactDialog } from "@/components/contacts/create-contact-dialog";
import { ContactsSearch } from "@/components/layout/contacts-search";
import { Notifications } from "@/components/layout/notifications";
import { ProfileMenu } from "@/components/layout/profile-menu";
import {
  type SidebarItemId,
  SidebarNavList,
} from "@/components/layout/sidebar-nav";
import { Button } from "@/components/ui/button";
import { ui } from "@/lib/i18n/pt-br";
import { useAppMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { Tag } from "@/types/tag";

type AppSidebarProps = {
  activeItem?: SidebarItemId;
  peopleHref?: string;
  untaggedCount?: number;
  tags?: Tag[];
  className?: string;
  tagsPanelOpen?: boolean;
  tagsNavActive?: boolean;
  onTagsToggle?: () => void;
};

export function AppSidebar({
  activeItem = "people",
  peopleHref = "/",
  untaggedCount = 0,
  tags = [],
  className,
  tagsPanelOpen = false,
  tagsNavActive = false,
  onTagsToggle,
}: AppSidebarProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const {
    sidebarChromeStaggerItem,
    sidebarFooterStaggerContainer,
    tween,
    reduceMotion,
  } = useAppMotion();

  return (
    <>
      <aside
        className={cn(
          "flex h-full w-full shrink-0 flex-col border-sidebar-border border-r bg-sidebar px-4 py-5 text-sidebar-foreground",
          className,
        )}
      >
        <motion.div
          variants={sidebarChromeStaggerItem}
          initial="initial"
          animate="animate"
          className="flex items-center justify-between gap-2"
        >
          <motion.div
            className="truncate font-bebas-neue text-2xl text-accent leading-none tracking-wide"
            initial={{
              opacity: reduceMotion ? 1 : 0,
              x: reduceMotion ? 0 : -8,
            }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...tween, delay: reduceMotion ? 0 : 0.02 }}
          >
            {ui.appName}
          </motion.div>
          <motion.div
            initial={{
              opacity: reduceMotion ? 1 : 0,
              scale: reduceMotion ? 1 : 0.88,
            }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...tween, delay: reduceMotion ? 0 : 0.08 }}
          >
            <Notifications />
          </motion.div>
        </motion.div>

        <ContactsSearch
          className="mt-4 max-w-none"
          contentClassName="w-80"
          inputClassName="h-7 rounded-md border-sidebar-border bg-sidebar-accent/70 pl-8 text-xs shadow-none"
          placeholder={ui.searchPlaceholder}
        />

        <SidebarNavList
          activeItem={activeItem}
          peopleHref={peopleHref}
          className="mt-4"
          tagsExpanded={tagsPanelOpen}
          tagsNavActive={tagsNavActive}
          onTagsToggle={onTagsToggle}
          tags={tags}
        />

        <motion.div
          className="mt-5 flex flex-1 flex-col"
          variants={sidebarFooterStaggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.div variants={sidebarChromeStaggerItem}>
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
          </motion.div>

          <motion.div variants={sidebarChromeStaggerItem} className="mt-3">
            <Button
              className="w-full"
              variant="primary"
              type="button"
              onClick={() => setCreateOpen(true)}
            >
              {ui.addContact}
              <span aria-hidden="true">+</span>
            </Button>
          </motion.div>

          <motion.div
            variants={sidebarChromeStaggerItem}
            className="mt-auto pt-6"
          >
            <ProfileMenu className="border-0 bg-transparent px-0 py-0" />
          </motion.div>
        </motion.div>
      </aside>

      <CreateContactDialog open={createOpen} onOpenChange={setCreateOpen} />
    </>
  );
}
