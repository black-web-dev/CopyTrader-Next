import { useConnectModal } from '@rainbow-me/rainbowkit';
import clsx from 'clsx';
import numeral from 'numeral';
import React, { useCallback, useState } from 'react';
import { BsChevronDown } from 'react-icons/bs';
import { useSelector } from 'react-redux';
import { useAccount, useContractWrite } from 'wagmi';

import useNotification from '@/hooks/useNotification';

import Loader from '@/components/common/loader';

import { COPY_TRADER_ACCOUNT } from '@/configs';
import { useAppDispatch } from '@/services';
import { selectUserdata } from '@/services/auth';
import { selectETHDetail } from '@/services/pair';
import { FollowDetailType } from '@/services/position';
import {
  getCopyStatusAsync,
  selectTradeDetail,
  stopCopyTraderAsync,
} from '@/services/trade';

import PositionDetail from './positionDetail';

const STATUS = [
  {
    text: 'paused',
    color: 'bg-red-500',
  },
  {
    text: 'pending',
    color: 'bg-yellow-500',
  },
  {
    text: 'live',
    color: 'bg-green-500',
  },
];

const FollowDetail = ({
  data,
  index = 0,
}: {
  data: FollowDetailType;
  index?: number;
}) => {
  const dispatch = useAppDispatch();
  const notification = useNotification();
  const { address } = useAccount();
  const { openConnectModal } = useConnectModal();
  const user = useSelector(selectUserdata);
  const tradeDetail = useSelector(selectTradeDetail);
  const ethDetail = useSelector(selectETHDetail);

  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const {
    writeAsync: stopCopyTradingContract,
    isLoading: isLoadingStopCopyTrading,
  } = useContractWrite({
    address: tradeDetail.copyTraderAccount.copyAccount as `0x${string}`,
    abi: COPY_TRADER_ACCOUNT.abi,
    functionName: 'stopCopyTrading',
  });

  const handleStopTrade = useCallback(async () => {
    if (address && user.id > 0 && tradeDetail.copyStatus.backendInfo?.from) {
      stopCopyTradingContract()
        .then(() => {
          dispatch(
            stopCopyTraderAsync({
              user_id: `${user.id}`,
              wallet: address,
              leader_address: tradeDetail.copyStatus.backendInfo?.from || '',
            })
          )
            .then((payload: any) => {
              if (payload?.error) return;
              notification('Stop copy trading successfully.', 'success');

              dispatch(
                getCopyStatusAsync({
                  user_id: `${user.id}`,
                  wallet: `${address}`,
                })
              );
            })
            .catch(() => {
              notification('Rejected Metamask', 'warning');
            });
        })
        .catch(() => {
          notification('Rejected Metamask', 'warning');
        });
    }
  }, [
    address,
    dispatch,
    notification,
    stopCopyTradingContract,
    tradeDetail.copyStatus.backendInfo?.from,
    user.id,
  ]);

  return (
    <>
      <tr className={clsx('h-[50px] py-1', index % 2 === 1 && 'bg-back-400')}>
        <th>{`${index + 1}.`}</th>
        <td className='px-2 py-1 text-center text-xs'>
          <div
            className='flex cursor-pointer items-center gap-2'
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className='font-semibold'>{data.address}</div>
            {data.address && (
              <BsChevronDown
                className={clsx(
                  'text-text-100 transition-all',
                  isExpanded ? 'rotate-180' : 'rotate-0'
                )}
              />
            )}
          </div>
        </td>
        <td className='px-2 py-1 text-center text-xs'>
          <div className='flex items-center justify-center gap-2'>
            <div
              className={`h-2.5 w-2.5 rounded-full ${
                STATUS[data.status].color
              }`}
            />
            <div className='capitalize'>{STATUS[data.status].text}</div>
          </div>
        </td>
        <td className='px-2 py-1 text-center text-xs'>
          {`ETH ${numeral(data.currentValue / ethDetail.currentPrice).format(
            '0,0.00[00]'
          )}`}
        </td>
        <td className='px-2 py-1 text-center text-xs'>
          {`USD ${numeral(data.currentValue).format('0,0.[00]')}`}
        </td>
        <td
          className={`px-2 py-1 text-center text-xs ${
            data.pnl > 0 ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {`${numeral(data.pnl).format('0,0.[00]')} %`}
        </td>
        <td className='px-2 py-1 text-center text-xs'>{data.dsa}</td>
        <td className='px-2 py-1 text-center text-xs'>
          {address ? (
            <div className='flex items-center gap-2'>
              <button
                className={clsx(
                  'disabled:text-text-100 flex w-24 items-center justify-center gap-2 rounded bg-[#2C96C3] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#2C96C3]/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 active:scale-95 disabled:bg-[#2C96C3]/50'
                )}
                disabled={
                  !tradeDetail.copyStatus.isCopyingOnContract ||
                  !tradeDetail.copyStatus.backendInfo
                }
                onClick={handleStopTrade}
              >
                {(isLoadingStopCopyTrading || tradeDetail.isStoping) && (
                  <Loader />
                )}
                Stop
              </button>
            </div>
          ) : (
            <div>
              <button
                className={clsx(
                  'flex w-24 items-center justify-center gap-2 rounded bg-[#2C96C3] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#2C96C3]/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 active:scale-95'
                )}
                onClick={openConnectModal}
              >
                Connect
              </button>
            </div>
          )}
        </td>
      </tr>
      {isExpanded &&
        data.positions.map((position, i) => (
          <tr key={i}>
            <td colSpan={8}>
              <PositionDetail position={position} />
            </td>
          </tr>
        ))}
    </>
  );
};

export default FollowDetail;
