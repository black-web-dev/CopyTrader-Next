import React from 'react';

import Loader from '@/components/common/loader';

import { formatNum } from '@/utils';
import { useSelector } from 'react-redux';
import { closePositionAsync, selectPositions } from '@/services/positions';
import { selectTradeDetail } from '@/services/trade';
import { useAppDispatch } from '@/services';

const indexTokens: any = {
  '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f': 'BTC',
  '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1': 'ETH',
  '0xFa7F8980b0f1E64A2062791cc3b0871572f1F7f0': 'UNI',
  '0xf97f4df75117a78c1A5a0DBb814Af92458539FB4': 'LINK',
};

const Positions = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const positions = useSelector(selectPositions);
  const { copyStatus, busy } = useSelector(selectTradeDetail);

  return (
    <div className='bg-back-200 w-full rounded p-4'>
      <table className='w-full'>
        <thead className='text-text-100 text-sm'>
          <tr className='text-left'>
            <th>Position</th>
            <th>Net Value</th>
            <th>Size</th>
            <th>Collateral</th>
            <th>Entry Price</th>
            <th>Mark Price</th>
            <th>Liq. Price</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody className=''>
          {positions?.map((row: any, i: number) => (
            <tr key={i} className='pt-1'>
              <td>
                <span className='border-b border-dashed'>
                  {indexTokens[row.indextoken]}
                </span>
                <div className='text-[0.8em]'>
                  <span className='text-gray-400'>
                    {formatNum(row.leverage)}x
                  </span>
                  &nbsp;
                  <span
                    className={row.islong ? 'text-green-500' : 'text-red-500'}
                  >
                    {row.islong ? 'Long' : 'Short'}
                  </span>
                </div>
              </td>
              <td>
                <span className='border-b border-dashed'>
                  ${formatNum(row.collateral + row.pnl, 2)}
                </span>
                <div
                  className={`text-[0.8em] ${
                    row.pnl > 0 ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  <span>
                    {row.pnl > 0 ? '' : '-'}${formatNum(Math.abs(row.pnl))}
                  </span>
                  &nbsp;(
                  <span>
                    {row.pnl > 0 ? '+' : ''}
                    {formatNum((row.pnl / row.collateral) * 100)}
                  </span>
                  %)
                </div>
              </td>
              <td>${formatNum(row.size, 2)}</td>
              <td>${formatNum(row.collateral, 2)}</td>
              <td>${formatNum(row.averageprice, 2)}</td>
              <td>${formatNum(row.price, 2)}</td>
              <td>${formatNum(row.limit_price, 2)}</td>
              <td>
                <button
                  className={
                    copyStatus.copy || busy
                      ? 'cursor-not-allowed text-gray-400'
                      : 'rounded-md px-2 hover:bg-gray-800'
                  }
                  onClick={() =>
                    busy ||
                    dispatch(
                      closePositionAsync({
                        index_token: row.indextoken,
                        is_long: row.islong,
                      })
                    )
                  }
                >
                  {!copyStatus.copy && busy ? (
                    <Loader className='xs:w-4 xs:h-4 mx-auto' />
                  ) : (
                    'Close'
                  )}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Positions;
