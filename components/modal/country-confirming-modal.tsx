import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import React from "react";
import { FaSpinner } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { removeUrlParam } from "@/lib/urlParams";

type ComponentProps = {
  label: string;
  image: string;
  status?: string;
  open?: boolean;
  action?: () => void;
  isSubmitting?: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const CountryConfirmingDialog: React.FC<ComponentProps> = ({
  label,
  image,
  open,
  action,
  setOpen,
  status,
  isSubmitting,
}) => {
  return (
    <Transition show={open}>
      <Dialog className="relative z-10" onClose={setOpen}>
        <TransitionChild
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 opacity-70 backdrop-blur-sm transition-opacity" />
        </TransitionChild>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center overflow-hidden p-4 text-center sm:items-center sm:p-0">
            <TransitionChild
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel className="relative transform rounded-[42px] bg-white px-4 pb-4 pt-5 text-left lg:pl-[30px] lg:pb-[30px] lg:pr-[30px] shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-[442px] sm:p-6">
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <div className="mt-2 flex flex-col gap-6 justify-center items-center">
                      <div className="rounded-full bg-[#fff] absolute -top-[50px] h-[110px] w-[110px] flex justify-center items-center">
                        <div className="bg-[#ECF3F2] rounded-full p-[12px]">
                          <Image
                            src={image}
                            alt={label}
                            className="h-[64px] w-[64px] rounded-full "
                          />
                        </div>
                      </div>

                      <div className="pt-[30px]">
                        <h2 className="text-secondary-500 font-sora font-bold text-[20px] text-center">
                          Confirm you have a valid ID for {label}
                        </h2>

                        <span className="font-inter text-[14px] font-normal text-[#464646]">
                          Only documents issued from {label} will be accepted
                          for verification.
                        </span>
                      </div>

                      <div></div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 flex items-center flex-col gap-6 sm:mt-6 w-full">
                  <Button
                    type="button"
                    className="w-full h-[50px] rounded-xl cursor-pointer bg-primary-100 text-white font-inter font-medium text-[14px]  flex justify-center items-center"
                    onClick={action}
                  >
                    {isSubmitting ? (
                      <FaSpinner className="animate-spin text-white" />
                    ) : (
                      `Continue with ${label} `
                    )}
                  </Button>
                  <Button
                    type="button"
                    className="w-full h-[50px]  bg-[#FAF7FF] text-[14px] text-[#464646] cursor-pointer font-inter font-[600]"
                    onClick={() => {
                      setOpen(false);
                      removeUrlParam("country");
                    }}
                  >
                    Go back
                  </Button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CountryConfirmingDialog;
