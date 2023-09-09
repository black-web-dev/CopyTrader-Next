import React from 'react';
import { BiSearchAlt2 } from 'react-icons/bi';

const SearchInput = (): JSX.Element => {
  return (
    <div className='shadow-inputFocus flex items-center rounded bg-white/5 px-4 py-3'>
      <div className='text-text-100'>
        <BiSearchAlt2 className='text-text-100 h-6 w-5' />
      </div>
      <input
        className='block w-full border-0 bg-transparent px-2 text-white focus:outline-0 focus:ring-0 sm:text-sm sm:leading-6'
        id='search'
        name='search'
        type='text'
        placeholder='Search for addresses...'
      />
    </div>
  );
};
export default SearchInput;
