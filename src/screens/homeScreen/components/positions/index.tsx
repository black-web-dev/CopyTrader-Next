import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAccount, useContractRead } from 'wagmi';

import Pagination from '@/components/common/pagination';

import { COPY_TRADER_INDEX } from '@/configs';
import { useAppDispatch } from '@/services';
import { selectUserdata } from '@/services/auth';
import {
  FollowDetailType,
  getPositionsAsync,
  selectPage,
  selectPageSize,
  selectPositionData,
  selectSort,
  setPage,
  setSort,
} from '@/services/position';
import { selectTradeDetail } from '@/services/trade';
import { shortAddress } from '@/utils';

import Table from './table';

const Positions = ({ className }: { className: string }) => {
  const dispatch = useAppDispatch();
  const { address } = useAccount();
  const user = useSelector(selectUserdata);
  const page = useSelector(selectPage);
  const pageSize = useSelector(selectPageSize);
  const sort = useSelector(selectSort);
  const positionData = useSelector(selectPositionData);
  const tradeDetail = useSelector(selectTradeDetail);

  const { data: copyTraderAccount } = useContractRead({
    address: COPY_TRADER_INDEX.address as `0x${string}`,
    abi: COPY_TRADER_INDEX.abi,
    functionName: 'getCopyTraderAccount',
    args: [address],
    enabled: !!address,
    watch: true,
  });

  // currently we expect there is one follow address with several positions(Max 8)
  const followAddress =
    tradeDetail.copyStatus.backendInfo?.from || positionData.account || '';
  const isCopyTrading =
    tradeDetail.copyStatus.isCopyingOnContract &&
    tradeDetail.copyStatus.backendInfo?.to_timestamp === '0';

  const dsaAddress = shortAddress(
    tradeDetail.copyTraderAccount.copyAccount ||
      copyTraderAccount?.toString() ||
      ''
  );

  const [followDetail, setFollowDetail] = useState<FollowDetailType>({
    address: followAddress,
    status: 1, // 0: paused, 1: pending, 2: live
    currentValue: 0,
    pnl: 0,
    dsa: dsaAddress,
    positions: [],
  });

  useEffect(() => {
    let currentValue = 0;
    let pnl = 0;

    for (let i = 0; i < positionData.list.length; i++) {
      const position = positionData.list[i];
      currentValue += position.collateral;
      pnl += position.pnl;
    }

    if (isCopyTrading) {
      if (positionData.list.length > 0) {
        setFollowDetail((prev) => ({
          ...prev,
          address: followAddress,
          status: 2,
          currentValue,
          pnl,
          positions: positionData.list,
        }));
      } else {
        setFollowDetail((prev) => ({
          ...prev,
          address: followAddress,
          status: 1,
          currentValue,
          pnl,
          positions: positionData.list,
        }));
      }
    } else {
      setFollowDetail((prev) => ({
        ...prev,
        address: '',
        status: 0,
        currentValue,
        pnl,
        positions: positionData.list,
      }));
    }
  }, [followAddress, positionData.list, isCopyTrading]);

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

  const followItems =
    tradeDetail.copyStatus.isCopyingOnContract ||
    !tradeDetail.copyStatus.backendInfo
      ? [followDetail]
      : [];

  return (
    <div className={className}>
      <Table
        isFetching={false}
        data={followItems}
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

export default Positions;
