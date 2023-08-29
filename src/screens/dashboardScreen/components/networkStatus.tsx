import React from 'react';

import Arbitrum from '~/svg/arbitrum.svg';

const NetworkStatus = (): JSX.Element => {
  return (
    <div className='flex flex-col items-start gap-3'>
      <div className='font-bold text-white'>Network Status</div>
      <div className='bg-back-200 flex w-full gap-12 rounded p-5'>
        <div className='flex h-full flex-col justify-between gap-4'>
          <div className='flex flex-col gap-2'>
            <div className='flex items-center gap-1'>
              <div className='h-2 w-2 rounded-full bg-[#3AB275]'></div>
              <div className='text-xs'>Active</div>
            </div>
            <div className='flex items-center gap-2'>
              <Arbitrum className='h-12 w-12' />
              <div className='text-2xl font-bold'>Arbitrum</div>
            </div>
          </div>
          <div className='flex flex-col gap-1'>
            <div className='text-2xl'>$29,333.00</div>
            <div className='text-[#3AB275]'>-$37.00</div>
          </div>
        </div>
        <div className='flex flex-col gap-4'>
          <div className='flex items-center justify-between gap-2'>
            <div className='text-text-100 text-sm'>Volume</div>
            <div className='text-sm text-white'>$163,678,016</div>
          </div>
          <div className='flex items-center justify-between gap-2'>
            <div className='text-text-100 text-sm'>Market Cap</div>
            <div className='text-sm text-white'>$4,487,375,515</div>
          </div>
          <div className='flex items-center justify-between gap-2'>
            <div className='text-text-100 text-sm'>Average Gas Price</div>
            <div className='text-sm text-white'>30.6 GWEI</div>
          </div>
          <div className='flex items-center justify-between gap-2'>
            <div className='text-text-100 text-sm'>Latest Block</div>
            <div className='text-sm text-white'>31987218</div>
          </div>
          <div className='flex items-center justify-between gap-2'>
            <div className='text-text-100 text-sm'>Transfers</div>
            <div className='text-sm text-white'>480,315,851</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkStatus;
