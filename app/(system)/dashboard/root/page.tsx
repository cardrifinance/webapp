'use client';

import Image from 'next/image';
import vector from '@/public/assets/dashboard/vectorarrow.png';
import { BeneficiaryList, SideBarMenuList } from '@/lib/assets';
import { Tooltip } from 'react-tooltip';
import { Eye, Info } from 'lucide-react';
import Cards from '@/components/dashboard/card';
import {
  currencySymbols,
  getCurrencyByType,
  networkImage,
  networkName,
  transactionType,
} from '@/lib/misc';
import NGN from '@/public/assets/currencies/NGNCurrency.png';
import USD from '@/public/assets/currencies/DollarCurrency.png';

import GBP from '@/public/assets/currencies/PoundsCurrency.png';

import EUR from '@/public/assets/currencies/EurCurrency.png';
import COM from '@/public/assets/currencies/cashback.png';
import transactionLog from '@/public/assets/transaction/tranaction.png';
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { useUserStore } from '@/stores/currentUserStore';
import { useQuery } from '@tanstack/react-query';
import { getTransactions } from '@/services/lib';
import {
  filterTransactionsByType,
  getStatusText,
  getTextStatus,
  MonthlyTransactionGroup,
  numberWithCommas,
  Status,
} from '@/helper';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { getNetwork } from '@/services/intra-africa';
import Link from 'next/link';

const IsEmpty = () => {
  return (
    <div className='flex flex-col gap-4 my-10 items-center justify-center w-full h-full'>
      <Image
        src={transactionLog}
        alt='transaction log'
        className='w-[201px] h-[220px] object-center'
      />
      <h3 className='text-[#474256] font-inter text-[14px] font-normal'>
        You have no transaction yet!
      </h3>
    </div>
  );
};

