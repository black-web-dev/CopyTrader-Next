import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

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
  const dispatch = useAppDispatch();
  const user = useSelector(selectUserdata);
  const filter = useSelector(selectFilter);

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
    <div className='bg-back-200 flex min-w-[250px] flex-col gap-3 py-2'>
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
  );
};

export default FilterSidebar;
