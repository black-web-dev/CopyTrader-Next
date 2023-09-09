import Link from 'next/link';
import React from 'react';
import { CiTwitter } from 'react-icons/ci';
import { FaTelegramPlane } from 'react-icons/fa';
import { FiGithub } from 'react-icons/fi';
import { RxDiscordLogo } from 'react-icons/rx';

import Logo from '~/svg/logo_footer.svg';

const Footer = () => {
  return (
    <div className='bg-back-100 mx-auto flex w-full flex-col items-center justify-center'>
      <div className='border-border-100 flex w-full flex-col items-center justify-center gap-10 border-t py-10'>
        <Link href='/'>
          <Logo className='mx-auto h-[50px] w-[180px]' />
        </Link>
        <div className='flex items-center gap-x-10'>
          <a
            href='https://twitter.com/GMX_IO'
            target='_blank'
            rel='noopener noreferrer'
          >
            <CiTwitter className='h-6 w-6 text-white' />
          </a>
          <a
            href='https://github.com/gmx-io'
            target='_blank'
            rel='noopener noreferrer'
          >
            <FiGithub className='h-6 w-6 text-white' />
          </a>
          <a
            href='https://discord.com/invite/ymN38YefH9'
            target='_blank'
            rel='noopener noreferrer'
          >
            <RxDiscordLogo className='h-6 w-6 text-white' />
          </a>
          <a
            href='https://t.me/GMX_IO'
            target='_blank'
            rel='noopener noreferrer'
          >
            <FaTelegramPlane className='h-6 w-6 text-white' />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
