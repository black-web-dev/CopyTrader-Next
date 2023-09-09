import axios from 'axios';

import { PairType } from '.';

const LIMIT = 100;
const INTERVAL = '1d';

export async function getPairDetail({ pair }: { pair: PairType }) {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `https://api.binance.com/api/v3/klines?interval=${INTERVAL}&limit=${LIMIT}&symbol=${pair.symbol}`
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

        resolve({
          currentPrice,
          highPrice,
          lowPrice,
          averagePrice,
          change,
        });
      })
      .catch((err) => {
        reject(err);
      });
  });
}
