import BigNumber from 'bignumber.js';
import Link from 'next/link';
import numeral from 'numeral';
import React, { useCallback, useEffect, useState } from 'react';
import { AiOutlineCheck, AiOutlineCheckCircle } from 'react-icons/ai';
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

import { COPY_TRADER_ACCOUNT, COPY_TRADER_INDEX } from '@/configs';
import { useAppDispatch } from '@/services';
import { selectUserdata } from '@/services/auth';
import {
  selectIsShowCopyTradeModal,
  setIsShowCopyTradeModal,
} from '@/services/global';
import {
  getCopyStatusAsync,
  selectTradeDetail,
  setLeader,
  startCopyTraderAsync,
} from '@/services/trade';
import { shortAddress } from '@/utils';

import Copy from '../common/copy';
import Loader from '../common/loader';
import Tooltip from '../common/tooltip';
import { HeadlessUiModal } from '../modal';

type ActionDetailType = {
  id: string;
  title: string;
  description: string;
  label: string;
};

type ActionStatusType = {
  isActive: boolean;
  isLoading: boolean;
  value: React.ReactNode;
  disabled: boolean;
  onSubmit: any;
} & ActionDetailType;

const CopyTraderModal = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const notification = useNotification();
  const isShow = useSelector(selectIsShowCopyTradeModal);

  const user = useSelector(selectUserdata);
  const tradeDetail = useSelector(selectTradeDetail);

  const [depositAmount, setDepositAmount] = useState<BigNumber>(BigNumber(0));

  const [actionDetails, setActionDetails] = useState<ActionDetailType[]>([]);
  const [actionsStatus, setActionsStatus] = useState<ActionStatusType[]>([]);
  const [currentActionIndex, setCurrentActionIndex] = useState<number>(0);
  const [currentActionStatus, setCurrentActionStatus] =
    useState<ActionStatusType>();

  const lastActionState = actionsStatus[actionsStatus.length - 1];

  const { address } = useAccount();

  const { data: accountBalance } = useBalance({
    address: address,
    enabled: !!address && address?.toString() !== zeroAddress,
    watch: true,
  });

  const { data: copyTraderAccount, refetch: refetchCopyTraderAccount } =
    useContractRead({
      address: COPY_TRADER_INDEX.address as `0x${string}`,
      abi: COPY_TRADER_INDEX.abi,
      functionName: 'getCopyTraderAccount',
      args: [address],
      enabled: !!address,
      watch: true,
    });

  const { data: contractBalance, refetch: refetchContractBalance } = useBalance(
    {
      address: `${copyTraderAccount}` as `0x${string}`,
      enabled:
        !!copyTraderAccount && copyTraderAccount.toString() !== zeroAddress,
      watch: true,
    }
  );

  const { data: isCopyTrading, refetch: refetchIsCopyTrading } =
    useContractRead({
      address: `${copyTraderAccount}` as `0x${string}`,
      abi: COPY_TRADER_ACCOUNT.abi,
      functionName: 'isCopyTrading',
      enabled:
        !!copyTraderAccount && copyTraderAccount.toString() !== zeroAddress,
      watch: true,
    });

  const {
    data: buildCopyTraderAccount,
    writeAsync: writeBuildCopyTraderAccount,
    isSuccess: isSuccessBuildAccount,
    isLoading: isLoadingBuildAccount,
  } = useContractWrite({
    address: COPY_TRADER_INDEX.address as `0x${string}`,
    abi: COPY_TRADER_INDEX.abi,
    functionName: 'buildCopyTraderAccount',
    onSuccess: () => {
      refetchCopyTraderAccount?.();
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const {
    writeAsync: startCopyTradingContract,
    isSuccess: isSuccessStartCopyTrading,
    isLoading: isLoadingStartCopyTrading,
  } = useContractWrite({
    address: `${copyTraderAccount}` as `0x${string}`,
    abi: COPY_TRADER_ACCOUNT.abi,
    functionName: 'startCopyTrading',
    onSuccess: () => {
      refetchIsCopyTrading?.();
    },
    onError: (err) => {
      console.log(err);
    },
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
      getGasAmount(depositAmount) > 0,
  });

  const {
    isLoading: isDepositLoading,
    isSuccess: isDepositSuccess,
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

  const handleChangeDepositAmount = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = new BigNumber(e.target.value || '0');
      const balance = new BigNumber(accountBalance?.formatted || 0);

      if (inputValue.gt(balance)) setDepositAmount(balance);
      else setDepositAmount(inputValue);
    },
    [accountBalance]
  );

  const handleMaxAmount = () => {
    const cAmount = accountBalance?.formatted || '0';

    setDepositAmount(BigNumber(cAmount));
  };

  const startCopyTrading = useCallback(() => {
    return new Promise((resolve) => {
      dispatch(
        startCopyTraderAsync({
          user_id: `${user.id}`,
          wallet: `${address}`,
          leader_address: tradeDetail.leader,
          collateral_ratio: Number(tradeDetail.collateral_ratio),
          leverage_ratio: tradeDetail.leverage_ratio,
        })
      ).then((payload: any) => {
        if (payload?.error) return;
        notification('You have successfully logged in.', 'success');

        dispatch(
          getCopyStatusAsync({ user_id: `${user.id}`, wallet: `${address}` })
        );

        resolve('');
      });
    });
  }, [
    address,
    dispatch,
    notification,
    tradeDetail.collateral_ratio,
    tradeDetail.leader,
    tradeDetail.leverage_ratio,
    user.id,
  ]);

  const handleSubmit = useCallback(() => {
    if (currentActionStatus?.isActive) {
      setCurrentActionIndex((prev) => prev + 1);
    } else {
      currentActionStatus?.onSubmit().catch(() => {
        notification('Canceled Metamask.', 'warning');
      });
    }
  }, [currentActionStatus, notification]);

  const handleClose = () => {
    setCurrentActionIndex(0);
    dispatch(setIsShowCopyTradeModal(false));
  };

  useEffect(() => {
    setCurrentActionIndex(0);
  }, [isShow]);

  useEffect(() => {
    if (actionsStatus.length) {
      const current = actionsStatus[currentActionIndex];

      if (current.isActive) {
        const max = actionsStatus.length - 1;
        const nextActionIndex = currentActionIndex + 1;

        setCurrentActionIndex(nextActionIndex > max ? max : nextActionIndex);
      } else {
        setCurrentActionStatus(actionsStatus[currentActionIndex]);
      }
    }
  }, [actionsStatus, currentActionIndex, isShow]);

  useEffect(() => {
    const actionsStatus: ActionStatusType[] = actionDetails.map(
      (actionDetail) => {
        let isActive = false;
        let value;
        let disabled = false;
        let onSubmit;
        let isLoading = false;

        const isContractTraderAccount =
          copyTraderAccount?.toString() !== zeroAddress;

        switch (actionDetail.id) {
          case 'contractAddress':
            value = (
              <div className='flex items-center gap-1'>
                {isContractTraderAccount && (
                  <>
                    <div className='flex-auto'>
                      {shortAddress(`${copyTraderAccount}`, 6)}
                    </div>
                    <Copy toCopy={`${copyTraderAccount}`} />
                  </>
                )}
              </div>
            );
            isActive = isContractTraderAccount || isSuccessBuildAccount;
            isLoading = !!isLoadingBuildAccount;
            disabled = !address;
            onSubmit = writeBuildCopyTraderAccount;
            break;
          case 'contractBalance':
            value = (
              <div>
                {isContractTraderAccount &&
                  `${numeral(contractBalance?.formatted).format(
                    '0,0.[00000]'
                  )} ETH`}
              </div>
            );
            isActive =
              isContractTraderAccount &&
              (Number(contractBalance?.formatted) > 0 ? true : false);
            isLoading = !!isDepositLoading;
            disabled = depositAmount.eq(0);
            onSubmit = depositAction;
            break;
          case 'isCopyTradingContract':
            value = isCopyTrading ? (
              <AiOutlineCheckCircle className='h-5 w-5 text-green-600' />
            ) : (
              <></>
            );
            isActive = !!isCopyTrading;
            isLoading = !!isLoadingStartCopyTrading;
            disabled = !copyTraderAccount;
            onSubmit = startCopyTradingContract;
            break;
          case 'isCopyTradingBackend':
            value = tradeDetail.copyStatus.isCopyingOnContract ? (
              <AiOutlineCheckCircle className='h-5 w-5 text-green-600' />
            ) : (
              <></>
            );
            isActive = !!tradeDetail.copyStatus.isCopyingOnContract;
            isLoading = !!tradeDetail.isStarting;
            disabled = !tradeDetail.leader;
            onSubmit = startCopyTrading;
            break;
          default:
            break;
        }

        return {
          ...actionDetail,
          value,
          isActive,
          isLoading,
          disabled,
          onSubmit,
        };
      }
    );
    setActionsStatus(actionsStatus);
  }, [
    tradeDetail,
    contractBalance,
    isCopyTrading,
    actionDetails,
    writeBuildCopyTraderAccount,
    address,
    depositAmount,
    isLoadingBuildAccount,
    isDepositLoading,
    isSuccessBuildAccount,
    isDepositSuccess,
    isSuccessStartCopyTrading,
    isLoadingStartCopyTrading,
    startCopyTradingContract,
    startCopyTrading,
    copyTraderAccount,
    depositAction,
  ]);

  useEffect(() => {
    isSuccessBuildAccount && refetchCopyTraderAccount?.();
  }, [isSuccessBuildAccount, refetchCopyTraderAccount]);

  useEffect(() => {
    isDepositSuccess && refetchContractBalance?.();
  }, [isDepositSuccess, refetchContractBalance]);

  useEffect(() => {
    isSuccessStartCopyTrading && refetchIsCopyTrading?.();
  }, [isSuccessStartCopyTrading, refetchIsCopyTrading]);

  useEffect(() => {
    const actionDetail: ActionDetailType[] = [
      {
        id: 'contractAddress',
        title: 'Create copy trader account',
        description:
          'To start copy trading, user needs to create the contract for wallet address',
        label: 'Create Account',
      },
      {
        id: 'contractBalance',
        title: 'Deposit on copy trader account',
        description:
          'To follow the copy trader, copy trader account has some tokens to trade',
        label: 'Deposit token',
      },
      {
        id: 'isCopyTradingContract',
        title: 'Start copy trading on contract',
        description: 'To start copy trading, user needs to enable contract',
        label: 'Enable Copy Trading',
      },
      {
        id: 'isCopyTradingBackend',
        title: 'Start copy trading on backend',
        description:
          'To start copy trading, user needs to create the contract for wallet address',
        label: 'Start Copy Trading',
      },
    ];
    setActionDetails(actionDetail);
  }, []);

  return (
    <HeadlessUiModal.Controlled
      isOpen={isShow}
      maxWidth='md'
      onDismiss={handleClose}
    >
      <div className='flex w-full flex-col space-y-6'>
        <HeadlessUiModal.Header
          header='START COPY TRADING'
          onClose={handleClose}
        />
        <HeadlessUiModal.Content>
          <div className='flex flex-col gap-5'>
            <div className='border-border-200 text-text-200 rounded border px-4 py-4 text-sm'>
              <div className='flex flex-col gap-4'>
                {actionsStatus.map(
                  (status: ActionStatusType, index: number) => (
                    <div key={index} className='flex flex-col gap-1'>
                      <div className='flex items-center justify-between'>
                        <div>{`${index + 1}. ${status.title}`}</div>
                        <div className='text-xs capitalize'>{status.value}</div>
                      </div>
                      <div className='text-text-100 pl-2 text-xs'>
                        {status.description}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
            <div className='flex items-center justify-center gap-4'>
              {actionsStatus.map((status: ActionStatusType, index: number) => (
                <Tooltip
                  key={index}
                  isTag={true}
                  position='top'
                  content='Start copy trader on smart contract'
                >
                  <div className='relative'>
                    {!status.isActive && (
                      <div className='border-border-200 flex h-10 w-10 items-center justify-center rounded-full border p-1 text-white'>
                        {index + 1}
                      </div>
                    )}
                    {status.isActive && (
                      <div className='relative flex h-10 w-10 items-center justify-center rounded-full border border-green-500 p-1 text-white'>
                        <AiOutlineCheck className='h-5 w-5 text-green-500' />
                      </div>
                    )}
                    {status.isLoading && (
                      <div className='absolute inset-0 h-10 w-10'>
                        <Loader size='40px' strokewidth={1.5} />
                      </div>
                    )}
                  </div>
                </Tooltip>
              ))}
            </div>
            {currentActionIndex === 1 &&
              Number(contractBalance?.value) === 0 && (
                <div className='flex flex-col gap-1'>
                  <label className='text-text-200 flex items-center justify-between text-sm capitalize'>
                    <div>deposit amount</div>
                    <div className='flex items-baseline gap-1'>
                      <div className='text-text-100 mr-1 text-[10px]'>
                        available
                      </div>
                      {numeral(accountBalance?.formatted).format('0,0.00[00]')}
                      <div className='text-text-100 text-[10px]'>ETH</div>
                      <div
                        className='text-primary-100'
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
                      onChange={handleChangeDepositAmount}
                    />
                    <div className='text-text-100'>ETH</div>
                  </div>
                </div>
              )}
            {currentActionIndex === 3 && (
              <div className='flex flex-col gap-1'>
                <label className='text-text-200 flex items-center justify-between text-sm capitalize'>
                  <div>Leader address</div>
                </label>
                <div className='focus-within:shadow-inputFocus group flex w-full items-center gap-1 rounded bg-white/5 px-3'>
                  <input
                    type='text'
                    className='block flex-auto border-0 bg-transparent px-0 py-1.5 text-white focus:outline-0 focus:ring-0 sm:text-sm sm:leading-6'
                    value={tradeDetail.leader}
                    onChange={(e) => dispatch(setLeader(e.target.value))}
                  />
                  <div className='text-text-100'>
                    <Copy toCopy={tradeDetail.leader || ''} />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className='mt-5 flex flex-col gap-1'>
            {buildCopyTraderAccount?.hash && (
              <div className='flex items-center justify-between'>
                <div className='text-text-100 text-xs'>Trasanction ID</div>
                <Link
                  href={`https://arbiscan.io/tx/${buildCopyTraderAccount.hash}`}
                  target='_blank'
                >
                  <div className='text-text-200 flex items-center gap-1 text-xs'>
                    {shortAddress(buildCopyTraderAccount.hash, 12)}
                    <BiLinkExternal />
                  </div>
                </Link>
              </div>
            )}
          </div>
        </HeadlessUiModal.Content>
        <HeadlessUiModal.Actions>
          {!lastActionState?.isActive ? (
            <HeadlessUiModal.Action
              onClick={handleSubmit}
              isLoading={currentActionStatus?.isLoading}
              disabled={currentActionStatus?.disabled}
            >
              {currentActionStatus?.label}
            </HeadlessUiModal.Action>
          ) : (
            <HeadlessUiModal.Action onClick={handleClose}>
              Done
            </HeadlessUiModal.Action>
          )}
        </HeadlessUiModal.Actions>
      </div>
    </HeadlessUiModal.Controlled>
  );
};

export default CopyTraderModal;
