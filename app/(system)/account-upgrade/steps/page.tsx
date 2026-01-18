"use client";

import React, { useState } from "react";
import { ShieldCheck } from "lucide-react";
import Image from "next/image";
import FG from "@/public/assets/accountupgrade/account-upgrade-img.png";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/stores/currentUserStore";
import { AccountUpgradeModal } from "@/components/modal/account_upgrade_modal";
import { useRouter } from "next/navigation";

export default function VerificationTab() {
  const currentUser = useUserStore((state) => state.user);
  const currentTier = currentUser?.tier as 1 | 2 | 3 | undefined;

  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center">
      {/* Title */}
      <div className="text-center mb-8 mt-4">
        <h1 className="text-4xl font-bold font-sora">Account Upgrade</h1>
        <p className="text-lg font-inter text-[#07052A] mt-2">
          Upgrade your account to these tier levels
        </p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-sm w-full max-w-md p-6">
        {/* Illustration */}
        <div className="bg-[#1D124D] rounded-xl h-44 mb-6 flex items-center justify-center">
          <Image
            src={FG}
            alt="Account upgrade"
            className="object-contain"
            priority
          />
        </div>

        {/* Tiers */}
        <div className="space-y-6 border-dashed border-[#EFD1DC] rounded-3xl lg:p-10.5 p-5">
          <Tier
            tierValue={1}
            currentTier={currentTier}
            title="Tier 1"
            color="bg-[#018BEF1A] text-[#018BEF]"
            limits={[
              ["Single inflow", "₦50,000.00"],
              ["Cumulative Balance", "₦300,000.00"],
              ["Daily Transaction Limit", "₦300,000.00"],
            ]}
          />

          <Tier
            tierValue={2}
            currentTier={currentTier}
            title="Tier 2"
            color="bg-[#FA92321A] text-[#FA9232]"
            limits={[
              ["Single inflow", "₦200,000.00"],
              ["Cumulative Balance", "₦500,000.00"],
              ["Daily Transaction Limit", "₦500,000.00"],
            ]}
          />

          <Tier
            tierValue={3}
            currentTier={currentTier}
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
          <Button
            className="w-full h-14 rounded-xl bg-primary-100 text-white font-medium font-inter"
            onClick={() => setOpen(true)}
          >
            Upgrade Account
          </Button>

          <Button
            variant="ghost"
            className="w-full h-14 text-sm text-gray-600 font-inter"
          >
            Not Now
          </Button>
        </div>
      </div>
      <AccountUpgradeModal
        open={open}
        onOpenChange={setOpen}
        onUpgrade={() => {
          router.push("/account-upgrade/onboarding");
        }}
      />
    </div>
  );
}

/* ------------------ Tier Component ------------------ */

interface TierProps {
  title: string;
  color: string;
  limits: [string, string][];
  tierValue: 1 | 2 | 3;
  currentTier?: number;
}

function Tier({ title, color, limits, tierValue, currentTier }: TierProps) {
  const isCurrent = tierValue == currentTier;

  console.log(isCurrent);

  return (
    <div
      className={`rounded-xl p-4 cursor-pointer transition-all
        ${
          isCurrent
            ? "border-2 border-primary-100 bg-[#FFF5F8]"
            : "border border-transparent"
        }
      `}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className={`h-8 w-8 rounded-full flex items-center justify-center ${color}`}
          >
            <ShieldCheck className="h-4 w-4" />
          </div>

          <h3 className="font-bold text-base text-[#07052A] font-inter">
            {title}
          </h3>
        </div>

        {isCurrent && (
          <span className="text-xs font-semibold text-primary-100 bg-primary-100/10 px-3 py-1 rounded-full">
            Current tier
          </span>
        )}
      </div>

      <div className="space-y-2 text-sm font-inter">
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
