import { Suspense } from "react";
import { ContactsListPage } from "@/components/contacts/contacts-list-page";
import { Spinner } from "@/components/ui/spinner";

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center">
          <Spinner className="size-6" />
        </div>
      }
    >
      <ContactsListPage />
    </Suspense>
  );
}
