import React from 'react';
import { useSelector } from 'react-redux';

import { selectUserdata } from '@/services/auth';
import { selectInvitations } from '@/services/referral';

const InviteDetail = (): JSX.Element => {
  const user = useSelector(selectUserdata);
  const invitations = useSelector(selectInvitations);

  return (
    <div className='flex flex-col gap-3'>
      <div className='flex items-center justify-center gap-x-14'>
        <div className='flex h-[124px] w-[124px] flex-col items-center justify-center gap-y-2 rounded-full border border-dashed border-white/25'>
          <div className=''>
            {user?.role === 'admin'
              ? `${invitations.count}`
              : `${invitations.count} of 10`}
          </div>
          <div className='flex flex-col items-center text-xs text-white/25'>
            <div>Invites</div>
            <div>accepted</div>
          </div>
        </div>
        <div className='flex h-[124px] w-[124px] flex-col items-center justify-center gap-y-2 rounded-full border-4 border-white/25'>
          <div className=''>0</div>
          <div className='flex flex-col items-center text-xs text-white/25'>
            <div>Points</div>
            <div>earned</div>
          </div>
        </div>
      </div>
      <div className='text-center text-sm text-white/25'>
        You are <span className='text-white'>{`#${user.id}`}</span> on the
        leaderboard
      </div>
    </div>
  );
};

export default InviteDetail;
