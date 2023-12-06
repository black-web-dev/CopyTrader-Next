import clsx from 'clsx';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import numeral from 'numeral';
import React, { useEffect } from 'react';
import { BiLinkExternal } from 'react-icons/bi';
import { useSelector } from 'react-redux';

import Loader from '@/components/common/loader';
import Pagination from '@/components/common/pagination';

import { indexTokens } from '@/screens/homeScreen/components/positions_old';
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
import { classNames, shortAddress } from '@/utils';

import SortHeader from './sortHeader';
import { TableHeader, tableHeader } from '../utils';

export const PRETTY_DATE_FORMAT = 'd/M/yyyy';

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
            {tableHeader.map((header: TableHeader, index: number) => (
              <th key={index} className='px-2 py-1 capitalize'>
                <div className='jus flex items-center gap-1'>
                  {header.sort ? (
                    <SortHeader
                      className={classNames(
                        'flex-1',
                        index === 0 ? 'justify-start' : 'justify-end'
                      )}
                      label={header.label}
                      isUp={sort === `${header.sort}-asc`}
                      isDown={sort === `${header.sort}-desc`}
                      onClick={() =>
                        setSort(
                          sort === `${header.sort}-desc`
                            ? `${header.sort}-asc`
                            : `${header.sort}-desc`
                        )
                      }
                    />
                  ) : (
                    <div>{header.label}</div>
                  )}
                </div>
              </th>
            ))}
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
                    <div className='flex items-center justify-end'>
                      <Link
                        href={`https://www.gmx.house/arbitrum/account/${row.account}`}
                        target='_blank'
                      >
                        <div className='flex items-center gap-1'>
                          {shortAddress(row.account, 4)}
                          <BiLinkExternal />
                        </div>
                      </Link>
                    </div>
                  </td>
                  <td className='px-2 py-1 text-right text-xs'>
                    <div className='flex items-center justify-end'>
                      {indexTokens[row.index_token]?.img}
                    </div>
                  </td>
                  <td
                    className={clsx(
                      'px-2 py-1 text-right text-xs',
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
                      'px-2 py-1 text-right text-xs',
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
                    <div className='flex items-center justify-end'>
                      <Link
                        href={`https://arbiscan.io/tx/${row.transaction_hash}`}
                        target='_blank'
                      >
                        <div className='flex items-center gap-1'>
                          {shortAddress(row.transaction_hash, 4)}
                          <BiLinkExternal />
                        </div>
                      </Link>
                    </div>
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
          offset: (offset - 1) * limit,
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
