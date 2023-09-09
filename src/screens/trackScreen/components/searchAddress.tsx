import React from 'react';
import { AiOutlineExclamationCircle } from 'react-icons/ai';
import { useSelector } from 'react-redux';

import Tooltip from '@/components/common/tooltip';

import { useAppDispatch } from '@/services';
import { selectSearchAddress, setSearchAddress } from '@/services/track';

const SearchAddress = () => {
  const dispatch = useAppDispatch();
  const searchAddress = useSelector(selectSearchAddress);

  return (
    <div className='flex max-w-[500px] items-center gap-3'>
      <div className='shadow-inputFocus bg-back-200 flex flex-1 items-center rounded px-4 py-1'>
        <input
          className='block w-full border-0 bg-transparent px-2 text-white focus:outline-0 focus:ring-0 sm:text-sm sm:leading-6'
          id='search'
          name='search'
          type='text'
          placeholder='Enter An Addresses...'
          value={searchAddress}
          onChange={(e) => dispatch(setSearchAddress(e.target.value))}
        />
      </div>
      <Tooltip
        isTag={true}
        position='right'
        content='Enter the wallet address of a trader you wish to copy (optional)'
      >
        <AiOutlineExclamationCircle className='text-text-100' />
      </Tooltip>
    </div>
  );
};

export default SearchAddress;
