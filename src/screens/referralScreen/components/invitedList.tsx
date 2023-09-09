import clsx from 'clsx';
import { format } from 'date-fns';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import useNotification from '@/hooks/useNotification';

import Loader from '@/components/common/loader';

import { useAppDispatch } from '@/services';
import { selectUserdata } from '@/services/auth';
import {
  deleteInviteAsync,
  getInvitedListAsync,
  selectDeleteEmail,
  selectInvitations,
  selectIsDeleting,
  selectIsFetching,
  setDeleteEmail,
} from '@/services/referral';

export const PRETTY_DATE_FORMAT = 'd MMM yyyy';

const InvitedList = (): JSX.Element => {
  const isFetching = useSelector(selectIsFetching);
  const isDeleting = useSelector(selectIsDeleting);
  const deleteEmail = useSelector(selectDeleteEmail);
  const invitations = useSelector(selectInvitations);
  const user = useSelector(selectUserdata);

  const dispatch = useAppDispatch();
  const notification = useNotification();

  const handleDelete = (email: string) => {
    if (isDeleting || isFetching) return;

    dispatch(setDeleteEmail(email));

    dispatch(deleteInviteAsync({ user_id: user.id, email: email })).then(
      (payload: any) => {
        if (payload?.error) return;
        notification('You have successfully deleted invitation.', 'success');
        dispatch(getInvitedListAsync({ user_id: user.id }));
      }
    );
  };

  useEffect(() => {
    if (user?.id) {
      dispatch(getInvitedListAsync({ user_id: user.id }));
    }
  }, [dispatch, user]);

  return (
    <div className='flex h-full flex-col gap-2 rounded bg-[#14161D] px-[29px] py-[18px]'>
      {invitations.count !== undefined && (
        <>
          <div className=''>
            Invites (
            {user?.role === 'admin'
              ? `${invitations.count} Sent`
              : `${10 - invitations.count} Left`}
            )
          </div>
          <table className='w-full'>
            <thead className='text-text-100 text-xs'>
              <tr>
                <th className='px-2 py-1'>Date</th>
                <th className='px-2 py-1'>Email</th>
                <th className='px-2 py-1'>Status</th>
                <th className='px-2 py-1'></th>
              </tr>
            </thead>
            <tbody className='text-xs'>
              {!isFetching &&
                invitations.count > 0 &&
                invitations.list.map((row, i) => (
                  <tr
                    key={i}
                    className={clsx(
                      'h-[50px] py-1',
                      i % 2 === 1 && 'bg-back-400'
                    )}
                  >
                    <th className='px-2 py-1 text-center text-xs'>
                      {format(new Date(row.createdAt), PRETTY_DATE_FORMAT)}
                    </th>
                    <td className='px-2 py-1 text-center text-xs'>
                      {row.to_email}
                    </td>
                    <td className='px-2 py-1 text-center text-xs'>
                      {row.status ? (
                        <div className='text-green-500'>Accepted</div>
                      ) : (
                        <div className='text-red-500'>Pending</div>
                      )}
                    </td>
                    <td className='px-2 py-1 text-center text-xs'>
                      <button
                        className={clsx(
                          'border-border-100 flex items-center gap-1 rounded-md border px-2 py-1 text-xs text-gray-400 hover:bg-gray-800',
                          row.status && 'cursor-not-allowed '
                        )}
                        onClick={() => handleDelete(row.to_email)}
                      >
                        {isDeleting && deleteEmail === row.to_email && (
                          <Loader />
                        )}
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              {!isFetching && invitations.count === 0 && (
                <tr>
                  <td colSpan={4}>
                    <div className='flex min-h-[200px] items-center justify-center'>
                      No items
                    </div>
                  </td>
                </tr>
              )}
              {isFetching && (
                <tr>
                  <td colSpan={4}>
                    <div className='flex min-h-[200px] items-center justify-center'>
                      <Loader size='40px' strokewidth={1.5} />
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default InvitedList;
