"use client";

import Image from "next/image";
import { ArrowRight, Check, ChevronRight, Info, InfoIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import CountryConfirmingDialog from "@/components/modal/country-confirming-modal";
import { useEffect, useState } from "react";
import { addUrlParam } from "@/lib/urlParams";
import { useParams, useSearchParams } from "next/navigation";
import { useAuthStep } from "@/stores/misc";
import Intro from "@/components/auth/Into";
import SignupForm from "@/components/auth/signForm";
import EmailVerify from "@/components/auth/emailVerify";
import Password from "@/components/auth/password";
import AccountVerification from "@/components/auth/Account_verifixation";
import { UserData } from "@/types";
import TransactionPin from "@/components/auth/transaction_pin";
import VerifyTransactionPin from "@/components/auth/verify_transaction_pin";

const IsNotAvailable = () => {
  return (
    <div className="flex items-center justify-center bg-[#FAF7FF] text-primary-100 py-1.5 px-2 font-normal  text-[8px]  rounded-full">
      Coming Soon
    </div>
  );
};
const SignUp = () => {
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
      {step === 0 && <Intro />}
      {step === 1 && <SignupForm setUserData={setUserData} />}
      {step === 2 && <Password datas={userData} />}
      {step === 3 && <EmailVerify />}
      {step === 4 && <TransactionPin />}
      {step === 5 && <VerifyTransactionPin />}
      {step === 6 && <AccountVerification datas={userData} />}
    </div>
  );
};

export default SignUp;
