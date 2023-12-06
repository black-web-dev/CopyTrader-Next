import { useConnectModal } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import numeral from 'numeral';
import React, { useCallback, useEffect } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { useSelector } from 'react-redux';
import { zeroAddress } from 'viem';
import { useAccount, useBalance, useContractWrite } from 'wagmi';

import useNotification from '@/hooks/useNotification';

import Copy from '@/components/common/copy';
import Loader from '@/components/common/loader';
import NumericalInput from '@/components/common/numericalInput';
import RcSlider from '@/components/rcSlider';

import { COPY_TRADER_ACCOUNT } from '@/configs';
import { useAppDispatch } from '@/services';
import { selectUserdata } from '@/services/auth';
import { getConfigInfoAsync } from '@/services/dashboard';
import { setIsShowCopyTradeModal } from '@/services/global';
import { selectETHDetail } from '@/services/pair';
import {
  getCopyStatusAsync,
  selectTradeDetail,
  setCollateralRatio,
  setLeader,
  setLeverageRatio,
  stopCopyTraderAsync,
} from '@/services/trade';
import { classNames } from '@/utils';

const Follow = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const notification = useNotification();
  const { address } = useAccount();
  const { openConnectModal } = useConnectModal();
  const user = useSelector(selectUserdata);
  const ethDetail = useSelector(selectETHDetail);
  // const configInfoStatus = useSelector(selectConfigInfoStatus);
  const tradeDetail = useSelector(selectTradeDetail);

  const { data: balance } = useBalance({
    address: address,
    enabled: !!address && address.toString() !== zeroAddress,
    watch: true,
  });

  const colleateral_size = tradeDetail.copyStatus.isCopyingOnContract
    ? tradeDetail.copyStatus.backendInfo?.collateral_ratio || ''
    : tradeDetail.collateral_ratio;
  const leverage_ratio = tradeDetail.copyStatus.isCopyingOnContract
    ? tradeDetail.copyStatus.backendInfo?.leverage_ratio || 0
    : tradeDetail.leverage_ratio;
  const trade_size = Number(colleateral_size || 0) * leverage_ratio;

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

  useEffect(() => {
    dispatch(getConfigInfoAsync({ user_id: `${user.id}` }));
  }, [dispatch, user]);

  return (
    <>
      <div className='text-text-100 flex w-full flex-col text-sm'>
        <div className='flex w-full flex-col flex-wrap gap-y-4 py-10'>
          <div className='flex flex-col gap-1'>
            <label className='text-text-200 flex items-center justify-between text-sm capitalize'>
              Selected Trader Wallet
            </label>
            <div className='focus-within:shadow-inputFocus text-text-200 relative flex h-[36px] items-center gap-4 rounded bg-white/5 px-3 py-2'>
              <input
                type='text'
                placeholder='Please select the leader address for trading'
                className='placeholder:text-text-100 block flex-auto border-0 bg-transparent px-0 py-1.5 text-white placeholder:text-xs focus:outline-0 focus:ring-0 sm:text-sm sm:leading-6'
                value={
                  tradeDetail.copyStatus.isCopyingOnContract
                    ? tradeDetail.copyStatus.backendInfo?.from || ''
                    : tradeDetail.leader || ''
                }
                disabled={tradeDetail.copyStatus.isCopyingOnContract}
                onChange={(e) => dispatch(setLeader(e.target.value))}
              />
              {(
                tradeDetail.copyStatus.isCopyingOnContract
                  ? tradeDetail.copyStatus.backendInfo?.from
                  : tradeDetail.leader
              ) ? (
                <Copy
                  toCopy={
                    tradeDetail.copyStatus.backendInfo?.from ||
                    tradeDetail.leader
                  }
                />
              ) : (
                <Link href='/track'>
                  <AiOutlineSearch />
                </Link>
              )}
            </div>
          </div>
          <div className='flex flex-col gap-y-1'>
            <label className='text-text-200 flex items-center justify-between text-sm capitalize'>
              <div>My Balance</div>
              <div>
                {`ETH ${numeral(balance?.formatted).format('0,0.[000]')}`}{' '}
                {`($ ${numeral(
                  Number(balance?.formatted) * ethDetail.currentPrice
                ).format('0,0.[000]')})`}
              </div>
            </label>
            <div className='focus-within:shadow-inputFocus group flex w-full items-center gap-1 rounded bg-white/5 px-3 py-2'>
              <div className='flex flex-auto flex-col gap-1'>
                <div className='text-text-200 text-xs'>Collateral Size</div>
                <NumericalInput
                  disabled={tradeDetail.copyStatus.isCopyingOnContract}
                  value={colleateral_size}
                  onChange={(value) => dispatch(setCollateralRatio(value))}
                />
              </div>
              <div className='flex flex-col items-end'>
                <div className='text-text-100 text-xs'>{`$ ${numeral(
                  Number(tradeDetail.collateral_ratio) * ethDetail.currentPrice
                ).format('0,0.[000]')}`}</div>
                <div className='text-text-100'>ETH</div>
              </div>
            </div>
          </div>
          <div className='mb-5 flex flex-col gap-y-10'>
            <div className='flex w-full flex-col gap-y-1'>
              <label>Leverage</label>
              <div className='pl-3'>
                <RcSlider
                  value={leverage_ratio}
                  disabled={tradeDetail.copyStatus.isCopyingOnContract}
                  setValue={(value) => dispatch(setLeverageRatio(value))}
                />
              </div>
            </div>
          </div>

          <div className='flex flex-col gap-1 py-2'>
            <div className='flex items-center justify-between text-xs'>
              <div className='capitalize'>collateral</div>
              <div className='text-text-200'>
                $
                {numeral(
                  Number(colleateral_size) * ethDetail.currentPrice
                ).format('0,0.0[0]')}
              </div>
            </div>
            <div className='flex items-center justify-between'>
              <div className='capitalize'>leverage</div>
              <div className='text-text-200'>{`${leverage_ratio}x`}</div>
            </div>
            <div className='flex items-center justify-between'>
              <div className='capitalize'>Trade Size</div>
              <div className='text-text-200'>
                $
                {numeral(trade_size * ethDetail.currentPrice).format(
                  '0,0.0[0]'
                )}
              </div>
            </div>
          </div>

          {address ? (
            <div className='flex items-center gap-2'>
              <button
                className={classNames(
                  'bg-primary-100 hover:bg-primary-100/50 disabled:text-text-100 disabled:bg-primary-100/50 flex w-full items-center justify-center gap-2 rounded px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 active:scale-95 disabled:cursor-not-allowed'
                )}
                disabled={
                  tradeDetail.copyStatus.isCopyingOnContract ||
                  !(Number(colleateral_size) > 0)
                }
                onClick={handleStartTrade}
              >
                {tradeDetail.isStarting && <Loader />}
                Start Copy Trading
              </button>
              <button
                className={classNames(
                  'disabled:text-text-100 hidden w-full items-center justify-center gap-2 rounded bg-[#2C96C3] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#2C96C3]/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 active:scale-95 disabled:bg-[#2C96C3]/50'
                )}
                disabled={
                  !tradeDetail.copyStatus.isCopyingOnContract ||
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
