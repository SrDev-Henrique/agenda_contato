"use client";

import { BellIcon } from "lucide-react";
import { useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const initialNotifications = [
  {
    action: "solicitou revisão em",
    id: 1,
    target: "Contato duplicado em clientes VIP",
    timestamp: "há 15 minutos",
    unread: true,
    user: "Chris Tompson",
  },
  {
    action: "compartilhou",
    id: 2,
    target: "Nova lista de fornecedores",
    timestamp: "há 45 minutos",
    unread: true,
    user: "Emma Davis",
  },
  {
    action: "atribuiu você a",
    id: 3,
    target: "Atualização dos aniversários da semana",
    timestamp: "há 4 horas",
    unread: false,
    user: "James Wilson",
  },
  {
    action: "respondeu seu comentário em",
    id: 4,
    target: "Fluxo de autenticação",
    timestamp: "há 12 horas",
    unread: false,
    user: "Alex Morgan",
  },
  {
    action: "comentou em",
    id: 5,
    target: "Redesign do painel de contatos",
    timestamp: "há 2 dias",
    unread: false,
    user: "Sarah Chen",
  },
  {
    action: "mencionou você em",
    id: 6,
    target: "Lembretes de follow-up",
    timestamp: "há 2 semanas",
    unread: false,
    user: "Miky Derya",
  },
];

function Dot({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="currentColor"
      height="7"
      viewBox="0 0 6 6"
      width="7"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="3" cy="3" r="3" />
    </svg>
  );
}

export function Notifications() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const unreadCount = notifications.filter(
    (notification) => notification.unread,
  ).length;

  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        unread: false,
      })),
    );
  };

  const handleNotificationClick = (id: number) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id
          ? { ...notification, unread: false }
          : notification,
      ),
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          aria-label="Abrir notificações"
          className="relative"
          size="icon"
          variant="muted"
        >
          <BellIcon aria-hidden="true" />
          {unreadCount > 0 ? (
            <Badge className="absolute -top-2 left-full min-w-5 -translate-x-1/2 px-1">
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="center"
        className="me-4 h-fit max-h-[calc(100vh-10rem)] w-80 overflow-y-auto bg-card p-1"
      >
        <div className="flex items-baseline justify-between gap-4 px-3 py-2">
          <div className="font-semibold text-card-foreground text-sm">
            Notificações
          </div>
          {unreadCount > 0 ? (
            <button
              className="font-medium text-foreground-muted text-xs hover:text-foreground hover:underline"
              onClick={handleMarkAllAsRead}
              type="button"
            >
              Marcar todas como lidas
            </button>
          ) : null}
        </div>
        <Separator className="my-2" />
        <div className="flex flex-col gap-1">
          {notifications.map((notification) => (
            <div
              className={cn(
                "rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted",
                notification.unread && "bg-primary/10",
              )}
              key={notification.id}
            >
              <div className="relative flex items-start gap-3 ps-1 pe-3">
                <Avatar className="size-9">
                  <AvatarFallback>
                    {getInitials(notification.user)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <button
                    className="text-left font-medium text-foreground after:absolute after:inset-0"
                    onClick={() => handleNotificationClick(notification.id)}
                    type="button"
                  >
                    <span className="text-foreground hover:underline">
                      {notification.user}
                    </span>{" "}
                    <span className="text-foreground-muted">
                      {notification.action}
                    </span>{" "}
                    <span className="text-foreground hover:underline">
                      {notification.target}
                    </span>
                    .
                  </button>
                  <div className="text-muted-foreground text-xs">
                    {notification.timestamp}
                  </div>
                </div>
                {notification.unread ? (
                  <div className="absolute -left-2 mt-3 text-primary">
                    <Dot />
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}
