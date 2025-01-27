import { fetchPublishers } from "@/app/lib/data";
import Form from "@/app/ui/campaigns/create-form";
import Breadcrumbs from "@/app/ui/campaigns/breadcrumbs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Campaign",
};

export default async function Page() {
  const publishers = await fetchPublishers();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Campaigns", href: "/dashboard/campaigns" },
          {
            label: "Create Campaign",
            href: "/dashboard/campaigns/create",
            active: true,
          },
        ]}
      />
      <Form publishers={publishers} />
    </main>
  );
}
