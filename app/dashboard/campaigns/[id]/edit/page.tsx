import { notFound } from "next/navigation";
import { Metadata } from "next";
import Form from "@/app/ui/campaigns/edit-form";
import Breadcrumbs from "@/app/ui/campaigns/breadcrumbs";
import { fetchCampaignById, fetchPublishers } from "@/app/lib/data";
import EditCampaignForm from "@/app/ui/campaigns/edit-form";

export const metadata: Metadata = {
  title: "Edit Campaign",
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const [campaign, publishers] = await Promise.all([
    fetchCampaignById(id),
    fetchPublishers(),
  ]);

  if (!campaign) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Campaigns", href: "/dashboard/campaigns" },
          {
            label: "Edit Campaign",
            href: `/dashboard/campaigns/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form campaign={campaign} publishers={publishers} />
    </main>
  );
}
