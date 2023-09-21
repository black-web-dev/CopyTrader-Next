import clsx from 'clsx';
import React, { useState } from 'react';

import { useAppDispatch } from '@/services';
import { selectIsFetching, setFilter } from '@/services/track';
import { useSelector } from 'react-redux';

type DurationType = {
  label: string;
  period: number;
};

const durations: DurationType[] = [
  {
    label: 'D',
    period: 86400,
  },
  {
    label: 'W',
    period: 86400 * 7,
  },
  {
    label: 'M',
    period: 86400 * 7 * 4,
  },
];

const Duration = (): JSX.Element => {
  const [selected, setSelected] = useState<number>(0);
  const dispatch = useAppDispatch();
  const isFetching = useSelector(selectIsFetching);

  const handleSelect = (index: number, item: DurationType) => () => {
    if (!isFetching) {
      setSelected(index);
      dispatch(setFilter({ period: item.period }));
    }
  };

  return (
    <>
      {durations.map((item, index) => (
        <div
          key={index}
          className={clsx(
            'text-sm',
            selected === index ? 'font-bold text-white' : 'text-text-100',
            isFetching ? 'cursor-not-allowed' : 'cursor-pointer'
          )}
          onClick={handleSelect(index, item)}
        >
          {item.label}
        </div>
      ))}
    </>
  );
};

const SortOption = () => {
  return (
    <div className='relative flex items-center gap-6'>
      {/* <Datepicker
        showShortcuts={true}
        popoverDirection='down'
        value={duration}
        onChange={(value) => setDuration(value)}
      /> */}
      <div className='flex items-center gap-[14px]'>
        <Duration />
      </div>
    </div>
  );
};

export default SortOption;
