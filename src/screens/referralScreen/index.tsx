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
      <div className='mt-10 flex w-full flex-col gap-5 md:flex-row md:gap-16'>
        <div className='flex w-full flex-col items-center justify-center gap-10 md:w-[400px]'>
          <InviteDetail />
        </div>
        <div className='flex flex-col md:flex-1'>
          <InviteLink />
        </div>
      </div>

      <div className='mt-10 flex w-full gap-5 md:gap-16'>
        <div className='hidden w-[400px] flex-col gap-10 md:flex'>
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
