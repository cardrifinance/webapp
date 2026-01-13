"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArchiveMinus, CloseCircle } from "iconsax-react";
import {
  
  X,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import Switch from "react-switch";
import bankLogo from "@/public/assets/cardripay/bank.png";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FaSpinner } from "react-icons/fa";
import {
  useBankModal,
  useLoadingSpinOverlay,
  usePaymentMethodOverlay,
  useTransactionPinOverlay,
} from "@/stores/overlay";
import {
  createDomPayment,
  createWirepayment,
  getBanks,
  resolveAccountInfo,
} from "@/services/bank";
import BankModal from "@/components/modal/bankModal";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { toast } from "sonner";
import { addUrlParam, updateUrlParams } from "@/lib/urlParams";
import rateLogo from "@/public/assets/beneficiary/exchange.png";
import feeLogo from "@/public/assets/beneficiary/fee.png";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { currencyImages, currencySymbols } from "@/lib/misc";
import { numberWithCommas } from "@/helper";
import { useManagementData } from "@/hooks/useManagementData";
import TransactionPinModal from "@/components/modal/transaction_pin_modal";
import { getRate } from "@/services/lib";
import { verifyTransactionPin } from "@/services/_request";
import LoaderModal from "../modal/request_sending_modal";


import PaymentMethodSelector from "../paymentMethodSelector";
import TransactionLastStage from "../navigation/TransactionLastStage";

