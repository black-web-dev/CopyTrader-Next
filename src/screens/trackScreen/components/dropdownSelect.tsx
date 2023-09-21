import React, { ReactNode, useState } from 'react';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { useSelector } from 'react-redux';

import useDesktopMediaQuery from '@/hooks/useDesktopMediaQuery';

import { selectIsFetching } from '@/services/track';

import { OptionsType } from '../utils';
import { classNames } from '../../../utils';

const DropdownSelect = ({
  id,
  type,
  img,
  title,
  isExpanded,
  fixedValue = false,
  options,
  selectedOpt,
  onSelect,
  disabled,
}: {
  id: string;
  type: string;
  img: ReactNode;
  title: string;
  isExpanded?: boolean;
  fixedValue?: boolean;
  options: OptionsType[];
  selectedOpt?: string | number | number[];
  onSelect: (
    type: string,
    id: string,
    value: string | number | number[]
  ) => void;
  disabled: boolean;
}): JSX.Element => {
  const isDesktop = useDesktopMediaQuery();
  const [isOpened, setIsOpened] = useState(!isDesktop ? false : !!isExpanded);
  const isFetching = useSelector(selectIsFetching);

  return (
    <div className='flex flex-col'>
      <div
        className='hover:bg-back-300 z-10 flex cursor-default items-center justify-between px-5 py-3 hover:text-white'
        onClick={() => setIsOpened(!isOpened)}
      >
        <div className='flex items-center gap-4'>
          <div>{img}</div>
          <div className='text-sm capitalize'>{title}</div>
        </div>
        {isOpened ? <BsChevronUp /> : <BsChevronDown />}
      </div>
      <div
        className={classNames(
          'flex flex-col',
          isOpened
            ? 'ml-2 max-h-screen gap-4 px-5 py-3 opacity-100'
            : 'max-h-0 gap-0 p-0 opacity-0'
        )}
      >
        {options.map((opt, index) => {
          return (
            <div key={index} className='relative text-sm'>
              <input
                type='checkbox'
                id={id + '_' + opt.label + '_check'}
                className='peer hidden'
                aria-describedby={id + '_' + opt.label + '_check'}
                readOnly={fixedValue}
                disabled={disabled || isFetching}
                checked={
                  disabled
                    ? false
                    : fixedValue
                    ? fixedValue
                    : JSON.stringify(selectedOpt) === JSON.stringify(opt.value)
                }
                onChange={() => {
                  !isFetching && !fixedValue && onSelect(type, id, opt.value);
                }}
              />
              <label
                htmlFor={id + '_' + opt.label + '_check'}
                className={classNames(
                  'before:border-border peer-checked:after:bg-primary-100 relative ml-[10px] block h-5 pl-5 align-top before:absolute before:left-[-10px] before:top-0 before:block before:h-5 before:w-5 before:rounded before:border before:content-[""] peer-checked:after:absolute peer-checked:after:left-[-7px] peer-checked:after:top-[3px] peer-checked:after:block peer-checked:after:h-[14px] peer-checked:after:w-[14px] peer-checked:after:rounded-sm peer-checked:after:content-[""] dark:before:border-gray-700',
                  disabled || fixedValue || isFetching
                    ? 'cursor-not-allowed opacity-50'
                    : 'cursor-pointer'
                )}
              >
                <div className='flex items-start'>{opt.label}</div>
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DropdownSelect;
