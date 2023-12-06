import { Menu, Transition } from '@headlessui/react';
import clsx from 'clsx';
import numeral from 'numeral';
import React, { useEffect } from 'react';
import { BiChevronDown } from 'react-icons/bi';
import { useSelector } from 'react-redux';

import { useAppDispatch } from '@/services';
import {
  getETHDetailAsync,
  getPairDetailAsync,
  pairs,
  seCurrentPair,
  selectCurrentPair,
  selectCurrentPairDetail,
} from '@/services/pair';

const TIME_INTERVAL = 3;

const CurrencyList = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const currentPair = useSelector(selectCurrentPair);

  useEffect(() => {
    dispatch(getPairDetailAsync({ pair: currentPair }));
    dispatch(getETHDetailAsync());

    const time = setInterval(() => {
      dispatch(getPairDetailAsync({ pair: currentPair }));
      dispatch(getETHDetailAsync());
    }, TIME_INTERVAL * 1000);
    return () => {
      clearInterval(time);
    };
  }, [currentPair, dispatch]);

  return (
    <Menu as='div' className='relative ml-3'>
      <div>
        <Menu.Button className='flex items-center gap-x-2 rounded p-2 text-lg font-extrabold hover:outline-none'>
          <div>{currentPair?.label}</div>
          <BiChevronDown className='text-text-100 h-6 w-6' />
        </Menu.Button>
      </div>
      <Transition
        as={React.Fragment}
        enter='transition ease-out duration-100'
        enterFrom='transform opacity-0 scale-95'
        enterTo='transform opacity-100 scale-100'
        leave='transition ease-in duration-75'
        leaveFrom='transform opacity-100 scale-100'
        leaveTo='transform opacity-0 scale-95'
      >
        <Menu.Items className='border-border-200 bg-back-100 absolute left-0 z-10 w-48 origin-top-right rounded border py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
          {pairs.map((pair, index) => (
            <Menu.Item key={index}>
              {({ active }: { active: boolean }) => (
                <span
                  className={clsx(
                    active ? 'bg-back-300 text-white' : 'text-text-100',
                    'block cursor-pointer px-4 py-2 text-sm'
                  )}
                  onClick={() => dispatch(seCurrentPair(index))}
                >
                  {pair.label}
                </span>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

const CurrencyStatus = () => {
  const currentPairDetail = useSelector(selectCurrentPairDetail);

  return (
    <div className='pz-1 bg-back-200 flex w-full items-center gap-x-10 rounded py-1.5 font-medium tracking-tighter'>
      <CurrencyList />
      <div className='flex items-baseline gap-x-10'>
        <div className='flex flex-col items-center justify-center'>
          <div className='text-text-200 text-base'>
            {numeral(currentPairDetail.currentPrice).format('0,0.00')}
          </div>
          <div className='text-xs text-white opacity-70'>
            ${numeral(currentPairDetail.currentPrice).format('0,0.00')}
          </div>
        </div>
        <div className='flex flex-col items-center justify-center'>
          <div className='text-xs text-white opacity-70'>24h Change</div>
          <div
            className={clsx(
              'text-base',
              currentPairDetail.change > 0 ? 'text-primary-100' : 'text-red-800'
            )}
          >{`${numeral(currentPairDetail.change).format('0,0.00')}%`}</div>
        </div>
        <div className='flex flex-col items-center justify-center'>
          <div className='text-xs text-white opacity-70'>24h High</div>
          <div className='text-text-200 text-base'>
            {numeral(currentPairDetail.highPrice).format('0,0.00')}
          </div>
        </div>
        <div className='flex flex-col items-center justify-center'>
          <div className='text-xs text-white opacity-70'>24h Low</div>
          <div className='text-text-200 text-base'>
            {numeral(currentPairDetail.lowPrice).format('0,0.00')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyStatus;
