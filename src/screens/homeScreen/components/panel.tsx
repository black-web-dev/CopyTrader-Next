import React, { useState } from 'react';

import Tab from '@/components/common/tab';

import { ExchangeTabs } from '@/constants';

import Deposit from './deposit';
import Follow from './follow';
import Withdraw from './withdraw';

const Panel = (): JSX.Element => {
  const [selectedTab, setSelectedTab] = useState<string>(ExchangeTabs[0].label);

  const TabContent = () => {
    switch (selectedTab) {
      case ExchangeTabs[0].label:
        return <Follow />;
      case ExchangeTabs[1].label:
        return <Deposit />;
      case ExchangeTabs[2].label:
        return <Withdraw />;
      default:
        return <Follow />;
    }
  };

  return (
    <div className='bg-back-200 w-96 rounded'>
      <div className='p-4'>
        <Tab
          value={selectedTab}
          setValue={setSelectedTab}
          options={ExchangeTabs}
        />
        <TabContent />
      </div>
    </div>
  );
};

export default Panel;
