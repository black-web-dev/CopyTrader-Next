import React, { ReactNode } from 'react';
import { AiOutlineHome, AiOutlineUnorderedList } from 'react-icons/ai';
import { BiMoneyWithdraw, BiUserPin } from 'react-icons/bi';
import { BsFiletypeDoc, BsGraphUpArrow, BsLink45Deg } from 'react-icons/bs';
import { FaCoins } from 'react-icons/fa';

export const MENUS = [
  {
    href: '/dashboard',
    label: 'dashboard',
    icon: <AiOutlineHome />,
  },
  {
    href: '/track',
    label: 'track',
    icon: <AiOutlineUnorderedList />,
  },
  {
    href: '/trade',
    label: 'trade',
    icon: <BsGraphUpArrow />,
  },
  {
    href: '/referral',
    label: 'referrals',
    icon: <BsLink45Deg />,
  },
  {
    href: '/docs',
    label: 'docs',
    icon: <BsFiletypeDoc />,
  },
];

export type ExchangeTabType = {
  label: string;
  icon: ReactNode;
};

export const ExchangeTabs: ExchangeTabType[] = [
  {
    label: 'trade',
    icon: <BiUserPin />,
  },
  {
    label: 'deposit',
    icon: <FaCoins />,
  },
  {
    label: 'widthraw',
    icon: <BiMoneyWithdraw />,
  },
];
