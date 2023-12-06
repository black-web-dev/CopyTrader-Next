import { useConnectModal } from '@rainbow-me/rainbowkit';
import BigNumber from 'bignumber.js';
import Link from 'next/link';
import numeral from 'numeral';
import React, { useCallback, useState } from 'react';
import { BiLinkExternal } from 'react-icons/bi';
import { useSelector } from 'react-redux';
import { parseEther, zeroAddress } from 'viem';
import {
  useAccount,
  useBalance,
  useContractRead,
  useContractWrite,
  usePrepareSendTransaction,
  useSendTransaction,
} from 'wagmi';

import useNotification from '@/hooks/useNotification';

import Button from '@/components/common/button';
import Conditional from '@/components/common/conditional';
import Copy from '@/components/common/copy';
import Loader from '@/components/common/loader';

import { COPY_TRADER_INDEX } from '@/configs';
import { useAppDispatch } from '@/services';
import { selectUserdata } from '@/services/auth';
import { getCopyTraderAccountAsync, selectTradeDetail } from '@/services/trade';
import { shortAddress } from '@/utils';

const Deposit = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const notification = useNotification();

  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const user = useSelector(selectUserdata);
  const tradeDetail = useSelector(selectTradeDetail);

  const [depositAmount, setDepositAmount] = useState<BigNumber>(BigNumber(0));

  const { data: balance } = useBalance({
    address: address,
    enabled: !!address && address.toString() !== zeroAddress,
    watch: true,
  });

  const { data: copyTraderAccount } = useContractRead({
    address: COPY_TRADER_INDEX.address as `0x${string}`,
    abi: COPY_TRADER_INDEX.abi,
    functionName: 'getCopyTraderAccount',
    args: [address],
    enabled: !!address,
    watch: true,
  });

  const {
    data: contractBalance,
    isError: isFetchBalanceError,
    isLoading: isFetchBalanceLoading,
    refetch: refetchContractBalance,
  } = useBalance({
    address: `${copyTraderAccount}` as `0x${string}`,
    enabled: copyTraderAccount?.toString() !== zeroAddress,
    watch: true,
  });

  const getGasAmount = (depositAmount: BigNumber) => {
    const depositAmountEther = parseEther(depositAmount.toString());

    const estimate = depositAmountEther - BigInt(100000000000000);

    return estimate > 0 ? estimate : BigInt(0);
  };

  const { config: depositConfig } = usePrepareSendTransaction({
    to: `${copyTraderAccount}` as `0x${string}`,
    value: getGasAmount(depositAmount),
    enabled:
      copyTraderAccount?.toString() !== zeroAddress &&
      BigNumber(balance?.formatted || '0').gt(depositAmount) &&
      getGasAmount(depositAmount) > 0,
  });

  const {
    data: resultDeposit,
    isLoading: isDepositLoading,
    sendTransactionAsync: depositAction,
  } = useSendTransaction({
    ...depositConfig,
    onSuccess: () => {
      notification('Confirmed deposit successfully.', 'success');
      refetchContractBalance?.();
      setDepositAmount(BigNumber(0));
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const {
    write: writeBuildCopyTraderAccount,
    isLoading: isLoadingBuildAccount,
  } = useContractWrite({
    address: COPY_TRADER_INDEX.address as `0x${string}`,
    abi: COPY_TRADER_INDEX.abi,
    functionName: 'buildCopyTraderAccount',
    onSuccess: () => {
      notification('Confirmed build successfully.', 'success');
      dispatch(
        getCopyTraderAccountAsync({
          user_id: `${user.id}`,
          wallet: `${address}`,
        })
      );
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const handleMaxAmount = () => {
    setDepositAmount(BigNumber(balance?.formatted || '0'));
  };

  const handleChangeAmount = (value: string) => {
    setDepositAmount(BigNumber(value || '0'));
  };

  const handleCreateCopyTraderAccount = useCallback(() => {
    writeBuildCopyTraderAccount?.();
  }, [writeBuildCopyTraderAccount]);

  const handleDeposit = useCallback(() => {
    depositAction?.().catch(() => {
      notification('Canceled Metamask.', 'warning');
    });
  }, [depositAction, notification]);

  const availableAmount = BigNumber(balance?.formatted || '0').gte(
    depositAmount
  );

  return (
    <div className='text-text-100 relative flex h-full w-full flex-col text-sm'>
      <div className='flex-auto'>
        <Conditional
          className='min-h-[100px]'
          loadingSize='40px'
          isLoading={tradeDetail.isFetching}
        >
          {tradeDetail.copyTraderAccount.copyAccount ||
          copyTraderAccount?.toString() !== zeroAddress ? (
            <div className='flex w-full flex-col flex-wrap gap-y-4 py-10'>
              <div className='flex flex-col gap-1'>
                <label className='text-text-200 text-sm capitalize'>
                  Smart Contract Address
                </label>
                <div className='text-text-200 relative flex items-center rounded bg-white/5 px-3 py-2'>
                  <div className='flex-auto'>
                    {shortAddress(
                      tradeDetail.copyTraderAccount.copyAccount ||
                        copyTraderAccount?.toString() ||
                        ''
                    )}
                  </div>
                  <Copy
                    toCopy={
                      tradeDetail.copyTraderAccount.copyAccount ||
                      copyTraderAccount?.toString() ||
                      ''
                    }
                  />
                </div>
              </div>

              <div className='flex flex-col gap-1'>
                <label className='text-text-200 text-sm capitalize'>
                  Balance
                </label>
                <div className='flex cursor-not-allowed items-center rounded bg-white/5 px-3 py-2'>
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

              <div className='mt-10 flex flex-col gap-1'>
                <label className='text-text-200 flex items-center justify-between text-sm capitalize'>
                  <div>deposit amount</div>
                  <div className='flex items-baseline gap-1'>
                    <div className='text-text-100 mr-1 text-[10px]'>
                      available
                    </div>
                    {numeral(balance?.formatted).format('0,0.[000]')}
                    <div className='text-[10px]'>ETH</div>
                    <div
                      className='text-primary-100 cursor-pointer'
                      onClick={handleMaxAmount}
                    >
                      Max
                    </div>
                  </div>
                </label>
                <div className='focus-within:shadow-inputFocus group flex w-full items-center gap-1 rounded bg-white/5 px-3'>
                  <input
                    type='number'
                    className='block flex-auto border-0 bg-transparent px-0 py-1.5 text-white focus:outline-0 focus:ring-0 sm:text-sm sm:leading-6'
                    value={depositAmount.toNumber()}
                    onChange={(e) => handleChangeAmount(e.target.value)}
                  />
                  <div>ETH</div>
                </div>
                {!availableAmount && (
                  <div className='text-xs text-red-600'>
                    Deposit Amount must be less than balance
                  </div>
                )}
              </div>

              {resultDeposit && (
                <div className='flex items-center justify-between'>
                  <div className='text-xs'>Trasanction ID</div>
                  <Link
                    href={`https://arbiscan.io/tx/${resultDeposit.hash}`}
                    target='_blank'
                  >
                    <div className='text-text-200 flex items-center gap-1 text-xs'>
                      {shortAddress(resultDeposit.hash, 12)}
                      <BiLinkExternal />
                    </div>
                  </Link>
                </div>
              )}

              <div className='mt-5'>
                <Button
                  disabled={depositAmount.eq(0)}
                  loading={isDepositLoading}
                  onClick={handleDeposit}
                >
                  Deposit
                </Button>
              </div>
            </div>
          ) : (
            <div className='flex w-full flex-col flex-wrap gap-y-4 py-10'>
              {address && isConnected && (
                <div className='flex flex-col gap-2'>
                  <label className='text-text-200 flex items-center justify-between text-sm capitalize'>
                    Connect wallet address
                  </label>
                  <div className='text-text-200 relative flex items-center rounded bg-white/5 px-3 py-2'>
                    <div className='flex-auto'>
                      {shortAddress(address || '')}
                    </div>
                    <Copy toCopy={address || ''} />
                  </div>
                </div>
              )}

              <div className='mt-5'>
                {isConnected && address ? (
                  <Button
                    loading={isLoadingBuildAccount}
                    onClick={handleCreateCopyTraderAccount}
                  >
                    Create CopyTrader Account
                  </Button>
                ) : (
                  <Button onClick={openConnectModal}>Connect Wallet</Button>
                )}
              </div>
            </div>
          )}
        </Conditional>
      </div>
      {tradeDetail.copyTraderAccount.copyAccount ? (
        <p className='text-xs'>
          NOTICE: Send only ETH to this deposit address.
        </p>
      ) : (
        <p className='text-xs'>NOTICE: Create CopyTrader Account.</p>
      )}
    </div>
  );
};

export default Deposit;
