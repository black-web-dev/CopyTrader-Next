import Link from 'next/link';
import React, { FC, ReactElement } from 'react';
import { BiLinkExternal } from 'react-icons/bi';

import { ModalActionProps } from '@/components/modal/Action';
import { HeadlessUiModal } from '@/components/modal/index';

import { shortAddress } from '@/utils';

import { ModalHeaderProps } from './Header';
import Loader from '../common/loader';

export interface SubmittedModalContentProps extends ModalHeaderProps {
  // eslint-disable-next-line @typescript-eslint/ban-types
  animationData?: Object;
  txHash?: string;
  onDismiss(): void;
  onBack?(): void;
  children?: React.ReactNode;
  actions?: ReactElement<ModalActionProps> | ReactElement<ModalActionProps>[];
}

const SubmittedModalContent: FC<SubmittedModalContentProps> = ({
  header,
  children,
  subheader,
  animationData,
  txHash = '',
  onDismiss,
  onBack,
  actions,
}) => {
  return (
    <HeadlessUiModal.Body>
      {animationData && (
        <div className='flex h-[102px] w-[102px] justify-center rounded-full p-6'>
          <Loader />
        </div>
      )}
      <HeadlessUiModal.Header
        onClose={onDismiss}
        onBack={onBack}
        header={header}
        subheader={subheader}
      />
      <HeadlessUiModal.Content>
        <div className='divide-dark-700 flex flex-col divide-y'>
          <div className='flex justify-between gap-2 py-2'>
            <div>Transaction Hash</div>
            {txHash && (
              <div className='text-primary-100 text-sm'>
                <Link href={`https://arbiscan.io/tx/${txHash}`} target='_blank'>
                  <div className='flex items-center gap-1'>
                    {shortAddress(txHash, 12)}
                    <BiLinkExternal />
                  </div>
                </Link>
              </div>
            )}
          </div>

          <div className='flex justify-between gap-2 py-2'>
            <div className='text-primary-100'>Status</div>
          </div>
        </div>
        {children}
      </HeadlessUiModal.Content>
      <HeadlessUiModal.Actions>
        <HeadlessUiModal.Action onClick={onDismiss}>
          Close
        </HeadlessUiModal.Action>
        {actions}
      </HeadlessUiModal.Actions>
    </HeadlessUiModal.Body>
  );
};

export default SubmittedModalContent;
