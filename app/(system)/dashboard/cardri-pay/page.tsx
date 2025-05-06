"use client";

import { ChevronRight } from "lucide-react";
import Image from "next/image";
import sendMoney from "@/public/assets/cardripay/sendmoney.png";
import payBills from "@/public/assets/cardripay/paybills.png";
import paymentLink from "@/public/assets/cardripay/paymentlink.png";
import swap from "@/public/assets/cardripay/swap.png";
import deposit from "@/public/assets/cardripay/deposit.png";
import { SideBarMenuList } from "@/lib/assets";
import SendMoneyModal from "@/components/modal/send-money-modal";
import { useSendMoneyModalOverlay } from "@/stores/overlay";

const CardriPay = () => {
  const { setOpen } = useSendMoneyModalOverlay();

  const cardriPayList = [
    {
      label: "Send Money",
      description:
        "Send money to friends, family or business using their bank details",
      image: sendMoney,
      action: () => setOpen(true),
    },
    {
      label: "Deposit",
      description: "Withdraw commission to other banks using the bank details.",
      image: deposit,
    },
    {
      label: "Swap",
      description: "Withdraw commission to other banks using the bank details.",
      image: swap,
    },
    {
      label: "Pay Bills",
      description: "Withdraw commission to other banks using the bank details.",
      image: payBills,
    },
    {
      label: "Payment Link",
      description: "Withdraw commission to other banks using the bank details.",
      image: paymentLink,
    },
  ];

  return (
    <div className="grid h-max grid-cols-6 gap-7 py-5">
      <div className=" col-span-6 flex flex-col gap-6  mx-auto  bg-white p-10.5 rounded-3xl ">
        <h2 className="font-bold text-[20px] font-sora text-[#242E3E] ">
          Send, Receive and Swap
        </h2>

        <div className="mx-4 flex-wrap flex justify-between items-center  gap-6">
          {cardriPayList.map((item, index) => (
            <div
              key={index}
              onClick={item.action}
              className="flex-grow cursor-pointer  flex-shrink-0 flex justify-between max-w-[442px] basis-[442px] border border-[#FAF7FF] p-6 items-center rounded-2xl w-full"
            >
              <div className="flex items-center gap-4">
                <Image src={item.image} alt="" className="h-16 w-16" />

                <div>
                  <h3 className="text-[#07052A] font-semibold text-base font-inter">
                    {item.label}
                  </h3>

                  <span className="text-[#474256] text-[12px] font-inter  leading-4.5">
                    {item.description}
                  </span>
                </div>
              </div>

              <ChevronRight size={24} color="#B4ACCA" />
            </div>
          ))}
        </div>
      </div>
      <div className=" flex col-span-6 ">
        <div className="w-full bg-white p-10.5 rounded-[24px] bottom-0 justify-between  right-0 flex  gap-4  items-center">
          {SideBarMenuList?.map((menu: any, index) => (
            <Image
              src={menu?.image}
              alt={menu.label}
              className="object-fill h-[182px]"
              key={index}
            />
          ))}
        </div>
      </div>

      {/**** SEND MONEY MODAL */}

      <SendMoneyModal />
    </div>
  );
};

export default CardriPay;
