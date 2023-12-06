import { useConnectModal } from '@rainbow-me/rainbowkit';
import BigNumber from 'bignumber.js';
import Link from 'next/link';
import numeral from 'numeral';
import React, { useCallback, useState } from 'react';
import { BiLinkExternal } from 'react-icons/bi';
import { useSelector } from 'react-redux';
import { parseEther } from 'viem';
import {
  useAccount,
  useBalance,
  useContractRead,
  useContractWrite,
} from 'wagmi';

import useNotification from '@/hooks/useNotification';

import Button from '@/components/common/button';
import Copy from '@/components/common/copy';
import Loader from '@/components/common/loader';

import { COPY_TRADER_ACCOUNT } from '@/configs';
import { useAppDispatch } from '@/services';
import { selectUserdata } from '@/services/auth';
import {
  getCopyStatusAsync,
  selectTradeDetail,
  stopCopyTraderAsync,
} from '@/services/trade';
import { classNames, shortAddress } from '@/utils';

const Withdraw = (): JSX.Element => {
  const notification = useNotification();
  const dispatch = useAppDispatch();
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const user = useSelector(selectUserdata);
  const tradeDetail = useSelector(selectTradeDetail);

  const [withdrawAmount, setWithdrawAmount] = useState<BigNumber>(BigNumber(0));

  // Get balance of copyTrader account
  const {
    data: contractBalance,
    isError: isFetchBalanceError,
    isLoading: isFetchBalanceLoading,
    refetch: refetchContractBalance,
  } = useBalance({
    address: tradeDetail.copyTraderAccount.copyAccount as `0x${string}`,
    enabled: !!tradeDetail.copyTraderAccount.copyAccount,
    watch: true,
  });

  // Get owner wallet address of copyTrader account
  const { data: withdrawAddress } = useContractRead({
    address: tradeDetail.copyTraderAccount.copyAccount as `0x${string}`,
    abi: COPY_TRADER_ACCOUNT.abi,
    functionName: 'owner',
  });

  const { data: isCopyTrading } = useContractRead({
    address: tradeDetail.copyTraderAccount.copyAccount as `0x${string}`,
    abi: COPY_TRADER_ACCOUNT.abi,
    functionName: 'isCopyTrading',
    enabled: !!tradeDetail.copyTraderAccount.copyAccount,
    watch: true,
  });

  const {
    data: resultWithdraw,
    writeAsync: withdraw,
    isLoading: isLoadingWithdraw,
  } = useContractWrite({
    address: tradeDetail.copyTraderAccount.copyAccount as `0x${string}`,
    abi: COPY_TRADER_ACCOUNT.abi,
    functionName: 'withdrawETH',
    onSuccess() {
      refetchContractBalance?.();
      notification('Confirmed withdraw successfully.', 'success');
      setWithdrawAmount(BigNumber(0));
    },
  });

  const {
    writeAsync: stopCopyTradingContract,
    isLoading: isLoadingStopCopyTrading,
  } = useContractWrite({
    address: tradeDetail.copyTraderAccount.copyAccount as `0x${string}`,
    abi: COPY_TRADER_ACCOUNT.abi,
    functionName: 'stopCopyTrading',
  });

  const handleMaxAmount = () => {
    const cAmount = contractBalance?.formatted || '0';

    setWithdrawAmount(BigNumber(cAmount));
  };

  const handleWithdraw = useCallback(() => {
    if (withdrawAddress && address !== withdrawAddress.toString())
      return notification('Please check owner address', 'error');

    withdraw({
      args: [parseEther(withdrawAmount.toString())],
    }).catch(() => {
      notification('Canceled Metamask.', 'warning');
    });
  }, [address, notification, withdraw, withdrawAddress, withdrawAmount]);

  const handleStopTrade = useCallback(async () => {
    await stopCopyTradingContract().catch(() => {
      notification('Canceled Metamask.', 'warning');
    });

    if (tradeDetail.copyStatus.backendInfo?.from) {
      dispatch(
        stopCopyTraderAsync({
          user_id: `${user.id}`,
          wallet: `${address}`,
          leader_address: tradeDetail.copyStatus.backendInfo?.from,
        })
      ).then((payload: any) => {
        if (payload?.error) return;
        notification('Stop copy trading successfully.', 'success');

        dispatch(
          getCopyStatusAsync({ user_id: `${user.id}`, wallet: `${address}` })
        );
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
    <div className='text-text-100 flex w-full flex-col text-sm'>
      <div className='flex w-full flex-col flex-wrap gap-y-4 py-10'>
        {tradeDetail.copyTraderAccount.copyAccount ? (
          <>
            <div className='flex flex-col gap-1'>
              <label className='text-text-200 text-sm capitalize'>
                Smart Contract Balance
              </label>
              <div className='relative flex items-center rounded bg-white/5 px-3 py-2'>
                <div className='flex-auto'>
                  {numeral(contractBalance?.formatted).format('0,0.[00000]')}
                </div>
                <div>ETH</div>
              </div>
              {isFetchBalanceLoading && (
                <div className='flex items-center gap-1 text-xs'>
                  <Loader size='11px' />
                  <div>Fetching balance from address ...</div>
                </div>
              )}
              {!isFetchBalanceLoading && isFetchBalanceError && (
                <div className='text-xs text-red-600'>
                  Fetching balance is failed.
                </div>
              )}
            </div>

            <div className='flex flex-col gap-1'>
              <label className='text-text-200 text-sm capitalize'>
                <div>withdraw address</div>
              </label>
              <div className='text-text-200 relative flex items-center rounded bg-white/5 px-3 py-2'>
                <div className='flex-auto'>
                  {shortAddress(withdrawAddress?.toString() || '')}
                </div>
                <Copy toCopy={withdrawAddress?.toString() || ''} />
              </div>
              {withdrawAddress && withdrawAddress?.toString() !== address && (
                <div className='text-xs text-red-600'>
                  Different withdraw address with owner
                </div>
              )}
            </div>

            <div className='mt-10 flex flex-col gap-1'>
              <label className='text-text-200 flex items-center justify-between text-sm capitalize'>
                <div>withdraw amount</div>
                <div
                  className='text-primary-100 cursor-pointer'
                  onClick={handleMaxAmount}
                >
                  Max
                </div>
              </label>
              <div className='focus-within:shadow-inputFocus group flex w-full items-center gap-1 rounded bg-white/5 px-3'>
                <input
                  type='number'
                  className='block flex-auto border-0 bg-transparent px-0 py-1.5 text-white focus:outline-0 focus:ring-0 sm:text-sm sm:leading-6'
                  value={withdrawAmount?.toNumber()}
                  onChange={(e) =>
                    setWithdrawAmount(BigNumber(e.target.value || '0'))
                  }
                />
                <div>ETH</div>
              </div>
              {Number(contractBalance?.formatted) <
                withdrawAmount?.toNumber() && (
                <div className='text-xs text-red-500'>
                  Exceeds withdraw balance
                </div>
              )}
            </div>
          </>
        ) : (
          <div className='text-text-200 text-center'>
            Please build copy trader account.
          </div>
        )}

        {resultWithdraw && (
          <div className='flex items-center justify-between'>
            <div className='text-xs'>Trasanction ID</div>
            <Link
              href={`https://arbiscan.io/tx/${resultWithdraw.hash}`}
              target='_blank'
            >
              <div className='text-text-200 flex items-center gap-1 text-xs'>
                {shortAddress(resultWithdraw.hash, 12)}
                <BiLinkExternal />
              </div>
            </Link>
          </div>
        )}

        {(isCopyTrading || tradeDetail.copyStatus.isCopyingOnContract) && (
          <div className='text-xs text-red-600'>
            You can not withdraw from contract. please stop Copy Trading on
            contract
          </div>
        )}

        {(isCopyTrading || tradeDetail.copyStatus.isCopyingOnContract) && (
          <button
            className={classNames(
              'flex w-full items-center justify-center gap-2 rounded bg-[#2C96C3] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#2C96C3]/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 active:scale-95'
            )}
            onClick={handleStopTrade}
          >
            {(isLoadingStopCopyTrading || tradeDetail.isStoping) && <Loader />}
            Stop Copy Trading
          </button>
        )}

        <div className='mt-5'>
          {isConnected && address ? (
            <Button
              disabled={
                !!isCopyTrading ||
                tradeDetail.copyStatus.isCopyingOnContract ||
                withdrawAmount.toNumber() === 0 ||
                Number(contractBalance?.value) === 0 ||
                Number(contractBalance?.formatted) < withdrawAmount.toNumber()
              }
              loading={isLoadingWithdraw}
              onClick={handleWithdraw}
            >
              Withdraw
            </Button>
          ) : (
            <Button onClick={openConnectModal}>Connect Wallet</Button>
          )}
        </div>
      </div>
      <p className='text-xs'>NOTICE: Withdraw selected address and amount.</p>
    </div>
  );
};

export default Withdraw;
