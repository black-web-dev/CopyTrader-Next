import React from 'react';

import NetworkStatus from './components/networkStatus';
import SearchInput from './components/searchInput';
import TopTraders from './components/topTraders';
import Transactions from './components/transactions';

const DashboardScreen = () => {
  return (
    <div className='mx-auto flex h-full w-full max-w-6xl flex-col items-center justify-center p-10'>
      <div className='flex w-full flex-col gap-y-[18px]'>
        <div className='text-3xl font-medium'>Dashboard</div>
        <SearchInput />
      </div>
      <div className='mt-[34px] flex w-full gap-10'>
        <div className='flex max-w-[600px] flex-col gap-7'>
          <NetworkStatus />
          <TopTraders />
        </div>
        <div className='w-full'>
          <Transactions />
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;