const TransactionsTableSkeleton = () => {
  return (
    <div className='space-y-4'>
      {/* Header row skeleton */}
      <div className='flex justify-between items-center'>
        <Skeleton className='h-8 w-[200px]' />
        <Skeleton className='h-8 w-[100px]' />
      </div>

      {/* Table skeleton */}
      <div className='space-y-2'>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className='flex items-center justify-between p-4 border rounded-lg'
          >
            <div className='flex items-center space-x-4'>
              <Skeleton className='h-10 w-10 rounded-full' />
              <div className='space-y-2'>
                <Skeleton className='h-4 w-[120px]' />
                <Skeleton className='h-3 w-[80px]' />
              </div>
            </div>
            <div className='space-y-2 text-right'>
              <Skeleton className='h-4 w-[80px] ml-auto' />
              <Skeleton className='h-3 w-[60px] ml-auto' />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const currentUser = useUserStore((state) => state.user);
  //console.log("currentUser", currentUser);
  const {
    data: transactions,
    isLoading,
    isError,
    error,
  } = useQuery<MonthlyTransactionGroup[], Error>({
    queryKey: ['transactions'],
    queryFn: getTransactions,
  });

  const allTransactions =
    //@ts-ignore
    transactions?.flatMap((group) => group.transactions) || [];
  interface StatusPillProps {
    status: Status;
  }
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case '7':
        return 'bg-orange-500/5 text-[#FA9232] font-inter border-0 text-sm font-normal  p-[10px]';
      case '1':
        return 'bg-green-500/5   text-[#1FBA79] font-inter border-0 text-sm font-normal p-[10px]';
      case 'archived':
        return 'bg-red-500/5 border-red-500 text-red-500';
      case 'draft':
        return 'bg-gray-500/5 border-gray-500 text-gray-500';
      case '0':
      case '2':
        return ' font-inter text-sm border-0 text-red-500  bg-red-500/5 border-red-500 p-[10px] font-normal ';
    }
  };
  const StatusPill: React.FC<StatusPillProps> = ({ status }) => {
    return (
      <span
        className={cn(
          'inline-flex w-22 items-center justify-center rounded-full border px-2 py-1 text-xl font-medium',
          getStatusColor(status)
        )}
      >
        {getTextStatus(status)}
      </span>
    );
  };

  const BalanceChart = [
    {
      title: 'NGN',
      //@ts-ignore
      balance: currentUser?.ngn_b || '0', // Using ngn_ld from user data
      currency: currencySymbols('NGN'),
      //@ts-ignore
      ledger: currentUser?.ngn_ld,
      image: NGN,
      label: 'Naira Account',
    },
    {
      title: 'USD',
      //@ts-ignore
      balance: currentUser?.usd_b || '0', // Using usd_ld from user data
      currency: currencySymbols('USD'),
      //@ts-ignore
      ledger: currentUser?.usd_ld,
      image: USD,
      label: 'Dollar Account',
    },
    {
      title: 'EUR',
      //@ts-ignore
      balance: currentUser?.eur_b || '0', // Using eur_ld from user data
      currency: currencySymbols('EUR'),
      //@ts-ignore
      ledger: currentUser?.eur_ld,
      image: EUR,
      label: 'Euro Account',
    },
    {
      title: 'GBP',
      //@ts-ignore
      balance: currentUser?.gbp_b || '0', // Using gbp_ld from user data
      currency: currencySymbols('GBP'),
      //@ts-ignore
      ledger: currentUser?.gbd_ld,

      image: GBP,
      label: 'Pounds Account',
    },
    {
      title: 'NGN',
      //@ts-ignore
      balance: currentUser?.commission || '0', // Using ngn_ld for cashback too
      currency: currencySymbols('NGN'),
      image: COM,
      label: 'Cashback',
    },
  ];
  //@ts-ignore
  const name = currentUser?.firstName;
  return (
    <div className='flex w-full relative gap-7 py-5'>
      {/* MAIN CONTENT */}
      <div className='flex flex-col gap-6 w-full lg:w-[calc(100%-220px)] transition-all duration-300'>
        <div className='flex flex-col gap-4 w-full'>
          {/*** BENEFICIARY HEADER ***/}
          <div className='bg-secondary-500 p-6 rounded-[16px] lg:w-full'>
            <div className='flex lg:px-16 justify-between items-center relative'>
              <h3 className='text-[#FAF7FF] font-bold font-sora text-sm'>
                Send to your beneficiaries
              </h3>

              <div className='absolute lg:max-w-[311px] w-full lg:left-[200px] max-w-[134px] left-[50px]'>
                <Image src={vector} alt='vector object-center' />
              </div>

              <div className='flex items-center -space-x-2 w-full justify-end'>
                {BeneficiaryList?.slice(0, 4).map((ben) => (
                  <Image
                    src={ben.image}
                    alt={ben.name}
                    className='w-10.5 h-10.5 cursor-pointer'
                    key={ben.id}
                    data-tooltip-id={`beneficiary-tooltip-${ben.id}`}
                    data-tooltip-content={ben.name}
                  />
                ))}
                {BeneficiaryList?.length > 4 && (
                  <div className=' items-center flex justify-center w-[42px] h-[42px] bg-primary-100 font-inter text-[14px] text-white rounded-full'>
                    +{BeneficiaryList.length - 4}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/*** BALANCE SECTION ***/}
          <div className='w-full bg-white p-6 rounded-[16px] flex flex-col gap-10.5'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-6'>
                <h3 className='font-sora text-text-secondary-200 font-bold'>
                  My Balances
                </h3>

                <div className='bg-primary-100 p-1.5 rounded-full flex justify-center items-center cursor-pointer text-white h-7 w-7'>
                  <Eye />
                </div>
              </div>

              <div className='flex gap-1 items-center text-[#B4ACCA] font-inter font-normal text-[14px]'>
                <Info fill='true' fillOpacity={0.5} color='#B4ACCA' />
                View Details
              </div>
            </div>

            <div className='w-full overflow-auto flex-nowrap flex gap-6 [&::-webkit-scrollbar]:hidden'>
              {BalanceChart?.map((_balance: any, index) => (
                <Cards
                  title={_balance.label}
                  currency={_balance.currency}
                  balance={_balance.balance}
                  label={_balance.label}
                  ledger={_balance?.ledger}
                  image={_balance.image}
                  key={index}
                />
              ))}
            </div>
          </div>
          <div className='flex lg:hidden w-full overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
            <div
              className='h-full p-5 rounded-[24px] w-full right-0 flex gap-4 '
              style={{
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
              }}
            >
              {SideBarMenuList?.map((menu: any, index) => (
                <Image
                  src={menu?.image}
                  alt={menu.label}
                  className='object-center h-[140px] w-[148px]'
                  key={index}
                />
              ))}
            </div>
          </div>
          <div
            className='w-full bg-white p-6 rounded-[16px] flex flex-col gap-10.5 '
            style={{
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
            }}
          >
            <div className='flex justify-between items-center'>
              <h3 className='font-sora font-bold text-text-secondary-200 text-[20px]'>
                Transactions
              </h3>
              <Link
                href={'/transaction'}
                className='text-[#B4ACCA] text-base font-normal font-inter cursor-pointer'
              >
                See all
              </Link>
            </div>

            <Table
              className='w-full'
              style={{
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
              }}
            >
              {/* TABLE HEADER */}
              <TableHeader
                style={{
                  msOverflowStyle: 'none',
                  scrollbarWidth: 'none',
                }}
              >
                <TableRow
                  className='bg-[#FAF7FF] text-[#9292A0] text-base font-normal rounded-xl'
                  style={{
                    msOverflowStyle: 'none',
                    scrollbarWidth: 'none',
                  }}
                >
                  <TableHead className='xl:block hidden py-4 px-6'>
                    TRX ID
                  </TableHead>
                  <TableHead className='py-4 px-6'>Date</TableHead>
                  <TableHead className='py-4 px-6'>Amount</TableHead>
                  <TableHead className='py-4 px-6'>TRX Type</TableHead>
                  <TableHead className='py-4 px-6 w-[220px]'>
                    Beneficiary
                  </TableHead>
                  <TableHead className='py-4 px-6'>Status</TableHead>
                </TableRow>
              </TableHeader>

              {/* TABLE BODY */}
              <TableBody
                className='align-top'
                style={{
                  msOverflowStyle: 'none',
                  scrollbarWidth: 'none',
                }}
              >
                {allTransactions?.length > 0 ? (
                  allTransactions.slice(0, 10).map((transaction: any) => (
                    <TableRow
                      key={transaction.id}
                      className='font-inter lg:text-base text-sm text-[#474256] py-4 px-6 border-b border-[#FAF7FF] hover:bg-[#FAF7FF] cursor-pointer'
                    >
                      <TableCell className='xl:block hidden font-medium text-nowrap'>
                        {transaction.ref}
                      </TableCell>

                      <TableCell className='font-medium'>
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </TableCell>

                      <TableCell className='text-nowrap'>
                        {getCurrencyByType(transaction.type)}
                        {numberWithCommas(transaction.amount)}
                      </TableCell>

                      <TableCell className='text-nowrap'>
                        {transactionType(transaction.type)}
                      </TableCell>

                      {/* BENEFICIARY (Max 2 lines) */}
                      <TableCell className='text-nowrap line-clamp-2 break-words'>
                        <div className='w-full flex items-center gap-4'>
                          <div className='w-8 h-8 rounded-full '>
                            <Image
                              src={networkImage(
                                transaction.type === '1'
                                  ? transaction.network
                                  : transaction.type === '2'
                                  ? transaction.network
                                  : transaction.type || 1
                              )}
                              alt=''
                              className='object-center'
                            />
                          </div>
                          {transaction.reciever || transaction.phoneNumber}{' '}
                          <br />
                          {transaction.type === '6'
                            ? transaction.cref
                            : transaction.type === '12'
                            ? transaction.plan
                            : transaction.type === '1'
                            ? networkName(transaction.network)
                            : transaction.type === '2' &&
                              networkName(transaction.network)}
                        </div>
                      </TableCell>

                      <TableCell>
                        <StatusPill status={transaction.status} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className='text-center py-8'>
                      <div className='flex flex-col items-center gap-2'>
                        <IsEmpty />
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* SIDEBAR (fixed on desktop only) */}
      <div className='hidden lg:flex fixed right-0 top-[100px] h-[calc(100vh-120px)] justify-end w-[280px]'>
        <div className='h-full bg-white p-10.5 rounded-[24px] w-full max-w-[224px] right-0 flex flex-col gap-4 overflow-y-auto'>
          {SideBarMenuList?.map((menu: any, index) => (
            <Image
              src={menu?.image}
              alt={menu.label}
              className='object-center'
              key={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
