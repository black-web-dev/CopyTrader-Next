import React, { ChangeEvent, useState } from 'react';
import { useSelector } from 'react-redux';

import { selectBalance } from '@/services/balance';
import useNotification from '@/hooks/useNotification';
import Axios from '@/services/axios';
import Input from '@/components/common/input';
import { formatNum } from '@/utils';
import Loader from '@/components/common/loader';

const Withdraw = () => {
  const notification = useNotification();
  const [address, setAddress] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [password, setPassword] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);

  const balance = useSelector(selectBalance);

  const handleWithdraw = () => {
    if (loading || balance - amount < 0.0005) {
      notification('No Balance', 'error');
      return;
    }
    if (!address) {
      notification('Please input address', 'error');
      return;
    }
    if (!password) {
      notification('Please input password', 'error');
      return;
    }
    if (!amount) {
      notification('Please input amount', 'error');
      return;
    }

    setLoading(true);
    Axios.post('/api/copy/withdraw_eth', {
      password,
      to_address: address,
      amount,
    })
      .then(() => notification('Done Successfully', 'success'))
      .catch((err) =>
        notification(
          err?.response?.data?.message || 'Something went wrong',
          'error'
        )
      )
      .finally(() => setLoading(false));
  };

  return (
    <div className='text-text-100 flex w-full flex-col text-sm'>
      <div className='flex w-full flex-col flex-wrap gap-y-4 py-10'>
        <div className='flex flex-col gap-y-1 pb-10'>
          <label className='text-text-100 text-sm capitalize'>
            Current Balance
          </label>
          <div className='from-gradient-100 to-gradient-200 flex items-center rounded bg-gradient-to-r p-2'>
            <div className='flex-auto'>{formatNum(+balance)}</div>
            <div>ETH</div>
          </div>
        </div>
        <Input
          id='address'
          name='address'
          label='withdraw address'
          type='text'
          autoComplete='address'
          required
          className='text-text-200 w-full bg-transparent text-sm focus:outline-none'
          onChange={(e) => setAddress(e.target.value)}
          value={address}
        />
        <Input
          id='amount'
          name='amount'
          label='amount'
          type='number'
          autoComplete='amount'
          afterPrefix='ETH'
          required
          className='text-text-200 w-full bg-transparent text-sm focus:outline-none'
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setAmount(Number(e.target.value))
          }
          value={amount}
        />
        <Input
          id='password'
          name='password'
          label='password'
          password='password'
          type='password'
          autoComplete='password'
          required
          className='text-text-200 w-full bg-transparent text-sm focus:outline-none'
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
          value={password}
        />
        <div className='mt-5 flex flex-col'>
          <button
            className='bg-primary-100 hover:bg-hover-200 flex w-full justify-center rounded p-3 text-sm text-white shadow-sm focus-visible:outline-none'
            disabled={loading}
            onClick={handleWithdraw}
          >
            {loading ? <Loader /> : 'Withdraw'}
          </button>
        </div>
      </div>
      <p className='text-xs'>NOTICE: Withdraw selected address and amount.</p>
    </div>
  );
};

export default Withdraw;
