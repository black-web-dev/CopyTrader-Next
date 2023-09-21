import clsx from 'clsx';
import { format } from 'date-fns';
import React, { useEffect } from 'react';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { BiLoader } from 'react-icons/bi';
import { useSelector } from 'react-redux';

import useNotification from '@/hooks/useNotification';

import Loader from '@/components/common/loader';
import InviteModal from '@/components/inviteModal';

import { useAppDispatch } from '@/services';
import { selectUserdata } from '@/services/auth';
import { setIsShowInviteModal } from '@/services/global';
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
    <div className='flex h-full flex-col gap-2 rounded bg-[#14161D] p-4 md:px-[29px] md:py-[18px]'>
      {invitations.count !== undefined && (
        <>
          <div className='flex items-center justify-between'>
            <div className=''>
              Invites (
              {user?.role === 'admin'
                ? `${invitations.count} Sent`
                : `${10 - invitations.count} Left`}
              )
            </div>
            <button
              className='bg-primary-100 hover:bg-primary-100/50 flex justify-center rounded px-3 py-1.5 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 active:scale-95 md:hidden'
              onClick={() => dispatch(setIsShowInviteModal(true))}
            >
              Invite
            </button>
          </div>
          <table className='w-full'>
            <thead className='text-text-100 text-xs'>
              <tr>
                <th className='hidden px-2 py-1 text-left sm:block'>Date</th>
                <th className='px-2 py-1 text-left sm:text-center'>Email</th>
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
                    className={clsx('h-[50px]', i % 2 === 1 && 'bg-back-400')}
                  >
                    <td className='hidden h-[50px] items-center justify-start text-xs sm:flex'>
                      <div className='px-2 py-1 '>
                        {format(new Date(row.createdAt), PRETTY_DATE_FORMAT)}
                      </div>
                    </td>
                    <td className='px-2 py-1 text-left text-xs sm:text-center'>
                      <div className='flex flex-col gap-1'>
                        <div>{row.to_email}</div>
                        <div className='text-[10px] sm:hidden'>
                          {format(new Date(row.createdAt), PRETTY_DATE_FORMAT)}
                        </div>
                      </div>
                    </td>
                    <td className='px-2 py-1 text-center text-xs'>
                      <div className='flex items-center justify-center'>
                        {row.status ? (
                          <div className='flex items-center gap-1 text-green-500'>
                            <AiOutlineCheckCircle />
                            <div className='hidden sm:block'>Accepted</div>
                          </div>
                        ) : (
                          <div className='flex items-center gap-1 text-red-500'>
                            <BiLoader />
                            <div className='hidden sm:block'>Pending</div>
                          </div>
                        )}
                      </div>
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
      <InviteModal />
    </div>
  );
};

export default InvitedList;
