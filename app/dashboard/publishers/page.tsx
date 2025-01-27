import { Metadata } from "next";
import { fetchFilteredPublishers } from "@/app/lib/data";
import PublishersTable from "@/app/ui/publishers/table";

export const metadata: Metadata = {
  title: "Publishers",
};

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";

  const publishers = await fetchFilteredPublishers(query);

  return (
    <main>
      <PublishersTable publishers={publishers} />
    </main>
  );
}
