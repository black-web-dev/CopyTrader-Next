import React from 'react';

import CurrencyStatus from './components/currencyStatus';
import Panel from './components/panel';
import Positions from './components/positions';
import TradingViewWidget from './components/tradingView';

const HomeScreen = () => {
  return (
    <div className='flex h-full w-full items-start gap-4 p-7'>
      <div className='flex flex-auto flex-col gap-y-4'>
        <CurrencyStatus />
        <TradingViewWidget />
        <Positions />
      </div>
      <Panel />
    </div>
  );
};

export default HomeScreen;
