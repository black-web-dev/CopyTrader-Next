import { format } from 'date-fns';
import numeral from 'numeral';
import React from 'react';
import { useSelector } from 'react-redux';
import { useContractRead, useContractWrite } from 'wagmi';

import useNotification from '@/hooks/useNotification';

import Button from '@/components/common/button';

import { COPY_TRADER_ACCOUNT, GMX } from '@/configs';
import { PositionType } from '@/services/position';
import { selectTradeDetail } from '@/services/trade';

import { indexTokens } from '../positions_old';

const USDC_ADDRESS = '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8';

const PositionDetail = ({
  position,
}: {
  position: PositionType;
}): JSX.Element => {
  const tradeDetail = useSelector(selectTradeDetail);
  const notification = useNotification();

  const { data: gmxPositionData } = useContractRead({
    address: GMX.address as `0x${string}`,
    abi: GMX.abi,
    functionName: 'getPosition',
    args: [
      tradeDetail.copyTraderAccount.copyAccount,
      position.islong ? position.indextoken : USDC_ADDRESS,
      position.indextoken,
      position.islong,
    ],
    watch: true,
  });

  const sizeDeltaUsd =
    gmxPositionData && gmxPositionData.length > 0
      ? gmxPositionData[0]
      : BigInt(0);

  const { writeAsync: closePosition, isLoading: isLoadingStartCopyTrading } =
    useContractWrite({
      address: tradeDetail.copyTraderAccount.copyAccount as `0x${string}`,
      abi: COPY_TRADER_ACCOUNT.abi,
      functionName: 'createDecreasePosition',
      args: [
        position.islong ? position.indextoken : USDC_ADDRESS,
        position.indextoken,
        1,
        sizeDeltaUsd,
        position.islong,
        true,
      ],
      onSuccess: () => {
        notification('Close Position.', 'success');
      },
    });

  const onClosePosition = () => {
    closePosition?.().catch(() => {
      notification('Rejected the request', 'warning');
    });
  };

  return (
    <div className='w-full px-14'>
      <div className='bg-back-100 flex items-center justify-between gap-2 rounded p-4'>
        <div className='flex flex-col gap-2'>
          <div className='text-text-100'>TimeStamp</div>
          <div className='text-text-200 text-center'>
            {format(Number(position.timestamp) * 1000, 'HH:mm yyyy-MM-dd ', {
              useAdditionalWeekYearTokens: false,
              useAdditionalDayOfYearTokens: false,
            })}
          </div>
        </div>
        <div className='flex flex-col gap-2'>
          <div className='text-text-100'>Token</div>
          <div className='flex flex-auto items-center gap-1'>
            {indexTokens[position.indextoken].img}
            {indexTokens[position.indextoken].label}
          </div>
        </div>
        <div className='flex flex-col gap-2'>
          <div className='text-text-100'>Long / Short</div>
          <div className='text-text-200 text-center'>
            <div className='text-xs'>
              <span className='text-text-200 text-center'>
                {numeral(position.leverage).format('0,0.[00]')}x
              </span>
              &nbsp;
              <span
                className={position.islong ? 'text-green-500' : 'text-red-500'}
              >
                {position.islong ? 'Long' : 'Short'}
              </span>
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-2'>
          <div className='text-text-100'>Collateral Size</div>
          <div className='text-text-200 text-center'>
            {`$${numeral(position.collateral).format('0,0.[00]')}`}
          </div>
        </div>
        <div className='flex flex-col gap-2'>
          <div className='text-text-100'>Trade Size</div>
          <div className='text-text-200 text-center'>
            {`$${numeral(position.size).format('0,0.[00]')}`}
          </div>
        </div>
        <div className='flex flex-col gap-2'>
          <div className='text-text-100'>Pnl %</div>
          <div className='text-text-200 text-center'>
            <div
              className={`text-xs ${
                position.pnl > 0 ? 'text-green-500' : 'text-red-500'
              }`}
            >
              <span>
                {position.pnl > 0 ? '' : '-'}$
                {numeral(Math.abs(position.pnl)).format('0,0.[00]')}
              </span>
              &nbsp;(
              <span>
                {position.pnl > 0 ? '+' : ''}
                {numeral((position.pnl / position.collateral) * 100).format(
                  '0,0.[00]'
                )}
              </span>
              %)
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-2'>
          <div className='text-text-100'>Limit Price</div>
          <div className='text-text-200 text-center'>
            {numeral(position.limit_price).format('0,0.[00]')}
          </div>
        </div>
        <div className='flex flex-col gap-2'>
          <div className='text-text-100'>Market Price</div>
          <div className='text-text-200 text-center'>
            {numeral(position.price).format('0,0.[00]')}
          </div>
        </div>
        <div>
          <Button
            className='w-36 capitalize'
            onClick={onClosePosition}
            loading={isLoadingStartCopyTrading}
            disabled={
              tradeDetail.copyStatus.isCopyingOnContract ||
              isLoadingStartCopyTrading
            }
          >
            close position
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PositionDetail;
