import clsx from 'clsx';
import React from 'react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { AiOutlineRight } from 'react-icons/ai';
import { BsLink45Deg } from 'react-icons/bs';
import { FcGenericSortingAsc, FcGenericSortingDesc } from 'react-icons/fc';

import Pagination from '@/components/common/pagination';

import Axios from '@/services/axios';

export type TransactionType = {
  img: string;
  time: string;
  from: string;
  to: string;
  value: number;
  token: string;
  usd: number;
};

const tempData: TransactionType[] = [
  {
    img: 'eth',
    time: 'just now',
    from: 'uniswap',
    to: 'uniswap',
    value: 0,
    token: 'eth',
    usd: 0.5,
  },
  {
    img: 'eth',
    time: 'just now',
    from: '0xFd2e8c1a7...',
    to: 'Binance Dep...',
    value: 0.001,
    token: 'weth',
    usd: 1.01,
  },
  {
    img: 'eth',
    time: 'just now',
    from: 'uniswap',
    to: 'uniswap',
    value: 0,
    token: 'eth',
    usd: 0.5,
  },
  {
    img: 'eth',
    time: 'just now',
    from: '0xFd2e8c1a7...',
    to: 'Binance Dep...',
    value: 0.001,
    token: 'weth',
    usd: 1.01,
  },
  {
    img: 'eth',
    time: 'just now',
    from: 'uniswap',
    to: 'uniswap',
    value: 0,
    token: 'eth',
    usd: 0.5,
  },
  {
    img: 'eth',
    time: 'just now',
    from: '0xFd2e8c1a7...',
    to: 'Binance Dep...',
    value: 0.001,
    token: 'weth',
    usd: 1.01,
  },
  {
    img: 'eth',
    time: 'just now',
    from: 'uniswap',
    to: 'uniswap',
    value: 0,
    token: 'eth',
    usd: 0.5,
  },
  {
    img: 'eth',
    time: 'just now',
    from: '0xFd2e8c1a7...',
    to: 'Binance Dep...',
    value: 0.001,
    token: 'weth',
    usd: 1.01,
  },
  {
    img: 'eth',
    time: 'just now',
    from: 'uniswap',
    to: 'uniswap',
    value: 0,
    token: 'eth',
    usd: 0.5,
  },
  {
    img: 'eth',
    time: 'just now',
    from: '0xFd2e8c1a7...',
    to: 'Binance Dep...',
    value: 0.001,
    token: 'weth',
    usd: 1.01,
  },
];

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
      {isDown && <FcGenericSortingDesc className='fill-white' />}
      {isUp && <FcGenericSortingAsc className='fill-white' />}
      {!isDown && !isUp && <FcGenericSortingDesc className='fill-white' />}
    </div>
    {label}
  </div>
);

const Table = ({
  data,
  sort,
  setSort,
}: {
  data: TransactionType[];
  sort: string;
  setSort: Dispatch<string>;
}) => {
  return (
    <div className='bg-back-200  w-full rounded p-2'>
      <table className='w-full'>
        <thead className='text-text-100 text-sm'>
          <tr>
            <th className='text-left'>
              <BsLink45Deg />
            </th>
            <th>
              <SortHeader
                className='justify-center'
                label='Time'
                isUp={sort === 'time_asc'}
                isDown={sort === 'time_desck'}
                onClick={() =>
                  setSort(sort === 'time_desc' ? 'time_asc' : 'time_desc')
                }
              />
            </th>
            <th>
              <SortHeader
                className='justify-center'
                label='From'
                isUp={sort === 'from_asc'}
                isDown={sort === 'from_desck'}
                onClick={() =>
                  setSort(sort === 'from_desc' ? 'from_asc' : 'from_desc')
                }
              />
            </th>
            <th className='text-right'>
              <SortHeader
                className='justify-end'
                label='to'
                isUp={sort === 'to_asc'}
                isDown={sort === 'to_desc'}
                onClick={() =>
                  setSort(sort === 'to_desc' ? 'to_asc' : 'to_desc')
                }
              />
            </th>
            <th className='text-right'>
              <SortHeader
                className='justify-end'
                label='value'
                isUp={sort === 'value_asc'}
                isDown={sort === 'value_desc'}
                onClick={() =>
                  setSort(sort === 'value_desc' ? 'value_asc' : 'value_desc')
                }
              />
            </th>
            <th className='text-right'>
              <SortHeader
                className='justify-end'
                label='token'
                isUp={sort === 'token_asc'}
                isDown={sort === 'token_desc'}
                onClick={() =>
                  setSort(sort === 'token_desc' ? 'token_asc' : 'token_desc')
                }
              />
            </th>
            <th className='text-right'>
              <SortHeader
                className='justify-end'
                label='USD'
                isUp={sort === 'usd_asc'}
                isDown={sort === 'usd_desc'}
                onClick={() =>
                  setSort(sort === 'usd_desc' ? 'usd_asc' : 'usd_desc')
                }
              />
            </th>
          </tr>
        </thead>
        <tbody className='text-xs'>
          {data?.map((row, i) => (
            <tr
              key={i}
              className={clsx('h-[50px] pt-1', i % 2 === 1 && 'bg-back-400')}
            >
              <td className='pl-2'>{row.img}</td>
              <td className='text-center sm:text-[1.2em]'>{row.time}</td>
              <td className='text-center sm:text-[1.2em]'>{row.from}</td>
              <td className='text-center sm:text-[1.2em]'>{row.to}</td>
              <td className='text-center sm:text-[1.2em]'>{row.value}</td>
              <td className='text-center sm:text-[1.2em]'>{row.token}</td>
              <td className='text-center sm:text-[1.2em]'>{row.usd}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className='text-text-100 py-4 text-center text-[1.5em]'>
          Loading...
        </div>
      )}
    </div>
  );
};

const pageSize = 10;

const DataTable = ({ className }: { className: string }) => {
  const [sort, setSort] = useState<string>('time_desc');
  const [page, setPage] = useState<number>(1);
  const [retry, setRetry] = useState<number>(3);

  const [tableData, setTableData] = useState<TransactionType[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);

  useEffect(() => {
    setTableData([]);
    const data = {
      offset: (page - 1) * pageSize,
      order: sort,
      limit: pageSize,
    };

    Axios.post(`/api/transactions`, data)
      .then(({ data }) => {
        setTableData(
          data.data.map((d: { key: any; pnl: any; realisedpnl: any }) => ({
            ...d,
            trade: d.key,
            pnl: d.pnl || d.realisedpnl,
          }))
        );
        setTotalCount(data.totalcount);
      })
      .catch(() => {
        if (retry) {
          setRetry(retry - 1);
        }
      });
  }, [sort, page, retry]);

  return (
    <div className={className}>
      <div className='flex items-center justify-end'>
        <div className='flex items-center gap-5 text-sm'>
          <div>Transactions</div>
          <div className='flex items-center gap-1'>
            <div>1/500</div>
            <div>
              <AiOutlineRight className='text-xs' />
            </div>
          </div>
        </div>
      </div>
      <Table
        data={tempData}
        sort={sort}
        setSort={(v: SetStateAction<string>) => {
          setSort(v);
        }}
      />
      <div className='p-4 text-center'>
        <Pagination
          onPageChange={(v: any) => setPage(v)}
          totalCount={totalCount}
          currentPage={page}
          pageSize={pageSize}
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
