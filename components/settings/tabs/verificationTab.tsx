import React from "react";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import Image from "next/image";
import FG from "@/public/assets/accountupgrade/account-upgrade-img.png";
import { Button } from "@/components/ui/button";

export default function VerificationTab() {
  return (
    <div className="min-h-screen bg-[#F6F4FA] flex flex-col items-center">
      {/* Header */}
      <header className="w-full max-w-4xl flex items-center gap-3 px-6 py-6">
        <button className="h-10 w-10 rounded-full border flex items-center justify-center">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <span className="text-sm text-gray-600">Back</span>
      </header>

      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-sora">Account Upgrade</h1>
        <p className="text-lg font-inter  text-[#07052A] mt-2">
          Upgrade your account to these tier levels
        </p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-sm w-full max-w-md p-6">
        {/* Illustration placeholder */}
        <div className="bg-[#1D124D] rounded-xl h-44 mb-6 flex items-center justify-center text-white text-sm">
          <Image src={FG} className="object-center" alt="" />
        </div>

        {/* Tiers */}
        <div className="space-y-6 border-dashed border-[#EFD1DC] rounded-3xl lg:p-10.5 p-5 ">
          {/* Tier 1 */}
          <Tier
            title="Tier 1"
            color="bg-[#018BEF1A] text-[#018BEF]"
            limits={[
              ["Single inflow", "₦50,000.00"],
              ["Cumulative Balance", "₦300,000.00"],
              ["Daily Transaction Limit", "₦300,000.00"],
            ]}
          />

          {/* Tier 2 */}
          <Tier
            title="Tier 2"
            color="bg-[#FA92321A] text-[#FA9232]"
            limits={[
              ["Single inflow", "₦200,000.00"],
              ["Cumulative Balance", "₦500,000.00"],
              ["Daily Transaction Limit", "₦500,000.00"],
            ]}
          />

          {/* Tier 3 */}
          <Tier
            title="Tier 3"
            color="bg-green-100 text-green-600"
            limits={[
              ["Single inflow", "₦5,000,000.00"],
              ["Cumulative Balance", "Unlimited"],
              ["Daily Transaction Limit", "₦5,000,000.00"],
            ]}
          />
        </div>

        {/* Actions */}
        <div className="mt-8 space-y-3">
          <Button className="w-full h-14 rounded-xl bg-primary-100 text-white font-medium font-sm font-inter">
            Upgrade Account
          </Button>
          <Button className="w-full h-14 rounded-xl  text-sm text-gray-600 bg-white font-inter border-0 mt-2">
            Not Now
          </Button>
        </div>
      </div>
    </div>
  );
}

interface TierProps {
  title: string;
  color: string;
  limits: [string, string][];
}

function Tier({ title, color, limits }: TierProps) {
  return (
    <div className=" rounded-xl p-4 cursor-pointer">
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`h-8 w-8 rounded-full flex items-center justify-center ${color}`}
        >
          <ShieldCheck className="h-4 w-4" />
        </div>
        <h3 className="font-bold text-base text-[#07052A font-inter]">
          {title}
        </h3>
      </div>
      <div className="space-y-2 text-sm font-inter  ">
        {limits.map(([label, value]) => (
          <div key={label} className="flex justify-between text-[#474256]">
            <span>{label}</span>
            <span className="text-gray-900">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
