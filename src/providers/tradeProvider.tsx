import axios from 'axios';
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import LocalStorage from '@/hooks/useStorage';

const PAIR_KEY = 'pair';
const LIMIT = 100;
const INTERVAL = '1d';
const TIME_INTERVAL = 2;

export type PairType = {
  label: string;
  symbol: string;
  ticket: string;
};

export type CurrentPairDetail = {
  currentPrice: number;
  highPrice: number;
  lowPrice: number;
  averagePrice: number;
  change: number;
};

export const pairs: PairType[] = [
  {
    label: 'ETH/USD',
    symbol: 'ETHUSDT',
    ticket: 'BINANCE:ETHUSD',
  },
  {
    label: 'BTC/USD',
    symbol: 'BTCUSDT',
    ticket: 'BINANCE:BTCUSD',
  },
  {
    label: 'LINK/USD',
    symbol: 'LINKUSDT',
    ticket: 'BINANCE:LINKUSD',
  },
  {
    label: 'UNI/USD',
    symbol: 'UNIUSDT',
    ticket: 'BINANCE:UNIUSD',
  },
];

export type CTX = {
  currentPair: PairType;
  currentPairDetail: CurrentPairDetail;
  handleSwitchPair: (pair: PairType) => void;
};

const TradeContext = createContext<CTX>({
  currentPair: pairs[0],
  currentPairDetail: {
    currentPrice: 0,
    highPrice: 0,
    lowPrice: 0,
    averagePrice: 0,
    change: 0,
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function, unused-imports/no-unused-vars
  handleSwitchPair: function (pair: PairType): void {},
});

const TradeProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentPair, setCurrentPair] = useState<PairType>(pairs[0]);
  const [currentPairDetail, setCurrentPairDetail] = useState({
    currentPrice: 0,
    highPrice: 0,
    lowPrice: 0,
    averagePrice: 0,
    change: 0,
  });

  const handleSwitchPair = useCallback((pair: PairType) => {
    console.log(pair);
    setCurrentPair(pair);
    LocalStorage.set(PAIR_KEY, JSON.stringify(pair));
  }, []);

  const getPairDetail = useCallback(async () => {
    currentPair &&
      axios
        .get(
          `https://api.binance.com/api/v3/klines?interval=${INTERVAL}&limit=${LIMIT}&symbol=${currentPair.symbol}`
        )
        .then((res) => res.data)
        .then((result) => {
          let currentPrice = 0;
          let highPrice = 0;
          let lowPrice = 0;
          let averagePrice = 0;
          let change = 0;
          let totalPriceSum = 0;

          for (let i = 0; i < result.length; i++) {
            const item = result[i];
            if (highPrice < Number(item[2])) highPrice = Number(item[2]);
            if (lowPrice === 0 || lowPrice > Number(item[3]))
              lowPrice = Number(item[3]);

            totalPriceSum += Number(item[1]);
          }

          currentPrice = Number(result[result.length - 1][1]);
          averagePrice = totalPriceSum / (result.length - 1);
          change = ((currentPrice - averagePrice) / averagePrice) * 100;

          setCurrentPairDetail({
            currentPrice,
            highPrice,
            lowPrice,
            averagePrice,
            change,
          });
        });
  }, [currentPair]);

  useEffect(() => {
    const storedPair = JSON.parse(LocalStorage.get(PAIR_KEY, ''));

    if (storedPair) {
      setCurrentPair(storedPair);
    } else {
      setCurrentPair(pairs[0]);
    }
  }, []);

  useEffect(() => {
    getPairDetail();

    const time = setInterval(() => {
      getPairDetail();
    }, TIME_INTERVAL * 1000);
    return () => {
      clearInterval(time);
    };
  }, [currentPair, getPairDetail]);

  const context: CTX = useMemo(
    () => ({
      currentPair,
      currentPairDetail,
      handleSwitchPair,
    }),
    [currentPair, currentPairDetail, handleSwitchPair]
  );

  return (
    <TradeContext.Provider value={context}>{children}</TradeContext.Provider>
  );
};

export { TradeContext, TradeProvider };
