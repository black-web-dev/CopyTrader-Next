import clsx from 'clsx';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import numeral from 'numeral';
import React, { useEffect } from 'react';
import { BiLinkExternal } from 'react-icons/bi';
import { CgSortAz, CgSortZa } from 'react-icons/cg';
import { useSelector } from 'react-redux';

import Loader from '@/components/common/loader';
import Pagination from '@/components/common/pagination';

import { useAppDispatch } from '@/services';
import { selectUserdata } from '@/services/auth';
import {
  getTransactionsAsync,
  selectIsFetchingTransactions,
  selectLimit,
  selectOffset,
  selectSort,
  selectTransactionData,
  setOffset,
  setSort,
  TransactionType,
} from '@/services/dashboard';
import { shortAddress } from '@/utils';

export const PRETTY_DATE_FORMAT = 'd/M/yyyy';

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
  data: TransactionType[];
  sort: string;
  setSort: (sort: string) => void;
}) => {
  return (
    <div className='bg-back-200  w-full rounded p-2'>
      <table className='w-full'>
        <thead className='text-text-100 text-sm'>
          <tr>
            <th className='px-2 py-1'>
              <SortHeader
                className='justify-center'
                label='Time'
                isUp={sort === 'timestamp-asc'}
                isDown={sort === 'timestamp-desc'}
                onClick={() =>
                  setSort(
                    sort === 'timestamp-desc'
                      ? 'timestamp-asc'
                      : 'timestamp-desc'
                  )
                }
              />
            </th>
            <th className='px-2 py-1'>
              <SortHeader
                className='justify-center'
                label='Wallet Address'
                isUp={sort === 'account-asc'}
                isDown={sort === 'account-desc'}
                onClick={() =>
                  setSort(
                    sort === 'account-desc' ? 'account-asc' : 'account-desc'
                  )
                }
              />
            </th>
            <th className='px-2 py-1'>
              <SortHeader
                className='justify-center'
                label='Token'
                isUp={sort === 'index_token-asc'}
                isDown={sort === 'index_token-desc'}
                onClick={() =>
                  setSort(
                    sort === 'index_token-desc'
                      ? 'index_token-asc'
                      : 'index_token-desc'
                  )
                }
              />
            </th>
            <th className='px-2 py-1'>
              <SortHeader
                className='justify-end'
                label='Size Delta'
                isUp={sort === 'size_delta-asc'}
                isDown={sort === 'size-desc'}
                onClick={() =>
                  setSort(
                    sort === 'size-desc' ? 'size_delta-asc' : 'size_delta-desc'
                  )
                }
              />
            </th>
            <th className='px-2 py-1'>
              <SortHeader
                className='justify-end'
                label='Collateral Delta'
                isUp={sort === 'collateral_delta-asc'}
                isDown={sort === 'collateral_delta-desc'}
                onClick={() =>
                  setSort(
                    sort === 'collateral_delta-desc'
                      ? 'collateral_delta-asc'
                      : 'collateral_delta-desc'
                  )
                }
              />
            </th>
            <th className='px-2 py-1'>
              <SortHeader
                className='justify-end'
                label='tx hash'
                isUp={sort === 'transaction_hash-asc'}
                isDown={sort === 'transaction_hash-desc'}
                onClick={() =>
                  setSort(
                    sort === 'transaction_hash-desc'
                      ? 'transaction_hash-asc'
                      : 'transaction_hash-desc'
                  )
                }
              />
            </th>
          </tr>
        </thead>
        <tbody className='text-xs'>
          {!isFetching &&
            data?.map((row, i) => {
              return (
                <tr
                  key={i}
                  className={clsx(
                    'h-[50px] pt-1',
                    i % 2 === 1 && 'bg-back-400'
                  )}
                >
                  <td className='px-2 py-1 text-center text-xs'>
                    {`${formatDistanceToNow(
                      new Date(Number(row.timestamp) * 1000)
                    )}`}
                  </td>
                  <td className='px-2 py-1 text-center text-xs'>
                    {shortAddress(row.account, 4)}
                  </td>
                  <td className='px-2 py-1 text-center text-xs'>
                    {shortAddress(row.index_token, 4)}
                  </td>
                  <td
                    className={clsx(
                      'px-2 py-1 text-center text-xs',
                      Number(row.size_delta) > 0 && row.action > 1
                        ? 'text-red-600'
                        : 'text-green-600'
                    )}
                  >
                    {Number(row.size_delta) > 0 && row.action > 1 ? '-' : ''}
                    {numeral(parseInt(row.size_delta) / 10 ** 30).format(
                      '0,0.[00]'
                    )}
                  </td>
                  <td
                    className={clsx(
                      'px-2 py-1 text-center text-xs',
                      Number(row.collateral_delta) > 0 && row.action > 1
                        ? 'text-red-600'
                        : 'text-green-600'
                    )}
                  >
                    {Number(row.collateral_delta) > 0 && row.action > 1
                      ? '-'
                      : ''}
                    {numeral(parseInt(row.collateral_delta) / 10 ** 30).format(
                      '0,0.[00]'
                    )}
                  </td>
                  <td className='px-2 py-1 text-center text-xs'>
                    <Link
                      href={`https://arbiscan.io/tx/${row.transaction_hash}`}
                      target='_blank'
                    >
                      <div className='flex items-center gap-1'>
                        {shortAddress(row.transaction_hash, 4)}
                        <BiLinkExternal />
                      </div>
                    </Link>
                  </td>
                </tr>
              );
            })}
          {isFetching && (
            <tr>
              <td colSpan={6}>
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
  const offset = useSelector(selectOffset);
  const limit = useSelector(selectLimit);
  const sort = useSelector(selectSort);
  const user = useSelector(selectUserdata);
  const transactionData = useSelector(selectTransactionData);
  const isFetching = useSelector(selectIsFetchingTransactions);

  useEffect(() => {
    if (user.id > 0) {
      dispatch(
        getTransactionsAsync({
          user_id: `${user.id}`,
          limit,
          offset: offset - 1,
        })
      ).then((payload: any) => {
        if (payload?.error) return;
      });
    }
  }, [dispatch, limit, offset, user, sort]);

  return (
    <div className={className}>
      <Table
        isFetching={isFetching}
        data={transactionData.list}
        sort={sort}
        setSort={(v) => {
          dispatch(setSort(v));
        }}
      />
      <div className='p-4 text-center'>
        <Pagination
          onPageChange={(v) => dispatch(setOffset(v))}
          totalCount={transactionData.count}
          currentPage={offset}
          pageSize={limit}
        />
      </div>
    </div>
  );
};

const Transactions = (): JSX.Element => {
  return (
    <div className='flex flex-col items-start gap-3'>
      <div className='font-bold text-white'>Transactions</div>
      <div className='bg-back-200 flex w-full gap-12 rounded p-5'>
        <DataTable className='flex-1' />
      </div>
    </div>
  );
};

export default Transactions;
