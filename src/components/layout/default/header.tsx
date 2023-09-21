import Link from 'next/link';
import React from 'react';

import useDesktopMediaQuery from '@/hooks/useDesktopMediaQuery';

import { MENUS } from '@/constants';

import AccountDropMenu from '../components/accountDropMenu';

import Logo from '~/svg/logo.svg';

const Header = (): JSX.Element => {
  const isDesktop = useDesktopMediaQuery();

  return (
    <header className='bg-back-100 border-border-100 sticky top-0 z-20 flex h-16 flex-row items-center justify-between gap-x-5 border-b px-4 shadow md:px-10'>
      <Link href='/' className='w-fit'>
        <Logo className='h-[27px] w-[36px]' />
      </Link>
      <div className='flex h-full flex-1 items-center'>
        {isDesktop &&
          MENUS.map((menu, index) => (
            <div
              key={index}
              className='hover:text-text-200 px-5 capitalize text-white transition-all'
            >
              <Link href={menu.href} className='flex items-center gap-x-1'>
                {menu.label}
              </Link>
            </div>
          ))}
      </div>
      <AccountDropMenu />
    </header>
  );
};

export default Header;
