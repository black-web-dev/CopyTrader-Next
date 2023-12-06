import React from 'react';
import { CgSortAz, CgSortZa } from 'react-icons/cg';

const SortHeader = ({
  label,
  onClick,
  isUp = false,
  isDown = false,
  className = '',
}: {
  label: string;
  onClick: () => void;
  isUp: boolean;
  isDown: boolean;
  className: string;
}) => (
  <div
    className={`${className} flex cursor-pointer flex-row items-center`}
    onClick={onClick}
  >
    <div className='mr-1 flex items-center'>
      {isDown && <CgSortZa className='fill-white' />}
      {isUp && <CgSortAz className='fill-white' />}
      {!isDown && !isUp && <CgSortZa className='fill-white' />}
    </div>
    <div className='text-xs'>{label}</div>
  </div>
);

export default SortHeader;
