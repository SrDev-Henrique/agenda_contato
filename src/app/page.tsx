import { Suspense } from "react";

import { Spinner } from "@/components/ui/spinner";
import { ContactsListPage } from "@/components/contacts/contacts-list-page";

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
