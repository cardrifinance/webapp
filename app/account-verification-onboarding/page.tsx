"use client";

import OnboardingOne from "@/components/account-onboarding/OboardingOne";
import OnboardingTwo from "@/components/account-onboarding/OnBoardingTwo";
import BvnManualInstruction from "@/components/modal/bvn-manual-instruction-modal";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const AccountVerificationOnboarding = () => {
  const searchParams = useSearchParams();
  const [step, setStep] = useState("");

  useEffect(() => {
    setStep(searchParams.get("step") || "");
  }, [searchParams]);
  return (
    <div className="h-screen bg-bg-color-500 w-full flex justify-center items-end">
      <BvnManualInstruction />
      {step === "1" && <OnboardingOne />}
      {step === "2" && <OnboardingTwo />}
    </div>
  );
};

export default AccountVerificationOnboarding;
