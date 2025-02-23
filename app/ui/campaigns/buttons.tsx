import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { deleteCampaign } from "@/app/lib/actions";

export function CreateCampaign() {
  return (
    <Link
      href="/dashboard/campaigns/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Campaign</span>{" "}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateCampaign({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/campaigns/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
      data-testid={`update-campaign-button-${id}`}
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteCampaign({ id }: { id: string }) {
  const deleteCampaignWithId = deleteCampaign.bind(null, id);

  return (
    <form action={deleteCampaignWithId}>
      <button
        type="submit"
        className="rounded-md border p-2 hover:bg-gray-100"
        data-testid={`delete-campaign-button-${id}`}
      >
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}
