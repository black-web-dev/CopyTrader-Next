import React from 'react';
import { useSelector } from 'react-redux';

import DirectInvite from '@/screens/referralScreen/components/directInvite';
import { useAppDispatch } from '@/services';
import {
  selectIsShowInviteModal,
  setIsShowInviteModal,
} from '@/services/global';

import { HeadlessUiModal } from '../modal';

const InviteModal = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const isShow = useSelector(selectIsShowInviteModal);

  return (
    <HeadlessUiModal.Controlled
      isOpen={isShow}
      onDismiss={() => dispatch(setIsShowInviteModal(false))}
      maxWidth='md'
    >
      <div className='flex w-full flex-col'>
        <HeadlessUiModal.Header
          header=''
          onClose={() => dispatch(setIsShowInviteModal(false))}
        />
        <DirectInvite />
      </div>
    </HeadlessUiModal.Controlled>
  );
};

export default InviteModal;
