"use client";

import * as React from "react";
import { GlobeAltIcon } from "@heroicons/react/24/outline";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Geo } from "@/app/lib/definitions";

export default function GeographicFormSection(geo: Geo) {
  const { country, state, city, zipCode } = geo;
  return (
    <Accordion type="single" className="w-full">
      <AccordionItem value="geographic-info">
        <AccordionTrigger className="text-lg font-semibold">
          <label htmlFor="name" className="mb-2 flex items-center gap-2 text-sm font-medium">
            <GlobeAltIcon className="h-5 w-5" />
            Choose Geo
          </label>
        </AccordionTrigger>
          <div className="space-y-4">
            <div className="flex items-center">
              <Label htmlFor="country" className="w-24 flex-shrink-0">
                Country
              </Label>
              <Input
                name="country"
                id="country"
                placeholder="Enter country"
                className="flex-grow"
                defaultValue={country?.toString()}
              />
            </div>
            <div className="flex items-center">
              <Label htmlFor="state" className="w-24 flex-shrink-0">
                State
              </Label>
              <Input
                name="state"
                id="state"
                placeholder="Enter state"
                className="flex-grow"
                defaultValue={state?.toString()}
              />
            </div>
            <div className="flex items-center">
              <Label htmlFor="city" className="w-24 flex-shrink-0">
                City
              </Label>
              <Input
                name="city"
                id="city"
                placeholder="Enter city"
                className="flex-grow"
                defaultValue={city?.toString()}
              />
            </div>
            <div className="flex items-center">
              <Label htmlFor="zipCode" className="w-24 flex-shrink-0">
                Zip Code
              </Label>
              <Input
                name="zipCode"
                id="zipCode"
                placeholder="Enter zip code"
                className="flex-grow"
                defaultValue={zipCode?.toString()}
              />
            </div>
          </div>
      </AccordionItem>
    </Accordion>
  );
}
