import React, { ChangeEvent } from 'react';
import { useSelector } from 'react-redux';

import Input from '@/components/common/input';
import Loader from '@/components/common/loader';
import RcSlider from '@/components/rcSlider';

import { useAppDispatch } from '@/services';
import { selectBalance } from '@/services/balance';
import {
  selectTradeDetail,
  setCollateralRatio,
  setLeader,
  setLeverageRatio,
  startCopyTraderAsync,
} from '@/services/trade';
import { formatNum } from '@/utils';

const Follow = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const balance = useSelector(selectBalance);
  const {
    leader,
    copyStatus,
    collateral_ratio,
    leverage_ratio,
    collateral_limit_eth,
    busy,
  } = useSelector(selectTradeDetail);

  return (
    <div className='text-text-100 flex w-full flex-col text-sm'>
      <div className='flex w-full flex-col flex-wrap gap-y-4 py-10'>
        <div className='flex flex-col gap-y-1'>
          <label className='text-text-100 text-sm capitalize'>Balance</label>
          <div className='from-gradient-100 to-gradient-200 flex items-center rounded bg-gradient-to-r p-2'>
            <div className='flex-auto'>{formatNum(+balance)}</div>
            <div>ETH</div>
          </div>
        </div>
        <Input
          id='leader'
          name='leader'
          label='leader'
          type='text'
          autoComplete='leader'
          required
          className='text-text-200 w-full bg-transparent text-sm focus:outline-none'
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            dispatch(setLeader(e.target.value))
          }
          value={copyStatus.copy ? copyStatus.leader?.from : leader}
          disabled={copyStatus.copy}
        />
        <div className='flex w-full gap-x-4'>
          <Input
            id='collateral_ratio'
            name='collateral_ratio'
            label='collateral Ratio'
            type='number'
            autoComplete='collateral_ratio'
            min={0}
            max={10000000000}
            required
            className='text-text-200 w-full bg-transparent text-sm focus:outline-none'
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              dispatch(setCollateralRatio(e.target.value))
            }
            value={
              copyStatus.copy
                ? copyStatus.leader?.collateral_ratio
                : collateral_ratio
            }
            disabled={copyStatus.copy}
          />
          <Input
            id='leverage_ratio'
            name='leverage_ratio'
            type='number'
            label='leverage'
            autoComplete='leverage_ratio'
            min={1.2}
            max={50}
            required
            className='text-text-200 w-full bg-transparent text-sm focus:outline-none'
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              dispatch(setLeverageRatio(e.target.value))
            }
            value={
              copyStatus.copy
                ? copyStatus.leader?.leverage_ratio
                : leverage_ratio
            }
            disabled={copyStatus.copy}
          />
        </div>
        <div className='flex flex-col gap-y-10'>
          <div className='flex w-full flex-col gap-y-1'>
            <label>Leverage slider</label>
            <div className='pr-3'>
              <RcSlider
                value={
                  copyStatus.copy
                    ? copyStatus.leader?.leverage_ratio
                    : leverage_ratio
                }
                setValue={setLeverageRatio}
              />
            </div>
          </div>
        </div>
        <div className='mt-5 flex flex-col'>
          <button
            className='bg-primary-100 hover:bg-hover-200 flex w-full justify-center rounded p-3 text-sm text-white shadow-sm focus-visible:outline-none'
            disabled={busy}
            onClick={() =>
              dispatch(
                startCopyTraderAsync({
                  leader,
                  collateral_ratio,
                  leverage_ratio,
                  collateral_limit_eth,
                })
              )
            }
          >
            {busy ? <Loader /> : copyStatus.copy ? 'Stop' : 'Copy'}
          </button>
        </div>
      </div>
      <p className='text-xs'>NOTICE: Set following address and your ratio.</p>
    </div>
  );
};

export default Follow;
