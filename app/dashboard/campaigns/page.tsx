import { Suspense } from "react";
import { Metadata } from "next";
import Pagination from "@/app/ui/campaigns/pagination";
import Search from "@/app/ui/search";
import Table from "@/app/ui/campaigns/table";
import { CreateCampaign } from "@/app/ui/campaigns/buttons";
import { lusitana } from "@/app/ui/fonts";
import { CampaignsTableSkeleton } from "@/app/ui/skeletons";
import { fetchCampaignsPages } from "@/app/lib/data";

export const metadata: Metadata = {
  title: "Campaigns",
};

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;

  const totalPagesResult = await fetchCampaignsPages(query);
  const totalPages =
    typeof totalPagesResult === "number" ? totalPagesResult : 0;

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Campaigns</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search campaigns..." />
        <CreateCampaign />
      </div>
      <Suspense key={query + currentPage} fallback={<CampaignsTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
