import { ReactNode } from 'react';
import { BiTargetLock } from 'react-icons/bi';
import { BsDiamond, BsLayoutSidebar, BsXDiamond } from 'react-icons/bs';
import { CiSliderVertical } from 'react-icons/ci';
import { CiWallet } from 'react-icons/ci';
import { FiExternalLink } from 'react-icons/fi';

export type OptionsType = {
  label: string;
  value: string | number | number[];
};

export type FilterOptionType = {
  id: string;
  type: string;
  img: ReactNode;
  title: string;
  fixedValue?: boolean;
  options: OptionsType[];
};

export const filterOpts: FilterOptionType[] = [
  {
    id: 'chain',
    type: 'select',
    img: <BsXDiamond />,
    title: 'blockchain',
    fixedValue: true,
    options: [
      {
        label: 'arbitrum',
        value: 'arbitrum',
      },
    ],
  },
  {
    id: 'protocol',
    type: 'select',
    img: <BsDiamond />,
    title: 'protocol',
    fixedValue: true,
    options: [
      {
        label: 'GMX',
        value: 'GMX',
      },
    ],
  },
  {
    id: 'wallet_amount',
    type: 'select',
    img: <CiWallet />,
    title: 'Wallet Amount',
    options: [
      { label: '$100-$1000', value: [100, 1000] },
      { label: '$1000-$5000', value: [1000, 5000] },
      { label: '$5000-$10000', value: [5000, 10000] },
      { label: '$10000+', value: [0, 1e300] },
    ],
  },
  {
    id: 'trade_size',
    type: 'select',
    img: <BiTargetLock />,
    title: 'Trade Size',
    options: [
      { label: '$100-$1000', value: [100, 1000] },
      { label: '$1000-$5000', value: [1000, 5000] },
      { label: '$5000-$10000', value: [5000, 10000] },
      { label: '$10000+', value: [0, 1e300] },
    ],
  },
  {
    id: 'side',
    type: 'select',
    img: <BsLayoutSidebar />,
    title: 'Side',
    options: [
      {
        label: 'Short',
        value: 'short',
      },
      {
        label: 'Long',
        value: 'long',
      },
    ],
  },
  {
    id: 'leverage',
    type: 'slidebar',
    img: <CiSliderVertical />,
    title: 'Leverage',
    options: [],
  },
  {
    id: 'status',
    type: 'select',
    img: <FiExternalLink />,
    title: 'Open/Closed',
    options: [
      {
        label: 'Open',
        value: 'open',
      },
      {
        label: 'Close',
        value: 'close',
      },
    ],
  },
  {
    id: 'win_loss_min',
    type: 'select',
    img: <FiExternalLink />,
    title: 'Win/Loss',
    options: [
      {
        label: '>50%',
        value: 50,
      },
      {
        label: '>75%',
        value: 70,
      },
    ],
  },
];
