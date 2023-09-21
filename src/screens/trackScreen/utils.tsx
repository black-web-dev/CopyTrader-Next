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
  isExpanded?: boolean;
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
      { label: '$10000+', value: [10000, 1e270] },
    ],
  },
  {
    id: 'trade_size',
    type: 'select',
    img: <BiTargetLock />,
    title: 'Trade Size',
    isExpanded: true,
    options: [
      { label: '$100-$1000', value: [100, 1000] },
      { label: '$1000-$5000', value: [1000, 5000] },
      { label: '$5000-$10000', value: [5000, 10000] },
      { label: '$10000+', value: [10000, 1e270] },
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
    isExpanded: true,
    options: [],
  },
  {
    id: 'status',
    type: 'select',
    img: <FiExternalLink />,
    title: 'Open/Closed',
    isExpanded: true,
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
    isExpanded: true,
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

export type TableHeader = {
  label: string;
  tooltip?: string;
  sort?: string;
};

export const closedTableHeader: TableHeader[] = [
  {
    label: 'address',
    tooltip: 'Trader wallet address',
    sort: '',
  },
  {
    label: 'wallet Amount',
    sort: 'size',
  },
  {
    label: 'pnl',
    sort: 'realisedpnl',
  },
  {
    label: 'win/Loss',
    sort: 'win_loss',
  },
  {
    label: 'ratio',
    sort: 'ratio',
  },
  {
    label: 'Avg.Levarage',
    sort: 'avg_leverage',
  },
  {
    label: 'Avg.Collateral',
    sort: 'avg_coll',
  },
  {
    label: '',
  },
];

export const openedTableHeader: TableHeader[] = [
  {
    label: 'address',
    tooltip: 'Trader wallet address',
    sort: '',
  },
  {
    label: 'token',
    sort: 'indextoken',
  },
  {
    label: 'l/s',
    sort: 'islong',
  },
  {
    label: 'size',
    sort: 'size',
  },
  {
    label: 'collateral',
    sort: 'collateral',
  },
  {
    label: 'leverage',
    sort: 'leverage',
  },
  {
    label: 'limit price',
    sort: 'limit_price',
  },
  {
    label: 'pnl',
    sort: 'pnl',
  },
  {
    label: '',
  },
];
