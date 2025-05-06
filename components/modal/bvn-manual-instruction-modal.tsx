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
import BvnWidget from "../widget/bvn-widget";
import { useBVNmanualOverlay } from "@/stores/overlay";

const BvnManualInstruction = () => {
  const { open, setOpen } = useBVNmanualOverlay();

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
                <BvnWidget />
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default BvnManualInstruction;
