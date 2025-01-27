"use client";

import { PublisherField } from "@/app/lib/definitions";
import Link from "next/link";
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  TagIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/app/ui/button";
import { createCampaign, State } from "@/app/lib/actions";
import { useActionState } from "react";

export default function Form({ publishers }: { publishers: PublisherField[] }) {
  const initialState: State = { message: null, errors: {} };
  const [state, formAction] = useActionState(createCampaign, initialState);

  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Campaign Name */}
        <div className="mb-6 min-w-[40%] max-w-[100%]">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Name
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter Campaign Name"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="name-error"
              />
              <TagIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>

          <div id="name-error" aria-live="polite" aria-atomic="true">
            {state.errors?.name && (
              <p
                className="mt-2 text-sm text-red-500"
                key={state.errors?.name.toString()}
              >
                {state.errors?.name}
              </p>
            )}
          </div>
        </div>

        {/* Publisher Name */}
        <div className="mb-4">
          <label htmlFor="publisher" className="mb-2 block text-sm font-medium">
            Choose a Publisher
          </label>
          <div className="relative">
            <select
              id="publisher"
              name="publisherId"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
              aria-describedby="publisher-error"
              data-testid="publisher-select"
            >
              <option value="" disabled>
                Select a Publisher
              </option>
              {publishers.map((publisher, index) => (
                <option
                  key={publisher.id}
                  value={publisher.id}
                  data-testid={`publisher-option-${index}`}
                >
                  {publisher.name}
                </option>
              ))}
            </select>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>

          <div id="publisher-error" aria-live="polite" aria-atomic="true">
            {state.errors?.publisherId &&
              state.errors.publisherId.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Campaign Budget */}
        <div className="mb-4">
          <label htmlFor="budget" className="mb-2 block text-sm font-medium">
            Enter a Budget
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="budget"
                name="budget"
                type="number"
                step="0.01"
                placeholder="Enter USD Budget"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="budget-error"
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>

          <div id="budget-error" aria-live="polite" aria-atomic="true">
            {state.errors?.budget &&
              state.errors.budget.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        <div aria-live="polite" aria-atomic="true">
          {state.message ? (
            <p className="mt-2 text-sm text-red-500">{state.message}</p>
          ) : null}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/campaigns"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit" data-testid="create-campaign-button">
          Create Campaign
        </Button>
      </div>
    </form>
  );
}
