"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STATES_AND_LGAS } from "@/helper";

export default function ResidentialAddressPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    houseNumber: "",
    houseAddress: "",
    city: "",
    state: "",
    lga: "",
    landmark: "",
  });

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const canContinue =
    form.houseNumber &&
    form.houseAddress &&
    form.city &&
    form.state &&
    form.lga;

  return (
    <div className="min-h-screen bg-[#F6F4FA] px-4">
      <div className="max-w-2xl mx-auto pt-12">
        <h1 className="text-3xl font-bold text-center text-[#07052A] font-sora">
          Residential Address
        </h1>
        <p className="text-center text-[#474256] mt-2">
          Please fill the field provided correctly.
        </p>

        <div className="bg-white rounded-[30px] lg:px-[72px] px-8 lg:pt-[64px] pt-8 mt-10 space-y-6">
          {/* House Number */}
          <div>
            <label className="text-sm font-medium">House Number</label>
            <Input
              placeholder="Enter house number"
              className="h-[60px] mt-4 py-[15px] px-[16px] rounded-[10px] border-0 outline-0 bg-white placeholder:text-base placeholder:font-extralight placeholder:text-placeholder-100 focus-visible:ring-primary-100 focus-visible:ring-offset-0 text-base font-medium"
              value={form.houseNumber}
              onChange={(e) => handleChange("houseNumber", e.target.value)}
            />
          </div>

          {/* House Address */}
          <div>
            <label className="text-sm font-medium">House Address</label>
            <Input
              placeholder="Enter house address"
              value={form.houseAddress}
              className="h-[60px] mt-4 py-[15px] px-[16px] rounded-[10px] border-0 outline-0 bg-white placeholder:text-base placeholder:font-extralight placeholder:text-placeholder-100 focus-visible:ring-primary-100 focus-visible:ring-offset-0 text-base font-medium"
              onChange={(e) => handleChange("houseAddress", e.target.value)}
            />
          </div>

          {/* City */}
          <div>
            <label className="text-sm font-medium">City</label>
            <Input
              placeholder="Enter city"
              value={form.city}
              className="h-[60px] mt-4 py-[15px] px-[16px] rounded-[10px] border-0 outline-0 bg-white placeholder:text-base placeholder:font-extralight placeholder:text-placeholder-100 focus-visible:ring-primary-100 focus-visible:ring-offset-0 text-base font-medium"
              onChange={(e) => handleChange("city", e.target.value)}
            />
          </div>

          {/* State */}
          <div>
            <label className="text-sm font-medium mb-2">State</label>
            <Select
              onValueChange={(value) => {
                handleChange("state", value);
                handleChange("lga", "");
              }}
            >
              <SelectTrigger className="py-8">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent className="">
                {Object.keys(STATES_AND_LGAS).map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* LGA */}
          <div>
            <label className="text-sm font-medium mb-2">
              Local Government Area
            </label>
            <Select
              disabled={!form.state}
              onValueChange={(value) => handleChange("lga", value)}
            >
              <SelectTrigger className="py-8">
                <SelectValue placeholder="Select LGA" />
              </SelectTrigger>
              <SelectContent className="">
                {form.state &&
                  STATES_AND_LGAS[form.state]?.map((lga) => (
                    <SelectItem key={lga} value={lga}>
                      {lga}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Landmark */}
          <div>
            <label className="text-sm font-medium">Nearest Landmark</label>
            <Input
              placeholder="e.g. Near Total Filling Station"
              value={form.landmark}
              className="h-[60px] mt-4 py-[15px] px-[16px] rounded-[10px] border-0 outline-0 bg-white placeholder:text-base placeholder:font-extralight placeholder:text-placeholder-100 focus-visible:ring-primary-100 focus-visible:ring-offset-0 text-base font-medium"
              onChange={(e) => handleChange("landmark", e.target.value)}
            />
          </div>

          <Button
            disabled={!canContinue}
            onClick={() => router.push("/account/upgrade/level-1")}
            className="w-full h-14 bg-primary-100 text-white rounded-xl mt-6"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
