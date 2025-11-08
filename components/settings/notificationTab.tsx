'use client';

import { useState } from 'react';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NotificationTab() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    const newStatus = !isEnabled;
    setIsEnabled(newStatus);
    setLoading(true);

    try {
      // Example API request — change to your actual endpoint
      const token = localStorage.getItem('token');
      await axios.patch(
        'https://api.cardri.ng/api/update-notification',
        { notifications: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Notification preference updated successfully.');
    } catch (error) {
      console.error('Error updating notification preference:', error);
      // revert state if request fails
      setIsEnabled(!newStatus);
    } finally {
      setLoading(false);
    }
  };
  const router = useRouter();

  return (
    <div className='max-w-5xl mx-auto bg-white rounded-2xl lg:p-6 p-3 mb-4'>
      <button
        onClick={() => router.back()}
        className='flex items-center gap-2 text-[#242E3E] font-bold mb-6 font-sora'
      >
        <ArrowLeft size={18} />{' '}
        <span className='font-bold text-xl'>Notification</span>
      </button>
      <div className='border border-[#F4F0FF] rounded-2xl lg:p-6 p-2 flex items-center justify-between'>
        {/* Left Section */}
        <div className='flex items-center gap-4'>
          <div className='max-w-[56px] h-[56px] w-full rounded-xl bg-[#E7FFF2] flex items-center justify-center '>
            <svg
              width='20'
              height='20'
              viewBox='0 0 24 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M12 2C7.029 2 3 6.029 3 11C3 15.971 7.029 20 12 20C16.971 20 21 15.971 21 11C21 6.029 16.971 2 12 2ZM11 14H9V12H11V14ZM15 14H13V12H15V14Z'
                fill='#00C48C'
              />
            </svg>
          </div>
          <div>
            <h3 className='text-base font-semibold text-[#1B1B1B]'>
              Notifications
            </h3>
            <p className='text-sm text-[#8E8AA0]'>
              Toggle notifications on or off to control the notifications coming
              in
            </p>
          </div>
        </div>

        {/* Toggle Switch */}
        <label className='relative inline-flex items-center cursor-pointer'>
          <input
            type='checkbox'
            checked={isEnabled}
            onChange={handleToggle}
            disabled={loading}
            className='sr-only peer'
          />
          <div
            className={`w-11 h-6 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            } bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#CFC1FF] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#CFC1FF]`}
          ></div>
        </label>
      </div>
    </div>
  );
}
