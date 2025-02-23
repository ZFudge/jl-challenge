"use client";

import { PublisherField } from "@/app/lib/definitions";
import Link from "next/link";
import {
  CurrencyDollarIcon,
  DevicePhoneMobileIcon,
  TagIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/app/ui/button";
import { createCampaign, State } from "@/app/lib/actions";
import { useActionState, useState } from "react";
import { PillboxSelect } from "@/components/ui/pillbox-select";
import { devices } from "@/app/lib/placeholder-data";
import { Calendar } from "@/components/ui/calendar";
import GeographicFormSection from "@/components/ui/geographic-form-section";

export default function Form({ publishers }: { publishers: PublisherField[] }) {
  const initialState: State = { message: null, errors: {} };
  const [state, formAction] = useActionState(createCampaign, initialState);

  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [devicesSelected, setDevicesSelected] = useState<string[]>([]);

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
          {/* end name */}

          {/* Publisher Name */}
          <div className="mb-6 min-w-[40%] max-w-[100%]">
            <label
              htmlFor="publisher"
              className="mb-2 block text-sm font-medium"
            >
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
          {/* end publisher */}

          {/*  Budget */}
          <div className="mb-6 min-w-[40%] max-w-[100%]">
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
          {/* end budget */}

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
                defaultValue=""
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
                defaultValue=""
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
                />
                <input
                  id="devices"
                  type="hidden"
                  name="devices"
                  value={devicesSelected}
                />
                <DevicePhoneMobileIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
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

          {/* geo */}
          <div className="mb-6 min-w-[40%] max-w-[100%]">
            <GeographicFormSection />
          </div>

          {/* Start-End Dates */}
          <fieldset>
            <legend className="mb-2 block text-sm font-medium">
              Set Start and End Dates
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
          {/* end start-end dates */}

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
        <Button type="submit" data-testid="create-campaign-button">
          Create Campaign
        </Button>
      </div>
    </form>
  );
}
