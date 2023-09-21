import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import numeral from 'numeral';
import React, { useEffect } from 'react';
import { BiLinkExternal } from 'react-icons/bi';
import { useSelector } from 'react-redux';

import useDesktopMediaQuery from '@/hooks/useDesktopMediaQuery';
import useNotification from '@/hooks/useNotification';

import Loader from '@/components/common/loader';

import { useAppDispatch } from '@/services';
import { selectUserdata } from '@/services/auth';
import {
  getTopTradersAsync,
  selectIsFetchingTopTraders,
  selectTopTraderStatus,
} from '@/services/dashboard';
import { setLeader } from '@/services/trade';
import { shortAddress } from '@/utils';

const TopTraders = (): JSX.Element => {
  const router = useRouter();

  const isDesktop = useDesktopMediaQuery();
  const isFetchingTopTraders = useSelector(selectIsFetchingTopTraders);
  const topTraderStatus = useSelector(selectTopTraderStatus);

  const dispatch = useAppDispatch();
  const notification = useNotification();
  const user = useSelector(selectUserdata);

  useEffect(() => {
    if (user?.id) {
      dispatch(getTopTradersAsync({ user_id: `${user.id}` }));
    }
  }, [dispatch, user]);

  return (
    <div className='flex w-full flex-col items-start gap-3'>
      <div className='font-bold text-white'>Top Traders</div>
      <div className='bg-back-200 flex w-full gap-12 rounded p-5'>
        <table className='w-full'>
          <thead>
            <tr className='text-text-100 text-xs'>
              <td className='whitespace-nowrap p-1 text-left'>Address</td>
              <td className='whitespace-nowrap p-1 text-right'>
                Wallet Amount
              </td>
              <td className='whitespace-nowrap p-1 text-right'>PnL%</td>
              <td className='whitespace-nowrap p-1 text-right'>Win Rate</td>
              <td className='whitespace-nowrap p-1 text-center'></td>
            </tr>
          </thead>
          <tbody className='text-xs'>
            {!isFetchingTopTraders &&
              topTraderStatus.count > 0 &&
              topTraderStatus.data.map((row, i) => (
                <tr
                  key={i}
                  className={clsx(
                    'h-[50px] py-1',
                    i % 2 === 1 && 'bg-back-400'
                  )}
                >
                  <td className='px-2 py-1 text-center text-xs'>
                    <Link
                      href={`https://www.gmx.house/arbitrum/account/${row.account}`}
                      target='_blank'
                    >
                      <div className='flex items-center gap-1'>
                        {shortAddress(row.account, isDesktop ? 3 : 5)}
                        <BiLinkExternal />
                      </div>
                    </Link>
                  </td>
                  <td className='px-2 py-1 text-right text-xs'>
                    {numeral(row.size).format('0,0.[00]')}
                  </td>
                  <td className='px-2 py-1 text-right text-xs'>
                    {row.realisedpnl > 0 ? (
                      <div className='text-green-500'>
                        ${numeral(row.realisedpnl).format('0,0.[00]')}
                      </div>
                    ) : (
                      <div className='text-red-500'>
                        -${numeral(row.realisedpnl).format('0,0.[00]')}
                      </div>
                    )}
                  </td>
                  <td className='px-2 py-1 text-right text-xs'>
                    {numeral(row.win_loss).format('0,0.[00]')}%
                  </td>
                  <td className='px-2 py-1 text-center text-xs'>
                    <button
                      type='submit'
                      className='bg-primary-100 hover:bg-primary-100/50 flex w-full justify-center rounded px-3 py-1.5 text-xs font-semibold uppercase text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 active:scale-95'
                      onClick={() => {
                        dispatch(setLeader(row.account));
                        notification('Selected Leader address', 'success');
                        router.push('/');
                      }}
                    >
                      Copy
                    </button>
                  </td>
                </tr>
              ))}
            {!isFetchingTopTraders && topTraderStatus.count === 0 && (
              <tr>
                <td colSpan={5}>
                  <div className='flex min-h-[200px] items-center justify-center'>
                    No items
                  </div>
                </td>
              </tr>
            )}
            {isFetchingTopTraders && (
              <tr>
                <td colSpan={5}>
                  <div className='flex min-h-[200px] items-center justify-center'>
                    <Loader size='40px' strokewidth={1} />
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopTraders;
