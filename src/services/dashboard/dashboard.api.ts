import Axios from '../axios';

export function getChainInfo({ user_id }: { user_id: string }) {
  return Axios.post('/chain/info', { user_id });
}

export function getTopTraders({ user_id }: { user_id: string }) {
  return Axios.post('/positions/closed', {
    user_id,
    chain: 'arbitrum',
    protocol: 'GMX',
    top_trader: 5,
    wallet_amount: [0, 1e300],
    trade_size: [0, 1e300],
    leverage: [0, 50],
    win_loss_min: 0,
    period: '86400',
  });
}

export function getTransactions({
  user_id,
  offset,
  limit,
}: {
  user_id: string;
  offset: number;
  limit: number;
}) {
  return Axios.post('/gmx/transactions', { user_id, offset, limit });
}
