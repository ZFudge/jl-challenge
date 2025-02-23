"use client";

import { Key, useActionState, useState } from "react";
import { PublisherField, CampaignForm } from "@/app/lib/definitions";
import {
  CurrencyDollarIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  UserCircleIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { Button } from "@/app/ui/button";
import { updateCampaign, State } from "@/app/lib/actions";
import { PillboxSelect } from "@/components/ui/pillbox-select";
import GeographicFormSection from "@/components/ui/geographic-form-section";
import { Calendar } from "@/components/ui/calendar";
import { devices, deviceIdToNameMapping } from "@/app/lib/placeholder-data";

export default function EditCampaignForm({
  campaign,
  publishers,
}: {
  campaign: CampaignForm;
  publishers: PublisherField[];
}) {
  const initialState: State = { message: null, errors: {} };
  const updateCampaignWithId = updateCampaign.bind(null, campaign.id);
  const [state, formAction] = useActionState<State, FormData>(
    updateCampaignWithId as unknown as (
      state: State,
      payload: FormData,
    ) => Promise<State>,
    initialState,
  );
  const [startDate, setStartDate] = useState<Date | undefined>(
    (campaign.startdate && new Date(campaign.startdate)) || new Date(),
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    (campaign.enddate && new Date(campaign.enddate)) || new Date(),
  );
  const [devicesSelected, setDevicesSelected] = useState<string[]>(
    Object.values(campaign.devices || {}),
  );
  console.log(`campaign = ${JSON.stringify(campaign)}`);

  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <div className="flex gap-4 flex-wrap">
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
                  defaultValue={campaign.name}
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
          <div className="mb-6 min-w-[40%] max-w-[100%]">
            <label
              htmlFor="publisher"
              className="mb-2 block text-sm font-medium"
            >
              Choose publisher
            </label>
            <div className="relative">
              <select
                id="publisher"
                name="publisherId"
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                defaultValue={campaign.publisher_id}
                aria-describedby="publisher-error"
              >
                <option value="" disabled>
                  Select a publisher
                </option>
                {publishers.map((publisher) => (
                  <option key={publisher.id} value={publisher.id}>
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

          {/* Budget */}
          <div className="mb-6 min-w-[40%] max-w-[100%]">
            <label htmlFor="budget" className="mb-2 block text-sm font-medium">
              Choose an budget
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="budget"
                  name="budget"
                  type="number"
                  step="0.01"
                  placeholder="Enter USD budget"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  aria-describedby="budget-error"
                  defaultValue={campaign.budget}
                />
                <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>

            <div id="budget-error" aria-live="polite" aria-atomic="true">
              {state.errors?.budget && (
                <p
                  className="mt-2 text-sm text-red-500"
                  key={state.errors?.budget.toString()}
                >
                  {state.errors?.budget}
                </p>
              )}
            </div>
          </div>

          {/* Devices */}
          <div className="mb-6 min-w-[40%] max-w-[100%]">
            <label htmlFor="devices" className="mb-2 block text-sm font-medium">
              Choose devices
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <PillboxSelect
                  data={devices}
                  onValueChange={setDevicesSelected}
                  placeholder="Select Devices"
                  defaultValue={devicesSelected}
                />
                <DevicePhoneMobileIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                <input
                  id="devices"
                  type="hidden"
                  name="devices"
                  value={devicesSelected}
                />
              </div>
            </div>

            <div id="devices-error" aria-live="polite" aria-atomic="true">
              {state.errors?.devices && (
                <p
                  className="mt-2 text-sm text-red-500"
                  key={state.errors?.devices.toString()}
                >
                  {state.errors?.devices}
                </p>
              )}
            </div>
          </div>
          {/* end devices */}

          {/* gender */}
          <div className="mb-6 min-w-[40%] max-w-[100%]">
            <label htmlFor="gender" className="mb-2 block text-sm font-medium">
              Choose gender
            </label>
            <div className="relative">
              <select
                id="gender"
                name="gender"
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                defaultValue={campaign.gender || ""}
                aria-describedby="gender-error"
              >
                <option value="" disabled>
                  Select a gender
                </option>
                <option key={"male"} value="male">
                  Male
                </option>
                <option key={"female"} value="female">
                  Female
                </option>
              </select>
              <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>

            <div id="gender-error" aria-live="polite" aria-atomic="true">
              {state.errors?.gender && (
                <p
                  className="mt-2 text-sm text-red-500"
                  key={state.errors?.gender.toString()}
                >
                  {state.errors?.gender}
                </p>
              )}
            </div>
          </div>
          {/* end gender */}

          {/* age */}
          <div className="mb-6 min-w-[40%] max-w-[100%]">
            <label htmlFor="age" className="mb-2 block text-sm font-medium">
              Choose age
            </label>
            <div className="relative">
              <select
                id="age"
                name="age"
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                defaultValue={campaign.age || ""}
                aria-describedby="age-error"
              >
                <option value="" disabled>
                  Select an age
                </option>
                <option key={"18-24"} value="18-24">
                  18-24
                </option>
                <option key={"25-34"} value="25-34">
                  25-34
                </option>
                <option key={"35-44"} value="35-44">
                  35-44
                </option>
                <option key={"45-54"} value="45-54">
                  45-54
                </option>
                <option key={"55-64"} value="55-64">
                  55-64
                </option>
                <option key={"65+"} value="65+">
                  65+
                </option>
              </select>
              <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>

            <div id="age-error" aria-live="polite" aria-atomic="true">
              {state.errors?.age && (
                <p
                  className="mt-2 text-sm text-red-500"
                  key={state.errors?.age.toString()}
                >
                  {state.errors?.age}
                </p>
              )}
            </div>
          </div>
          {/* end age */}

          {/* geo */}
          <div className="mb-6 min-w-[40%] max-w-[100%]">
            <GeographicFormSection {...campaign.geo} />
          </div>
          {/* end geo */}

          {/* Start-End Dates */}
          <fieldset>
            <legend className="mb-2 block text-sm font-medium">
              Set start and end dates
            </legend>
            <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
              <div className="flex gap-4">
                <div className="flex">
                  <Calendar
                    id="start-date"
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    className="rounded-md border"
                  />
                  <input
                    type="hidden"
                    name="startDate"
                    value={startDate?.valueOf()}
                  />
                </div>
                <div className="flex items-center">
                  <Calendar
                    id="end-date"
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    className="rounded-md border"
                  />
                  <input
                    type="hidden"
                    name="endDate"
                    value={endDate?.valueOf()}
                  />
                </div>
              </div>
            </div>
            <div id="start-date-error" aria-live="polite" aria-atomic="true">
              {state.errors?.startDate && (
                <p
                  className="mt-2 text-sm text-red-500"
                  key={state.errors?.startDate.toString()}
                >
                  {state.errors?.startDate}
                </p>
              )}
            </div>
          </fieldset>

          <div aria-live="polite" aria-atomic="true">
            {state.message ? (
              <p className="mt-2 text-sm text-red-500">{state.message}</p>
            ) : null}
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/campaigns"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit" data-testid="edit-campaign-button">
          Edit Campaign
        </Button>
      </div>
    </form>
  );
}
