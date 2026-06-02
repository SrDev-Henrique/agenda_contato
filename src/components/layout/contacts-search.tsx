"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";
import { useContactListFilters } from "@/hooks/use-contact-list-filters";
import { slugify } from "@/lib/id";
import { cn } from "@/lib/utils";
import { useContactsStore } from "@/store/contacts-store";

type ContactSearchItem = {
  id: string;
  name: string;
  email: string;
  company?: string;
};

type ContactsSearchProps = {
  contacts?: ContactSearchItem[];
  className?: string;
  contentClassName?: string;
  inputClassName?: string;
  placeholder?: string;
  syncWithUrl?: boolean;
  onSelectContact?: (contact: ContactSearchItem) => void;
};

const defaultContacts: ContactSearchItem[] = [
  {
    id: "1",
    name: "Ana Beatriz",
    email: "ana.beatriz@alloy.com",
    company: "Alloy Studio",
  },
  {
    id: "2",
    name: "Carlos Eduardo",
    email: "carlos@northwind.com",
    company: "Northwind",
  },
  {
    id: "3",
    name: "Fernanda Lima",
    email: "fernanda@contoso.com",
    company: "Contoso",
  },
  {
    id: "4",
    name: "Henrique Albuquerque",
    email: "henrique@agenda.com",
    company: "Agenda Contato",
  },
  {
    id: "5",
    name: "Juliana Martins",
    email: "juliana@solaris.com",
    company: "Solaris",
  },
  {
    id: "6",
    name: "Rafael Souza",
    email: "rafael@orbit.com",
    company: "Orbit CRM",
  },
];

export function ContactsSearch({
  contacts = defaultContacts,
  className,
  contentClassName,
  inputClassName,
  placeholder = "Buscar contatos",
  syncWithUrl = false,
  onSelectContact,
}: ContactsSearchProps) {
  const { state } = useContactsStore();
  const { filters, setFilters } = useContactListFilters();
  const [localQuery, setLocalQuery] = useState("");
  const [open, setOpen] = useState(false);

  const storeContacts = useMemo<ContactSearchItem[]>(
    () =>
      state.contacts.map((contact) => ({
        id: contact.id,
        name: contact.name,
        email: contact.email ?? "",
        company: contact.company,
      })),
    [state.contacts],
  );

  const sourceContacts = syncWithUrl ? storeContacts : contacts;
  const query = syncWithUrl ? (filters.q ?? "") : localQuery;

  const setQuery = (value: string) => {
    if (syncWithUrl) {
      setFilters({ q: value });
    } else {
      setLocalQuery(value);
    }
  };

  const filteredContacts = useMemo(() => {
    const normalizedQuery = normalize(query);

    if (!normalizedQuery) {
      return [];
    }

    return sourceContacts
      .filter((contact) =>
        [contact.name, contact.email, contact.company]
          .filter(Boolean)
          .some((value) => normalize(value).includes(normalizedQuery)),
      )
      .slice(0, 5);
  }, [sourceContacts, query]);

  const hasQuery = query.trim().length > 0;

  const handleSelectContact = (contact: ContactSearchItem) => {
    setQuery(contact.name);
    setOpen(false);
    onSelectContact?.(contact);
  };

  return (
    <Popover open={open && hasQuery} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <div className={cn("relative w-full max-w-md", className)}>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-foreground-subtle"
          />
          <Input
            aria-label="Buscar contatos"
            autoComplete="off"
            className={cn(
              "h-10 rounded-lg border-border bg-background pr-3 pl-9 text-[16px] shadow-sm placeholder:text-foreground-placeholder focus-visible:border-ring",
              inputClassName,
            )}
            placeholder={placeholder}
            type="search"
            value={query}
            onChange={(event) => {
              const value = event.target.value;

              setQuery(value);
              setOpen(value.trim().length > 0);
            }}
            onFocus={() => setOpen(query.trim().length > 0)}
          />
        </div>
      </PopoverAnchor>
      <PopoverContent
        align="start"
        className={cn(
          "w-[min(28rem,calc(100vw-2rem))] p-1 max-sm:max-h-140 max-sm:overflow-y-auto",
          contentClassName,
        )}
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        {filteredContacts.length > 0 ? (
          <div className="flex flex-col gap-1">
            {filteredContacts.map((contact) => {
              const row = (
                <>
                  <Avatar>
                    <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
                  </Avatar>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium text-foreground text-sm">
                      {contact.name}
                    </span>
                    <span className="block truncate text-foreground-muted text-xs">
                      {contact.company ? `${contact.company} · ` : ""}
                      {contact.email}
                    </span>
                  </span>
                </>
              );

              if (syncWithUrl) {
                return (
                  <Link
                    key={contact.id}
                    href={`/contato/${slugify(contact.name)}`}
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                    onClick={() => setOpen(false)}
                    onMouseDown={(event) => event.preventDefault()}
                  >
                    {row}
                  </Link>
                );
              }

              return (
                <button
                  className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                  key={contact.id}
                  type="button"
                  onClick={() => handleSelectContact(contact)}
                  onMouseDown={(event) => event.preventDefault()}
                >
                  {row}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="px-3 py-6 text-center text-foreground-muted text-sm">
            Nenhum contato encontrado.
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

function normalize(value?: string) {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
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
