"use client";

import * as React from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

import UpgradeImg from "@/public/assets/accountupgrade/account-upgrade-img.png";

interface AccountUpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpgrade?: () => void;
}

export function AccountUpgradeModal({
  open,
  onOpenChange,
  onUpgrade,
}: AccountUpgradeModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          max-w-[526px]
          rounded-5xl
          p-6
          overflow-hidden
          bg-[#F5F2FB]
          sm:flex-col-reverse
        "
      >
        {/* Close button */}
        <DialogClose className="absolute right-4 top-4 rounded-xl p-2 text-muted-foreground hover:bg-muted border ">
          <X className="h-4 w-4" />
        </DialogClose>

        {/* Illustration */}
        <div className=" p-4">
          <div className="relative h-54 w-full rounded-2xl overflow-hidden">
            <Image
              src={UpgradeImg}
              alt="Account upgrade required"
              fill
              className="object-contain rounded-3xl h-full"
              priority
            />
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 pt-4 text-center">
          <h2 className="text-xl font-bold text-[#07052A] font-sora">
            Customer (KYC) Requirement
          </h2>

          <p className="mt-3 text-sm text-[#474256] leading-relaxed font-inter text-start">
            The Central Bank of Nigeria mandates strict Know your Customeer
            (KYC) document requirements for banks to ensure integrity of the
            financaial system
          </p>
          <p className="mt-3 text-sm text-[#474256] leading-relaxed font-inter text-start">
            These requirements which include proof of identity, address , income
            and references are crucial in preventing financial crimes like money
            laundering and fraud.
          </p>
          <p className="mt-3 text-sm text-[#474256] leading-relaxed font-inter text-start">
            They will help establish transparency, identify beneficial owners,
            and monitor transactions, safeguarding both the financial
            institution and Nigeria's financial stability. Stay informed about
            these evolving requirement is essential for all customers.
          </p>

          {/* Actions */}
          <div className="mt-8 space-y-3">
            <Button
              onClick={onUpgrade}
              className="w-full h-14 rounded-xl bg-primary-100 text-white font-inter  font-semibold text-sm"
            >
              Upgrade Account
            </Button>

            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="w-full h-14 text-sm text-[#474256] font-inter"
            >
              Not Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
