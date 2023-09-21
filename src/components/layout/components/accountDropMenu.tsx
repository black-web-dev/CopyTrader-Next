import { Menu, Transition } from '@headlessui/react';
import { Chain } from '@rainbow-me/rainbowkit';
import clsx from 'clsx';
import Link from 'next/link.js';
import { useRouter } from 'next/router';
import React from 'react';
import { AiOutlineKey } from 'react-icons/ai';
import { BiLogIn, BiLogOut } from 'react-icons/bi';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { useSelector } from 'react-redux';
import { useNetwork, useSwitchNetwork } from 'wagmi';

import useDesktopMediaQuery from '@/hooks/useDesktopMediaQuery';

import { RandomAvatar } from '@/components/common/randomAvatar';
import WalletConnect from '@/components/connectButton';

import { chains } from '@/configs/wagmiConfig';
import { MENUS } from '@/constants';
import { selectUserdata } from '@/services/auth';

const AccountDropMenu = (): JSX.Element => {
  const isDesktop = useDesktopMediaQuery();
  const router = useRouter();

  const user = useSelector(selectUserdata);
  const { chain } = useNetwork();
  const { isLoading, pendingChainId, switchNetwork } = useSwitchNetwork();

  const IconUrl = chains.find((_chain) => _chain.id === chain?.id)?.iconUrl;

  return (
    <div className='gap flex items-center'>
      <WalletConnect />
      <Menu as='div' className='relative ml-3'>
        <div>
          <Menu.Button className='hover:bg-back-200 flex items-center rounded bg-white/10 p-2 text-sm hover:outline-none'>
            <span className='sr-only'>Open user menu</span>
            <div className='bg-back-300 relative flex h-6 w-6 items-center justify-center overflow-hidden rounded-full'>
              {chain && IconUrl && <IconUrl />}
            </div>
            <div className='border-border-200 ml-2 border-l pl-1'>
              <BsThreeDotsVertical className='text-text-100' />
            </div>
          </Menu.Button>
        </div>
        <Transition
          as={React.Fragment}
          enter='transition ease-out duration-100'
          enterFrom='transform opacity-0 scale-95'
          enterTo='transform opacity-100 scale-100'
          leave='transition ease-in duration-75'
          leaveFrom='transform opacity-100 scale-100'
          leaveTo='transform opacity-0 scale-95'
        >
          <Menu.Items className='shadow-back-100 border-border-200 bg-back-100 absolute right-0 z-10 mt-2 w-48 origin-top-right rounded border shadow-md ring-1 ring-black ring-opacity-5 focus:outline-none'>
            <div className='border-border-100 border-b pb-2'>
              <div className='text-text-100 px-2 py-1 pb-0 text-right text-xs capitalize'>
                networks
              </div>
              {chains.map((item: Chain, index: any) => (
                <Menu.Item
                  key={index}
                  disabled={!switchNetwork || item.id === chain?.id}
                >
                  {({ active }: { active: boolean }) => (
                    <span
                      className={clsx(
                        active ? 'bg-back-300 text-white' : 'text-text-100',
                        'flex cursor-pointer items-center gap-2 px-4 py-2 text-sm'
                      )}
                      onClick={() => switchNetwork?.(item.id)}
                    >
                      <div className='flex h-6 w-6 items-center justify-center'>
                        {item.iconUrl && <item.iconUrl />}
                      </div>
                      <div className='flex-1'>
                        {isLoading && pendingChainId === item.id
                          ? ' Switching...'
                          : item.name}
                      </div>
                      {item.id === chain?.id && (
                        <div className='h-2 w-2 rounded-full bg-green-600'></div>
                      )}
                    </span>
                  )}
                </Menu.Item>
              ))}
            </div>
            {!isDesktop && (
              <div className='border-border-100 border-b pb-2'>
                <div className='text-text-100 px-2 py-1 pb-0 text-right text-xs capitalize'>
                  menus
                </div>
                {MENUS.map((menu, index) => (
                  <Menu.Item key={index}>
                    {({ active }: { active: boolean }) => (
                      <span
                        className={clsx(
                          active ? 'bg-back-300 text-white' : 'text-text-100',
                          'flex cursor-pointer items-center gap-2 px-4 py-2 text-sm'
                        )}
                      >
                        <Link
                          href={menu.href}
                          className='group flex w-full items-center gap-2'
                        >
                          <div className='flex h-6 w-6 items-center justify-center'>
                            {menu.icon}
                          </div>
                          <div className='group:hover:hidden capitalize'>
                            {menu.label}
                          </div>
                        </Link>
                      </span>
                    )}
                  </Menu.Item>
                ))}
              </div>
            )}
            {!user ? (
              <Menu.Item>
                {({ active }: { active: boolean }) => (
                  <span
                    className={clsx(
                      active ? 'bg-back-300 text-white' : 'text-text-100',
                      'border-border-100 flex cursor-pointer items-center gap-2 border-t px-4 py-2 text-sm'
                    )}
                  >
                    <Link
                      href='/account/login'
                      className='flex w-full items-center gap-2'
                    >
                      <BiLogIn className='h-6 w-6' />
                      <div className='capitalize'>log in</div>
                    </Link>
                  </span>
                )}
              </Menu.Item>
            ) : (
              <>
                <div className='pb-2'>
                  <div className='text-text-100 px-2 py-1 pb-0 text-right text-xs capitalize'>
                    Account
                  </div>
                  <Menu.Item>
                    <span
                      className={clsx(
                        'text-text-100 flex cursor-pointer items-center gap-2 px-4 py-2 text-sm'
                      )}
                    >
                      <div className='bg-back-300 relative flex h-6 w-6 items-center justify-center overflow-hidden rounded-full'>
                        <RandomAvatar hash={user.email} saturation={90} />
                      </div>
                      <div className='truncate text-[0.9em] leading-none'>
                        {user.email}
                      </div>
                    </span>
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }: { active: boolean }) => (
                      <span
                        className={clsx(
                          active ? 'bg-back-300 text-white' : 'text-text-100',
                          'flex cursor-pointer items-center gap-2 px-4 py-2 text-sm'
                        )}
                      >
                        <Link
                          href='/account/password'
                          className='flex w-full items-center gap-2'
                        >
                          <div className='flex h-6 w-6 items-center justify-center'>
                            <AiOutlineKey />
                          </div>
                          <div className='capitalize'>change password</div>
                        </Link>
                      </span>
                    )}
                  </Menu.Item>
                </div>
                <Menu.Item>
                  {({ active }: { active: boolean }) => (
                    <span
                      className={clsx(
                        active ? 'bg-back-300 text-white' : 'text-text-100',
                        'border-border-100 flex cursor-pointer items-center gap-2 border-t px-4 py-2 text-sm'
                      )}
                      onClick={() => router.push('/account/logout')}
                    >
                      <BiLogOut className='h-6 w-6' />
                      <div>Log out</div>
                    </span>
                  )}
                </Menu.Item>
              </>
            )}
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

export default AccountDropMenu;
