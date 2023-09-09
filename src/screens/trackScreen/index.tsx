import React from 'react';

import FilterSidebar from './components/FilterSidebar';
import SearchAddress from './components/searchAddress';
import TrackTable from './components/trackTable';

export type FilterOptionsType = {
  [key: string]: any;
};

const TrackScreen = (): JSX.Element => {
  return (
    <div className='mx-auto flex h-full w-full max-w-6xl items-start justify-center gap-7 p-10'>
      <FilterSidebar />
      <div className='flex w-full flex-col'>
        <div className='mb-[26px] text-3xl font-medium'>Track</div>
        <SearchAddress />
        <div className='mt-[26px] text-base font-bold'>Select Top Traders</div>
        <TrackTable />
      </div>
    </div>
  );
};

export default TrackScreen;
