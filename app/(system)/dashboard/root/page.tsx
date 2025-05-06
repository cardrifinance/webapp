"use client";

import Image from "next/image";
import vector from "@/public/assets/dashboard/vectorarrow.png";
import { BeneficiaryList, SideBarMenuList } from "@/lib/assets";
import { Tooltip } from "react-tooltip";
import { Eye, Info } from "lucide-react";
import Cards from "@/components/dashboard/card";
import { currencySymbols } from "@/lib/misc";
import NGN from "@/public/assets/currencies/NGNCurrency.png";
import USD from "@/public/assets/currencies/DollarCurrency.png";

import GBP from "@/public/assets/currencies/PoundsCurrency.png";

import EUR from "@/public/assets/currencies/EurCurrency.png";
import COM from "@/public/assets/currencies/cashback.png";
import transactionLog from "@/public/assets/transaction/tranaction.png";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useUserStore } from "@/stores/currentUserStore";

const IsEmpty = () => {
  return (
    <div className="flex flex-col gap-4 my-10 items-center justify-center w-full h-full">
      <Image
        src={transactionLog}
        alt="transaction log"
        className="w-[201px] h-[220px] object-center"
      />
      <h3 className="text-[#474256] font-inter text-[14px] font-normal">
        You have no transaction yet!
      </h3>
    </div>
  );
};
const Dashboard = () => {
  const currentUser = useUserStore((state) => state.user);
  //console.log("currentUser", currentUser);

  const BalanceChart = [
    {
      title: "NGN",
      //@ts-ignore
      balance: currentUser?.ngn_b || "0", // Using ngn_ld from user data
      currency: currencySymbols("NGN"),
      image: NGN,
      label: "Naira Account",
    },
    {
      title: "USD",
      //@ts-ignore
      balance: currentUser?.usd_b || "0", // Using usd_ld from user data
      currency: currencySymbols("USD"),
      image: USD,
      label: "Dollar Account",
    },
    {
      title: "EUR",
      //@ts-ignore
      balance: currentUser?.eur_b || "0", // Using eur_ld from user data
      currency: currencySymbols("EUR"),
      image: EUR,
      label: "Euro Account",
    },
    {
      title: "GBP",
      //@ts-ignore
      balance: currentUser?.gbp_b || "0", // Using gbp_ld from user data
      currency: currencySymbols("GBP"),
      image: GBP,
      label: "Pounds Account",
    },
    {
      title: "NGN",
      //@ts-ignore
      balance: currentUser?.commission || "0", // Using ngn_ld for cashback too
      currency: currencySymbols("NGN"),
      image: COM,
      label: "Cashback",
    },
  ];
  //@ts-ignore
  const name = currentUser?.firstName;
  return (
    <div className="grid h-max grid-cols-6 gap-7 py-5">
      <div className=" col-span-6 flex flex-col gap-6   ">
        <div className="flex  gap-4  w-[calc(100%-280px)]">
          <div className=" flex-col flex gap-4 w-full">
            {/*** BENEFICIARY HEADER */}

            <div className="bg-secondary-500 p-6 rounded-[16px] w-full">
              <div className="flex px-16 justify-between items-center relative">
                <h3 className="text-[#FAF7FF] font-bold font-sora">
                  Send to your beneficiaries
                </h3>
                <div className="absolute max-w-[311px]  w-full left-[200px]">
                  <Image src={vector} alt="vector  object-center " />
                </div>

                <div className="flex items-center  -space-x-2">
                  {BeneficiaryList?.slice(0, 4).map((ben) => (
                    <Image
                      src={ben.image}
                      alt={ben.name}
                      className="w-10.5 h-10.5 cursor-pointer"
                      key={ben.id}
                      data-tooltip-id={`beneficiary-tooltip-${ben.id}`}
                      data-tooltip-content={ben.name}

                      // Don't forget to add a unique key prop
                    />
                  ))}
                  {BeneficiaryList?.length > 4 && (
                    <div className="flex items-center justify-center w-10.5 h-10.5 bg-primary-100 font-inter text-[14px] text-white rounded-full">
                      +{BeneficiaryList.length - 4}
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/***BALANCE SECTION */}

            <div className="w-full bg-white p-6 rounded-[16px] flex flex-col gap-10.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <h3 className="font-sora text-text-secondary-200 font-bold">
                    My Balances
                  </h3>

                  <div className="bg-primary-100 p-1.5 rounded-full flex justify-center items-center cursor-pointer text-white h-7 w-7">
                    <Eye />
                  </div>
                </div>

                <div className="flex gap-1 items-center text-[#B4ACCA] font-inter font-normal text-[14px]">
                  <Info fill="true" fillOpacity={0.5} color="#B4ACCA" />
                  View Details
                </div>
              </div>
              <div className="w-full overflow-auto flex-nowrap flex gap-6 [&::-webkit-scrollbar]:hidden">
                {BalanceChart?.map((_balance: any, index) => (
                  <Cards
                    title={_balance.label}
                    currency={_balance.currency}
                    balance={_balance.balance}
                    label={_balance.label}
                    image={_balance.image}
                    key={index}
                  />
                ))}
              </div>
            </div>

            <div className="w-full bg-white p-6 rounded-[16px] flex flex-col gap-10.5">
              <div className="flex justify-between items-center">
                <h3 className="font-sora font-bold text-text-secondary-200 text-[20px] ">
                  Transactions
                </h3>

                <span className="text-[#B4ACCA] text-base font-normal font-inter cursor-pointer">
                  See all
                </span>
              </div>
              <Table>
                <TableHeader className="bg-[#FAF7FF] border-b border-[#FAF7FF] text-[#9292A0] font-normal text-base py-4 px-6 rounded-xl">
                  <TableRow className="">
                    <TableHead>Date</TableHead>
                    <TableHead className="">Amount</TableHead>
                    <TableHead className="">TRX Type</TableHead>
                    <TableHead className=" ">Wallet </TableHead>
                    <TableHead className="">Description</TableHead>
                    <TableHead className="">Status</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  <TableRow>
                    <TableCell
                      colSpan={6} // Span all columns
                      className="text-center py-8" // Center text and add padding
                    >
                      <div className="flex justify-center">
                        <IsEmpty />
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="h-[100vh-220px]  flex fixed right-18 justify-end">
            <div className="h-full bg-white p-10.5 rounded-[24px] bottom-0 w-full max-w-[224px] right-0 flex flex-col gap-4 overflow-y-auto">
              {SideBarMenuList?.map((menu: any, index) => (
                <Image
                  src={menu?.image}
                  alt={menu.label}
                  className="object-center"
                  key={index}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
