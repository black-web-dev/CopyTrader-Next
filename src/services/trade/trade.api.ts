import Axios from '../axios';

export type CopyTraderType = {
  leader: string;
  collateral_ratio: number;
  leverage_ratio: number;
  collateral_limit_eth: string;
};

export function getCopyStatus() {
  return Axios.post('/api/copy/status', {});
}

export function startCopyTrader(copyDetail: CopyTraderType) {
  return Axios.post('/api/copy/start', copyDetail);
}

export function stopCopyTrader({ leader }: { leader: string }) {
  return Axios.post('/api/copy/stop', { leader });
}
