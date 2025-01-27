import Image from "next/image";
import { UpdateCampaign, DeleteCampaign } from "@/app/ui/campaigns/buttons";
import CampaignStatus from "@/app/ui/campaigns/status";
import { fetchFilteredCampaigns } from "@/app/lib/data";
import { CampaignsTable as CampaignsTableType } from "@/app/lib/definitions";
import { formatDateToLocal, formatCurrency } from "@/app/lib/utils";

export default async function CampaignsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const campaigns = await fetchFilteredCampaigns(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {campaigns?.map((campaign: CampaignsTableType) => (
              <div
                key={campaign.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <Image
                        src={campaign.image_url}
                        className="mr-2 rounded-full"
                        width={28}
                        height={28}
                        alt={`${campaign.name}'s profile picture`}
                      />
                      <p>{campaign.publishername}</p>
                    </div>
                    <p className="text-sm text-gray-500">{campaign.email}</p>
                  </div>
                  <CampaignStatus status={campaign.status} />
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">
                      {formatCurrency(campaign.budget)}
                    </p>
                    <p>{formatDateToLocal(campaign.date)}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateCampaign id={campaign.id} />
                    <DeleteCampaign id={campaign.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Campaign Name
                </th>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Publisher
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Email
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Budget
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Date
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Status
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {campaigns?.map((campaign: CampaignsTableType, index: number) => (
                <tr
                  key={campaign.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                  data-testid={`campaign-row-${index}`}
                  data-id={campaign.id}
                >
                  <td
                    className="whitespace-nowrap px-3 py-3"
                    data-testid={`campaign-name-${campaign.id}`}
                  >
                    {campaign.name}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={campaign.image_url}
                        className="rounded-full"
                        width={28}
                        height={28}
                        alt={`${campaign.name}'s profile picture`}
                      />
                      <p
                        data-testid={`campaign-publisher-${campaign.id}`}
                        className="text-sm text-gray-500"
                      >
                        {campaign.publishername}
                      </p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {campaign.email}
                  </td>
                  <td
                    data-testid={`campaign-budget-${campaign.id}`}
                    className="whitespace-nowrap px-3 py-3"
                  >
                    {formatCurrency(campaign.budget)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(campaign.date)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <CampaignStatus status={campaign.status} />
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateCampaign id={campaign.id} />
                      <DeleteCampaign id={campaign.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
