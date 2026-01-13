'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import transactionLog from '@/public/assets/transaction/tranaction.png';
import { format } from 'date-fns';
import { Calendar as CalenderDate } from '@/components/ui/calendar';
import { Calendar,  Image as ImageIcon } from 'iconsax-react';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { FileCheck, FileText, FileX, Filter, Search, X } from 'lucide-react';
import {
  getTextStatus,
  MonthlyTransactionGroup,
  numberWithCommas,
  Status,
} from '@/helper';
import { getTransactions } from '@/services/lib';
import { getCurrencyByType, transactionType } from '@/lib/misc';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSearchParams } from 'next/navigation';
import TransactionsComponent from '@/components/transaction-component';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

import { Pagination, PaginationEllipsis, PaginationNext, PaginationPrevious, } from '@/components/ui/pagination';

interface StatusPillProps {
  status: Status;
}

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case '7':
      return ' text-[#474256] font-inter border-0 text-[10px] font-normal leading-[16px] p-[10px]';
    case '1':
      return '  text-[#474256] font-inter border-0 text-[10px] font-normal leading-[16px] p-[10px]';
    case 'archived':
      return 'bg-red-500/5 border-red-500 text-red-500';
    case 'draft':
      return 'bg-gray-500/5 border-gray-500 text-gray-500';
    case '0':
      return ' font-inter text-[10px] border-0 text-red-500';
  }
};

const StatusPill: React.FC<StatusPillProps> = ({ status }) => {
  return (
    <span
      className={cn(
        'inline-flex w-20 items-center justify-center rounded-full border px-2 py-1 text-xl font-medium',
        getStatusColor(status)
      )}
    >
      {getTextStatus(status)}
    </span>
  );
};

export default function TransactionsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [activeStatus, setActiveStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  const updateQueryParams = (key: string, value: string | null) => {
    const queryParams = new URLSearchParams(window.location.search);
    if (value) {
      queryParams.set(key, value);
    } else {
      queryParams.delete(key);
    }
    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}?${queryParams.toString()}`
    );
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    updateQueryParams('search', value);
  };

const { data: transactions, isLoading } = useQuery<
  { data: MonthlyTransactionGroup[]; total: number },
  Error
>({
  queryKey: ['transactions', page, pageSize, startDate, endDate, activeStatus, searchTerm],
  queryFn: () =>
    getTransactions({
      page,
      
      month: startDate ? new Date(startDate).getMonth() : undefined,

      year:  startDate ? new Date(startDate).getFullYear() : undefined,

     
      status: activeStatus,
    
    }).then((res) => ({
      data: res, // assuming res is MonthlyTransactionGroup[]
      total: res.length, // or your actual total if your API returns it
    })),
});


  const searchParams = useSearchParams();

  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '');
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');
    const statusParam = searchParams.get('status');

    setStartDate(startDateParam ? new Date(startDateParam) : null);
    setEndDate(endDateParam ? new Date(endDateParam) : null);
    setActiveStatus(statusParam || 'all');
  }, [searchParams]);

  const applyFilters = () => {
    const params = new URLSearchParams(window.location.search);
    params.set('status', activeStatus);
    if (startDate) params.set('startDate', startDate.toISOString());
    else params.delete('startDate');
    if (endDate) params.set('endDate', endDate.toISOString());
    else params.delete('endDate');
    window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`);
    setOpenFilter(false);
    setPage(1);
 
  };

  const clearAllFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setActiveStatus('all');
    const params = new URLSearchParams(window.location.search);
    params.delete('startDate');
    params.delete('endDate');
    params.delete('status');
    window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`);
    setPage(1);

  };

  const exportTransaction = (format: 'pdf' | 'xlsx' | 'csv' | 'image') => {
    getTransactions({
      page: 1,
      limit: 1000, // export all
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
      status: activeStatus,
      search: searchTerm,
      export: format,
    }).then((res: any) => {
      // download file
      const url = res.url; // assume endpoint returns URL
      const link = document.createElement('a');
      link.href = url;
      link.download = `transactions.${format}`;
      link.click();
    });
  };

  return (
    <div className='w-full flex flex-col gap-8'>
      <div className='justify-between items-center bg-white lg:p-4 p-2 rounded-xl mt-4'>
        <div className='rounded-2xl bg-white p-[14px] w-full'>
          {/* OPTIONS */}
          <div className='flex items-center justify-between'>
            <div className='flex lg:gap-4 justify-start items-center w-full'>
              <Select value={activeStatus} onValueChange={setActiveStatus}>
                <SelectTrigger className='w-[150px] rounded-full border border-gray-100 focus:outline-none bg-white focus:ring-0 focus:ring-offset-0 focus-visible:ring-0'>
                  <SelectValue placeholder='Status' />
                </SelectTrigger>
                <SelectContent className='bg-white border-0'>
                  <SelectGroup>
                    <SelectItem value='all'>All Transaction</SelectItem>
                    <SelectItem value='debit'>Debit</SelectItem>
                    <SelectItem value='credit'>Credit</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              {/* Export Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='outline' className='ml-4'>
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => exportTransaction('pdf')}>
                    <FileText size={16} className='mr-2' /> PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => exportTransaction('xlsx')}>
                    <FileX size={16} className='mr-2' /> XLSX
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => exportTransaction('csv')}>
                    <FileCheck size={16} className='mr-2' /> CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => exportTransaction('image')}>
                    <ImageIcon size={16} className='mr-2' /> Image
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Date Range */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant='outline' className='w-min justify-start gap-2 rounded-full px-3 text-sm'>
                  <Calendar size={16} />{' '}
                  {startDate && endDate
                    ? `${format(startDate, 'MMM dd, yyyy')} - ${format(endDate, 'MMM dd, yyyy')}`
                    : 'Select date range'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-2'>
                <CalenderDate
                  mode='range'
                  selected={{ from: startDate || undefined, to: endDate || undefined }}
                  onSelect={(range) => {
                    setStartDate(range?.from || null);
                    setEndDate(range?.to || null);
                  }}
                  numberOfMonths={1}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className='overflow-x-auto bg-white rounded-xl shadow-sm'>
        <TransactionsComponent
        //@ts-ignore
          data={transactions?.data}
          isLoading={isLoading}
          hasMore={hasMore}
        />
      </div>

      {/* Pagination */}
      {
      //@ts-ignore
      transactions && transactions.total > pageSize && (
        <Pagination className='justify-center mt-4'>
          <PaginationPrevious onClick={() => setPage((p) => Math.max(p - 1, 1))} />
            
          {
          //@ts-ignore
          Array.from({ length: Math.ceil(transactions.total / pageSize) }, (_, i) => (
            <PaginationEllipsis key={i} onClick={() => setPage(i + 1)}>{i + 1}</PaginationEllipsis>
          ))}
          <PaginationNext
            onClick={() =>
              setPage((p) => Math.min(p + 1, Math.ceil(
                //@ts-ignore
                transactions.total / pageSize)))
            }
          />
        </Pagination>
      )}
    </div>
  );
}

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
