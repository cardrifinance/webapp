'use client';

import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from '@headlessui/react';
import React, { Fragment } from 'react';
import { XIcon } from 'lucide-react';

import { useSendMoneyModalOverlay } from '@/stores/overlay';
import SendMoneyWidget from '../widget/send-money-widget';

const SendMoneyModal = () => {
  const { open, setOpen } = useSendMoneyModalOverlay();

  return (
    <Transition show={open} as={Fragment}>
      <Dialog as='div' className='relative z-50' onClose={setOpen}>
        {/* Overlay Background */}
        <TransitionChild
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-gray-500/70 backdrop-blur-sm transition-opacity' />
        </TransitionChild>

        {/* Modal Content */}
        <div className='fixed inset-0 z-50 flex items-end justify-center overflow-y-auto lg:items-center'>
          <TransitionChild
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            enterTo='opacity-100 translate-y-0 sm:scale-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100 translate-y-0 sm:scale-100'
            leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
          >
            <DialogPanel
              className='
                relative transform overflow-hidden
                bg-[#F5F2FB] shadow-xl transition-all
                w-full sm:max-w-[526px]
                sm:my-8 rounded-t-[30px] lg:rounded-[30px]
                px-4 pt-5 pb-6 lg:px-[30px] lg:pb-[30px]
                h-[80vh] lg:h-auto
              '
            >
              {/* Header */}
              <div className='flex items-center justify-between mb-4'>
                <DialogTitle className='text-[20px] font-sora font-bold text-[#07052A]'>
                  Send Money
                </DialogTitle>
                <button
                  onClick={() => setOpen(false)}
                  className='h-10.5 w-10.5 flex items-center justify-center rounded-[12px] border border-[#6C757D] hover:bg-gray-100 transition'
                >
                  <XIcon color='#6C757D' size={20} />
                </button>
              </div>

              {/* Body */}
              <div className='h-full max-h-[calc(80vh-70px)] overflow-y-auto scrollbar-hide'>
                <SendMoneyWidget />
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};

export default SendMoneyModal;
