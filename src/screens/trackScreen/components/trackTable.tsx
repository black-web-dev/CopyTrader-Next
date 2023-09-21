import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import numeral from 'numeral';
import React from 'react';
import { AiOutlineExclamationCircle } from 'react-icons/ai';
import { BiLinkExternal } from 'react-icons/bi';
import { useSelector } from 'react-redux';

import useDesktopMediaQuery from '@/hooks/useDesktopMediaQuery';
import useNotification from '@/hooks/useNotification';

import Loader from '@/components/common/loader';
import Pagination from '@/components/common/pagination';
import Tooltip from '@/components/common/tooltip';

import DEATH from '@/assets/images/death.svg';
import {
  indexTokens,
  longShortImgs,
} from '@/screens/homeScreen/components/positions';
import { useAppDispatch } from '@/services';
import {
  ClosedTrackItemType,
  OpenedTrackItemType,
  selectFilter,
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
import SortHeader from './sortHeader';
import { closedTableHeader, openedTableHeader, TableHeader } from '../utils';

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
  const filter = useSelector(selectFilter);

  const header =
    filter.status === 'open' ? openedTableHeader : closedTableHeader;

  return (
    <div className='bg-back-200 w-full rounded p-4'>
      <table className='w-full'>
        <thead className='text-text-100 text-xs'>
          <tr>
            {header.map((header: TableHeader, index: number) => (
              <th key={index} className='px-2 py-1 capitalize'>
                <div className='jus flex items-center gap-1'>
                  {header.sort ? (
                    <SortHeader
                      className='flex-1 justify-end'
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
                  {header.tooltip && (
                    <Tooltip
                      isTag={true}
                      position='top'
                      content='Trader wallet address'
                    >
                      <AiOutlineExclamationCircle className='text-text-100' />
                    </Tooltip>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className='text-xs'>
          {!isFetching &&
            data?.map((row, index) => (
              <tr
                key={index}
                className={clsx(
                  'h-[50px] py-1',
                  index % 2 === 1 && 'bg-back-400'
                )}
              >
                {filter.status === 'open' ? (
                  <OpenedTableRow key={index} data={row} />
                ) : (
                  <ClosedTableRow key={index} data={row} />
                )}
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

const ClosedTableRow = ({ data }: { data: ClosedTrackItemType | any }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const notification = useNotification();

  return (
    <>
      <th className='px-2 py-1 text-center text-xs'>
        <Link
          href={`https://www.gmx.house/arbitrum/account/${data.account}`}
          target='_blank'
        >
          <div className='flex items-center gap-1'>
            {shortAddress(data.account, 4)}
            <BiLinkExternal />
          </div>
        </Link>
      </th>
      <td className='px-2 py-1 text-right text-xs'>
        {numeral(data.size).format('0,0.[00]')}
      </td>
      <td className='px-2 py-1 text-right text-xs'>
        <div
          className={`text-xs ${
            data.realisedpnl > 0 ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {numeral(data.realisedpnl).format('0,0.[00]')}
        </div>
      </td>
      <td className='px-2 py-1 text-center text-xs'>
        {`${data.win}/${data.loss}`}
      </td>
      <td className='px-2 py-1 text-right text-xs'>
        {numeral(data.win_loss).format('0.[00]')}%
      </td>
      <td className='px-2 py-1 text-right text-xs'>
        {numeral(data.avg_leverage).format('0,0.[00]')}
      </td>
      <td className='px-2 py-1 text-right text-xs'>
        {numeral(data.avg_coll).format('0,0.[00]')}
      </td>
      <td className='px-2 py-1 text-center text-xs'>
        <button
          type='submit'
          className='bg-primary-100 hover:bg-primary-100/50 flex w-full justify-center whitespace-nowrap rounded px-3 py-1.5 text-xs font-semibold uppercase text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 active:scale-95'
          onClick={() => {
            dispatch(setLeader(data.account));
            notification('Selected Leader address', 'success');
            router.push('/');
          }}
        >
          Copy Trade
        </button>
      </td>
    </>
  );
};

const OpenedTableRow = ({ data }: { data: OpenedTrackItemType | any }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const notification = useNotification();

  return (
    <>
      <th className='px-2 py-1 text-center text-xs'>
        <Link
          href={`https://www.gmx.house/arbitrum/account/${data.account}`}
          target='_blank'
        >
          <div className='flex items-center gap-1'>
            {shortAddress(data.account, 4)}
            <BiLinkExternal />
          </div>
        </Link>
      </th>
      <td className='px-2 py-1 text-center text-xs'>
        <div className='flex justify-center'>
          {indexTokens[data.indextoken]?.img}
        </div>
      </td>
      <td className='px-2 py-1 text-center text-xs'>
        <div className='flex justify-center'>
          {data.islong ? (
            <div className='flex items-center justify-center'>
              <div>{longShortImgs.long.img}</div>
            </div>
          ) : (
            <div className='flex items-center justify-center'>
              <div>{longShortImgs.short.img}</div>
            </div>
          )}
        </div>
      </td>
      <td className='px-2 py-1 text-right text-xs'>
        {numeral(data.size).format('0,0.[00]')}
      </td>
      <td className='px-2 py-1 text-right text-xs'>
        {numeral(data.collateral).format('0,0.[00]')}
      </td>
      <td className='px-2 py-1 text-right text-xs'>
        {`${numeral(data.leverage).format('0,0.[00]')}x`}
      </td>
      <td className='px-2 py-1 text-center text-xs'>
        <div className='flex items-center gap-1'>
          <DEATH className='h-5 w-5 text-white' />
          {numeral(data.limit_price).format('0,0.[00]')}
        </div>
      </td>
      <td className='px-2 py-1 text-right text-xs'>
        <div
          className={`text-xs ${
            data.pnl > 0 ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {numeral(data.pnl).format('0,0.[00]')}
        </div>
      </td>
      <td className='px-2 py-1 text-center text-xs'>
        <button
          type='submit'
          className='bg-primary-100 hover:bg-primary-100/50 flex w-full justify-center whitespace-nowrap rounded px-3 py-1.5 text-xs font-semibold uppercase text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 active:scale-95'
          onClick={() => {
            dispatch(setLeader(data.account));
            notification('Selected Leader address', 'success');
            router.push('/');
          }}
        >
          Copy Trade
        </button>
      </td>
    </>
  );
};

const List = ({
  isFetching,
  data,
}: {
  isFetching: boolean;
  data: TrackItemType[];
}): JSX.Element => {
  const filter = useSelector(selectFilter);

  return (
    <div className='flex w-full flex-col gap-2'>
      {!isFetching &&
        data?.map((row, index) => (
          <div
            key={index}
            className='bg-back-200 flex flex-col gap-4 rounded p-5 text-xs'
          >
            {filter.status === 'open' ? (
              <OpenedListItem key={index} data={row} />
            ) : (
              <ClosedListItem key={index} data={row} />
            )}
          </div>
        ))}
      {isFetching && (
        <div className='flex min-h-[200px] items-center justify-center'>
          <Loader size='40px' strokewidth={1.5} />
        </div>
      )}
      {!isFetching && data.length === 0 && (
        <div className='flex items-center justify-center'>No items</div>
      )}
    </div>
  );
};

const ClosedListItem = ({
  data,
}: {
  data: ClosedTrackItemType | any;
}): JSX.Element => {
  const isDesktop = useDesktopMediaQuery();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const notification = useNotification();

  return (
    <>
      <div className='flex items-center justify-between'>
        <div className='text-sm font-semibold capitalize'>address</div>
        <Link
          href={`https://www.gmx.house/arbitrum/account/${data.account}`}
          target='_blank'
        >
          <div className='flex items-center gap-1'>
            {shortAddress(data.account, isDesktop ? data.account.length : 4)}
            <BiLinkExternal />
          </div>
        </Link>
      </div>
      <div className='flex items-center justify-between'>
        <div className='text-sm font-semibold capitalize'>trade size / pnl</div>
        <div className='flex items-center gap-2'>
          <div>{numeral(data.size).format('0,0.[00]')}</div>
          <div>/</div>
          <div
            className={`text-xs ${
              data.realisedpnl > 0 ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {numeral(data.realisedpnl).format('0,0.[00]')}
          </div>
        </div>
      </div>
      <div className='flex items-center justify-between'>
        <div className='text-sm font-semibold capitalize'>win/Loss</div>
        {`${data.win}/${data.loss}`}
      </div>
      <div className='flex items-center justify-between'>
        <div className='text-sm font-semibold capitalize'>ratio</div>
        {numeral(data.win_loss).format('0.[00]')}%
      </div>
      <div className='flex items-center justify-between'>
        <div className='text-sm font-semibold capitalize'>
          Avg.Levarage / Avg.Collateral
        </div>
        <div className='flex items-center gap-2'>
          <div>{numeral(data.avg_leverage).format('0,0.[00]')}</div>
          <div>/</div>
          <div>{numeral(data.avg_coll).format('0,0.[00]')}</div>
        </div>
      </div>
      <div className='flex items-center justify-end'>
        <button
          type='submit'
          className='bg-primary-100 hover:bg-primary-100/50 flex justify-center whitespace-nowrap rounded px-3 py-1.5 text-xs font-semibold uppercase text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 active:scale-95'
          onClick={() => {
            dispatch(setLeader(data.account));
            notification('Selected Leader address', 'success');
            router.push('/');
          }}
        >
          Copy Trade
        </button>
      </div>
    </>
  );
};

const OpenedListItem = ({
  data,
}: {
  data: ClosedTrackItemType | any;
}): JSX.Element => {
  const isDesktop = useDesktopMediaQuery();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const notification = useNotification();

  return (
    <>
      <div className='flex items-center justify-between'>
        <div className='text-sm font-semibold capitalize'>address</div>
        <Link
          href={`https://www.gmx.house/arbitrum/account/${data.account}`}
          target='_blank'
        >
          <div className='flex items-center gap-1'>
            {shortAddress(data.account, isDesktop ? data.account.length : 4)}
            <BiLinkExternal />
          </div>
        </Link>
      </div>
      <div className='flex items-center justify-between'>
        <div className='text-sm font-semibold capitalize'>
          token / type / limit price
        </div>
        <div className='flex items-center gap-2'>
          <div>{indexTokens[data.indextoken]?.img}</div>
          <div>
            {data.islong ? (
              <div className='flex items-center justify-center'>
                <div>{longShortImgs.long.img}</div>
              </div>
            ) : (
              <div className='flex items-center justify-center'>
                <div>{longShortImgs.short.img}</div>
              </div>
            )}
          </div>
          <div className='flex items-center gap-1'>
            <DEATH className='h-5 w-5 text-white' />
            {numeral(data.limit_price).format('0,0.[00]')}
          </div>
        </div>
      </div>
      <div className='flex items-center justify-between'>
        <div className='text-sm font-semibold capitalize'>size / pnl</div>
        <div className='flex items-center gap-2'>
          <div>{numeral(data.size).format('0,0.[00]')}</div>
          <div>/</div>
          <div
            className={`text-xs ${
              data.pnl > 0 ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {numeral(data.pnl).format('0,0.[00]')}
          </div>
        </div>
      </div>
      <div className='flex items-center justify-between'>
        <div className='text-sm font-semibold capitalize'>
          collateral / Leverage
        </div>
        <div className='flex items-center gap-2'>
          <div>{numeral(data.collateral).format('0,0.[00]')}</div>
          <div>/</div>
          <div>{`${numeral(data.leverage).format('0,0.[00]')}x`}</div>
        </div>
      </div>
      <div className='flex items-center justify-end'>
        <button
          type='submit'
          className='bg-primary-100 hover:bg-primary-100/50 flex justify-center whitespace-nowrap rounded px-3 py-1.5 text-xs font-semibold uppercase text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 active:scale-95'
          onClick={() => {
            dispatch(setLeader(data.account));
            notification('Selected Leader address', 'success');
            router.push('/');
          }}
        >
          Copy Trade
        </button>
      </div>
    </>
  );
};

const DataTable = ({ className }: { className: string }) => {
  const isDesktop = useDesktopMediaQuery();
  const dispatch = useAppDispatch();
  const page = useSelector(selectPage);
  const pageSize = useSelector(selectPageSize);
  const sort = useSelector(selectSort);
  const trackData = useSelector(selectTrackData);
  const isFetching = useSelector(selectIsFetching);

  return (
    <div className={className}>
      {isDesktop ? (
        <Table
          isFetching={isFetching}
          data={trackData.list}
          sort={sort}
          setSort={(v) => {
            dispatch(setSort(v));
          }}
        />
      ) : (
        <>
          <div className='p-4 text-center'>
            <Pagination
              onPageChange={(v) => dispatch(setPage(v))}
              totalCount={trackData.count}
              currentPage={page}
              disabled={isFetching}
              pageSize={pageSize}
            />
          </div>
          <List isFetching={isFetching} data={trackData.list} />
        </>
      )}
      <div className='p-4 text-center'>
        <Pagination
          onPageChange={(v) => dispatch(setPage(v))}
          totalCount={trackData.count}
          currentPage={page}
          disabled={isFetching}
          pageSize={pageSize}
        />
      </div>
    </div>
  );
};

const Transactions = () => {
  const filter = useSelector(selectFilter);

  return (
    <div className='flex flex-col items-start gap-3'>
      {filter.status === 'close' && (
        <div className='flex w-full items-center justify-end'>
          <SortOption />
        </div>
      )}
      <div className='flex w-full gap-12'>
        <DataTable className='flex-1' />
      </div>
    </div>
  );
};

export default Transactions;
