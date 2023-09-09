import Axios from '../axios';

export function getCopyStatus({
  user_id,
  wallet,
}: {
  user_id: string;
  wallet: string;
}) {
  return Axios.post('/api/copy/status', { user_id, wallet });
}

export function startCopyTrader({
  user_id,
  wallet,
  leader_address,
  collateral_ratio,
  leverage_ratio,
}: {
  user_id: string;
  wallet: string;
  leader_address: string;
  collateral_ratio: number;
  leverage_ratio: number;
}) {
  return Axios.post('/api/copy/start', {
    user_id,
    wallet,
    leader_address,
    collateral_ratio,
    leverage_ratio,
  });
}

export function stopCopyTrader({
  user_id,
  wallet,
  leader_address,
}: {
  user_id: string;
  wallet: string;
  leader_address: string;
}) {
  return Axios.post('/api/copy/stop', { user_id, wallet, leader_address });
}

export function getCopyTraderAccount({
  user_id,
  wallet,
}: {
  user_id: string;
  wallet: string;
}) {
  return Axios.post('/api/copy/getaccount', { user_id, wallet });
}
