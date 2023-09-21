import React, { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';

import useCopyClipboard from '@/hooks/useCopyClipboard';
import useNotification from '@/hooks/useNotification';

import { useAppDispatch } from '@/services';
import { selectUserdata } from '@/services/auth';
import { getInviteCodeAsync, selectInviteCode } from '@/services/referral';

const InviteLink = (): JSX.Element => {
  const [isCopied, setCopied] = useCopyClipboard();
  const notification = useNotification();
  const dispatch = useAppDispatch();
  const user = useSelector(selectUserdata);
  const inviteCode = useSelector(selectInviteCode);

  const APP_LINK =
    process.env.NEXT_PUBLIC_API_URL || 'https://platform.copytrader.gg';

  useEffect(() => {
    if (user.id > 0) {
      dispatch(getInviteCodeAsync({ user_id: user.id }));
    }
  }, [dispatch, user.id]);

  const handleCopyLink = useCallback(() => {
    setCopied(`${APP_LINK}/account/register?referred=${inviteCode}`);
  }, [APP_LINK, inviteCode, setCopied]);

  useEffect(() => {
    isCopied && notification('Copied on clipboard.', 'success');
  }, [isCopied, notification]);

  return (
    <div className='flex flex-col items-start'>
      <div className='font-medium'>Invite Link</div>
      <div className='mt-2 text-xs'>
        Use this link to share your invites. Those who sign up with your link
        will skips the waitlist and immediately be granted access to the
        platform.
      </div>
      <div className='my-5 flex w-full items-center gap-3'>
        <div className='flex-1 rounded bg-white/10 px-2 py-1.5 text-sm'>
          <span className='md:hidden'>
            {`referred=${inviteCode.slice(0, 15)}...`}
          </span>
          <span className='hidden md:block'>
            {`https://platform.copytrader.gg/account/register?referred=${inviteCode.slice(
              0,
              10
            )}...`}
          </span>
        </div>
        <button
          className='bg-primary-100 hover:bg-primary-100/50 flex justify-center rounded px-3 py-1.5 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 active:scale-95'
          onClick={handleCopyLink}
        >
          {isCopied ? 'Copied' : 'Copy Link'}
        </button>
      </div>
      <div className='text-sm text-white/25'>
        Your link has been used by <span className='text-white'>0 people</span>
      </div>
    </div>
  );
};

export default InviteLink;
