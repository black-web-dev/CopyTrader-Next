import clsx from 'clsx';
import { format } from 'date-fns';
import numeral from 'numeral';
import React, { ReactNode, useEffect, useState } from 'react';
import { AiOutlineExclamationCircle } from 'react-icons/ai';
import { BsChevronDown } from 'react-icons/bs';
import { CgSortAz, CgSortZa } from 'react-icons/cg';
import { useSelector } from 'react-redux';
import { useAccount, useContractRead, useContractWrite } from 'wagmi';

import useNotification from '@/hooks/useNotification';

import Button from '@/components/common/button';
import Loader from '@/components/common/loader';
import Pagination from '@/components/common/pagination';
import Tooltip from '@/components/common/tooltip';

import Bear from '@/assets/images/bear.svg';
import Bull from '@/assets/images/bull.svg';
import LINK from '@/assets/tokens/link.svg';
import UNI from '@/assets/tokens/uni.svg';
import WBTC from '@/assets/tokens/wbtc.svg';
import WETH from '@/assets/tokens/weth.svg';
import { COPY_TRADER_ACCOUNT, GMX } from '@/configs';
import { useAppDispatch } from '@/services';
import { selectUserdata } from '@/services/auth';
import {
  getPositionsAsync,
  PositionType,
  selectPage,
  selectPageSize,
  selectPositionData,
  selectSort,
  setPage,
  setSort,
} from '@/services/position';
import { selectTradeDetail } from '@/services/trade';

const PRETTY_DATE_FORMAT = ' hh:mm dd-mm-yyyy';

export const longShortImgs: {
  [key: string]: {
    label: string;
    img: ReactNode;
  };
} = {
  long: {
    label: 'Long',
    img: <Bull className='h-5 w-5 text-white' />,
  },
  short: {
    label: 'Short',
    img: <Bear className='h-5 w-5 text-white' />,
  },
};

