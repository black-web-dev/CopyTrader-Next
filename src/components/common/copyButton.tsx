import React from 'react';
import { BiCopy } from 'react-icons/bi';

export const CopyButton = ({
  text,
  className = '',
}: {
  text: string;
  className: string;
}) => {
  const [copied, setCopied] = React.useState(false);

  return (
    <span className={className}>
      <span
        className='ml-2 cursor-pointer text-gray-400 hover:text-white [&:hover_span]:opacity-100 [&_span]:opacity-0'
        onClick={() => {
          window.navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}
      >
        <BiCopy className='h-5 w-5' />
        <span className='fixed z-20 -translate-x-[calc(50%_+_10px)] translate-y-[30px] rounded-md bg-gray-800 p-1 text-center text-[0.6em] text-white transition-opacity duration-500'>
          {copied ? 'Copied' : <>Copy&nbsp;to&nbsp;clipboard</>}
        </span>
      </span>
    </span>
  );
};
