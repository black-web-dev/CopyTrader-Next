import Axios from '../axios';

export function getPositions({
  user_id,
  wallet,
}: {
  user_id: string;
  wallet: string;
}) {
  return Axios.post('/api/positions/list', { user_id, wallet });
}

export function closePosition({
  index_token,
  is_long,
}: {
  index_token: number;
  is_long: boolean;
}) {
  return Axios.post('/api/copy/close_position', { index_token, is_long });
}
