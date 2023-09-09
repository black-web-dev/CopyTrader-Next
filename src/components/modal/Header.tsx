import React, { FC, ReactNode } from 'react';
import { AiOutlineArrowLeft, AiOutlineClose } from 'react-icons/ai';

export interface ModalHeaderProps {
  header: string | ReactNode;
  subheader?: string;
  onClose?(): void;
  onBack?(): void;
}

const ModalHeader: FC<ModalHeaderProps> = ({
  header,
  subheader,
  onBack,
  onClose,
}) => {
  return (
    <div className='flex items-start justify-between'>
      <div className='flex flex-col justify-center gap-1'>
        <div className='text-text-200 flex items-center gap-3'>
          {onBack && (
            <AiOutlineArrowLeft
              onClick={onBack}
              width={24}
              height={24}
              className='text-text-100 cursor-pointer'
            />
          )}
          {header}
        </div>
        {subheader && <div>{subheader}</div>}
      </div>
      {onClose && (
        <div
          className='flex h-6 w-6 cursor-pointer items-center justify-center'
          onClick={onClose}
        >
          <AiOutlineClose width={24} height={24} className='text-text-100' />
        </div>
      )}
    </div>
  );
};

export default ModalHeader;