export const indexTokens: {
  [key: string]: {
    label: string;
    img: ReactNode;
  };
} = {
  '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f': {
    label: 'BTC',
    img: <WBTC className='h-5 w-5 text-white' />,
  },
  '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1': {
    label: 'ETH',
    img: <WETH className='h-5 w-5 text-white' />,
  },
  '0xFa7F8980b0f1E64A2062791cc3b0871572f1F7f0': {
    label: 'UNI',
    img: <UNI className='h-5 w-5 text-white' />,
  },
  '0xf97f4df75117a78c1A5a0DBb814Af92458539FB4': {
    label: 'LINK',
    img: <LINK className='h-5 w-5 text-white' />,
  },
};

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
  data: PositionType[];
  sort: string;
  setSort: (sort: string) => void;
}) => {
  return (
    <div className='bg-back-200 w-full rounded p-2'>
      <table className='w-full'>
        <thead className='text-text-100 text-xs'>
          <tr>
            <th className='px-2 py-1 capitalize'></th>
            <th className='px-2 py-1 capitalize'>
              <div className='flex items-center gap-1'>
                <div>Position</div>
                <Tooltip isTag={true} position='top' content='Token address'>
                  <AiOutlineExclamationCircle className='text-text-100' />
                </Tooltip>
              </div>
            </th>
            <th className='px-2 py-1 capitalize'>
              <SortHeader
                className='justify-center'
                label='Net Value'
                isUp={sort === 'collateral-asc'}
                isDown={sort === 'collateral-desc'}
                onClick={() =>
                  setSort(
                    sort === 'collateral-desc'
                      ? 'collateral-asc'
                      : 'collateral-desc'
                  )
                }
              />
            </th>
            <th className='px-2 py-1 capitalize'>
              <SortHeader
                className='justify-center'
                label='Size'
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
                label='Collateral'
                isUp={sort === 'collateral-asc'}
                isDown={sort === 'collateral-desc'}
                onClick={() =>
                  setSort(
                    sort === 'collateral-desc'
                      ? 'collateral-asc'
                      : 'collateral-desc'
                  )
                }
              />
            </th>
            <th className='px-2 py-1 capitalize'>
              <SortHeader
                className='justify-center'
                label='Entry Price'
                isUp={sort === 'averageprice-asc'}
                isDown={sort === 'averageprice-desc'}
                onClick={() =>
                  setSort(
                    sort === 'averageprice-desc'
                      ? 'averageprice-asc'
                      : 'averageprice-desc'
                  )
                }
              />
            </th>
            <th className='px-2 py-1 capitalize'>
              <SortHeader
                className='justify-center'
                label='Mark Price'
                isUp={sort === 'price-asc'}
                isDown={sort === 'price-desc'}
                onClick={() =>
                  setSort(sort === 'price-desc' ? 'price-asc' : 'price-desc')
                }
              />
            </th>
          </tr>
        </thead>
        <tbody className='text-xs'>
          {!isFetching &&
            data?.map((row, i) => <ExpandRow key={i} data={row} index={i} />)}
          {isFetching && (
            <tr>
              <td colSpan={7}>
                <div className='flex min-h-[200px] items-center justify-center'>
                  <Loader size='40px' strokewidth={1.5} />
                </div>
              </td>
            </tr>
          )}
          {!isFetching && data.length === 0 && (
            <tr>
              <td colSpan={7}>
                <div className='flex min-h-[100px] items-center justify-center'>
                  No items
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const ExpandRow = ({ data, index }: { data: PositionType; index: number }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const tradeDetail = useSelector(selectTradeDetail);
  const notification = useNotification();

  const { data: gmxPositionData } = useContractRead({
    address: GMX.address as `0x${string}`,
    abi: GMX.abi,
    functionName: 'getPosition',
    args: [
      tradeDetail.copyTraderAccount.copyAccount,
      data.indextoken,
      data.indextoken,
      data.islong,
    ],
    watch: true,
  });

  const sizeDeltaUsd =
    gmxPositionData && gmxPositionData.length > 0
      ? gmxPositionData[0]
      : BigInt(0);

  const {
    writeAsync: closePosition,
    isSuccess: isSuccessStartCopyTrading,
    isLoading: isLoadingStartCopyTrading,
  } = useContractWrite({
    address: tradeDetail.copyTraderAccount.copyAccount as `0x${string}`,
    abi: COPY_TRADER_ACCOUNT.abi,
    functionName: 'createDecreasePosition',
    args: [
      data.indextoken,
      data.indextoken,
      1,
      sizeDeltaUsd,
      data.islong,
      true,
    ],
    onSuccess: () => {
      notification('Close Position.', 'success');
    },
  });

  const onClosePosition = async () => {
    closePosition?.().catch(() => {
      notification('Rejected the request', 'warning');
    });
  };

  return (
    <>
      <tr
        key={index}
        className={clsx('h-[50px] py-1', index % 2 === 1 && 'bg-back-400')}
      >
        <th>{`${index + 1}.`}</th>
        <td className='px-2 py-1 text-center text-xs'>
          <div
            className='flex items-center'
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className='flex flex-auto items-center gap-1'>
              {indexTokens[data.indextoken].img}
              {indexTokens[data.indextoken].label}
            </div>
            <BsChevronDown
              className={clsx(
                'text-text-100 transition-all',
                isExpanded ? 'rotate-180' : 'rotate-0'
              )}
            />
          </div>
        </td>
        <td className='px-2 py-1 text-center text-xs'>
          ${numeral(data.collateral + data.pnl).format('0,0.[00]')}
        </td>
        <td className='px-2 py-1 text-center text-xs'>
          {`$${numeral(data.size).format('0,0.[00]')}`}
        </td>
        <td className='px-2 py-1 text-center text-xs'>
          {`$${numeral(data.collateral).format('0,0.[00]')}`}
        </td>
        <td className='px-2 py-1 text-center text-xs'>
          {numeral(data.averageprice).format('0,0.[00]')}
        </td>
        <td className='px-2 py-1 text-center text-xs'>
          {numeral(data.price).format('0,0.[00]')}
        </td>
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan={7}>
            <div className='w-full pl-5'>
              <div className='bg-back-100 flex items-center justify-between gap-2 rounded p-4'>
                <div className='flex flex-col gap-2'>
                  <div className='text-text-100'>TimeStamp</div>
                  <div className='text-text-200'>
                    {format(
                      new Date(Number(data.timestamp) * 1000),
                      PRETTY_DATE_FORMAT
                    )}
                  </div>
                </div>
                <div className='flex flex-col gap-2'>
                  <div className='text-text-100'>Long / Short</div>
                  <div className='text-text-200'>
                    <div className='text-xs'>
                      <span className='text-gray-400'>
                        {numeral(data.leverage).format('0,0.[00]')}x
                      </span>
                      &nbsp;
                      <span
                        className={
                          data.islong ? 'text-green-500' : 'text-red-500'
                        }
                      >
                        {data.islong ? 'Long' : 'Short'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className='flex flex-col gap-2'>
                  <div className='text-text-100'>Pnl %</div>
                  <div className='text-text-200'>
                    <div
                      className={`text-xs ${
                        data.pnl > 0 ? 'text-green-500' : 'text-red-500'
                      }`}
                    >
                      <span>
                        {data.pnl > 0 ? '' : '-'}$
                        {numeral(Math.abs(data.pnl)).format('0,0.[00]')}
                      </span>
                      &nbsp;(
                      <span>
                        {data.pnl > 0 ? '+' : ''}
                        {numeral((data.pnl / data.collateral) * 100).format(
                          '0,0.[00]'
                        )}
                      </span>
                      %)
                    </div>
                  </div>
                </div>
                <div className='flex flex-col gap-2'>
                  <div className='text-text-100'>Limit Price</div>
                  <div className='text-text-200'>
                    {numeral(data.limit_price).format('0,0.[00]')}
                  </div>
                </div>
                <div>
                  <Button
                    onClick={() => onClosePosition()}
                    loading={isLoadingStartCopyTrading}
                    disabled={
                      tradeDetail.copyStatus.isCopyTrading ||
                      isSuccessStartCopyTrading
                    }
                  >
                    Close position
                  </Button>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

const DataTable = ({ className }: { className: string }) => {
  const dispatch = useAppDispatch();
  const { address } = useAccount();
  const user = useSelector(selectUserdata);
  const page = useSelector(selectPage);
  const pageSize = useSelector(selectPageSize);
  const sort = useSelector(selectSort);
  const positionData = useSelector(selectPositionData);
  const tradeDetail = useSelector(selectTradeDetail);

  useEffect(() => {
    const interval = setInterval(() => {
      if (tradeDetail.copyTraderAccount.copyAccount && address) {
        dispatch(
          getPositionsAsync({
            user_id: `${user.id}`,
            wallet: `${address}`,
          })
        );
      }
    }, 3000);
    return () => {
      clearInterval(interval);
    };
  }, [address, dispatch, tradeDetail.copyTraderAccount.copyAccount, user.id]);

  return (
    <div className={className}>
      <Table
        isFetching={false}
        data={positionData.list}
        sort={sort}
        setSort={(v) => {
          dispatch(setSort(v));
        }}
      />
      {positionData.count > 0 && (
        <div className='p-4 text-center'>
          <Pagination
            onPageChange={(v) => dispatch(setPage(v))}
            totalCount={positionData.count}
            currentPage={page}
            pageSize={pageSize}
          />
        </div>
      )}
    </div>
  );
};

const Positions = () => {
  return (
    <div className='bg-back-200 w-full rounded p-4'>
      <DataTable className='flex-1' />
    </div>
  );
};

export default Positions;
