"use client";

import { cn } from "@/lib/utils";
import CountryConfirmingDialog from "@/components/modal/country-confirming-modal";
import { useEffect, useState } from "react";

import { useParams, useSearchParams } from "next/navigation";
import { useAuthStep } from "@/stores/misc";
import SignInForm from "@/components/auth/signForm";

import { UserData } from "@/types";
import SigninForm from "@/components/auth/signinForm";

const SignIn = () => {
  const { step, setStep } = useAuthStep();

  const searchParams = useSearchParams();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const RegStep = searchParams.get("step") || "0";
    setStep(Number(RegStep));
  }, []);

  return (
    <div
      className={cn(
        "bg-[#F5F2FB]   flex justify-center items-center",
        step !== 1 && "h-[100vh]"
      )}
    >
      <SigninForm />
    </div>
  );
};

export default SignIn;
