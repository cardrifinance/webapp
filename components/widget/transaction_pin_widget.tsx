import Image from "next/image";
import { Button } from "../ui/button";
import check from "@/public/assets/oboarding/accountcheck2.png";
import {
  useBVNmanualOverlay,
  useDeviceBindingOverlay,
  useTransactionPinOverlay,
} from "@/stores/overlay";
import { addUrlParam } from "@/lib/urlParams";
import OTPInput from "react-otp-input";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { verifyLoginPin } from "@/services/_request";
import { getBrowserUID } from "@/helper";
import { useRouter } from "next/navigation";
import { FaSpinner } from "react-icons/fa";
import { useRemoteUserStore } from "@/stores/remoteUser";
import { useUserStore } from "@/stores/currentUserStore";

const TransactionPinWidget = () => {
  const { setOpen, id } = useDeviceBindingOverlay();
  // const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setUser } = useRemoteUserStore();
  const loginUser = useUserStore((state) => state.loginUser);
  const router = useRouter();

  const { otp, setOtp } = useTransactionPinOverlay();

  useEffect(() => {
    if (otp.length === 4 && id) {
      onSubmit();
    }
  }, [otp, id]);

  const onSubmit = async () => {
    if (isSubmitting) return;

    const toastId = toast.loading("Verfiying Login...");
    try {
      setIsSubmitting(true);

      const response = await verifyLoginPin(getBrowserUID(), id, otp);
      //  console.log(response);

      loginUser(response.data);
      setUser(response.data);

      // console.log(token);
      //@ts-ignore
      localStorage.setItem("access_token", JSON.stringify(response.token));
      //@ts-ignore
      localStorage.setItem("refresh_token", JSON.stringify(response.token));
      //@ts-ignore
      localStorage.setItem("token_type", JSON.stringify(response.token));

      toast.success("Login succesfully.", { id: toastId });
      router.push("/dashboard/root?verify=true");

      //
    } catch (error) {
      //  console.log(error);
      toast.error(
        //@ts-ignore
        error?.response.data.message ||
          //@ts-ignore
          error?.response.data.success === "false 1"
          ? "PIN do not match"
          : "Something went wrong. Failed to verify PIN",
        {
          id: toastId,
        }
      );
    } finally {
      setIsSubmitting(false);
      setOpen(false);
    }

    // setOpen(false);
  };

  return (
    <>
      {" "}
      <div>
        <div className="mt-3 text-center sm:mt-5">
          <div className="mt-2 flex flex-col gap-6 justify-center items-center">
            <div className="flex flex-col gap-4">
              <div className="w-full text-center">
                <span className="text-[#B4ACCA] text-base font-inter leading-0.5 text-center font-semibold">
                  Enter your PIN
                </span>
              </div>
              <div className=" w-full max-w-[360px] mx-auto flex gap-2 items-center justify-center my-4">
                <OTPInput
                  value={otp}
                  onChange={setOtp}
                  numInputs={4}
                  inputType="number"
                  shouldAutoFocus
                  inputStyle={cn(
                    "w-[100%_!important] max-w-[78px] text-black font-bold font-sora text-[20px] rounded border border-[#E7E7E7] caret-main-100 h-[84px] bg-white outline-0 focus:border focus:border-primary-100 focus:border-opacity-55 focus:bg-[#F5F8FF]"
                  )}
                  containerStyle={{
                    width: "100%",
                    display: "grid",
                    columnGap: "10px",
                    gridTemplateColumns: "repeat(4, 1fr)",
                  }}
                  renderInput={(inputProps, index) => (
                    <input
                      {...inputProps}
                      type="text"
                      inputMode="numeric"
                      onKeyDown={(e) => {
                        if (
                          !/[0-9]/.test(e.key) &&
                          e.key !== "Backspace" &&
                          e.key !== "Delete" &&
                          e.key !== "ArrowLeft" &&
                          e.key !== "ArrowRight"
                        ) {
                          e.preventDefault();
                        }
                      }}
                      onPaste={(e) => {
                        const pastedData =
                          e.clipboardData.getData("text/plain");
                        if (!/^\d+$/.test(pastedData)) {
                          e.preventDefault();
                        }
                      }}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5 flex items-center flex-col gap-6 sm:mt-6 w-full">
        <span className="text-primary-100 font-normal text-sm font-inter text-center inline-block">
          Forgot Payment PIN?
        </span>
      </div>
    </>
  );
};

export default TransactionPinWidget;
