'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useUserStore } from '@/stores/currentUserStore';
import profileAvatar from '@/public/assets/avater/avater5.png';
import { useState } from 'react';
import axios from 'axios';
import { GalleryAdd, GalleryEdit } from 'iconsax-react';

export default function ProfileForm() {
  const router = useRouter();
  const currentUser = useUserStore((state) => state.user);

  const [formData, setFormData] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    email: currentUser?.email || '',
    phoneNumber: currentUser?.phoneNumber || '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token'); // assuming you store JWT
      const response = await axios.post(
        'https://api.cardri.ng/api/updateprofile',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Profile updated:', response.data);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='bg-white rounded-2xl lg:px-6 px-3 py-11'>
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className='flex items-center gap-2 text-[#242E3E] font-bold mb-6 font-sora'
      >
        <ArrowLeft size={18} />{' '}
        <span className='font-bold text-xl'>Profile</span>
      </button>

      {/* Profile Image */}
      <div className='flex flex-col items-center mb-8 max-w-[785px] w-full mx-auto'>
        <div className='relative'>
          <Image
            src={profileAvatar}
            alt='Profile Avatar'
            className='w-24 h-24 rounded-full object-cover'
          />
          <div className='absolute bottom-0 right-0 bg-[#206CE1] p-1.5 rounded-full cursor-pointer w-[39px] h-[39px] text-white'>
            <GalleryEdit />
          </div>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className='grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[785px] w-full mx-auto'
      >
        <div>
          <label className='block text-base font-normal text-[#474256] mb-1'>
            First Name
          </label>
          <input
            type='text'
            name='firstName'
            value={formData.firstName}
            onChange={handleChange}
            placeholder='Enter your first name'
            className='w-full border border-gray-100 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-pink-500'
          />
        </div>

        <div>
          <label className='block text-base font-normal text-[#474256] mb-1'>
            Last Name
          </label>
          <input
            type='text'
            name='lastName'
            value={formData.lastName}
            onChange={handleChange}
            placeholder='Enter your last name'
            className='w-full border border-gray-100 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-pink-500'
          />
        </div>

        <div>
          <label className='block text-base font-normal text-[#474256] mb-1'>
            Email Address
          </label>
          <input
            type='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            placeholder='Enter your email address'
            className='w-full border border-gray-100 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-pink-500'
          />
        </div>

        <div>
          <label className='block text-base font-normal text-[#474256] mb-1'>
            Phone Number
          </label>
          <div className='flex items-center border border-gray-100 rounded-lg px-4 py-3 text-base'>
            <span className='mr-2'>🇳🇬</span>
            <input
              type='tel'
              name='phoneNumber'
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder='081012345678'
              className='w-full focus:outline-none'
            />
          </div>
        </div>

        {/* Full-width submit button */}
        <div className='md:col-span-2'>
          <button
            type='submit'
            disabled={loading}
            className={`mt-4 w-full bg-[#EB0055] text-white font-semibold py-3 rounded-lg ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Updating...' : 'Update'}
          </button>
        </div>
      </form>
    </div>
  );
}
