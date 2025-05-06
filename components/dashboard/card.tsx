import { numberWithCommas } from "@/helper";
import Image from "next/image";
import { title } from "process";

interface dashboardProps {
  title: string;
  balance: string;
  currency: string;
  label: string;
  image: string;
}

const Cards = ({ title, balance, currency, label, image }: dashboardProps) => {
  return (
    <div className="basis-[324px] flex-grow flex-shrink-0  py-10.5 px-6 flex w-full gap-4 border rounded-[16px] border-[#FAF7FF]">
      <Image src={image} alt="" className="w-17 h-17" />

      <div className="flex flex-col gap-2">
        <span className="font-inter font-normal text-[14px] text-[#333951]">
          {label}
        </span>
        <h2 className="font-bold text-[#333951] text-[24px] font-sora">
          {currency}
          {numberWithCommas(balance)}
        </h2>
      </div>
    </div>
  );
};

export default Cards;
