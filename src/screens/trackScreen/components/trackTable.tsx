import clsx from 'clsx';
import { useRouter } from 'next/router';
import numeral from 'numeral';
import React from 'react';
import { AiOutlineExclamationCircle } from 'react-icons/ai';
import { CgSortAz, CgSortZa } from 'react-icons/cg';
import { useSelector } from 'react-redux';

import useNotification from '@/hooks/useNotification';

import Loader from '@/components/common/loader';
import Pagination from '@/components/common/pagination';
import Tooltip from '@/components/common/tooltip';

import { useAppDispatch } from '@/services';
import {
  selectIsFetching,
  selectPage,
  selectPageSize,
  selectSort,
  selectTrackData,
  setPage,
  setSort,
  TrackItemType,
} from '@/services/track';
import { setLeader } from '@/services/trade';
import { shortAddress } from '@/utils';

import SortOption from './sort';

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

const Table = ({
  isFetching,
  data,
  sort,
  setSort,
}: {
  isFetching: boolean;
  data: TrackItemType[];
  sort: string;
  setSort: (sort: string) => void;
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const notification = useNotification();

  return (
    <div className='bg-back-200 w-full rounded p-2'>
      <table className='w-full'>
        <thead className='text-text-100 text-xs'>
          <tr>
            <th className='px-2 py-1 capitalize'>
              <div className='flex items-center gap-1'>
                <div>Address</div>
                <Tooltip
                  isTag={true}
                  position='top'
                  content='Trader wallet address'
                >
                  <AiOutlineExclamationCircle className='text-text-100' />
                </Tooltip>
              </div>
            </th>
            <th className='px-2 py-1 capitalize'>
              <SortHeader
                className='justify-center'
                label='Wallet Amount'
                isUp={sort === 'size-asc'}
                isDown={sort === 'size-desc'}
                onClick={() =>
                  setSort(sort === 'size-desc' ? 'size-asc' : 'size-desc')
                }
              />
            </th>
            <th className='px-2 py-1 capitalize'>
              <SortHeader
                className='justify-center'
                label='pnl'
                isUp={sort === 'realisedpnl-asc'}
                isDown={sort === 'realisedpnl-desc'}
                onClick={() =>
                  setSort(
                    sort === 'realisedpnl-desc'
                      ? 'realisedpnl-asc'
                      : 'realisedpnl-desc'
                  )
                }
              />
            </th>
            <th className='px-2 py-1 capitalize'>
              <SortHeader
                className='justify-center'
                label='win/Loss'
                isUp={sort === 'win_loss-asc'}
                isDown={sort === 'win_loss-desc'}
                onClick={() =>
                  setSort(
                    sort === 'win_loss-desc' ? 'win_loss-asc' : 'win_loss-desc'
                  )
                }
              />
            </th>
            <th className='px-2 py-1 capitalize'>
              <SortHeader
                className='justify-center'
                label='ratio'
                isUp={sort === 'ratio-asc'}
                isDown={sort === 'ratio-desc'}
                onClick={() =>
                  setSort(sort === 'ratio-desc' ? 'ratio-asc' : 'ratio-desc')
                }
              />
            </th>
            <th className='px-2 py-1 capitalize'>
              <SortHeader
                className='justify-center'
                label='Avg.Levarage'
                isUp={sort === 'avg_leverage-asc'}
                isDown={sort === 'avg_leverage-desc'}
                onClick={() =>
                  setSort(
                    sort === 'avg_leverage-desc'
                      ? 'avg_leverage-asc'
                      : 'avg_leverage-desc'
                  )
                }
              />
            </th>
            <th className='px-2 py-1 capitalize'>
              <SortHeader
                className='justify-center'
                label='Avg.Collateral'
                isUp={sort === 'avg_coll-asc'}
                isDown={sort === 'avg_coll-desc'}
                onClick={() =>
                  setSort(
                    sort === 'avg_coll-desc' ? 'avg_coll-asc' : 'avg_coll-desc'
                  )
                }
              />
            </th>
            <th className='px-2 py-1 capitalize'></th>
          </tr>
        </thead>
        <tbody className='text-xs'>
          {!isFetching &&
            data?.map((row, i) => (
              <tr
                key={i}
                className={clsx('h-[50px] py-1', i % 2 === 1 && 'bg-back-400')}
              >
                <th className='px-2 py-1 text-center text-xs'>
                  {shortAddress(row.account, 4)}
                </th>
                <td className='px-2 py-1 text-center text-xs'>
                  {numeral(row.size).format('0,0.[00]')}
                </td>
                <td className='px-2 py-1 text-center text-xs'>
                  {numeral(row.realisedpnl).format('0,0.[00]')}
                </td>
                <td className='px-2 py-1 text-center text-xs'>
                  {`${row.win}/${row.loss}`}
                </td>
                <td className='px-2 py-1 text-center text-xs'>
                  {numeral(row.win_loss).format('0.[00]')}%
                </td>
                <td className='px-2 py-1 text-center text-xs'>
                  {numeral(row.avg_leverage).format('0,0.[00]')}
                </td>
                <td className='px-2 py-1 text-center text-xs'>
                  {numeral(row.avg_coll).format('0,0.[00]')}
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
                    Copy Trade
                  </button>
                </td>
              </tr>
            ))}
          {isFetching && (
            <tr>
              <td colSpan={8}>
                <div className='flex min-h-[200px] items-center justify-center'>
                  <Loader size='40px' strokewidth={1.5} />
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const DataTable = ({ className }: { className: string }) => {
  const dispatch = useAppDispatch();
  const page = useSelector(selectPage);
  const pageSize = useSelector(selectPageSize);
  const sort = useSelector(selectSort);
  const trackData = useSelector(selectTrackData);
  const isFetching = useSelector(selectIsFetching);

  return (
    <div className={className}>
      <Table
        isFetching={isFetching}
        data={trackData.list}
        sort={sort}
        setSort={(v) => {
          dispatch(setSort(v));
        }}
      />
      {/* <div className='mt-10 flex items-center justify-center'>
        <div className='flex items-center gap-5 text-xs'>
          <div className='flex items-center gap-1'>
            <div>1/500</div>
            <div>
              <AiOutlineRight className='text-xs' />
            </div>
          </div>
        </div>
      </div> */}
      <div className='p-4 text-center'>
        <Pagination
          onPageChange={(v) => dispatch(setPage(v))}
          totalCount={trackData.count}
          currentPage={page}
          pageSize={pageSize}
        />
      </div>
    </div>
  );
};

const Transactions = () => {
  return (
    <div className='flex flex-col items-start gap-3'>
      <div className='flex w-full items-center justify-end'>
        <SortOption />
      </div>
      <div className='bg-back-200 flex w-full gap-12 rounded p-2'>
        <DataTable className='flex-1' />
      </div>
    </div>
  );
};

export default Transactions;
