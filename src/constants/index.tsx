import React, { ReactNode } from 'react';

import { BiMoneyWithdraw, BiUserPin } from 'react-icons/bi';
import { FaCoins } from 'react-icons/fa';

export const MENUS = [
  {
    href: '/',
    label: 'dashboard',
  },
  {
    href: '/track',
    label: 'track',
  },
  {
    href: '/trade',
    label: 'trade',
  },
  {
    href: '/leaderboard',
    label: 'leaderboard',
  },
  {
    href: '/referral',
    label: 'referrals',
  },
  {
    href: '/docs',
    label: 'docs',
  },
];

export type ExchangeTabType = {
  label: string;
  icon: ReactNode;
};

export const ExchangeTabs: ExchangeTabType[] = [
  {
    label: 'copy',
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
