import { Bell } from "lucide-react";
import Image from "next/image";
import Avater from "@/public/assets/avater/avater.png";
import { useUserStore } from "@/stores/currentUserStore";
import { usePathname } from "next/navigation";
const DashTopNav = () => {
  const currentUser = useUserStore((state) => state.user);
  //console.log("currentUser", currentUser);
  //@ts-ignore
  const name = currentUser?.firstName;

  const pathname = usePathname();

  const routeSegment = pathname?.split("/dashboard/")[1];
  let displayName = "";

  if (routeSegment && routeSegment !== "root") {
    displayName = routeSegment.replace(/-/g, " ");
  }

  return (
    <div className="w-full justify-between flex items-center bg-[#fff] py-6 pr-20  pl-[42px]">
      {displayName ? (
        <h2 className="text-secondary-500 font-sora font-bold text-2xl">
          {displayName}
        </h2>
      ) : (
        <div className="">
          <h2 className="text-secondary-500 font-sora font-bold text-2xl">
            Welcome {name}, 👋🏻
          </h2>

          <span className="text-[#9292A0] font-normal font-inter tracking-[0.5px]">
            Easily send, receive, and manage funds across multiple currencies.
          </span>
        </div>
      )}
      <div className="flex items-center gap-[42px]  relative">
        <div className="relative text-[#525071]">
          <Bell fill="true" size={28} />
          <span className="h-3 w-3 absolute -top-1.5 -right-1.5 text-white bg-primary-100 rounded-full flex justify-center items-center font-inter text-[6px]">
            {" "}
            2
          </span>
        </div>

        <div className="w-12 h-12 rounded-full border border-gray-400">
          <Image
            src={Avater}
            alt="Profile picture"
            className="object-center overflow-hidden rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

export default DashTopNav;
