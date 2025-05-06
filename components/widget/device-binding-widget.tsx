import Image from "next/image";
import { Button } from "../ui/button";
import check from "@/public/assets/oboarding/accountcheck2.png";
import { useBVNmanualOverlay, useDeviceBindingOverlay } from "@/stores/overlay";
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

const DeviceBindingWidget = () => {
  const { setOpen, id } = useDeviceBindingOverlay();
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setUser } = useRemoteUserStore();
  const loginUser = useUserStore((state) => state.loginUser);
  const router = useRouter();

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
            <div className="rounded-full bg-[#fff] absolute -top-[50px] h-[110px] w-[110px] flex justify-center items-center">
              <Image
                src={check}
                alt={""}
                className="h-[110px] w-[110px] rounded-full "
              />
            </div>

            <div className="flex flex-col gap-4">
              <h1 className="text-secondary-500 text-[20px] text-center font-sora font-bold  leading-[48px]">
                Login Verification
              </h1>
              <span className="text-[14px] font-normal font-inter text-center  text-[#464646] leading-[28px] mt-4 inline-block">
                Enter the 4-digit code sent to your registered phone number.{" "}
                <br /> This is to verify that you are the owner of this account.
              </span>
              <div className=" w-full max-w-[220px] mx-auto flex gap-2 items-center justify-center my-4">
                <OTPInput
                  value={otp}
                  onChange={setOtp}
                  numInputs={4}
                  inputType="number"
                  shouldAutoFocus
                  inputStyle={cn(
                    "w-[100%_!important] text-black font-bold font-sora text-[20px] rounded border border-[#E7E7E7] caret-main-100 h-[50px] bg-white outline-0 focus:border focus:border-primary-100 focus:border-opacity-55 focus:bg-[#F5F8FF]"
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
        <Button
          type="button"
          disabled={isSubmitting}
          className="w-full h-[50px] rounded-xl cursor-pointer bg-primary-100 text-white font-inter font-medium text-[14px]  flex justify-center items-center"
          onClick={onSubmit}
        >
          {isSubmitting ? (
            <FaSpinner className="animate-spin text-white" />
          ) : (
            `Continue`
          )}
        </Button>
        <Button
          type="button"
          className="w-full h-[50px]  bg-[#FAF7FF] text-[14px] text-[#464646] cursor-pointer font-inter font-[600]"
          onClick={() => {
            setOpen(false);
            //  removeUrlParam("country");
          }}
        >
          Go back
        </Button>
      </div>
    </>
  );
};

export default DeviceBindingWidget;
