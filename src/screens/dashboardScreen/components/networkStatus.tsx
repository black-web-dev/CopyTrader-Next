import clsx from 'clsx';
import numeral from 'numeral';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import Loader from '@/components/common/loader';

import { useAppDispatch } from '@/services';
import { selectUserdata } from '@/services/auth';
import {
  getChainInfoAsync,
  selectChainInfoStatus,
  selectIsFetching,
} from '@/services/dashboard';
import { classNames } from '@/utils';

import Arbitrum from '~/svg/arbitrum.svg';

const NetworkStatus = (): JSX.Element => {
  const isFetching = useSelector(selectIsFetching);
  const chainInfoStatus = useSelector(selectChainInfoStatus);

  const dispatch = useAppDispatch();
  const user = useSelector(selectUserdata);

  useEffect(() => {
    if (user?.id) {
      dispatch(getChainInfoAsync({ user_id: `${user.id}` }));
    }
  }, [dispatch, user]);

  return (
    <div className='flex flex-col items-start gap-3'>
      <div className='font-bold text-white'>Network Status</div>
      <div className='bg-back-200 relative flex w-full gap-8 rounded p-5'>
        {isFetching && (
          <div className='absolute inset-0 flex items-center justify-center bg-black/10'>
            <Loader size='40px' strokewidth={1} />
          </div>
        )}
        <div className='flex h-full flex-col justify-between gap-4'>
          <div className='flex flex-col gap-2'>
            <div className='flex items-center gap-1'>
              {isFetching && (
                <div className='h-4 w-20 animate-pulse rounded bg-gray-800'></div>
              )}
              {!isFetching && (
                <>
                  <div
                    className={clsx(
                      'h-2 w-2 rounded-full',
                      chainInfoStatus.active ? 'bg-[#3AB275]' : 'bg-red-600'
                    )}
                  ></div>
                  <div className='text-xs'>
                    {chainInfoStatus.active ? 'Active' : 'Inactive'}
                  </div>
                </>
              )}
            </div>
            <div className='flex items-center gap-2'>
              <Arbitrum className='h-12 w-12' />
              <div className='text-2xl font-bold'>Arbitrum</div>
            </div>
          </div>
          <div className='flex flex-col gap-1'>
            {isFetching && (
              <>
                <div className='h-6 w-24 animate-pulse rounded bg-gray-800'></div>
                <div className='h-3 w-20 animate-pulse rounded bg-gray-800'></div>
              </>
            )}
            {!isFetching && chainInfoStatus && (
              <>
                <div className='text-2xl'>
                  $
                  {numeral(chainInfoStatus.chain_info.arbPrice).format(
                    '0,0.[000]'
                  )}
                </div>
                <div
                  className={classNames(
                    chainInfoStatus.chain_info.arbPriceChange_24h
                      ? 'text-[#3AB275]'
                      : 'text-red-600'
                  )}
                >
                  {chainInfoStatus.chain_info.arbPriceChange_24h > 0 ? '' : '-'}
                  $
                  {numeral(
                    chainInfoStatus.chain_info.arbPriceChange_24h > 0
                      ? chainInfoStatus.chain_info.arbPriceChange_24h
                      : chainInfoStatus.chain_info.arbPriceChange_24h * -1
                  ).format('0,0.[00]')}
                </div>
              </>
            )}
          </div>
        </div>
        <div className='flex flex-col gap-4'>
          <div className='flex items-center justify-between gap-2'>
            <div className='text-text-100 whitespace-nowrap text-sm'>
              Volume
            </div>
            {isFetching && (
              <div className='h-4 w-24 animate-pulse rounded bg-gray-800'></div>
            )}
            {!isFetching && (
              <div className='text-sm text-white'>
                $
                {numeral(chainInfoStatus.chain_info.volume24h).format(
                  '0,0.[00]'
                )}
              </div>
            )}
          </div>
          <div className='flex items-center justify-between gap-2'>
            <div className='text-text-100 whitespace-nowrap text-sm'>
              Market Cap
            </div>
            {isFetching && (
              <div className='h-4 w-24 animate-pulse rounded bg-gray-800'></div>
            )}
            {!isFetching && (
              <div className='text-sm text-white'>
                $
                {numeral(chainInfoStatus.chain_info.marketCap).format(
                  '0,0.[00]'
                )}
              </div>
            )}
          </div>
          <div className='flex items-center justify-between gap-2'>
            <div className='text-text-100 whitespace-nowrap text-sm'>
              Average Gas Price
            </div>
            {isFetching && (
              <div className='h-4 w-12 animate-pulse rounded bg-gray-800'></div>
            )}
            {!isFetching && (
              <div className='text-sm text-white'>
                {numeral(chainInfoStatus.chain_info.avgGasPrice).format(
                  '0,0.[00]'
                )}
                GWEI
              </div>
            )}
          </div>
          <div className='flex items-center justify-between gap-2'>
            <div className='text-text-100 whitespace-nowrap text-sm'>
              Latest Block
            </div>
            {isFetching && (
              <div className='h-4 w-16 animate-pulse rounded bg-gray-800'></div>
            )}
            {!isFetching && (
              <div className='text-sm text-white'>
                {numeral(chainInfoStatus.chain_info.latestBlock).format(
                  '0,0.[00]'
                )}
              </div>
            )}
          </div>
          <div className='flex items-center justify-between gap-2'>
            <div className='text-text-100 whitespace-nowrap text-sm'>
              Transfers
            </div>
            {isFetching && (
              <div className='h-4 w-16 animate-pulse rounded bg-gray-800'></div>
            )}
            {!isFetching && (
              <div className='text-sm text-white'>480,315,851</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkStatus;
