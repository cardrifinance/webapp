"use client";

import { useUserStore } from "@/stores/currentUserStore";
import { CardSlash } from "iconsax-react";
import { Check, IdCard } from "lucide-react";
import { Building2, Home, ScanFace } from "lucide-react";
import { useRouter } from "next/navigation";

interface VerificationStatus {
  bvnVerified: boolean;
  addressVerified: boolean;
  livenessVerified: boolean;
}

interface Props {
  status: VerificationStatus;
}

export default function LevelOneRequirements({ status }: Props) {
  const currentUser = useUserStore((state) => state.user);
  const router = useRouter();

  console.log(currentUser);
  const items = [
    {
      label: "Bank Verification Number (BVN)",
      icon: <Building2 className="h-5 w-5 text-[#FA9232]" />,
      //@ts-ignore
      done: currentUser?.bvnstatus ?? false,
      link: "/account-upgrade/nin",
    },
    {
      label: "National Identification Number",
      icon: <IdCard className="h-5 w-5 text-[#018BEF]" />,
      //@ts-ignore
      done: currentUser?.nin ?? false,
      link: "/account-upgrade/nin",
    },
    {
      label: "Residential Address",
      icon: <Home className="h-5 w-5 text-[#22C55E]" />,
      //@ts-ignore
      done: currentUser?.address === "1" ?? true,
      link: "/account-upgrade/address",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="text-center mb-8 mt-4">
        <h1 className="lg:text-4xl font-bold font-sora text-2xl">Tier 2</h1>
        <p className="lg:text-lg text-sm font-inter text-[#07052A] mt-2">
          Provide the following information for account <br /> upgrade to level
          1
        </p>
      </div>

      <div className="bg-white rounded-4xl shadow-sm w-full max-w-[640px] px-[72px] pt-[64px] h-screen">
        <div className="space-y-8">
          {items.map((item) => (
            <div
              key={item.label}
              className="
              flex items-center justify-between rounded-2xl  py-4 bg-white w-full
            "
              onClick={() => {
                if (!item.done) {
                  router.push(item.link);
                }
              }}
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                  {item.icon}
                </div>

                <span className="text-sm font-medium text-[#07052A] truncate">
                  {item.label}
                </span>
              </div>

              {/* Status */}
              {item.done ? (
                <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Check className="h-4 w-4 text-emerald-600" />
                </div>
              ) : (
                <div className="h-6 w-6 rounded-full border border-gray-300" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer hint */}
    </div>
  );
}