const DomTransferPage = () => {
  const router = useRouter();
  const [userAccountInfo, setUserAccountInfo] = useState({});
  const { otp, setOpen: setOpenOtp, setOtp } = useTransactionPinOverlay();

 

  const [step, setstep] = useState(1);

  const searchParams = useSearchParams();

  const [openDrawer, setOpenDrawer] = useState(false);
  const { data, loading, refresh } = useManagementData();
  const { paymentMethodDetails, showMethod, setShowMethod } =
    usePaymentMethodOverlay();


  const handeMovetoNextStep = () => {
    const step = searchParams.get("step");

    //  console.log(step, "step");
    if (step && userAccountInfo) {
      setstep(parseInt(step) + 1);
      updateUrlParams({ step: "2" });
      // console.log(step, "step");
    }
  };

  useEffect(() => {
    const sendRequest = async () => {
      if (isSubmitting || isLoadings || isLoading) return;
      try {
        if (otp && otp.length === 4) {
          const toastId = toast.loading("Verifying pin...");

          //@ts-ignore
          
          await verifyTransactionPin(otp);
          toast.dismiss(toastId);
          setOpen(false);
          setOpenLoader(true);
          const response = await createDomPayment({
            amount: watch("amount"),
            firstName: watch('firstName'),
            lastName: watch("lastName"),
            currencyfrom: "NGN",
            
            account_number: watch("id"),
            bankName: bankDetails?.bankName,
            bank_code: bankDetails.bankCode,
            balanceType: paymentMethodDetails?.value,

            m: "web",
          });

          //@ts-ignore
          if (response.success === "false") {
            //@ts-ignore
            toast.error(response.message || "An unknown error occur");
            setOpen(false)
          } else {
            setstep(4);
            setOpenOtp(false);
            setOtp("")

            addUrlParam(
              "ref",
              //@ts-ignore
              response.data?.ref
            );
            addUrlParam("status", "success");
            toast.success("Account funding pending..");
          }
        }
      } catch (e) {
        
        //@ts-ignore
        if (e?.response?.data.success === "false 1") {
          toast.error("Incorrect PIN");
        } else {
          //@ts-ignore
          toast.error(
            //@ts-ignore
            e?.response?.data.message ||
              "Could not complete transaction, try again"
          );
        }
        setOpen(false)
        setOtp("")
        
      } finally {
        setOpenLoader(false);
      }
    };
    sendRequest();
  }, [otp]);
  const {
    data: bankList,
    isLoading,
    
  } = useQuery({
    queryKey: ["banks"], // Unique key for this query
    queryFn: getBanks, // Your fetch function
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  const { data: exchangeRate } = useQuery({
    queryKey: ["exchangeRate"],
    queryFn: () => getRate({ from: "USD", to: "NGN" }),
    staleTime: 3000,
  });

  type FormValues = {
    id: string;
    firstName: string;
    lastName:string;

    narration: string;
    amount: string;
    amountInNaira: string;
    type: string;
  };

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<FormValues>({
    defaultValues: {
      id: "",
      firstName:"",
      lastName:"",
      narration: "",
      amount: "",
      amountInNaira: "",
      type: "",
    },
  });
  const { open, setOpen, bankDetails } = useBankModal();

  const [isLoadings, setIsLoading] = useState(false);

  const { openLoader, setOpenLoader } = useLoadingSpinOverlay();


 

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    console.log(data, "data");
  };
  useEffect(() => {
    if (!bankDetails ) {
      setstep(1);
      updateUrlParams({ step: "1" });
    }
  }, [bankDetails ]);

  const ConfirmDrawer = ({ receiverAccountInfo, amount, narration }: any) => {
    const { data, loading, error, refresh } = useManagementData();
    const { open, setOpen } = useTransactionPinOverlay();


    return (
      <Drawer open={openDrawer} onOpenChange={setOpenDrawer}>
        <DrawerContent className="mx-auto max-w-[500px] bg-white rounded-tl-[24px] rounded-tr-[24px] border-0 focus-visible:outline-none">
          {/* Header */}
          <DrawerHeader className="relative bg-main-100 p-6 text-left text-white">
            <div className="mx-auto w-full max-w-[500px]">
              <DrawerTitle className="text-xl font-bold text-text-secondary-200 text-[20px] font-sora">
                Confirm Transaction
              </DrawerTitle>
            </div>
            <button
              onClick={() => setOpenDrawer(false)}
              className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#000]"
            >
              <X size={20} />
            </button>
          </DrawerHeader>

          {/* Body Content */}
          <div className="mx-auto w-full max-w-[614px] p-6">
            {/* Transaction Details */}
            <div className="space-y-4">
              <div className="w-full flex justify-center items-center">
                <h2 className="text-text-secondary-200 font-bold text-[32px] font-inter">
                  <sub>{currencySymbols("USD")}</sub>
                  {numberWithCommas(watch("amount").replace(",", ""))}
                </h2>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Amount in Naira:</span>
                <span className="font-medium">
                  <sub>{currencySymbols("NGN")}</sub>
                  {numberWithCommas(
                    parseFloat(watch("amount").replace(",", "")) *
                      exchangeRate?.rate
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Bank:</span>
                <span className="font-medium">
                  {" "}
                  {/*** @ts-ignore */}
                  {bankDetails && bankDetails?.bankName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Account Number:</span>
                <span className="font-medium">
                  {" "}
                  {/*** @ts-ignore */}
                  {watch("id")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Name:</span>
                <span className="font-medium">
                
                  {watch("firstName")}{" "}{watch("lastName")}
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="my-6 border-t border-gray-200" />

            {/* Total */}
            <div className="flex justify-between text-lg font-semibold">
              <span>Sub total:</span>

              {loading ? (
                <div className="h-5 w-20 animate-pulse rounded bg-gray-200" />
              ) : (
                <div className="flex gap-2">
                  <span className="font-medium">
                    <sub>{currencySymbols("USD")}</sub>
                    {numberWithCommas(
                      parseFloat(watch("amount").replace(",", "")) +
                        parseFloat(data?.domfee)
                    )}
                  </span>
                  <span>&asymp;</span>
                  <span className="font-medium">
                    <sub>{currencySymbols("NGN")}</sub>
                    {numberWithCommas(
                      parseFloat(
                        //@ts-ignore
                        parseFloat(watch("amount").replace(",", "")) +
                          parseFloat(data?.domfee)
                      ) * parseFloat(exchangeRate?.rate)
                    )}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex gap-3 items-center">
              <button
                onClick={() => setOpenDrawer(false)}
                className=" rounded-lg border border-gray-300 h-[60px] flex justify-center items-center  px-3  w-fit min-w-[120px] font-medium text-gray-700"
              >
                Cancel
              </button>
              <Button
                onClick={() => {
                  setOpenDrawer(false);
                  setOpen(true);
                }}
                className="w-full rounded-xl cursor-pointer  bg-primary-100 text-white font-inter font-medium text-[20px] h-[60px] flex justify-center items-center"
              >
                Confrim
              </Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    );
  };

  return (
    <>
      <div className="w-full mt-4">
        <div
          className="h-[calc(100vh-125px)] w-full flex flex-col-reverse overflow-auto "
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <div className="w-full max-w-[640px] mx-auto   rounded-tl-[42px] rounded-tr-[42px] flex flex-col gap-[42px] justify-center items-center">
            {step !== 4 && (
              <div className="flex w-full flex-col gap-4 justify-center items-center">
                <div className="w-full text-center">
                  <h1 className="text-secondary-500 text-[32px] text-center font-sora font-bold  leading-[48px]">
                    DOM Funding
                  </h1>
                  <span className="text-[14px] font-normal font-inter text-center  text-[#464646] leading-[28px] mt-4 inline-block">
                    Select a previous or send to a new recipient
                  </span>
                </div>
              </div>
            )}

            <div className="w-full bg-white rounded-tl-[42px] rounded-tr-[42px] lg:px-[72px] lg:pt-16 gap-6 p-[30px]">
              <form
                id="sign-up"
                className=" [&>label]:block flex flex-col gap-6"
                onSubmit={handleSubmit(onSubmit)}
              >
                {step === 1 && (
                  <>

                    <div className="flex items-center gap-3">
<Label htmlFor="first name" className="flex flex-col gap-4 ">
                      <span className="font-inter font-normal text-base text-label-100">
                        First name
                      </span>
                      <Input
                        {...register("firstName")}
                        name="firstName"
                        id="firstName"
                        type="text"
                        //   inputMode="numeric"
                        //   maxLength={10}
                        placeholder="Enter first name"
                        className="h-[60px]  py-[15] px-[16px] rounded-[10px] border border-[#faf7ff] outline-0  bg-[#FAF7FF] placeholder:text-base  placeholder:font-normal placeholder:text-placeholder-100  focus-visible:ring-[#faf7ff] focus-visible:ring-offset-0 placeholder:font-inter font-inter  text-base font-normal [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />

                      {errors.firstName && (
                        <p className="text-xs text-red-500 mt-3">
                          {errors.firstName.message}
                        </p>
                      )}
                    </Label>
                    <Label htmlFor="Email" className="flex flex-col gap-4 ">
                      <span className="font-inter font-normal text-base text-label-100">
                        First name
                      </span>
                      <Input
                        {...register("lastName")}
                        name="lastName"
                        id="lastName"
                        type="text"
                        //   inputMode="numeric"
                        //   maxLength={10}
                        placeholder="Enter last name"
                        className="h-[60px]  py-[15] px-[16px] rounded-[10px] border border-[#faf7ff] outline-0  bg-[#FAF7FF] placeholder:text-base  placeholder:font-normal placeholder:text-placeholder-100  focus-visible:ring-[#faf7ff] focus-visible:ring-offset-0 placeholder:font-inter font-inter  text-base font-normal [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />

                      {errors.lastName && (
                        <p className="text-xs text-red-500 mt-3">
                          {errors.lastName.message}
                        </p>
                      )}
                    </Label>
                      </div>
                    <Label htmlFor="account" className="flex flex-col gap-4 ">
                      <span className="font-inter font-normal text-base text-label-100">
                        Recipient account
                      </span>
                      <Input
                        {...register("id", {
                          required: "Account number is required",
                          maxLength: {
                            value: 10,
                            message: "Account number must be 10 digits",
                          },
                          minLength: {
                            value: 10,
                            message: "Account number must be 10 digits",
                          },
                          pattern: {
                            value: /^[0-9]{10}$/,
                            message: "Only numbers (0-9) allowed",
                          },
                        })}
                        name="id"
                        id="id"
                        type="number"
                        autoComplete="off"
                        inputMode="numeric"
                        maxLength={10}
                        placeholder="Enter your account number"
                        className="h-[60px] mt-4 py-[15] px-[16px] rounded-[10px] border border-[#faf7ff] outline-0  bg-[#FAF7FF] placeholder:text-base  placeholder:font-normal placeholder:text-placeholder-100  focus-visible:ring-[#faf7ff] focus-visible:ring-offset-0 placeholder:font-inter font-inter  text-base font-normal [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />

                      {errors.id && (
                        <p className="text-xs text-red-500 mt-3">
                          {errors.id.message}
                        </p>
                      )}
                    </Label>

                    <div>
                      <label
                        htmlFor="Bank"
                        className="font-inter font-normal text-base text-label-100"
                      >
                        Bank
                      </label>
                     
                       <Controller
  name="id"
  control={control}
  defaultValue={bankDetails?.bankCode || ''}
  render={({ field: { value, onChange } }) => {
    const selectedBank =
      bankDetails.bankName;
     
//
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="h-[60px] w-full mt-4 py-[15px] px-[16px] rounded-[10px] border border-[#faf7ff] outline-0 bg-[#FAF7FF] text-base font-normal font-inter flex items-center justify-between"
      >
        <span
          className={
            selectedBank ? 'text-[#07052A]' : 'text-[#B4ACCA]'
          }
        >
          {selectedBank ?? 'Select bank'}
        </span>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
    );
  }}
/>

                    
                      
                    </div>
                   

                    {/** @ts-ignore */}
                  
                  </>
                )}

                {step === 2 && (
                  <div className="flex flex-col gap-6">
                    <div className="py-[10px] px-4 bg-[#fff] border border-[#FAF7FF] rounded-[10px] flex gap-[10px] items-center justify-between">
                      <div className="flex gap-[10px] items-center">
                        <Image
                          src={bankLogo}
                          alt={bankDetails?.bankName}
                          className="w-10.5 h-10.5"
                        />

                        <div>
                          <h3 className="text-[#07052A] font-bold font-sora  text-[20px]">
                            {/***@ts-ignore */}
                            {watch('firstName')}{" "}{watch("lastName")}
                          </h3>

                          <div className="text-[#474256] font-normal font-inter text-[14px]">
                            <span className="text-[#474256] font-normal font-inter text-[14px]">
                              {bankDetails.bankName}
                            </span>{" "}
                            &nbsp;
                            {
                              <span className="text-[#474256] font-normal font-inter text-[14px]">
                                {/***@ts-ignore */}
                                {userAccountInfo.accountNumber}
                              </span>
                            }
                          </div>
                        </div>
                      </div>
                    </div>

                    <Label htmlFor="amount" className="flex flex-col gap-4">
                      <span className="font-inter font-normal text-base text-label-100">
                        Amount in (USD)
                      </span>

                      <div className="flex items-center gap-6 bg-[#FAF7FF] rounded-[10px]">
                        <div className="flex gap-2 items-center ml-2.5">
                          <Image
                            src={currencyImages("USD")}
                            alt=""
                            className="w-6 h-6 object-center"
                          />
                          <span className="text-[#474256] font-inter text-base font-bold">
                            {" "}
                            {currencySymbols("USD")}
                          </span>
                        </div>
                        <Input
                          {...register("amount", {
                            required: "Amount is required",
                            validate: (value) => {
                              const numValue = parseFloat(
                                value.replace(/,/g, "")
                              );
                              if (isNaN(numValue))
                                return "Please enter a valid number";
                              if (numValue <= 0)
                                return "Amount must be greater than 0";
                              return true;
                            },
                          })}
                          name="amount"
                          id="amount"
                          type="text"
                          inputMode="decimal"
                          placeholder="Enter amount"
                          className="h-[60px] py-[15] px-[16px] rounded-[10px] border border-[#faf7ff] outline-0 bg-[#FAF7FF] placeholder:text-base placeholder:font-normal placeholder:text-placeholder-100 focus-visible:ring-[#faf7ff] focus-visible:ring-offset-0 placeholder:font-inter font-inter text-base font-normal"
                          onChange={(e) => {
                            const { value, selectionStart } = e.target;

                            setValue(
                              "amountInNaira",
                              numberWithCommas(
                                //@ts-ignore
                                parseFloat(value) *
                                  parseFloat(exchangeRate?.rate)
                              )
                            );

                            // Remove all non-digit characters (keep numbers & decimal)
                            const rawValue = value.replace(/[^0-9.]/g, "");

                            // Split into parts (for decimal handling)
                            const parts = rawValue.split(".");
                            const integerPart = parts[0];
                            const decimalPart = parts[1] ? `.${parts[1]}` : "";

                            // Format integer part with commas
                            const formattedInteger = integerPart.replace(
                              /\B(?=(\d{3})+(?!\d))/g,
                              ","
                            );

                            const formattedValue =
                              formattedInteger + decimalPart;

                            e.target.value = formattedValue;

                            if (selectionStart !== null) {
                              const commaCount = (
                                formattedValue.match(/,/g) || []
                              ).length;
                              const originalCommaCount = (
                                value
                                  .substring(0, selectionStart)
                                  .match(/,/g) || []
                              ).length;
                              const cursorOffset =
                                commaCount - originalCommaCount;
                              const newCursorPosition =
                                selectionStart + cursorOffset;

                              // Use setTimeout to ensure the cursor update happens after React's state update
                              setTimeout(() => {
                                e.target.setSelectionRange(
                                  newCursorPosition,
                                  newCursorPosition
                                );
                              }, 0);
                            }
                          }}
                        />
                      </div>

                      {errors.amount && (
                        <p className="text-xs text-red-500 ">
                          {errors.amount.message}
                        </p>
                      )}
                    </Label>

                    <Label
                      htmlFor="amountInNaira"
                      className="flex flex-col gap-4"
                    >
                      <span className="font-inter font-normal text-base text-label-100">
                        Amount in (NGN)
                      </span>

                      <div className="flex items-center gap-6 bg-[#FAF7FF] rounded-[10px]">
                        <div className="flex gap-2 items-center ml-2.5">
                          <Image
                            src={currencyImages("NGN")}
                            alt=""
                            className="w-6 h-6 object-center"
                          />
                          <span className="text-[#474256] font-inter text-base font-bold">
                            {currencySymbols("NGN")}
                          </span>
                        </div>
                        <Input
                          {...register("amountInNaira", {
                            required: "Amount is required",
                            validate: (value) => {
                              const numValue = parseFloat(
                                value.replace(/,/g, "")
                              );
                              if (isNaN(numValue))
                                return "Please enter a valid number";
                              if (numValue <= 0)
                                return "Amount must be greater than 0";
                              return true;
                            },
                          })}
                          name="amountInNaira"
                          id="amountInNaira"
                          type="text"
                          readOnly
                          inputMode="numeric"
                          placeholder="Enter amount (e.g., 1,000,000)"
                          className="h-[60px] py-[15] px-[16px] rounded-[10px] border border-[#faf7ff] outline-0 bg-[#FAF7FF] placeholder:text-base placeholder:font-normal placeholder:text-placeholder-100 focus-visible:ring-[#faf7ff] focus-visible:ring-offset-0 placeholder:font-inter font-inter text-base font-normal"
                        />
                      </div>

                      {errors.amountInNaira && (
                        <p className="text-xs text-red-500">
                          {errors.amountInNaira.message}
                        </p>
                      )}
                    </Label>

                    <Label htmlFor="Email" className="flex flex-col gap-4 ">
                      <span className="font-inter font-normal text-base text-label-100">
                        Narration
                      </span>
                      <Input
                        {...register("narration")}
                        name="id"
                        id="id"
                        type="text"
                        //   inputMode="numeric"
                        //   maxLength={10}
                        placeholder="Enter narration"
                        className="h-[60px]  py-[15] px-[16px] rounded-[10px] border border-[#faf7ff] outline-0  bg-[#FAF7FF] placeholder:text-base  placeholder:font-normal placeholder:text-placeholder-100  focus-visible:ring-[#faf7ff] focus-visible:ring-offset-0 placeholder:font-inter font-inter  text-base font-normal [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />

                      {errors.id && (
                        <p className="text-xs text-red-500 mt-3">
                          {errors.id.message}
                        </p>
                      )}
                    </Label>

                    <PaymentMethodSelector
                      control={control}
                      paymentMethodDetails={paymentMethodDetails}
                      setShowMethod={setShowMethod}
                    />
                  </div>
                )}

                {step === 2 && (
                  <div className="flex items-center gap-6 justify-between">
                    <div className="flex items-center p-4 gap-6">
                      <Image
                        src={rateLogo}
                        alt="rate"
                        className="w-7 h-7 object-center"
                      />

                      <span className="text-[#07052A] font-inter font-normal text-sm">
                        Rate: 1{currencySymbols("USD")}={" "}
                        {currencySymbols("NGN")}
                        {numberWithCommas(exchangeRate?.rate)}
                      </span>
                    </div>

                    <div className="flex items-center p-4 gap-6">
                      <Image
                        src={feeLogo}
                        alt="rate"
                        className="w-7 h-7 object-center"
                      />

                      <span className="text-[#07052A] font-inter font-normal text-sm">
                        {currencySymbols("USD")}
                        {numberWithCommas(data?.domfee)}
                      </span>
                    </div>
                  </div>
                )}
                {step === 1 && (
                  <Button
                    type="submit"
                    onClick={handeMovetoNextStep}
                    disabled={bankDetails.bankName ==""}
                    className="w-full rounded-xl mb-20 cursor-pointer mt-4 bg-primary-100 text-white font-inter font-medium text-[20px] h-[60px] flex justify-center items-center"
                  >
                    Continue
                  </Button>
                )}
                {step === 2 && (
                  <Button
                    type="submit"
                    onClick={() => setOpenDrawer(true)}
                    disabled={isSubmitting}
                    className="w-full rounded-xl mb-20 cursor-pointer mt-4 bg-primary-100 text-white font-inter font-medium text-[20px] h-[60px] flex justify-center items-center"
                  >
                    Continue
                  </Button>
                )}
                {step === 4 && <TransactionLastStage />}
              </form>
            </div>
          </div>
        </div>

        {/*** BANK MODAL */}

        <ConfirmDrawer
          receiverAccountInfo={userAccountInfo}
          amount={watch("amount")}
          narration={watch("narration")}
        />

        <BankModal bankList={bankList} />

        <LoaderModal />

        <TransactionPinModal />
      </div>
    </>
  );
};

export default DomTransferPage;
