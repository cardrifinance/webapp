'use client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArchiveMinus, CloseCircle, Warning2 } from 'iconsax-react';
import {
  ArrowLeft,
  CheckCheckIcon,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  Copy,
  InfoIcon,
  X,
} from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import Switch from 'react-switch';
import bankLogo from '@/public/assets/bill/9pbs.png';
import bankLogo2 from '@/public/assets/bill/sfb.png';
import rateLogo from '@/public/assets/beneficiary/exchange.png';
import feeLogo from '@/public/assets/beneficiary/fee.png';

import { cn } from '@/lib/utils';
import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { FaExchangeAlt, FaSpinner } from 'react-icons/fa';
import {
  useBankModal,
  useLoadingSpinOverlay,
  usePaymentMethodOverlay,
  usePaymentTypeChina,
  useTransactionPinOverlay,
  useWireBeneficiaryDetailsOverlay,
} from '@/stores/overlay';
import {
  createChinaPayment,
  createWirepayment,
  getBanks,
  resolveAccountInfo,
} from '@/services/bank';
import BankModal from '@/components/modal/bankModal';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { toast } from 'sonner';
import { addUrlParam, updateUrlParams } from '@/lib/urlParams';

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { currencyImages, currencySymbols } from '@/lib/misc';
import { numberWithCommas } from '@/helper';
import { useManagementData } from '@/hooks/useManagementData';
import TransactionPinModal from '@/components/modal/transaction_pin_modal';

import { verifyTransactionPin } from '@/services/_request';
import { createPaymentLink } from '@/services/payment_link';
import LoaderModal from '@/components/modal/request_sending_modal';
import CurrencyModal from '@/components/modal/curency-modal';
import { getRate } from '@/services/lib';
import { swapRequest } from '@/services/swap';
import TransactionLastStage from '@/components/navigation/TransactionLastStage';
import { useUserStore } from '@/stores/currentUserStore';

