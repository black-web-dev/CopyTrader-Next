import { useConnectModal } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import numeral from 'numeral';
import React, { useCallback } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { useSelector } from 'react-redux';
import { useAccount, useBalance, useContractWrite } from 'wagmi';

import useNotification from '@/hooks/useNotification';

import Copy from '@/components/common/copy';
import Loader from '@/components/common/loader';
import RcSlider from '@/components/rcSlider';

import { COPY_TRADER_ACCOUNT } from '@/configs';
import { useAppDispatch } from '@/services';
import { selectUserdata } from '@/services/auth';
import { setIsShowCopyTradeModal } from '@/services/global';
import {
  getCopyStatusAsync,
  selectTradeDetail,
  setLeverageRatio,
  stopCopyTraderAsync,
} from '@/services/trade';
import { classNames, shortAddress } from '@/utils';

const Follow = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const notification = useNotification();
  const { address } = useAccount();
  const { openConnectModal } = useConnectModal();
  const user = useSelector(selectUserdata);
  const tradeDetail = useSelector(selectTradeDetail);

  const { data: balance } = useBalance({
    address: address,
    enabled: !!address,
    watch: true,
  });

  const {
    writeAsync: stopCopyTradingContract,
    isLoading: isLoadingStopCopyTrading,
  } = useContractWrite({
    address: tradeDetail.copyTraderAccount.copyAccount as `0x${string}`,
    abi: COPY_TRADER_ACCOUNT.abi,
    functionName: 'stopCopyTrading',
  });

  const handleStartTrade = () => {
    dispatch(setIsShowCopyTradeModal(true));
  };

  const handleStopTrade = useCallback(async () => {
    if (address && user.id > 0 && tradeDetail.copyStatus.info?.from) {
      stopCopyTradingContract()
        .then(() => {
          dispatch(
            stopCopyTraderAsync({
              user_id: `${user.id}`,
              wallet: address,
              leader_address: tradeDetail.copyStatus.info?.from || '',
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
    tradeDetail.copyStatus.info?.from,
    user.id,
  ]);

  return (
    <>
      <div className='text-text-100 flex w-full flex-col text-sm'>
        <div className='flex w-full flex-col flex-wrap gap-y-4 py-10'>
          <div className='flex flex-col gap-1'>
            <label className='text-text-200 flex items-center justify-between text-sm capitalize'>
              Selected Trader Wallet
            </label>
            <div className='text-text-200 relative flex h-[36px] items-center rounded bg-white/5 px-3 py-2'>
              {(
                tradeDetail.copyStatus.isCopyTrading
                  ? tradeDetail.copyStatus.info?.from
                  : tradeDetail.leader
              ) ? (
                <>
                  <div className='flex-auto'>
                    {shortAddress(
                      tradeDetail.copyStatus.isCopyTrading
                        ? tradeDetail.copyStatus.info?.from || ''
                        : tradeDetail.leader || ''
                    )}
                  </div>
                  <Copy
                    toCopy={
                      tradeDetail.copyStatus.info?.from || tradeDetail.leader
                    }
                  />
                </>
              ) : (
                <>
                  <div className='text-text-100 flex-auto text-xs'>
                    Please select the leader address for trading
                  </div>
                  <Link href='/track'>
                    <AiOutlineSearch />
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className='flex flex-col gap-y-1'>
            <label className='text-text-200 flex items-center justify-between text-sm capitalize'>
              <div>My Balance</div>
              <div>
                {`ETH ${numeral(balance?.formatted).format('0,0.[000]')}`}{' '}
                {`(USD ${numeral(balance?.formatted).format('0,0.[000]')})`}
              </div>
            </label>
            <div className='flex items-center rounded bg-white/5 px-3 py-2'>
              <div className='flex flex-auto flex-col gap-1'>
                <div className='text-text-200 text-xs'>Trade Size</div>
                <div>{numeral(balance?.formatted).format('0,0.[00000]')}</div>
              </div>
              <div>ETH</div>
            </div>
          </div>
          <div className='mb-5 flex flex-col gap-y-10'>
            <div className='flex w-full flex-col gap-y-1'>
              <label>Leverage</label>
              <div className='pr-3'>
                <RcSlider
                  value={
                    tradeDetail.copyStatus.isCopyTrading
                      ? tradeDetail.copyStatus.info?.leverage_ratio || 0
                      : tradeDetail.leverage_ratio
                  }
                  disabled={tradeDetail.copyStatus.isCopyTrading}
                  setValue={(value) => dispatch(setLeverageRatio(value))}
                />
              </div>
            </div>
          </div>

          <div className='flex flex-col gap-1 py-2'>
            <div className='flex items-center justify-between text-xs'>
              <div className='capitalize'>collateral</div>
              <div className='text-text-200'>USD</div>
            </div>
            <div className='flex items-center justify-between'>
              <div className='capitalize'>leverage</div>
              <div className='text-text-200'>2.0x</div>
            </div>
            <div className='flex items-center justify-between'>
              <div className='capitalize'>entry price</div>
              <div className='text-text-200'>$1.834.14</div>
            </div>
            <div className='flex items-center justify-between'>
              <div className='capitalize'>liq. price</div>
              <div className='text-text-200'>$1.834.14</div>
            </div>
            <div className='flex items-center justify-between'>
              <div className='capitalize'>fees</div>
              <div className='text-text-200'>$1.00</div>
            </div>
          </div>

          {address ? (
            <div className='flex items-center gap-2'>
              <button
                className={classNames(
                  'bg-primary-100 hover:bg-primary-100/50 flex w-full items-center justify-center gap-2 rounded px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 active:scale-95',
                  tradeDetail.copyStatus.isCopyTrading &&
                    'bg-primary-100/50 text-text-100 cursor-not-allowed'
                )}
                disabled={tradeDetail.copyStatus.isCopyTrading}
                onClick={handleStartTrade}
              >
                {tradeDetail.isStarting && <Loader />}
                Start Copy Trading
              </button>
              <button
                className={classNames(
                  'flex w-full items-center justify-center gap-2 rounded bg-[#2C96C3] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#2C96C3]/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 active:scale-95',
                  !tradeDetail.copyStatus.isCopyTrading &&
                    'text-text-100 cursor-not-allowed bg-[#2C96C3]/50'
                )}
                disabled={
                  !tradeDetail.copyStatus.isCopyTrading ||
                  isLoadingStopCopyTrading
                }
                onClick={handleStopTrade}
              >
                {(isLoadingStopCopyTrading || tradeDetail.isStoping) && (
                  <Loader />
                )}
                Stop Copy Trading
              </button>
            </div>
          ) : (
            <div>
              <button
                className={classNames(
                  'flex w-full items-center justify-center gap-2 rounded bg-[#2C96C3] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#2C96C3]/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 active:scale-95'
                )}
                onClick={openConnectModal}
              >
                Connect Wallet
              </button>
            </div>
          )}
        </div>
        <p className='text-xs'>NOTICE: Set following address and your ratio.</p>
      </div>
    </>
  );
};

export default Follow;
