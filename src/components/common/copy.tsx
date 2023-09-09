import React from 'react';
import { FiCheckCircle, FiCopy } from 'react-icons/fi';

import useCopyClipboard from '@/hooks/useCopyClipboard';
import useNotification from '@/hooks/useNotification';

export default function Copy(props: {
  toCopy: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const [isCopied, setCopied] = useCopyClipboard();
  const notification = useNotification();

  return (
    <div
      className={`${props.className || ''} cursor-pointer`}
      onClick={() => {
        setCopied(props.toCopy);
        notification('Copied on clipboard.', 'success');
      }}
    >
      {isCopied ? (
        <div className='flex items-center'>
          <FiCheckCircle className='h-4 w-4' />
          {props.children || null}
        </div>
      ) : (
        <div className='flex items-center'>
          <FiCopy className='h-4 w-4' />
          {props.children || null}
        </div>
      )}
    </div>
  );
}