const DepositDetails = () => {
  const router = useRouter();
  const [userAccountInfo, setUserAccountInfo] = useState({});

  const { id } = useParams();
  console.log(id);
  const [amount, setAmount] = useState('');
  const [narration, setNarration] = useState('');
  const { setOtp } = useTransactionPinOverlay();

  const { data: managementData } = useManagementData();
  const { openLoader, setOpenLoader } = useLoadingSpinOverlay();
  const queryClient = useQueryClient();

  const [step, setstep] = useState(1);
  const [openDrawer, setOpenDrawer] = useState(false);

  const [fromCurrency, setFromCurrency] = useState('NGN');
  const [toCurrency, setToCurrency] = useState('USD'); // Default to USD for demo

  const { otp } = useTransactionPinOverlay();

  const currentUser = useUserStore((state) => state.user);

  type FormValues = {
    narration: string;
    fromAmount: string;
    toAmount: string;
    purpose: string;
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    trigger,
  } = useForm<FormValues>({
    defaultValues: {
      narration: '',
      fromAmount: '',
      toAmount: '',
      purpose: '',
    },
  });

  // Fetch exchange rate
  const {
    data: rateData,
    isLoading: isRateLoading,
    error: rateError,
  } = useQuery({
    queryKey: ['exchangeRate', fromCurrency, toCurrency, watch('fromAmount')],
    queryFn: async () => {
      if (!watch('fromAmount') || parseFloat(watch('fromAmount')) <= 0)
        return null;

      const amount = parseFloat(watch('fromAmount').replace(/,/g, ''));
      const response = await getRate({
        from: fromCurrency,
        to: toCurrency,
        amount,
      });

      return response;
    },
    enabled:
      !!fromCurrency &&
      !!toCurrency &&
      !!watch('fromAmount') &&
      parseFloat(watch('fromAmount')) > 0,
    refetchInterval: 60000,
    staleTime: 30000,
  });
  console.log(currentUser);

  const handleBankDetails = (bankId: number) => {
    if (bankId === 1) {
      router.push('/cardri-pay/deposit/9psb');
    }
    if (bankId === 2) {
      if (!currentUser?.accountNumber2Status) {
        toast.error(
          'You do not have a Safe Heaven MFB account. Please contact support to create one.'
        );
      } else {
        router.push('/cardri-pay/deposit/safe-heaven');
      }
    }
  };
  const bankDetails = [
    {
      id: '9psb',
      image: bankLogo,
      accountNumber: currentUser?.bank,
      //@ts-ignore
      accountName: currentUser?.accountName,
      Name: ' 9 Payment Service Bank  (9PSB)',
      alert: ' Free funding',
    },
    {
      id: 'sfb',
      image: bankLogo,
      accountNumber: currentUser?.accountNumber2,
      //@ts-ignore
      accountName: currentUser?.accountName2,
      Name: 'SafeHeaven MFB',
      alert: '0.5% funding fee',
    },
  ];
  const filteredAccount = bankDetails.filter((item) => item.id === id);

  // console.log(filteredAccount);
  useEffect(() => {
    const sendRequest = async () => {
      if (isSubmitting || isRateLoading) return;
      try {
        if (otp && otp.length === 4) {
          await verifyTransactionPin(otp);

          const formData = new FormData();
          setOpenLoader(true);

          formData.append('currencyfrom', fromCurrency);

          formData.append('amount', watch('fromAmount').replaceAll(',', ''));
          const response = await swapRequest(formData);

          console.log(response);
          setstep(4);
          updateUrlParams({ step: '2' });
          setOpenDrawer(false);

          //    setOpen(false);
          setOtp('');

          addUrlParam('status', 'success');
          //setPaymentDetails(null);
          //setPaymentMethodDetails(null);
        }
      } catch (e) {
        console.log(e);
        toast.error('An error occurred while processing your request');
      } finally {
        setOpenLoader(false);
        // setOpen(false);
      }
    };
    sendRequest();
  }, [otp]);
  // ... (keep existing useEffect hooks and other functions)

  const ConfirmDrawer = ({ receiverAccountInfo, amount, narration }: any) => {
    const { open, setOpen } = useTransactionPinOverlay();

    return (
      <Drawer open={openDrawer} onOpenChange={setOpenDrawer}>
        <DrawerContent className='mx-auto max-w-[500px] bg-white rounded-tl-[24px] rounded-tr-[24px] border-0 focus-visible:outline-none'>
          <DrawerHeader className='relative bg-main-100 p-6 text-left text-white'>
            <div className='mx-auto w-full max-w-[500px]'>
              <DrawerTitle className='text-xl font-bold text-text-secondary-200 text-[20px] font-sora'>
                Confirm Transaction
              </DrawerTitle>
            </div>
            <button
              onClick={() => setOpenDrawer(false)}
              className='absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#000]'
            >
              <X size={20} />
            </button>
          </DrawerHeader>

          <div className='mx-auto w-full max-w-[614px] p-6'>
            <div className='space-y-4'>
              <div className='w-full flex justify-center items-center'>
                <h2 className='text-text-secondary-200 font-bold text-[32px] font-inter'>
                  <sub>{currencySymbols(fromCurrency)}</sub>
                  {numberWithCommas(watch('fromAmount').replace(',', ''))}
                </h2>
              </div>

              <div className='flex justify-between'>
                <span className='text-gray-500'>You'll receive:</span>
                <span className='font-medium'>
                  {currencySymbols(toCurrency)}
                  {numberWithCommas(watch('toAmount'))}
                </span>
              </div>

              <div className='flex justify-between'>
                <span className='text-gray-500'>Exchange rate:</span>
                <span className='font-medium'>
                  1{currencySymbols(fromCurrency)} ={' '}
                  {rateData?.rate?.toFixed(6)} {currencySymbols(toCurrency)}
                </span>
              </div>

              <div className='flex justify-between'>
                <span className='text-gray-500'>Fee:</span>
                <span className='font-medium'>
                  {currencySymbols(fromCurrency)}
                  {numberWithCommas(managementData?.wirefee || 0)}
                </span>
              </div>
            </div>

            <div className='mt-8 flex gap-3 items-center'>
              <button
                onClick={() => setOpenDrawer(false)}
                className='rounded-lg border border-gray-300 h-[60px] flex justify-center items-center px-3 w-fit min-w-[120px] font-medium text-gray-700'
              >
                Cancel
              </button>
              <Button
                onClick={() => {
                  setOpenDrawer(false);
                  setOpen(true);
                }}
                className='w-full rounded-xl cursor-pointer bg-primary-100 text-white font-inter font-medium text-[20px] h-[60px] flex justify-center items-center'
              >
                Confirm
              </Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    );
  };

  return (
    <div className='w-full mt-4'>
      <div
        className='h-[calc(100vh-125px)] w-full flex flex-col-reverse overflow-auto'
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className='w-full max-w-[640px] mx-auto rounded-tl-[42px] rounded-tr-[42px] flex flex-col gap-[42px] justify-center items-center'>
          <div className='flex w-full flex-col gap-4 justify-center items-center'>
            <div className='w-full text-center  max-w-[528px]'>
              <h1 className='text-secondary-500 text-[32px] text-center font-sora font-bold leading-[48px]'>
                Bank Transfer
              </h1>
              <span className='text-[18px] font-normal font-inter text-center text-[#464646] leading-[28px] mt-2 inline-block'>
                Your personalised bank account details is shown below. Copy the
                account details to fund your wallet.
              </span>
            </div>
          </div>

          <div className='w-full bg-white rounded-tl-[42px] rounded-tr-[42px] lg:px-[72px] lg:pt-16 gap-6 p-[30px]  h-[calc(100vh-250px)] '>
            <div className='flex flex-col gap-6'>
              {filteredAccount?.map((item) => (
                <>
                  <div
                    className='p-4 border border-[#FAF7FF] relative rounded-2xl flex items-center justify-between cursor-pointer'
                    onClick={() => handleBankDetails(1)}
                  >
                    <div className='flex items-center gap-4'>
                      <Image
                        src={item.image}
                        alt=''
                        className='w-11 h-11 object-center'
                      />

                      <span className='text-base text-[#07052A] font-inter font-normal'>
                        {item?.Name}
                      </span>
                    </div>
                    <span className='text-[#1FBA79] font-inter font-normal text-sm'>
                      {item.alert}
                    </span>
                  </div>

                  <div className='flex justify-between items-center py-6 px-4 '>
                    <span className='text-[#1B1B1B] font-normal text-start text-sm  font-inter'>
                      Account Name
                    </span>
                    <span className='text-[#1B1B1B] text-end font-semibold text-sm  font-inter'>
                      {item?.accountName}
                    </span>
                  </div>
                  <div className='flex justify-between items-center py-6 px-4'>
                    <span className='text-[#1B1B1B] font-normal text-sm text-start  font-inter'>
                      Account Number
                    </span>
                    <span className='text-[#1B1B1B] font-semibold text-sm flex items-center gap-2 text-end font-inter'>
                      {item?.accountNumber}{' '}
                      <Copy
                        className='text-primary-100 cursor-pointer'
                        onClick={() => {
                          if (!item?.accountNumber) return;
                          navigator.clipboard.writeText(item.accountNumber);
                        }}
                      />
                    </span>
                  </div>
                </>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ConfirmDrawer
        receiverAccountInfo={userAccountInfo}
        amount={amount}
        narration={narration}
      />
    </div>
  );
};

export default DepositDetails;
