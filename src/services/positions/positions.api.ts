import Axios from '../axios';

export function getPositions() {
  return Axios.post('/api/positions/list', {});
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
