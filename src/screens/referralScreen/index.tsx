import React from 'react';

import DirectInvite from './components/directInvite';
import InviteDetail from './components/InviteDetail';
import InvitedList from './components/invitedList';
import InviteLink from './components/InviteLink';

const Referral = (): JSX.Element => {
  return (
    <div className='mx-auto flex h-full w-full max-w-6xl flex-col items-center justify-center p-10'>
      <div className='flex w-full flex-col items-start gap-4'>
        <div className='text-3xl font-medium'>Referrals</div>
        <div className='text-xs'>
          Earn points and rebates through the CopyTrader referral program every
          time a new users signs up using your unique code or invite.
        </div>
      </div>
      <div className='mt-10 flex w-full gap-16'>
        <div className='flex w-[400px] flex-col gap-10'>
          <InviteDetail />
        </div>
        <div className='flex flex-1 flex-col'>
          <InviteLink />
        </div>
      </div>

      <div className='mt-10 flex w-full gap-16'>
        <div className='flex w-[400px] flex-col gap-10'>
          <DirectInvite />
        </div>
        <div className='flex flex-1 flex-col'>
          <InvitedList />
        </div>
      </div>
    </div>
  );
};

export default Referral;
