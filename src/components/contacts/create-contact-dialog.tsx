"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Phone, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";

import { ContactTagsEditor } from "@/components/contacts/contact-tags-editor";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ui } from "@/lib/i18n/pt-br";
import { slugify } from "@/lib/id";
import { formatBrazilPhone } from "@/lib/phone-mask";
import {
  type CreateContactFormValues,
  createContactDefaultValues,
  createContactFormSchema,
} from "@/lib/validation/create-contact-schema";
import { useContactsStore } from "@/store/contacts-store";

type CreateContactDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function CreateContactDialog({
  open,
  onOpenChange,
}: CreateContactDialogProps) {
  const router = useRouter();
  const { addContact, createTag, state } = useContactsStore();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateContactFormValues>({
    resolver: zodResolver(createContactFormSchema),
    defaultValues: createContactDefaultValues,
  });

  const watchedName = useWatch({
    control,
    name: "name",
    defaultValue: createContactDefaultValues.name,
  });
  const initials = getInitials(watchedName ?? "");

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      reset(createContactDefaultValues);
    }
    onOpenChange(nextOpen);
  };

  const onSubmit = (values: CreateContactFormValues) => {
    const trimmedName = values.name.trim();
    const email = values.email.trim();

    addContact({
      name: trimmedName,
      email: email || undefined,
      phone: values.phone.trim(),
      tagIds: values.tagIds,
      favorite: values.favorite,
    });

    reset(createContactDefaultValues);
    onOpenChange(false);
    router.push(`/contato/${slugify(trimmedName)}`);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-lg">
        <div className="relative border-border/60 border-b bg-linear-to-br from-primary/15 via-surface-elevated to-background px-6 pt-6 pb-5">
          <div
            className="pointer-events-none absolute -top-8 -right-8 size-32 rounded-full bg-primary/10 blur-2xl"
            aria-hidden
          />
          <DialogHeader className="relative gap-3 text-left">
            <div className="flex items-start gap-4">
              <Avatar className="size-14 shrink-0 border-2 border-primary/30 shadow-md ring-2 ring-background">
                <AvatarFallback className="bg-primary/20 font-heading text-lg text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1 space-y-1 pt-0.5">
                <div className="flex items-center gap-2">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
                    <UserPlus className="size-4" aria-hidden />
                  </span>
                  <DialogTitle className="font-heading text-xl tracking-wide">
                    {ui.newContact}
                  </DialogTitle>
                </div>
                <DialogDescription className="text-pretty text-foreground-muted">
                  {ui.newContactDescription}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          <div className="px-6 py-5">
            <FieldGroup>
              <Field data-invalid={!!errors.name}>
                <FieldLabel htmlFor="contact-name">{ui.contactName}</FieldLabel>
                <Input
                  id="contact-name"
                  autoFocus
                  aria-invalid={!!errors.name}
                  className="h-10 bg-surface-muted/50"
                  placeholder="Ex.: Maria Silva"
                  {...register("name")}
                />
                <FieldError>{errors.name?.message}</FieldError>
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field data-invalid={!!errors.email}>
                  <FieldLabel htmlFor="contact-email">{ui.email}</FieldLabel>
                  <div className="relative">
                    <Mail
                      className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-foreground-subtle"
                      aria-hidden
                    />
                    <Input
                      id="contact-email"
                      type="email"
                      autoComplete="email"
                      aria-invalid={!!errors.email}
                      className="h-10 bg-surface-muted/50 pl-9"
                      placeholder="nome@email.com"
                      {...register("email")}
                    />
                  </div>
                  <FieldError>{errors.email?.message}</FieldError>
                </Field>

                <Field data-invalid={!!errors.phone}>
                  <FieldLabel htmlFor="contact-phone">{ui.phone}</FieldLabel>
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                      <div className="relative">
                        <Phone
                          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-foreground-subtle"
                          aria-hidden
                        />
                        <Input
                          id="contact-phone"
                          type="tel"
                          inputMode="numeric"
                          autoComplete="tel"
                          aria-invalid={!!errors.phone}
                          className="h-10 bg-surface-muted/50 pl-9"
                          placeholder="(11) 99999-9999"
                          value={field.value}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                          onChange={(event) =>
                            field.onChange(
                              formatBrazilPhone(event.target.value),
                            )
                          }
                        />
                      </div>
                    )}
                  />
                  <FieldError>{errors.phone?.message}</FieldError>
                </Field>
              </div>

              <div className="flex w-full items-start justify-between gap-4">
                <Field>
                  <FieldLabel>{ui.navTags}</FieldLabel>
                  <Controller
                    name="tagIds"
                    control={control}
                    render={({ field }) => {
                      const selectedTags = state.tags.filter((tag) =>
                        field.value.includes(tag.id),
                      );

                      return (
                        <ContactTagsEditor
                          tags={selectedTags}
                          onAddTag={(name) => {
                            const tag = createTag(name);
                            if (tag && !field.value.includes(tag.id)) {
                              field.onChange([...field.value, tag.id]);
                            }
                          }}
                          onRemoveTag={(tag) =>
                            field.onChange(
                              field.value.filter((id) => id !== tag.id),
                            )
                          }
                        />
                      );
                    }}
                  />
                </Field>

                <Controller
                  name="favorite"
                  control={control}
                  render={({ field }) => (
                    <Field orientation="vertical">
                      <FieldLabel htmlFor="contact-favorite">
                        {ui.favorites}
                      </FieldLabel>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="contact-favorite"
                          checked={field.value}
                          onCheckedChange={(checked) =>
                            field.onChange(checked === true)
                          }
                        />
                        <Label
                          htmlFor="contact-favorite"
                          className="cursor-pointer font-normal"
                        >
                          {ui.favoriteYes}
                        </Label>
                      </div>
                    </Field>
                  )}
                />
              </div>
            </FieldGroup>
          </div>

          <DialogFooter className="my-4 border-border/60 border-t bg-surface-muted/30 px-6 sm:justify-between">
            <Button
              type="button"
              variant="ghost"
              size="default"
              onClick={() => handleOpenChange(false)}
            >
              {ui.cancel}
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="default"
              className="min-w-32"
            >
              {ui.createContact}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
