type ContactDetailSectionProps = {
  title: string;
  children: React.ReactNode;
};

export function ContactDetailSection({
  title,
  children,
}: ContactDetailSectionProps) {
  return (
    <section>
      <h2 className="mb-2 font-medium text-foreground-subtle text-xs uppercase tracking-wide">
        {title}
      </h2>
      {children}
    </section>
  );
}
