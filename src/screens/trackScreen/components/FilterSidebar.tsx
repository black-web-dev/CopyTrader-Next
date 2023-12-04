import React, { useEffect, useState } from 'react';
import { AiOutlineDoubleLeft } from 'react-icons/ai';
import { BsLayoutTextSidebar } from 'react-icons/bs';
import { useSelector } from 'react-redux';

import { useLaptopMediaQuery } from '@/hooks/useDesktopMediaQuery';

import { useAppDispatch } from '@/services';
import { selectUserdata } from '@/services/auth';
import {
  FilterType,
  getClosedPositionsAsync,
  getOpenedPositionsAsync,
  initialState,
  selectFilter,
  setFilter,
  setPage,
} from '@/services/track';
import { classNames } from '@/utils';

import DropdownSelect from './dropdownSelect';
import SlideBar from './slidebar';
import { FilterOptionType, filterOpts } from '../utils';

const FilterComponent = ({
  opt,
  disabled,
  value,
  onChange,
}: {
  opt: FilterOptionType;
  disabled: boolean;
  value?: string | number | number[];
  onChange: (
    type: string,
    id: string,
    value: string | number | number[]
  ) => void;
}) => {
  switch (opt.type) {
    case 'slidebar':
      return <SlideBar {...opt} value={value} setValue={onChange} />;
    default:
      return (
        <DropdownSelect
          {...opt}
          selectedOpt={value}
          disabled={disabled}
          onSelect={onChange}
        />
      );
  }
};

const FilterSidebar = () => {
  const isLaptop = useLaptopMediaQuery();
  const dispatch = useAppDispatch();
  const user = useSelector(selectUserdata);
  const filter = useSelector(selectFilter);

  const [isShow, setIsShow] = useState<boolean>(false);

  const handleSelectOptions = (
    type: string,
    id: string,
    value: string | number | number[]
  ) => {
    if (type === 'slidebar') {
      const updatedFilter = {
        ...filter,
        [id]:
          filter[id as keyof FilterType] === value
            ? initialState.filter[id as keyof FilterType]
            : value,
      };
      dispatch(setFilter(updatedFilter));
      dispatch(setPage(1));
    } else {
      const updatedFilter = {
        ...filter,
        [id]:
          filter[id as keyof FilterType] === value
            ? initialState.filter[id as keyof FilterType]
            : value,
      };
      dispatch(setFilter(updatedFilter));
      dispatch(setPage(1));
    }
  };

  useEffect(() => {
    const updatedFilter = {
      ...filter,
      user_id: `${user.id}`,
    };
    dispatch(setFilter(updatedFilter));
    dispatch(setPage(1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, user]);

  useEffect(() => {
    if (filter.user_id !== '0') {
      if (filter.status === 'close') {
        dispatch(getClosedPositionsAsync({ ...filter }));
      } else {
        dispatch(getOpenedPositionsAsync({ ...filter }));
      }
    }
  }, [dispatch, filter]);

  return (
    <>
      {isLaptop ? (
        <div className='bg-back-200 min-w-[250px] flex-col gap-3 rounded py-2'>
          {filterOpts.map((opt, index) => (
            <FilterComponent
              key={index}
              opt={opt}
              disabled={
                (opt.id === 'win_loss_min' && filter.status === 'open') ||
                (opt.id === 'side' && filter.status === 'close')
                  ? true
                  : false
              }
              value={filter[opt.id as keyof FilterType]}
              onChange={handleSelectOptions}
            />
          ))}
        </div>
      ) : (
        <div
          className={classNames(
            'fixed bottom-0 left-0 top-[64px] z-10 h-[calc(100vh_-_64px)] py-2 transition-all',
            isShow ? 'translate-x-[0px]' : 'translate-x-[-250px]'
          )}
        >
          <div className='flex h-full w-full'>
            <div
              className={classNames(
                'bg-back-200 no-scrollbar shadow-back-100 z-0 flex h-full w-[250px] flex-col gap-3 overflow-auto rounded py-2 shadow-xl'
              )}
            >
              {filterOpts.map((opt, index) => (
                <FilterComponent
                  key={index}
                  opt={opt}
                  disabled={
                    (opt.id === 'win_loss_min' && filter.status === 'open') ||
                    (opt.id === 'side' && filter.status === 'close')
                      ? true
                      : false
                  }
                  value={filter[opt.id as keyof FilterType]}
                  onChange={handleSelectOptions}
                />
              ))}
            </div>
            <div
              className={classNames(
                'text-text-100 cursor-pointer rounded-r px-3 py-4 text-xl transition-all hover:z-[-1px] hover:bg-white/10 hover:text-white',
                isShow ? 'hover:ml-[-4px]' : 'hover:ml-[5px]'
              )}
              onClick={() => setIsShow(!isShow)}
            >
              <div className='animate-pulse'>
                {isShow ? <AiOutlineDoubleLeft /> : <BsLayoutTextSidebar />}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FilterSidebar;
