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
      <h2 className="mb-2 font-medium text-lg text-muted-foreground uppercase tracking-wide md:text-xl">
        {title}
      </h2>
      {children}
    </section>
  );
}
