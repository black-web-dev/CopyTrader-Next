import React from 'react';
import { useSelector } from 'react-redux';

import { CopyButton } from '@/components/common/copyButton';

import { selectUserdata } from '@/services/auth';
import { selectBalance } from '@/services/balance';
import { formatNum, shortAddress } from '@/utils';

const Deposit = () => {
  const user = useSelector(selectUserdata);
  const balance = useSelector(selectBalance);

  return (
    <div className='text-text-100 flex w-full flex-col text-sm'>
      <div className='flex w-full flex-col flex-wrap gap-y-4 py-10'>
        <div className='flex flex-col gap-y-1'>
          <label className='text-text-100 text-sm capitalize'>
            deposit address
          </label>
          <div className='from-gradient-100 to-gradient-200 relative truncate rounded bg-gradient-to-r p-2'>
            {shortAddress(user.account)}
            <CopyButton
              text={user.account}
              className='absolute inset-y-0 right-2 flex items-center'
            />
          </div>
        </div>
        <div className='flex flex-col gap-y-1'>
          <label className='text-text-100 text-sm capitalize'>Balance</label>
          <div className='from-gradient-100 to-gradient-200 flex items-center rounded bg-gradient-to-r p-2'>
            <div className='flex-auto'>{formatNum(+balance)}</div>
            <div>ETH</div>
          </div>
        </div>
      </div>
      <p className='text-xs'>NOTICE: Send only ETH to this deposit address.</p>
    </div>
  );
};

export default Deposit;
